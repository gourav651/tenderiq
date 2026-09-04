import { prisma } from "../src/lib/prisma";

async function main() {
  console.log("🌱 Starting TenderIQ database seed process...");

  // Clear existing data in reverse order of dependencies
  await prisma.notification.deleteMany();
  await prisma.aIAnalysis.deleteMany();
  await prisma.application.deleteMany();
  await prisma.tenderRequirement.deleteMany();
  await prisma.tenderDocument.deleteMany();
  await prisma.tender.deleteMany();
  await prisma.user.deleteMany();
  await prisma.company.deleteMany();

  console.log("🧹 Cleared existing database records.");

  // 1. Create Demo Company
  const company = await prisma.company.create({
    data: {
      name: "Apex Solar EPC Solutions Pvt Ltd",
      description: "Leading renewable energy and EPC contractor specializing in solar rooftop and ground-mounted solar installations.",
      industry: "Renewable Energy & Solar EPC",
      website: "https://apexsolar.example.com",
      location: "Bhubaneswar",
      state: "Odisha",
      city: "Bhubaneswar",
      annualTurnover: 80000000.00, // 8 Crore INR
      yearsOfExperience: 7,
      certifications: ["ISO 9001:2015", "ISO 14001:2015", "MNRE Empaneled Contractor"],
      areasOfOperation: ["Odisha", "Maharashtra", "Chhattisgarh", "West Bengal"],
      procurementPreferences: {
        preferredCategories: ["SOLAR", "RENEWABLE_ENERGY", "ELECTRICAL"],
        maxTenderValue: 500000000,
        minTenderValue: 5000000,
      },
    },
  });

  console.log(`✅ Created Demo Company: ${company.name} (${company.id})`);

  // 2. Create Demo User
  const user = await prisma.user.create({
    data: {
      email: "rajesh.patnaik@apexsolar.example.com",
      name: "Rajesh Patnaik",
      role: "USER",
      companyId: company.id,
    },
  });

  const adminUser = await prisma.user.create({
    data: {
      email: "admin@tenderiq.example.com",
      name: "Platform Administrator",
      role: "ADMIN",
    },
  });

  console.log(`✅ Created Users: ${user.email} (User), ${adminUser.email} (Admin)`);

  const now = new Date();
  const daysFromNow = (days: number) => new Date(now.getTime() + days * 24 * 60 * 60 * 1000);

  // 3. Create Tenders
  // Tender 1: Solar EPC Sambalpur
  const tender1 = await prisma.tender.create({
    data: {
      referenceNumber: "OREDA/2026/SOLAR-EPC/089",
      title: "Design, Supply, Installation, and Commissioning of 5MW Solar Power Plant at Sambalpur",
      description: "Engineering, Procurement, and Construction (EPC) contract for a 5MW grid-connected ground-mounted solar PV power plant including 5-year comprehensive operation and maintenance (O&M) in Sambalpur district.",
      organization: "Odisha Renewable Energy Development Agency (OREDA)",
      category: "SOLAR",
      country: "India",
      state: "Odisha",
      city: "Sambalpur",
      location: "Sambalpur District Industrial Estate",
      estimatedValue: 225000000.00, // 22.5 Crore INR
      currency: "INR",
      tenderType: "WORKS",
      publishedAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
      submissionDeadline: daysFromNow(25),
      status: "ACTIVE",
      sourceName: "e-Procurement Odisha Portal",
      sourceUrl: "https://tendersodisha.gov.in/oreda-solar-089",
      documents: {
        create: [
          {
            name: "Technical Specification Document",
            fileName: "OREDA_Solar_5MW_TechSpec.pdf",
            fileUrl: "https://res.cloudinary.com/tenderiq/raw/upload/v1/tenders/OREDA_TechSpec.pdf",
            mimeType: "application/pdf",
            fileSize: 4250000,
            documentType: "TECHNICAL_SPECIFICATION",
            extractedText: "Section 3.1: Minimum turnover requirement is Rs 15 Crore per annum for last 3 fiscal years. Experience of executing at least one 3MW solar power project for government or PSU in last 5 years is mandatory. ISO 9001 certification required.",
          },
          {
            name: "Bill of Quantities (BOQ)",
            fileName: "OREDA_Solar_5MW_BOQ.pdf",
            fileUrl: "https://res.cloudinary.com/tenderiq/raw/upload/v1/tenders/OREDA_BOQ.pdf",
            mimeType: "application/pdf",
            fileSize: 1850000,
            documentType: "BOQ",
            extractedText: "Item 1: 540Wp+ Monocrystalline PERC Solar PV Modules - 9260 Units. Item 2: 2500kVA Grid Inverters - 2 Units. Item 3: 33kV Step-up Transformer Substation.",
          },
        ],
      },
      requirements: {
        create: [
          {
            type: "FINANCIAL",
            title: "Minimum Annual Turnover",
            description: "Average annual turnover of the bidder during the last 3 financial years (FY 2022-23, 2023-24, 2024-25) should not be less than Rs 15 Crore.",
            isMandatory: true,
            sourceDocumentId: "OREDA_TechSpec.pdf",
            sourcePage: 14,
          },
          {
            type: "EXPERIENCE",
            title: "Solar Installation Experience",
            description: "Must have successfully commissioned at least one 3MW grid-connected solar power plant or two 1.5MW plants in the last 5 years for a Government agency or PSU.",
            isMandatory: true,
            sourceDocumentId: "OREDA_TechSpec.pdf",
            sourcePage: 16,
          },
          {
            type: "CERTIFICATION",
            title: "Quality Certification",
            description: "Bidder must possess valid ISO 9001:2015 Quality Management System Certification.",
            isMandatory: true,
            sourceDocumentId: "OREDA_TechSpec.pdf",
            sourcePage: 18,
          },
        ],
      },
    },
  });

  // Tender 2: PMC ERP Software
  await prisma.tender.create({
    data: {
      referenceNumber: "PMC/IT/2026/ERP-014",
      title: "Implementation and Maintenance of Enterprise Resource Planning (ERP) System for Pune Municipal Corporation",
      description: "Selection of System Integrator for design, development, implementation, and 3-year support of integrated Cloud ERP solution covering Finance, HR, Property Tax, and Citizen Services.",
      organization: "Pune Municipal Corporation (PMC)",
      category: "SOFTWARE",
      country: "India",
      state: "Maharashtra",
      city: "Pune",
      location: "PMC Headquarters, Shivajinagar",
      estimatedValue: 48000000.00, // 4.8 Crore INR
      currency: "INR",
      tenderType: "SERVICES",
      publishedAt: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000),
      submissionDeadline: daysFromNow(14),
      status: "ACTIVE",
      sourceName: "MahaTenders Portal",
      sourceUrl: "https://mahatenders.gov.in/pmc-erp-014",
      documents: {
        create: [
          {
            name: "RFP & Scope of Work",
            fileName: "PMC_ERP_RFP.pdf",
            fileUrl: "https://res.cloudinary.com/tenderiq/raw/upload/v1/tenders/PMC_ERP_RFP.pdf",
            mimeType: "application/pdf",
            fileSize: 6100000,
            documentType: "RFP",
            extractedText: "System Integrator must be CMMI Level 3 or higher. Minimum 5 years of software development experience required. Annual revenue from IT software services must exceed Rs 5 Crore.",
          },
        ],
      },
      requirements: {
        create: [
          {
            type: "TECHNICAL",
            title: "CMMI Certification",
            description: "Bidder must be appraised at CMMI Level 3 or higher for Software Development.",
            isMandatory: true,
            sourceDocumentId: "PMC_ERP_RFP.pdf",
            sourcePage: 9,
          },
          {
            type: "FINANCIAL",
            title: "IT Services Turnover",
            description: "Average annual turnover from IT/Software services in last 3 financial years must be at least Rs 5 Crore.",
            isMandatory: true,
            sourceDocumentId: "PMC_ERP_RFP.pdf",
            sourcePage: 12,
          },
          {
            type: "EXPERIENCE",
            title: "Municipal / e-Governance Project Experience",
            description: "Bidder must have implemented at least one ERP or e-Governance project for a Municipal Corporation or Urban Local Body in India.",
            isMandatory: true,
            sourceDocumentId: "PMC_ERP_RFP.pdf",
            sourcePage: 15,
          },
        ],
      },
    },
  });

  // Tender 3: KRDCL Flyover Infrastructure
  await prisma.tender.create({
    data: {
      referenceNumber: "KRDCL/CIVIL/2026/FL-102",
      title: "Construction of 4-Lane Elevated Flyover Corridor at Outer Ring Road, Bengaluru",
      description: "Civil construction of 3.8 km long 4-lane elevated corridor including pre-stressed concrete girder superstructure, pile foundations, and allied road widening works.",
      organization: "Karnataka Road Development Corporation Ltd (KRDCL)",
      category: "CIVIL",
      country: "India",
      state: "Karnataka",
      city: "Bengaluru",
      location: "ORR Outer Ring Road Junction",
      estimatedValue: 850000000.00, // 85 Crore INR
      currency: "INR",
      tenderType: "WORKS",
      publishedAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
      submissionDeadline: daysFromNow(40),
      status: "ACTIVE",
      sourceName: "Karnataka e-Procurement Portal",
      sourceUrl: "https://karnataka.eproc.gov.in/krdcl-fl102",
      documents: {
        create: [
          {
            name: "Civil Tender Drawings & Specs",
            fileName: "KRDCL_Flyover_Drawings.pdf",
            fileUrl: "https://res.cloudinary.com/tenderiq/raw/upload/v1/tenders/KRDCL_Flyover.pdf",
            mimeType: "application/pdf",
            fileSize: 12400000,
            documentType: "TECHNICAL_SPECIFICATION",
            extractedText: "Class 1 Super Special Civil Contractor registration required. Minimum annual civil turnover Rs 50 Crore.",
          },
        ],
      },
      requirements: {
        create: [
          {
            type: "FINANCIAL",
            title: "Civil Work Annual Turnover",
            description: "Minimum annual turnover of Rs 50 Crore from civil infrastructure projects in any 2 of last 5 financial years.",
            isMandatory: true,
            sourceDocumentId: "KRDCL_Flyover.pdf",
            sourcePage: 22,
          },
        ],
      },
    },
  });

  // Tender 4: OSMC Rooftop Solar Hospitals
  const tender4 = await prisma.tender.create({
    data: {
      referenceNumber: "OSMC/MED-SOLAR/2026/04",
      title: "Rooftop Solar EPC Solution for 12 Government District Hospitals across Odisha",
      description: "Turnkey EPC contract for design, installation, testing, and 3-year maintenance of 50kWp rooftop solar systems across 12 District Headquarter Hospitals.",
      organization: "Odisha State Medical Corporation (OSMC)",
      category: "SOLAR",
      country: "India",
      state: "Odisha",
      city: "Multiple Districts",
      location: "Odisha District Hospitals",
      estimatedValue: 32000000.00, // 3.2 Crore INR
      currency: "INR",
      tenderType: "WORKS",
      publishedAt: new Date(now.getTime() - 12 * 24 * 60 * 60 * 1000),
      submissionDeadline: daysFromNow(8),
      status: "ACTIVE",
      sourceName: "OSMC Procurement Portal",
      sourceUrl: "https://osmc.odisha.gov.in/med-solar-04",
      documents: {
        create: [
          {
            name: "Hospital Rooftop Solar RFP",
            fileName: "OSMC_Rooftop_Solar.pdf",
            fileUrl: "https://res.cloudinary.com/tenderiq/raw/upload/v1/tenders/OSMC_Solar.pdf",
            mimeType: "application/pdf",
            fileSize: 3100000,
            documentType: "RFP",
            extractedText: "Turnover requirement Rs 4 Crore. Experience of rooftop solar installation of total 300kWp aggregate capacity required.",
          },
        ],
      },
      requirements: {
        create: [
          {
            type: "FINANCIAL",
            title: "Turnover Criterion",
            description: "Average annual turnover of at least Rs 4 Crore in last 3 financial years.",
            isMandatory: true,
            sourceDocumentId: "OSMC_Solar.pdf",
            sourcePage: 8,
          },
          {
            type: "EXPERIENCE",
            title: "Rooftop Solar Experience",
            description: "Bidder must have completed rooftop solar installations totaling at least 300kWp cumulative capacity.",
            isMandatory: true,
            sourceDocumentId: "OSMC_Solar.pdf",
            sourcePage: 11,
          },
        ],
      },
    },
  });

  console.log("✅ Seeded 4 Tenders with Documents and Requirements.");

  // 4. Create Initial Tracked Applications for Demo Company
  const application1 = await prisma.application.create({
    data: {
      companyId: company.id,
      tenderId: tender4.id,
      createdByUserId: user.id,
      status: "PREPARING",
      notes: "BOQ verified. Site survey team dispatched to Cuttack and Puri hospitals. Preparing financial bid.",
    },
  });

  const application2 = await prisma.application.create({
    data: {
      companyId: company.id,
      tenderId: tender1.id,
      createdByUserId: user.id,
      status: "SAVED",
      notes: "Reviewing eligibility gap on Rs 15 Cr turnover requirement.",
    },
  });

  console.log(`✅ Created Applications: ${application1.id} (PREPARING), ${application2.id} (SAVED)`);

  // 5. Create Pre-generated AI Summary for Tender 1
  await prisma.aIAnalysis.create({
    data: {
      tenderId: tender1.id,
      companyId: null, // Global Summary
      userId: null,
      type: "SUMMARY",
      status: "COMPLETED",
      model: "gemini-2.5-flash",
      result: {
        objective: "Turnkey EPC contract for 5MW ground-mounted solar plant in Sambalpur with 5-year O&M.",
        estimatedValueINR: 225000000,
        submissionDeadline: tender1.submissionDeadline.toISOString(),
        keyRequirements: [
          "Minimum Rs 15 Crore annual turnover in last 3 years",
          "Prior experience executing 3MW+ solar power project for Govt/PSU",
          "ISO 9001:2015 certification mandatory",
        ],
        keyRisks: [
          "Strict liquid damage clause of 0.5% per week of delay up to max 10%",
          "Land hand-over timeline subject to local industrial clearance",
        ],
      },
    },
  });

  // Create Pre-generated Company Eligibility Analysis for Tender 4
  await prisma.aIAnalysis.create({
    data: {
      tenderId: tender4.id,
      companyId: company.id,
      userId: user.id,
      type: "ELIGIBILITY",
      status: "COMPLETED",
      model: "gemini-2.5-flash",
      result: {
        overallEligibility: "ELIGIBLE",
        scorePercentage: 92,
        breakdown: [
          {
            criterion: "Annual Turnover",
            required: "Rs 4.0 Crore",
            companyValue: "Rs 8.0 Crore",
            status: "MET",
            explanation: "Company annual turnover of Rs 8 Crore exceeds the required threshold of Rs 4 Crore.",
          },
          {
            criterion: "Years of Experience",
            required: "3 Years",
            companyValue: "7 Years",
            status: "MET",
            explanation: "Company has 7 years of solar EPC experience.",
          },
          {
            criterion: "Rooftop Capacity Experience",
            required: "300 kWp Aggregate",
            companyValue: "Empaneled MNRE Contractor",
            status: "MET",
            explanation: "Company portfolio includes completed rooftop installations exceeding 1.2 MWp aggregate.",
          },
        ],
        recommendation: "Strong candidate for bidding. Prepare submission early due to upcoming 8-day deadline.",
      },
    },
  });

  console.log("✅ Created Pre-generated AI Summary and Eligibility Analysis.");
  console.log("🚀 Database seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Database seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
