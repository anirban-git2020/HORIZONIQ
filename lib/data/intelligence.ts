import type {
  InterestContent,
  InterestId,
  RegionContent,
  RegionId,
} from "@/lib/types";

/**
 * Curated mock intelligence (Phase 1).
 * Each interest carries role-specific framing so the same topic reads
 * differently for a student, a professional, and an entrepreneur.
 */
export const INTEREST_CONTENT: Record<InterestId, InterestContent> = {
  ai: {
    signals: [
      {
        id: "ai-agents",
        name: "Autonomous AI Agents",
        category: "Artificial Intelligence",
        momentum: 96,
        confidence: 88,
        summary:
          "AI systems that plan and execute multi-step tasks are moving from demos into production workflows.",
        roleImpact: {
          student:
            "Agent-building is becoming a baseline hiring expectation — learn it before your peers do.",
          professional:
            "Agents will absorb routine parts of your role; lead the rollout instead of being displaced.",
          entrepreneur:
            "A window for agent-native products is open before incumbents adapt.",
        },
      },
      {
        id: "multimodal-models",
        name: "Multimodal Foundation Models",
        category: "Artificial Intelligence",
        momentum: 90,
        confidence: 84,
        summary:
          "Models that fuse text, image, audio, and video are becoming the default interface for software.",
        roleImpact: {
          student:
            "Build projects on multimodal APIs to stand out in applications and internships.",
          professional:
            "New tools can automate document, image, and call-heavy workflows in your team.",
          entrepreneur:
            "Whole categories — design, support, media — are being rebuilt multimodally.",
        },
      },
      {
        id: "edge-ai",
        name: "On-Device Edge AI",
        category: "Artificial Intelligence",
        momentum: 80,
        confidence: 83,
        summary:
          "Capable models now run locally on phones and sensors without the cloud.",
        roleImpact: {
          student:
            "Edge ML is a fast-growing niche with far less competition than cloud AI.",
          professional:
            "Private, low-latency AI unlocks regulated and offline use cases.",
          entrepreneur:
            "Hardware bundled with edge AI creates defensible, hard-to-copy products.",
        },
      },
    ],
    skills: {
      student: [
        {
          name: "Machine Learning Foundations",
          demand: "Critical",
          summary: "Core models, math, and training intuition.",
        },
        {
          name: "Data Science & Python",
          demand: "High",
          summary: "Wrangle, analyze, and model real datasets.",
        },
        {
          name: "Applied Robotics & Automation",
          demand: "Growing",
          summary: "Connect AI to the physical world.",
        },
      ],
      professional: [
        {
          name: "Applied AI in Your Workflow",
          demand: "Critical",
          summary: "Automate real tasks with agents and copilots.",
        },
        {
          name: "MLOps & Deployment",
          demand: "High",
          summary: "Ship and operate models reliably in production.",
        },
        {
          name: "AI Strategy & Governance",
          demand: "High",
          summary: "Guide responsible adoption and manage risk.",
        },
      ],
      entrepreneur: [
        {
          name: "AI Product Building",
          demand: "Critical",
          summary: "Turn models into shippable products fast.",
        },
        {
          name: "Automation Opportunity Mapping",
          demand: "High",
          summary: "Find high-value workflows worth automating.",
        },
        {
          name: "AI Go-to-Market",
          demand: "High",
          summary: "Position, price, and sell AI products.",
        },
      ],
    },
    opportunities: [
      {
        id: "ai-implementation",
        title: "AI Implementation Services",
        sector: "Artificial Intelligence",
        baseGrowth: 64,
        summary:
          "Demand is surging for teams that deploy agents into existing business workflows.",
        roleAngle: {
          student: "Junior and internship roles here are multiplying fast.",
          professional:
            "High-leverage consulting and internal-platform roles.",
          entrepreneur: "Low-capital services business with fast revenue.",
        },
      },
      {
        id: "vertical-copilots",
        title: "Vertical AI Copilots",
        sector: "Applied AI",
        baseGrowth: 58,
        summary:
          "Industry-specific copilots for legal, health, and finance are scaling quickly.",
        roleAngle: {
          student: "Domain + AI knowledge makes you highly employable.",
          professional: "Own the copilot rollout for your industry niche.",
          entrepreneur: "Pick one vertical and own its AI workflow.",
        },
      },
    ],
    actions: {
      student: [
        {
          title: "Ship one AI agent project",
          detail:
            "Build and publish a working agent that automates a real task this month.",
          priority: "High",
        },
        {
          title: "Master the fundamentals",
          detail:
            "Complete a structured ML course and document every project publicly.",
          priority: "High",
        },
      ],
      professional: [
        {
          title: "Automate your top 3 tasks",
          detail:
            "Identify and automate your three most repetitive weekly tasks with AI.",
          priority: "High",
        },
        {
          title: "Lead an AI pilot",
          detail:
            "Propose a small AI pilot in your team and own the rollout end to end.",
          priority: "Medium",
        },
      ],
      entrepreneur: [
        {
          title: "Validate one AI workflow",
          detail:
            "Interview five potential customers about a painful, automatable workflow.",
          priority: "High",
        },
        {
          title: "Ship a thin AI MVP",
          detail:
            "Launch a narrow agent product to ten users within 30 days.",
          priority: "High",
        },
      ],
    },
  },

  robotics: {
    signals: [
      {
        id: "humanoid-robotics",
        name: "Humanoid Robotics",
        category: "Robotics",
        momentum: 89,
        confidence: 74,
        summary:
          "General-purpose humanoids are entering warehouse and factory pilots.",
        roleImpact: {
          student:
            "A brand-new field hiring engineers with little legacy competition.",
          professional:
            "Plan workforce and process changes before humanoids arrive on your floor.",
          entrepreneur:
            "Integration, tooling, and services around humanoids are wide open.",
        },
      },
      {
        id: "digital-twins",
        name: "Digital Twins",
        category: "Industrial Tech",
        momentum: 82,
        confidence: 82,
        summary:
          "Live virtual replicas of factories and grids enable simulation-first operations.",
        roleImpact: {
          student: "Simulation and controls skills are in short supply.",
          professional:
            "Test process changes virtually before committing costly physical ones.",
          entrepreneur:
            "SMB-friendly digital-twin tooling is badly underserved.",
        },
      },
      {
        id: "predictive-maintenance",
        name: "Predictive Maintenance",
        category: "Industrial AI",
        momentum: 79,
        confidence: 85,
        summary:
          "Sensor and ML systems predict equipment failure before it happens.",
        roleImpact: {
          student: "Industrial ML is a stable, high-demand niche.",
          professional:
            "Cut downtime and prove ROI faster than almost any other initiative.",
          entrepreneur:
            "Retrofit predictive maintenance onto legacy machinery for recurring revenue.",
        },
      },
    ],
    skills: {
      student: [
        {
          name: "Robotics Software (ROS)",
          demand: "High",
          summary: "Perception, motion, and control.",
        },
        {
          name: "Industrial Sensors & IoT",
          demand: "Growing",
          summary: "Instrument machines and collect data.",
        },
        {
          name: "Applied ML for Hardware",
          demand: "Growing",
          summary: "Models for real-time physical systems.",
        },
      ],
      professional: [
        {
          name: "Digital Twins",
          demand: "Critical",
          summary: "Build and operate factory and grid replicas.",
        },
        {
          name: "Predictive Maintenance",
          demand: "High",
          summary: "Sensor + ML failure prediction.",
        },
        {
          name: "Industrial AI",
          demand: "High",
          summary: "Apply AI across production lines.",
        },
      ],
      entrepreneur: [
        {
          name: "Automation Integration",
          demand: "High",
          summary: "Bundle robotics into turnkey solutions.",
        },
        {
          name: "Predictive Maintenance Services",
          demand: "High",
          summary: "Retrofit ML onto legacy equipment.",
        },
        {
          name: "Robotics-as-a-Service",
          demand: "Growing",
          summary: "Recurring-revenue automation models.",
        },
      ],
    },
    opportunities: [
      {
        id: "warehouse-automation",
        title: "Warehouse & Logistics Automation",
        sector: "Robotics",
        baseGrowth: 41,
        summary:
          "Operators are retrofitting facilities with autonomous handling.",
        roleAngle: {
          student: "Controls and integration roles are growing fast.",
          professional: "Lead automation projects with clear ROI.",
          entrepreneur: "Integration services have low capital needs.",
        },
      },
      {
        id: "factory-digital-twins",
        title: "Factory Digital Twins",
        sector: "Industrial Tech",
        baseGrowth: 37,
        summary: "Manufacturers are adopting simulation-first operations.",
        roleAngle: {
          student: "Simulation skills make you stand out.",
          professional: "Own digital-twin deployment for your plant.",
          entrepreneur: "Tooling for mid-market factories is open.",
        },
      },
    ],
    actions: {
      student: [
        {
          title: "Build a robotics simulation",
          detail:
            "Recreate a real process in a simulator and tune a control loop.",
          priority: "High",
        },
        {
          title: "Learn one industrial ML pipeline",
          detail:
            "Train a predictive-maintenance model on an open sensor dataset.",
          priority: "Medium",
        },
      ],
      professional: [
        {
          title: "Pilot predictive maintenance",
          detail:
            "Instrument one critical machine and prove downtime savings.",
          priority: "High",
        },
        {
          title: "Map your automation roadmap",
          detail:
            "Rank processes by automation ROI and sequence the first three.",
          priority: "Medium",
        },
      ],
      entrepreneur: [
        {
          title: "Find one legacy retrofit niche",
          detail:
            "Identify an industry running aging equipment and scope a retrofit offer.",
          priority: "High",
        },
        {
          title: "Price a RaaS model",
          detail:
            "Design a recurring-revenue automation package and test it with two buyers.",
          priority: "Medium",
        },
      ],
    },
  },

  biotech: {
    signals: [
      {
        id: "ai-protein-design",
        name: "AI Drug & Protein Design",
        category: "Biotech",
        momentum: 86,
        confidence: 72,
        summary:
          "AI-designed proteins and molecules are compressing discovery timelines.",
        roleImpact: {
          student:
            "Computational biology blends two fields with surging demand.",
          professional:
            "Discovery workflows are being rebuilt around AI design tools.",
          entrepreneur:
            "AI-native discovery startups are attracting major funding.",
        },
      },
      {
        id: "ai-diagnostics",
        name: "AI Diagnostics",
        category: "Health & Medtech",
        momentum: 84,
        confidence: 78,
        summary:
          "AI imaging and decision-support tools are reaching clinical deployment.",
        roleImpact: {
          student: "Health + ML skills are rare and highly paid.",
          professional:
            "Diagnostics and triage workflows are being augmented by AI.",
          entrepreneur:
            "Decision-support and imaging AI are large, fundable markets.",
        },
      },
      {
        id: "synthetic-biology",
        name: "Synthetic Biology",
        category: "Biotech",
        momentum: 83,
        confidence: 70,
        summary:
          "Programmable cells are enabling engineered materials, food, and medicine.",
        roleImpact: {
          student: "A frontier field with room for new specialists.",
          professional: "Manufacturing is shifting to biological production.",
          entrepreneur: "Bio-manufacturing unlocks novel product categories.",
        },
      },
    ],
    skills: {
      student: [
        {
          name: "Bioinformatics",
          demand: "High",
          summary: "Apply computation to biological data.",
        },
        {
          name: "Biology + Data Science",
          demand: "High",
          summary: "Model lab and clinical datasets.",
        },
        {
          name: "Lab Automation",
          demand: "Growing",
          summary: "Automate experiments and pipelines.",
        },
      ],
      professional: [
        {
          name: "Clinical AI & Diagnostics",
          demand: "High",
          summary: "Deploy decision-support in care settings.",
        },
        {
          name: "Health Regulatory & Compliance",
          demand: "High",
          summary: "Navigate approval and safety pathways.",
        },
        {
          name: "Health Data Engineering",
          demand: "Growing",
          summary: "Build pipelines for clinical data.",
        },
      ],
      entrepreneur: [
        {
          name: "HealthTech Product",
          demand: "Critical",
          summary: "Build products for patients and clinicians.",
        },
        {
          name: "AI Diagnostics",
          demand: "High",
          summary: "Imaging and decision-support AI.",
        },
        {
          name: "Medical Automation",
          demand: "High",
          summary: "Automate clinical and admin workflows.",
        },
      ],
    },
    opportunities: [
      {
        id: "longevity-health",
        title: "Preventive & Longevity Health",
        sector: "Health & Medtech",
        baseGrowth: 38,
        summary:
          "Personalized, data-driven preventive care is becoming a consumer category.",
        roleAngle: {
          student: "Data + health roles are expanding.",
          professional: "Lead AI adoption in care delivery.",
          entrepreneur: "Consumer health is a fast-growing market.",
        },
      },
      {
        id: "diagnostics-platforms",
        title: "AI Diagnostics Platforms",
        sector: "Health & Medtech",
        baseGrowth: 45,
        summary:
          "Imaging and decision-support platforms are scaling across providers.",
        roleAngle: {
          student: "Clinical ML experience is highly sought after.",
          professional: "Own diagnostics AI integration.",
          entrepreneur: "Large, fundable, defensible market.",
        },
      },
    ],
    actions: {
      student: [
        {
          title: "Complete a bioinformatics project",
          detail:
            "Analyze an open genomics or clinical dataset and publish your findings.",
          priority: "High",
        },
        {
          title: "Learn health data fundamentals",
          detail:
            "Study how clinical data is structured, governed, and modeled.",
          priority: "Medium",
        },
      ],
      professional: [
        {
          title: "Trial a clinical AI tool",
          detail:
            "Pilot a diagnostics or documentation AI in a low-risk workflow.",
          priority: "High",
        },
        {
          title: "Map regulatory pathways",
          detail:
            "Document the approval path for one AI-assisted use case.",
          priority: "Medium",
        },
      ],
      entrepreneur: [
        {
          title: "Validate a HealthTech wedge",
          detail:
            "Talk to five clinicians about one painful, automatable workflow.",
          priority: "High",
        },
        {
          title: "Scope a diagnostics MVP",
          detail:
            "Define a narrow decision-support product and its data needs.",
          priority: "High",
        },
      ],
    },
  },

  climate: {
    signals: [
      {
        id: "grid-storage",
        name: "Grid-Scale Energy Storage",
        category: "Climate & Energy",
        momentum: 81,
        confidence: 85,
        summary:
          "Long-duration batteries are making renewable power dispatchable around the clock.",
        roleImpact: {
          student: "Energy engineering demand is rising sharply.",
          professional: "Storage is reshaping grid and energy operations.",
          entrepreneur: "Storage deployment outpaces available supply.",
        },
      },
      {
        id: "next-gen-solar",
        name: "Next-Gen Solar",
        category: "Climate & Energy",
        momentum: 74,
        confidence: 70,
        summary:
          "Perovskite and tandem cells are pushing efficiency past silicon limits.",
        roleImpact: {
          student: "Materials and power-electronics skills are valuable.",
          professional: "New cell tech changes procurement and design.",
          entrepreneur: "Manufacturing and install services are scaling.",
        },
      },
      {
        id: "carbon-removal",
        name: "Carbon Removal",
        category: "Climate & Energy",
        momentum: 69,
        confidence: 60,
        summary:
          "Engineered carbon removal is moving from pilots toward real markets.",
        roleImpact: {
          student: "A nascent field forming its first job categories.",
          professional: "Carbon accounting is entering core operations.",
          entrepreneur: "Early markets reward credible removal supply.",
        },
      },
    ],
    skills: {
      student: [
        {
          name: "Energy Systems",
          demand: "High",
          summary: "How power generation and grids work.",
        },
        {
          name: "Climate Data Science",
          demand: "High",
          summary: "Model emissions and energy data.",
        },
        {
          name: "Power Electronics",
          demand: "Growing",
          summary: "Storage and conversion fundamentals.",
        },
      ],
      professional: [
        {
          name: "Grid & Storage Engineering",
          demand: "High",
          summary: "Design and integrate storage at scale.",
        },
        {
          name: "Energy Analytics",
          demand: "High",
          summary: "Optimize generation and consumption.",
        },
        {
          name: "Sustainability Strategy",
          demand: "Growing",
          summary: "Drive credible decarbonization plans.",
        },
      ],
      entrepreneur: [
        {
          name: "Climate Hardware GTM",
          demand: "High",
          summary: "Take physical climate products to market.",
        },
        {
          name: "Energy Project Finance",
          demand: "High",
          summary: "Fund and structure energy projects.",
        },
        {
          name: "Carbon Markets",
          demand: "Growing",
          summary: "Navigate credits and removal supply.",
        },
      ],
    },
    opportunities: [
      {
        id: "storage-deployment",
        title: "Energy Storage Deployment",
        sector: "Climate & Energy",
        baseGrowth: 52,
        summary: "Grid and commercial storage installs are scaling fast.",
        roleAngle: {
          student: "Engineering and field roles are plentiful.",
          professional: "Lead high-ROI storage projects.",
          entrepreneur: "Install and integration demand exceeds supply.",
        },
      },
      {
        id: "commercial-solar",
        title: "Commercial Solar & Microgrids",
        sector: "Climate & Energy",
        baseGrowth: 35,
        summary: "Businesses are adopting on-site generation and microgrids.",
        roleAngle: {
          student: "Design and analysis roles are growing.",
          professional: "Own on-site energy projects.",
          entrepreneur: "Recurring energy-as-a-service models work.",
        },
      },
    ],
    actions: {
      student: [
        {
          title: "Model an energy system",
          detail:
            "Build a small simulation of a solar-plus-storage setup.",
          priority: "High",
        },
        {
          title: "Learn the grid basics",
          detail: "Understand how power flows, pricing, and storage interact.",
          priority: "Medium",
        },
      ],
      professional: [
        {
          title: "Scope a storage project",
          detail:
            "Identify one site where storage delivers clear ROI and model it.",
          priority: "High",
        },
        {
          title: "Build a decarbonization plan",
          detail:
            "Draft a credible emissions-reduction roadmap for your unit.",
          priority: "Medium",
        },
      ],
      entrepreneur: [
        {
          title: "Test an energy-as-a-service offer",
          detail:
            "Pitch on-site solar or storage to two commercial customers.",
          priority: "High",
        },
        {
          title: "Map project financing",
          detail: "Understand how to fund one type of energy project.",
          priority: "Medium",
        },
      ],
    },
  },

  fintech: {
    signals: [
      {
        id: "embedded-finance",
        name: "Embedded Finance",
        category: "Fintech",
        momentum: 83,
        confidence: 80,
        summary:
          "Banking, lending, and payments are being built into non-financial products.",
        roleImpact: {
          student: "Fintech engineering demand is broad and rising.",
          professional: "Every product team can now ship financial features.",
          entrepreneur: "Any company can become a financial distributor.",
        },
      },
      {
        id: "real-time-payments",
        name: "Real-Time Payments",
        category: "Fintech",
        momentum: 77,
        confidence: 82,
        summary:
          "Instant payment rails are becoming the global default.",
        roleImpact: {
          student: "Payments and backend skills are in demand.",
          professional: "Real-time rails change treasury and ops.",
          entrepreneur: "New rails enable new business models.",
        },
      },
      {
        id: "asset-tokenization",
        name: "Asset Tokenization",
        category: "Digital Assets",
        momentum: 71,
        confidence: 63,
        summary:
          "Real-world assets are being represented and traded on-chain.",
        roleImpact: {
          student: "Blockchain fundamentals open niche roles.",
          professional: "Settlement and custody models are shifting.",
          entrepreneur: "Tokenized assets open new marketplaces.",
        },
      },
    ],
    skills: {
      student: [
        {
          name: "Financial Data Analysis",
          demand: "High",
          summary: "Analyze transactions, risk, and markets.",
        },
        {
          name: "Backend & APIs",
          demand: "High",
          summary: "Build reliable financial services.",
        },
        {
          name: "Blockchain Foundations",
          demand: "Growing",
          summary: "Understand on-chain settlement.",
        },
      ],
      professional: [
        {
          name: "Payments Systems",
          demand: "High",
          summary: "Design and operate payment flows.",
        },
        {
          name: "Risk & Compliance (Fintech)",
          demand: "High",
          summary: "Manage fraud, KYC, and regulation.",
        },
        {
          name: "Fintech Data Engineering",
          demand: "Growing",
          summary: "Build financial data pipelines.",
        },
      ],
      entrepreneur: [
        {
          name: "Embedded Finance Products",
          demand: "Critical",
          summary: "Ship wallets, lending, and payments.",
        },
        {
          name: "Fintech Compliance",
          demand: "High",
          summary: "Launch compliant by design.",
        },
        {
          name: "Payments Go-to-Market",
          demand: "High",
          summary: "Distribute financial products.",
        },
      ],
    },
    opportunities: [
      {
        id: "embedded-payments",
        title: "Embedded Payments Platforms",
        sector: "Fintech",
        baseGrowth: 47,
        summary:
          "Non-financial brands are launching wallets, lending, and payments.",
        roleAngle: {
          student: "Backend and data roles are expanding.",
          professional: "Lead embedded finance for your product.",
          entrepreneur: "Distribution-first fintech is open.",
        },
      },
      {
        id: "smb-lending",
        title: "SMB Lending Automation",
        sector: "Fintech",
        baseGrowth: 40,
        summary:
          "AI underwriting is unlocking faster credit for small businesses.",
        roleAngle: {
          student: "Risk modeling skills are valued.",
          professional: "Own credit automation initiatives.",
          entrepreneur: "Underserved SMB credit is a large market.",
        },
      },
    ],
    actions: {
      student: [
        {
          title: "Build a payments demo",
          detail: "Integrate a payments API into a small working app.",
          priority: "High",
        },
        {
          title: "Learn risk fundamentals",
          detail: "Study fraud, KYC, and credit-risk basics.",
          priority: "Medium",
        },
      ],
      professional: [
        {
          title: "Prototype an embedded feature",
          detail:
            "Scope one financial feature you could add to your product.",
          priority: "High",
        },
        {
          title: "Review your compliance gaps",
          detail: "Map regulatory requirements for one new flow.",
          priority: "Medium",
        },
      ],
      entrepreneur: [
        {
          title: "Validate a fintech wedge",
          detail:
            "Find one segment underserved by current financial products.",
          priority: "High",
        },
        {
          title: "Plan compliant launch",
          detail: "Identify licensing and partners needed to launch.",
          priority: "High",
        },
      ],
    },
  },

  space: {
    signals: [
      {
        id: "reusable-launch",
        name: "Reusable Launch",
        category: "Space",
        momentum: 78,
        confidence: 80,
        summary:
          "Falling launch costs are unlocking a wave of new orbital businesses.",
        roleImpact: {
          student: "Aerospace and embedded roles are growing again.",
          professional: "Cheaper access reshapes space supply chains.",
          entrepreneur: "Low launch costs enable new space ventures.",
        },
      },
      {
        id: "satellite-connectivity",
        name: "Satellite Connectivity",
        category: "Space",
        momentum: 76,
        confidence: 78,
        summary:
          "Direct-to-device satellite networks are extending coverage everywhere.",
        roleImpact: {
          student: "RF and comms skills are in demand.",
          professional: "Connectivity options change product design.",
          entrepreneur: "Global coverage enables new services.",
        },
      },
      {
        id: "in-space-manufacturing",
        name: "In-Space Manufacturing",
        category: "Space",
        momentum: 66,
        confidence: 58,
        summary:
          "Orbital production of materials and pharma is moving past pilots.",
        roleImpact: {
          student: "A frontier with first-mover advantage.",
          professional: "New supply chains form above the atmosphere.",
          entrepreneur: "Early orbital industries are forming now.",
        },
      },
    ],
    skills: {
      student: [
        {
          name: "Aerospace Engineering Basics",
          demand: "High",
          summary: "Orbital mechanics and systems.",
        },
        {
          name: "Satellite Data & GIS",
          demand: "High",
          summary: "Work with earth-observation data.",
        },
        {
          name: "Embedded Systems",
          demand: "Growing",
          summary: "Build reliable flight software.",
        },
      ],
      professional: [
        {
          name: "Space Systems Engineering",
          demand: "High",
          summary: "Design and integrate space systems.",
        },
        {
          name: "Earth Observation Analytics",
          demand: "High",
          summary: "Turn satellite data into insight.",
        },
        {
          name: "RF & Communications",
          demand: "Growing",
          summary: "Design connectivity systems.",
        },
      ],
      entrepreneur: [
        {
          name: "Space Data Products",
          demand: "High",
          summary: "Build products on satellite data.",
        },
        {
          name: "Smallsat Services",
          demand: "Growing",
          summary: "Serve the smallsat boom.",
        },
        {
          name: "Geospatial SaaS",
          demand: "High",
          summary: "Sell geospatial intelligence.",
        },
      ],
    },
    opportunities: [
      {
        id: "smallsat-services",
        title: "Small Satellite Services",
        sector: "Space",
        baseGrowth: 33,
        summary:
          "Cheaper launch is enabling earth-observation and connectivity startups.",
        roleAngle: {
          student: "Engineering roles are reopening.",
          professional: "Lead smallsat programs.",
          entrepreneur: "Services around smallsats are open.",
        },
      },
      {
        id: "earth-observation",
        title: "Earth Observation Data",
        sector: "Space",
        baseGrowth: 39,
        summary:
          "Demand for geospatial analytics spans agriculture, climate, and defense.",
        roleAngle: {
          student: "GIS + ML skills stand out.",
          professional: "Own geospatial analytics.",
          entrepreneur: "Vertical EO products are underbuilt.",
        },
      },
    ],
    actions: {
      student: [
        {
          title: "Analyze satellite imagery",
          detail: "Build a project using open earth-observation data.",
          priority: "High",
        },
        {
          title: "Learn orbital basics",
          detail: "Study orbital mechanics and satellite systems.",
          priority: "Medium",
        },
      ],
      professional: [
        {
          title: "Pilot a geospatial use case",
          detail: "Apply satellite data to one real decision in your work.",
          priority: "High",
        },
        {
          title: "Scan connectivity options",
          detail: "Assess how satellite connectivity affects your products.",
          priority: "Medium",
        },
      ],
      entrepreneur: [
        {
          title: "Pick one EO vertical",
          detail:
            "Choose an industry and scope a geospatial product for it.",
          priority: "High",
        },
        {
          title: "Validate space-data demand",
          detail: "Interview three potential buyers of satellite insight.",
          priority: "Medium",
        },
      ],
    },
  },

  cybersecurity: {
    signals: [
      {
        id: "ai-threats",
        name: "AI-Driven Cyber Threats",
        category: "Cybersecurity",
        momentum: 87,
        confidence: 79,
        summary:
          "Attackers use generative AI for phishing, malware, and rapid exploits.",
        roleImpact: {
          student: "Security skills are among the most in-demand.",
          professional: "Adopt AI defenses or fall behind automated attacks.",
          entrepreneur: "AI-native defense is a fast-growing market.",
        },
      },
      {
        id: "zero-trust",
        name: "Zero Trust Architecture",
        category: "Cybersecurity",
        momentum: 78,
        confidence: 84,
        summary:
          "Identity-centric security is replacing perimeter-based models.",
        roleImpact: {
          student: "Identity and cloud security skills are valuable.",
          professional: "Lead the shift to identity-first security.",
          entrepreneur: "SMB-friendly zero-trust tooling is needed.",
        },
      },
      {
        id: "post-quantum-crypto",
        name: "Post-Quantum Cryptography",
        category: "Cybersecurity",
        momentum: 70,
        confidence: 66,
        summary:
          "Organizations are starting to migrate to quantum-safe encryption.",
        roleImpact: {
          student: "An emerging niche with long runway.",
          professional: "Begin planning crypto migration now.",
          entrepreneur: "Migration tooling is an open market.",
        },
      },
    ],
    skills: {
      student: [
        {
          name: "Security Foundations",
          demand: "High",
          summary: "Core threats, controls, and defense.",
        },
        {
          name: "Network & Cloud Security",
          demand: "High",
          summary: "Secure modern infrastructure.",
        },
        {
          name: "Threat Detection & ML",
          demand: "Growing",
          summary: "Detect attacks with data.",
        },
      ],
      professional: [
        {
          name: "Security Architecture",
          demand: "Critical",
          summary: "Design resilient systems.",
        },
        {
          name: "Zero Trust Implementation",
          demand: "High",
          summary: "Roll out identity-first security.",
        },
        {
          name: "AI Threat Defense",
          demand: "High",
          summary: "Defend against AI-driven attacks.",
        },
      ],
      entrepreneur: [
        {
          name: "AI-Native Security Products",
          demand: "Critical",
          summary: "Build automated defense tools.",
        },
        {
          name: "Managed Security Services",
          demand: "High",
          summary: "Protect underserved SMBs.",
        },
        {
          name: "Compliance Automation",
          demand: "High",
          summary: "Automate audits and controls.",
        },
      ],
    },
    opportunities: [
      {
        id: "managed-security",
        title: "AI-Native Managed Security",
        sector: "Cybersecurity",
        baseGrowth: 49,
        summary: "SMBs need automated defense against AI-generated attacks.",
        roleAngle: {
          student: "Analyst and detection roles are plentiful.",
          professional: "Lead AI-driven defense programs.",
          entrepreneur: "SMB security is a large, open market.",
        },
      },
      {
        id: "identity-modernization",
        title: "Identity & Access Modernization",
        sector: "Cybersecurity",
        baseGrowth: 42,
        summary:
          "Organizations are rebuilding access around zero-trust identity.",
        roleAngle: {
          student: "Identity skills are highly employable.",
          professional: "Own the zero-trust migration.",
          entrepreneur: "Identity tooling for SMBs is needed.",
        },
      },
    ],
    actions: {
      student: [
        {
          title: "Earn a security foundation",
          detail: "Complete a recognized security fundamentals path.",
          priority: "High",
        },
        {
          title: "Build a detection project",
          detail: "Use open data to detect a class of attacks.",
          priority: "Medium",
        },
      ],
      professional: [
        {
          title: "Harden against AI attacks",
          detail:
            "Enable phishing-resistant auth and review AI-related risks.",
          priority: "High",
        },
        {
          title: "Start zero-trust migration",
          detail: "Pick one system to move to identity-first access.",
          priority: "Medium",
        },
      ],
      entrepreneur: [
        {
          title: "Find an SMB security gap",
          detail: "Identify a segment underserved by current tools.",
          priority: "High",
        },
        {
          title: "Scope an automated offer",
          detail: "Design a managed or automated security service.",
          priority: "Medium",
        },
      ],
    },
  },

  quantum: {
    signals: [
      {
        id: "error-correction",
        name: "Quantum Error Correction",
        category: "Quantum Computing",
        momentum: 72,
        confidence: 61,
        summary:
          "Error-correction milestones are shortening the path to useful machines.",
        roleImpact: {
          student: "Early expertise compounds in a tiny talent pool.",
          professional: "Track timelines to plan crypto and R&D impact.",
          entrepreneur: "Tooling and software layers are wide open.",
        },
      },
      {
        id: "post-quantum-migration",
        name: "Post-Quantum Migration",
        category: "Quantum Computing",
        momentum: 72,
        confidence: 70,
        summary:
          "Quantum-safe cryptography standards are driving early migrations.",
        roleImpact: {
          student: "Cryptography skills gain long-term value.",
          professional: "Begin inventorying vulnerable systems now.",
          entrepreneur: "Migration tooling is a near-term market.",
        },
      },
      {
        id: "quantum-networking",
        name: "Quantum Networking",
        category: "Quantum Computing",
        momentum: 64,
        confidence: 55,
        summary:
          "Early quantum networks point toward secure long-distance links.",
        roleImpact: {
          student: "A frontier research area forming now.",
          professional: "Watch for secure-comms implications.",
          entrepreneur: "Very early, but strategically important.",
        },
      },
    ],
    skills: {
      student: [
        {
          name: "Quantum Computing Foundations",
          demand: "Growing",
          summary: "Qubits, gates, and algorithms.",
        },
        {
          name: "Linear Algebra & Physics",
          demand: "High",
          summary: "The math behind quantum.",
        },
        {
          name: "Quantum Programming (Qiskit)",
          demand: "Growing",
          summary: "Write and run quantum circuits.",
        },
      ],
      professional: [
        {
          name: "Post-Quantum Cryptography",
          demand: "High",
          summary: "Plan quantum-safe migration.",
        },
        {
          name: "Quantum Algorithms",
          demand: "Growing",
          summary: "Identify useful quantum use cases.",
        },
        {
          name: "Quantum Risk Planning",
          demand: "High",
          summary: "Assess long-horizon crypto risk.",
        },
      ],
      entrepreneur: [
        {
          name: "Quantum-Safe Security",
          demand: "High",
          summary: "Build migration and audit tools.",
        },
        {
          name: "Quantum Software Tooling",
          demand: "Growing",
          summary: "Developer layers for quantum.",
        },
        {
          name: "Deep-Tech Fundraising",
          demand: "High",
          summary: "Fund long-horizon ventures.",
        },
      ],
    },
    opportunities: [
      {
        id: "pq-migration",
        title: "Post-Quantum Security Migration",
        sector: "Cybersecurity",
        baseGrowth: 36,
        summary:
          "Enterprises are beginning multi-year quantum-safe migrations.",
        roleAngle: {
          student: "Cryptography skills are scarce.",
          professional: "Lead crypto-migration planning.",
          entrepreneur: "Migration tooling is an open near-term market.",
        },
      },
      {
        id: "quantum-tooling",
        title: "Quantum Software Tooling",
        sector: "Deep Tech",
        baseGrowth: 28,
        summary:
          "Developer tools and simulators are forming the quantum stack.",
        roleAngle: {
          student: "Research and tooling roles are emerging.",
          professional: "Explore quantum use cases early.",
          entrepreneur: "Picks-and-shovels plays are open.",
        },
      },
    ],
    actions: {
      student: [
        {
          title: "Run your first quantum circuit",
          detail: "Use an open SDK to build and simulate a simple algorithm.",
          priority: "High",
        },
        {
          title: "Strengthen the math",
          detail: "Solidify linear algebra and probability foundations.",
          priority: "Medium",
        },
      ],
      professional: [
        {
          title: "Inventory crypto exposure",
          detail:
            "List systems using vulnerable encryption to plan migration.",
          priority: "High",
        },
        {
          title: "Track quantum milestones",
          detail: "Set a quarterly review of hardware progress.",
          priority: "Medium",
        },
      ],
      entrepreneur: [
        {
          title: "Scope a quantum-safe tool",
          detail: "Define a migration or audit product for early adopters.",
          priority: "Medium",
        },
        {
          title: "Map the deep-tech funding path",
          detail: "Identify grants and investors for long-horizon R&D.",
          priority: "Medium",
        },
      ],
    },
  },
};

export const REGION_CONTENT: Record<RegionId, RegionContent> = {
  "north-america": {
    hubs: ["San Francisco", "New York", "Toronto", "Boston", "Austin"],
    context: "Deep capital markets and strong enterprise demand.",
    hubsByInterest: {
      ai: ["San Francisco", "Seattle", "Toronto"],
      biotech: ["Boston", "San Diego"],
      fintech: ["New York", "Toronto"],
      space: ["Los Angeles", "Seattle"],
    },
    growthBias: { ai: 6, space: 5, cybersecurity: 4, fintech: 3, biotech: 4 },
  },
  europe: {
    hubs: ["London", "Berlin", "Paris", "Amsterdam", "Stockholm"],
    context: "Regulation-driven markets and deep-tech research strength.",
    hubsByInterest: {
      ai: ["London", "Paris"],
      fintech: ["London", "Berlin"],
      climate: ["Copenhagen", "Munich"],
      biotech: ["Cambridge", "Basel"],
    },
    growthBias: { climate: 6, quantum: 4, ai: 3, fintech: 3 },
  },
  "asia-pacific": {
    hubs: ["Bangalore", "Singapore", "Shenzhen", "Tokyo", "Seoul"],
    context: "Fastest-scaling adoption and unmatched manufacturing depth.",
    hubsByInterest: {
      ai: ["Bangalore", "Singapore"],
      robotics: ["Shenzhen", "Tokyo"],
      fintech: ["Singapore", "Bangalore"],
      biotech: ["Singapore", "Shanghai"],
    },
    growthBias: { robotics: 7, ai: 5, fintech: 5, climate: 4 },
  },
  "middle-east-africa": {
    hubs: ["Dubai", "Riyadh", "Nairobi", "Lagos", "Cape Town"],
    context: "Sovereign-backed investment and leapfrog adoption.",
    hubsByInterest: {
      fintech: ["Lagos", "Nairobi", "Dubai"],
      climate: ["Riyadh", "Dubai"],
      ai: ["Dubai", "Riyadh"],
    },
    growthBias: { fintech: 6, climate: 6, ai: 4 },
  },
  "latin-america": {
    hubs: ["São Paulo", "Mexico City", "Bogotá", "Buenos Aires"],
    context: "Mobile-first growth and global fintech leadership.",
    hubsByInterest: {
      fintech: ["São Paulo", "Mexico City"],
      ai: ["São Paulo", "Buenos Aires"],
    },
    growthBias: { fintech: 7, ai: 3, climate: 3 },
  },
  global: {
    hubs: ["San Francisco", "London", "Singapore", "Bangalore", "Shenzhen"],
    context: "Worldwide momentum across leading innovation hubs.",
    hubsByInterest: {},
    growthBias: {},
  },
};
