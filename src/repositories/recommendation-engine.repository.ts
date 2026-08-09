import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import type {
  IntakeRow,
  RankingRow,
  RequirementRow,
  ScholarshipRow,
  UniversityProgramCandidate,
} from "@/types/recommendation-engine";

interface UniversitySqlRow {
  university_id: string;
  university_name: string;
  university_slug: string;
  city: string | null;
  acceptance_rate: number | null;
  country_code: string;
  country_name: string;
  living_cost: string | null;
  ielts_required: number | null;
  post_study_work: string | null;
  visa_success_rate: number | null;
}

interface ProgramSqlRow {
  program_id: string;
  university_id: string;
  program_name: string;
  program_field: string | null;
  tuition_fee: string | null;
  currency: string;
}

export const recommendationEngineRepository = {
  /**
   * Step 1: Filter universities by target country (+ optional city) via SQL.
   */
  async filterUniversitiesByCountry(
    countryCode: string,
    preferredCity?: string,
  ): Promise<UniversitySqlRow[]> {
    const cityPattern = preferredCity ? `%${preferredCity}%` : null;

    return prisma.$queryRaw<UniversitySqlRow[]>`
      SELECT
        u.id            AS university_id,
        u.name          AS university_name,
        u.slug          AS university_slug,
        u.city,
        u.acceptance_rate,
        c.code          AS country_code,
        c.name          AS country_name,
        c.living_cost,
        c.ielts_required,
        c.post_study_work,
        (
          SELECT vr.success_rate
          FROM visa_rules vr
          WHERE vr.country_id = c.id
            AND vr.visa_type = 'STUDENT'
            AND vr.status = 'ACTIVE'
            AND vr.deleted_at IS NULL
          ORDER BY vr.created_at DESC
          LIMIT 1
        ) AS visa_success_rate
      FROM universities u
      INNER JOIN countries c ON c.id = u.country_id
      WHERE c.code = ${countryCode}
        AND u.status = 'ACTIVE'
        AND u.deleted_at IS NULL
        AND c.status = 'ACTIVE'
        AND c.deleted_at IS NULL
        AND (${cityPattern}::text IS NULL OR u.city ILIKE ${cityPattern})
      ORDER BY u.name ASC
    `;
  },

  /**
   * Step 2: Filter programs by subject field for given university IDs via SQL.
   */
  async filterProgramsBySubject(
    universityIds: string[],
    preferredSubject: string,
    preferredIntake?: string,
  ): Promise<ProgramSqlRow[]> {
    if (universityIds.length === 0) return [];

    const subjectPattern = preferredSubject ? `%${preferredSubject}%` : "%";
    const intakePattern = preferredIntake ? `%${preferredIntake}%` : null;
    const uuidList = universityIds.map((id) => `'${id}'::uuid`).join(",");

    // Intake is optional: many good programs have no intake rows yet.
    return prisma.$queryRaw<ProgramSqlRow[]>`
      SELECT DISTINCT
        p.id            AS program_id,
        p.university_id,
        p.name          AS program_name,
        p.field         AS program_field,
        p.tuition_fee,
        p.currency
      FROM programs p
      WHERE p.university_id IN (${Prisma.raw(uuidList)})
        AND p.status = 'ACTIVE'
        AND p.deleted_at IS NULL
        AND (
          ${subjectPattern} = '%'
          OR p.field ILIKE ${subjectPattern}
          OR p.name ILIKE ${subjectPattern}
        )
        AND (
          ${intakePattern}::text IS NULL
          OR EXISTS (
            SELECT 1 FROM intakes i
            WHERE i.program_id = p.id
              AND i.status = 'ACTIVE'
              AND i.deleted_at IS NULL
              AND i.name ILIKE ${intakePattern}
          )
        )
      ORDER BY p.tuition_fee ASC NULLS LAST
    `;
  },

  async fetchRequirements(programIds: string[]): Promise<RequirementRow[]> {
    if (programIds.length === 0) return [];

    const uuidList = programIds.map((id) => `'${id}'::uuid`).join(",");

    const rows = await prisma.$queryRaw<
      Array<{
        program_id: string;
        type: string;
        min_value: string | null;
        is_mandatory: boolean;
      }>
    >`
      SELECT program_id, type, min_value, is_mandatory
      FROM requirements
      WHERE program_id IN (${Prisma.raw(uuidList)})
        AND status = 'ACTIVE'
        AND deleted_at IS NULL
    `;

    return rows.map((r) => ({
      programId: r.program_id,
      type: r.type,
      minValue: r.min_value,
      isMandatory: r.is_mandatory,
    }));
  },

  async fetchIntakes(programIds: string[]): Promise<IntakeRow[]> {
    if (programIds.length === 0) return [];

    const uuidList = programIds.map((id) => `'${id}'::uuid`).join(",");

    const rows = await prisma.$queryRaw<
      Array<{
        program_id: string;
        name: string;
        start_date: Date;
        application_deadline: Date | null;
      }>
    >`
      SELECT program_id, name, start_date, application_deadline
      FROM intakes
      WHERE program_id IN (${Prisma.raw(uuidList)})
        AND status = 'ACTIVE'
        AND deleted_at IS NULL
    `;

    return rows.map((r) => ({
      programId: r.program_id,
      name: r.name,
      startDate: r.start_date,
      applicationDeadline: r.application_deadline,
    }));
  },

  async fetchRankings(universityIds: string[]): Promise<RankingRow[]> {
    if (universityIds.length === 0) return [];

    const uuidList = universityIds.map((id) => `'${id}'::uuid`).join(",");

    const rows = await prisma.$queryRaw<
      Array<{
        university_id: string;
        ranking_body: string;
        rank: number;
        year: number;
        subject: string | null;
      }>
    >`
      SELECT university_id, ranking_body, rank, year, subject
      FROM university_rankings
      WHERE university_id IN (${Prisma.raw(uuidList)})
        AND status = 'ACTIVE'
        AND deleted_at IS NULL
      ORDER BY year DESC, rank ASC
    `;

    return rows.map((r) => ({
      universityId: r.university_id,
      rankingBody: r.ranking_body,
      rank: r.rank,
      year: r.year,
      subject: r.subject,
    }));
  },

  async fetchScholarships(
    universityIds: string[],
    programIds: string[],
  ): Promise<ScholarshipRow[]> {
    if (universityIds.length === 0) return [];

    const uniUuidList = universityIds.map((id) => `'${id}'::uuid`).join(",");
    const progUuidList = programIds.map((id) => `'${id}'::uuid`).join(",");

    if (programIds.length === 0) {
      const rows = await prisma.$queryRaw<
        Array<{
          university_id: string;
          program_id: string | null;
          name: string;
          type: string;
          amount: string | null;
          currency: string;
        }>
      >`
        SELECT university_id, program_id, name, type, amount, currency
        FROM scholarships
        WHERE university_id IN (${Prisma.raw(uniUuidList)})
          AND status = 'ACTIVE'
          AND deleted_at IS NULL
      `;

      return rows.map((r) => ({
        universityId: r.university_id,
        programId: r.program_id,
        name: r.name,
        type: r.type,
        amount: r.amount ? parseFloat(r.amount) : null,
        currency: r.currency,
      }));
    }

    const rows = await prisma.$queryRaw<
      Array<{
        university_id: string;
        program_id: string | null;
        name: string;
        type: string;
        amount: string | null;
        currency: string;
      }>
    >`
      SELECT university_id, program_id, name, type, amount, currency
      FROM scholarships
      WHERE university_id IN (${Prisma.raw(uniUuidList)})
        AND status = 'ACTIVE'
        AND deleted_at IS NULL
        AND (program_id IS NULL OR program_id IN (${Prisma.raw(progUuidList)}))
    `;

    return rows.map((r) => ({
      universityId: r.university_id,
      programId: r.program_id,
      name: r.name,
      type: r.type,
      amount: r.amount ? parseFloat(r.amount) : null,
      currency: r.currency,
    }));
  },

  assembleCandidates(
    universities: UniversitySqlRow[],
    programs: ProgramSqlRow[],
    requirements: RequirementRow[],
    intakes: IntakeRow[],
    rankings: RankingRow[],
    scholarships: ScholarshipRow[],
  ): UniversityProgramCandidate[] {
    const uniMap = new Map(universities.map((u) => [u.university_id, u]));

    return programs
      .map((p) => {
        const uni = uniMap.get(p.university_id);
        if (!uni) return null;

        return {
          universityId: uni.university_id,
          universityName: uni.university_name,
          universitySlug: uni.university_slug,
          city: uni.city,
          acceptanceRate: uni.acceptance_rate,
          countryCode: uni.country_code,
          countryName: uni.country_name,
          livingCost: uni.living_cost ? parseFloat(uni.living_cost) : 0,
          ieltsRequired: uni.ielts_required,
          postStudyWork: uni.post_study_work,
          visaSuccessRate: uni.visa_success_rate,
          programId: p.program_id,
          programName: p.program_name,
          programField: p.program_field,
          tuitionFee: p.tuition_fee ? parseFloat(p.tuition_fee) : 0,
          currency: p.currency,
          intakes: intakes.filter((i) => i.programId === p.program_id),
          requirements: requirements.filter((r) => r.programId === p.program_id),
          rankings: rankings.filter((r) => r.universityId === p.university_id),
          scholarships: scholarships.filter(
            (s) =>
              s.universityId === p.university_id &&
              (s.programId === null || s.programId === p.program_id),
          ),
        } satisfies UniversityProgramCandidate;
      })
      .filter((c): c is UniversityProgramCandidate => c !== null);
  },
};
