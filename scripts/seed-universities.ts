import { PrismaClient, RequirementType, ScholarshipType, UniversityType, DegreeLevel, RecordStatus } from "@prisma/client";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import * as fs from "fs";
import * as dotenv from "dotenv";

dotenv.config({ path: join(dirname(fileURLToPath(import.meta.url)), "..", ".env.local") });

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const prisma = new PrismaClient();

interface CsvRow {
  name: string;
  country: string;
  city: string;
  ranking: string;
  type: string;
  degree_level: string;
  program: string;
  min_gpa: string;
  min_percentage: string;
  accepted_boards: string;
  min_ielts: string;
  min_toefl: string;
  min_sat: string;
  annual_tuition_usd: string;
  living_cost_usd: string;
  currency: string;
  scholarship_available: string;
  scholarship_percentage: string;
  application_fee: string;
}

function parseCsv(content: string): CsvRow[] {
  const lines = content.trim().split("\n");
  const headers = lines[0].split(",");
  const rows: CsvRow[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const values: string[] = [];
    let current = "";
    let inQuotes = false;

    for (let j = 0; j < line.length; j++) {
      const char = line[j];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === "," && !inQuotes) {
        values.push(current);
        current = "";
      } else {
        current += char;
      }
    }
    values.push(current);

    const row = {} as CsvRow;
    headers.forEach((h, idx) => {
      row[h as keyof CsvRow] = values[idx] || "";
    });
    rows.push(row);
  }
  return rows;
}

function mapDegreeLevel(level: string): DegreeLevel {
  const map: Record<string, DegreeLevel> = {
    "Foundation": "FOUNDATION",
    "Bachelors": "BACHELOR",
    "Bachelor": "BACHELOR",
    "Masters": "MASTER",
    "Master": "MASTER",
    "PhD": "PHD",
    "Diploma": "DIPLOMA",
    "Certificate": "CERTIFICATE",
  };
  return map[level] || "BACHELOR";
}

function mapUniversityType(type: string): UniversityType {
  const map: Record<string, UniversityType> = {
    "Public": "PUBLIC",
    "Private": "PRIVATE",
    "Research": "RESEARCH",
    "Community": "COMMUNITY",
  };
  return map[type] || "PUBLIC";
}

function mapCountryCode(country: string): string {
  const map: Record<string, string> = {
    "Canada": "CA",
    "Australia": "AU",
    "United Kingdom": "GB",
    "USA": "US",
    "United States": "US",
  };
  return map[country] || "US";
}

function mapCountryCode3(country: string): string {
  const map: Record<string, string> = {
    "Canada": "CAN",
    "Australia": "AUS",
    "United Kingdom": "GBR",
    "USA": "USA",
    "United States": "USA",
  };
  return map[country] || "USA";
}

async function main() {
  console.log("Reading CSV file...");
  const csvPath = join(__dirname, "..", "unis.csv");
  const csvContent = fs.readFileSync(csvPath, "utf-8");
  const rows = parseCsv(csvContent);

  console.log(`Found ${rows.length} rows in CSV`);

  const countries = new Map<string, { code: string; name: string; code3: string }>();
  const universities = new Map<string, any>();
  const programs: any[] = [];

  for (const row of rows) {
    const countryCode = mapCountryCode(row.country);
    const countryCode3 = mapCountryCode3(row.country);
    const countryName = row.country;

    if (!countries.has(countryCode)) {
      countries.set(countryCode, { code: countryCode, name: countryName, code3: countryCode3 });
    }

    const uniKey = `${row.name}-${row.city}`;
    if (!universities.has(uniKey)) {
      universities.set(uniKey, {
        name: row.name,
        slug: row.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, ""),
        city: row.city,
        countryCode,
        type: mapUniversityType(row.type),
        ranking: parseInt(row.ranking) || null,
        acceptanceRate: null,
        website: null,
        logoUrl: null,
        description: null,
      });
    }

    const degreeLevel = mapDegreeLevel(row.degree_level);
    const tuitionFee = parseFloat(row.annual_tuition_usd) || 0;
    const livingCost = parseFloat(row.living_cost_usd) || 0;
    const minGpa = parseFloat(row.min_gpa) || 0;
    const minPercentage = parseFloat(row.min_percentage) || 0;
    const minIelts = parseFloat(row.min_ielts) || 0;
    const minToefl = parseInt(row.min_toefl) || 0;
    const minSat = parseInt(row.min_sat) || 0;
    const scholarshipAvailable = row.scholarship_available === "Yes";
    const scholarshipPercentage = parseFloat(row.scholarship_percentage) || 0;
    const applicationFee = parseFloat(row.application_fee) || 0;

    const acceptedBoards = row.accepted_boards.split(";").map(b => b.trim());

    programs.push({
      universityName: row.name,
      universityCity: row.city,
      name: row.program,
      slug: row.program.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, ""),
      degreeLevel,
      field: row.program,
      tuitionFee,
      currency: row.currency,
      minGpa,
      minPercentage,
      acceptedBoards,
      minIelts,
      minToefl,
      minSat,
      scholarshipAvailable,
      scholarshipPercentage,
      applicationFee,
      livingCost,
      intakes: ["Fall", "Spring"].filter(() => Math.random() > 0.3),
    });
  }

  console.log(`Unique countries: ${countries.size}`);
  console.log(`Unique universities: ${universities.size}`);
  console.log(`Programs: ${programs.length}`);

  for (const [code, country] of countries) {
    await prisma.country.upsert({
      where: { code },
      update: { name: country.name },
      create: {
        code,
        code3: country.code3,
        name: country.name,
        currency: code === "US" ? "USD" : code === "CA" ? "CAD" : code === "AU" ? "AUD" : "GBP",
        livingCost: 15000,
        status: "ACTIVE",
      },
    });
  }
  console.log("Countries upserted");

  const universitySlugMap = new Map<string, string>();

  for (const [key, uni] of universities) {
    const country = await prisma.country.findUnique({ where: { code: uni.countryCode } });
    if (!country) {
      console.warn(`Country not found for ${uni.countryCode}`);
      continue;
    }

    const created = await prisma.university.upsert({
      where: { slug: uni.slug },
      update: {
        name: uni.name,
        city: uni.city,
        countryId: country.id,
        type: uni.type,
      },
      create: {
        name: uni.name,
        slug: uni.slug,
        city: uni.city,
        countryId: country.id,
        type: uni.type,
        status: "ACTIVE",
      },
    });
    universitySlugMap.set(key, created.id);
  }
  console.log("Universities upserted");

  for (const prog of programs) {
    const uniKey = `${prog.universityName}-${prog.universityCity}`;
    const universityId = universitySlugMap.get(uniKey);
    if (!universityId) {
      console.warn(`University not found for ${uniKey}`);
      continue;
    }

    const program = await prisma.program.upsert({
      where: {
        universityId_slug: {
          universityId,
          slug: prog.slug,
        },
      },
      update: {
        name: prog.name,
        degreeLevel: prog.degreeLevel,
        field: prog.field,
        tuitionFee: prog.tuitionFee,
        currency: prog.currency,
        status: "ACTIVE",
      },
      create: {
        universityId,
        name: prog.name,
        slug: prog.slug,
        degreeLevel: prog.degreeLevel,
        field: prog.field,
        tuitionFee: prog.tuitionFee,
        currency: prog.currency,
        status: "ACTIVE",
      },
    });

    const requirements: any[] = [];
    if (prog.minGpa > 0) {
      requirements.push({
        programId: program.id,
        type: "GPA" as RequirementType,
        label: "Minimum GPA",
        minValue: prog.minGpa.toString(),
        isMandatory: true,
        status: "ACTIVE" as RecordStatus,
      });
    }
    if (prog.minPercentage > 0) {
      requirements.push({
        programId: program.id,
        type: "GPA" as RequirementType,
        label: "Minimum Percentage",
        minValue: prog.minPercentage.toString(),
        isMandatory: false,
        status: "ACTIVE" as RecordStatus,
      });
    }
    if (prog.minIelts > 0) {
      requirements.push({
        programId: program.id,
        type: "IELTS" as RequirementType,
        label: "Minimum IELTS",
        minValue: prog.minIelts.toString(),
        isMandatory: true,
        status: "ACTIVE" as RecordStatus,
      });
    }
    if (prog.minToefl > 0) {
      requirements.push({
        programId: program.id,
        type: "TOEFL" as RequirementType,
        label: "Minimum TOEFL",
        minValue: prog.minToefl.toString(),
        isMandatory: false,
        status: "ACTIVE" as RecordStatus,
      });
    }
    if (prog.minSat > 0) {
      requirements.push({
        programId: program.id,
        type: "SAT" as RequirementType,
        label: "Minimum SAT",
        minValue: prog.minSat.toString(),
        isMandatory: false,
        status: "ACTIVE" as RecordStatus,
      });
    }

    if (requirements.length > 0) {
      await prisma.requirement.createMany({
        data: requirements,
        skipDuplicates: true,
      });
    }

    for (const intakeName of prog.intakes) {
      const existingIntake = await prisma.intake.findFirst({
        where: { programId: program.id, name: intakeName },
      });
      if (existingIntake) {
        await prisma.intake.update({
          where: { id: existingIntake.id },
          data: { startDate: new Date(`${new Date().getFullYear()}-09-01`) },
        });
      } else {
        await prisma.intake.create({
          data: {
            programId: program.id,
            name: intakeName,
            startDate: new Date(`${new Date().getFullYear()}-09-01`),
            status: "ACTIVE",
          },
        });
      }
    }

    if (prog.scholarshipAvailable) {
      try {
        await prisma.scholarship.create({
          data: {
            name: "Merit Scholarship",
            type: "MERIT",
            amount: prog.tuitionFee * (prog.scholarshipPercentage / 100),
            currency: prog.currency,
            eligibility: { percentage: prog.scholarshipPercentage },
            universityId,
            programId: program.id,
            status: "ACTIVE",
          },
        });
      } catch (e) {
        // scholarship might already exist
      }
    }

    await prisma.universityRanking.upsert({
      where: {
        universityId_rankingBody_year_subject: {
          universityId,
          rankingBody: "QS",
          year: new Date().getFullYear(),
          subject: prog.field,
        },
      },
      update: { rank: 100 },
      create: {
        universityId,
        rankingBody: "QS",
        rank: 100,
        year: new Date().getFullYear(),
        subject: prog.field,
        status: "ACTIVE",
      },
    });
  }

  console.log("Programs, requirements, intakes, scholarships, and rankings created");
  console.log("Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });