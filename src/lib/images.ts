/** Curated documentary-style photography — replace with real Muntajar shoots in production */

export const images = {
  hero: {
    home: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1920&q=85",
    studyAbroad: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1400&q=85",
    professionals: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=1400&q=85",
    workforce: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=1400&q=85",
    visa: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1400&q=85",
    about: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1400&q=85",
    destinations: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1400&q=85",
    guides: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=1400&q=85",
    stories: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1400&q=85",
    pricing: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=1400&q=85",
    contact: "https://images.unsplash.com/photo-1423666639041-f56000c27a9a?w=1400&q=85",
    eligibility: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1400&q=85",
  },
  editorial: {
    mentorship: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1000&q=80",
    studentWindow: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=1000&q=80",
    graduation: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1000&q=80",
    familyDiscussion: "https://images.unsplash.com/photo-1511895426328-dc8714191300?w=1000&q=80",
    laptopStudy: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1000&q=80",
    professionalMeeting: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=1000&q=80",
    workshop: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=1000&q=80",
    airportCandid: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1000&q=80",
    campusWalk: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1000&q=80",
    officeTeam: "https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?w=1000&q=80",
    documents: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1000&q=80",
    dhakaStreet: "https://images.unsplash.com/photo-1587474260585-136574528ed5?w=1000&q=80",
  },
  stories: {
    ayesha: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=600&q=80",
    tanvir: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=600&q=80",
    sumaiya: "https://images.unsplash.com/photo-1580894732444-8ecded7900cd?w=600&q=80",
    rakibul: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80",
    nusrat: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&q=80",
  },
  guides: {
    study: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&q=80",
    jobs: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&q=80",
    ukVisa: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&q=80",
    germanyVisa: "https://images.unsplash.com/photo-1560969184-10fe8719e047?w=800&q=80",
    safeMigration: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&q=80",
  },
} as const;

export const serviceHeroImages: Record<string, string> = {
  "study-abroad": images.hero.studyAbroad,
  "skilled-professionals": images.hero.professionals,
  workforce: images.hero.workforce,
};

export const serviceSectionImages: Record<string, string[]> = {
  "study-abroad": [images.editorial.campusWalk, images.editorial.studentWindow, images.editorial.graduation],
  "skilled-professionals": [images.editorial.professionalMeeting, images.editorial.officeTeam, images.editorial.mentorship],
  workforce: [images.editorial.workshop, images.editorial.airportCandid, images.editorial.documents],
};

export const destinationPhotos: Record<string, string> = {
  japan: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=800&q=80",
  germany: "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=800&q=80",
  uk: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&q=80",
  malaysia: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=800&q=80",
  canada: "https://images.unsplash.com/photo-1519832979-6fa067b3f2e7?w=800&q=80",
  australia: "https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?w=800&q=80",
  qatar: "https://images.unsplash.com/photo-1582407947309-fd86fe028716?w=800&q=80",
  uae: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80",
  "south-korea": "https://images.unsplash.com/photo-1517154421773-0529f29ea451?w=800&q=80",
  poland: "https://images.unsplash.com/photo-1519197924294-4ba991a11128?w=800&q=80",
};

export const guideCoverImages: Record<string, string> = {
  "study-abroad-guide": images.guides.study,
  "overseas-jobs-guide": images.guides.jobs,
  "uk-visa-guide": images.guides.ukVisa,
  "germany-visa-guide": images.guides.germanyVisa,
  "safe-migration-guide": images.guides.safeMigration,
};
