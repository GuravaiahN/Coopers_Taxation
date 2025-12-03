export interface ServiceData {
  id: number
  title: string
  description: string
  icon: string
  url: string
  category: 'business' | 'individual' | 'nri'
  pricing: {
    business: string
    individual: string
    nri: string
  }
  features: string[]
  benefits: string[]
  process: string[]
}

export const servicesData: ServiceData[] = [
  {
    id: 1,
    title: "Individual Tax Return",
    description: "Professional tax preparation for individuals with comprehensive review and maximum deduction identification.",
    icon: "📄",
    url: "/services/individual-tax-return",
    category: "individual",
    pricing: {
      business: "Not applicable",
      individual: "$150-350",
      nri: "$250-500"
    },
    features: [
      "Complete tax return preparation",
      "Deduction maximization",
      "Electronic filing",
      "Audit support",
      "Tax planning advice"
    ],
    benefits: [
      "Maximum refund guarantee",
      "Professional accuracy",
      "Time-saving convenience",
      "Expert tax advice"
    ],
    process: [
      "Document collection and review",
      "Tax return preparation",
      "Client review and approval",
      "Electronic filing with IRS",
      "Follow-up and support"
    ]
  },
  {
    id: 2,
    title: "Business Tax Returns",
    description: "Comprehensive business tax preparation for corporations, partnerships, and LLCs with strategic tax planning.",
    icon: "🏢",
    url: "/services/business-tax-returns",
    category: "business",
    pricing: {
      business: "$500-2000",
      individual: "Not applicable",
      nri: "Contact for pricing"
    },
    features: [
      "Corporate tax returns (1120, 1120S)",
      "Partnership returns (1065)",
      "LLC tax returns",
      "Multi-state filing",
      "Tax planning strategies"
    ],
    benefits: [
      "Minimize tax liability",
      "Ensure compliance",
      "Strategic tax planning",
      "Year-round support"
    ],
    process: [
      "Business financial review",
      "Tax strategy consultation",
      "Return preparation",
      "Review and filing",
      "Ongoing advisory support"
    ]
  },
  {
    id: 3,
    title: "Payroll Services",
    description: "Complete payroll processing including tax calculations, direct deposits, and quarterly reporting.",
    icon: "💰",
    url: "/services/payroll-services",
    category: "business",
    pricing: {
      business: "$50-200/month",
      individual: "Not applicable",
      nri: "Not applicable"
    },
    features: [
      "Payroll processing",
      "Tax calculations",
      "Direct deposit",
      "Quarterly reports",
      "W-2 and 1099 preparation"
    ],
    benefits: [
      "Accurate payroll processing",
      "Compliance assurance",
      "Time savings",
      "Professional reporting"
    ],
    process: [
      "Setup payroll system",
      "Employee data entry",
      "Regular payroll processing",
      "Tax filing and payments",
      "Year-end reporting"
    ]
  },
  {
    id: 4,
    title: "Bookkeeping Services",
    description: "Professional bookkeeping services to maintain accurate financial records and ensure business compliance.",
    icon: "📚",
    url: "/services/bookkeeping-services",
    category: "business",
    pricing: {
      business: "$300-800/month",
      individual: "$100-250/month",
      nri: "Contact for pricing"
    },
    features: [
      "Monthly financial statements",
      "Accounts payable/receivable",
      "Bank reconciliation",
      "Expense tracking",
      "QuickBooks setup and maintenance"
    ],
    benefits: [
      "Accurate financial records",
      "Better business decisions",
      "Tax preparation readiness",
      "Compliance assurance"
    ],
    process: [
      "Initial consultation and setup",
      "Monthly transaction recording",
      "Financial statement preparation",
      "Regular review meetings",
      "Year-end preparation"
    ]
  },
  {
    id: 5,
    title: "IRS Representation",
    description: "Professional representation for IRS audits, collections, and tax disputes with experienced tax attorneys.",
    icon: "⚖️",
    url: "/services/irs-representation",
    category: "individual",
    pricing: {
      business: "$200-500/hour",
      individual: "$150-400/hour",
      nri: "$250-600/hour"
    },
    features: [
      "Audit representation",
      "Appeals process",
      "Payment plan negotiation",
      "Penalty abatement",
      "Offer in compromise"
    ],
    benefits: [
      "Professional representation",
      "Reduced penalties",
      "Payment arrangements",
      "Peace of mind"
    ],
    process: [
      "Case evaluation",
      "Strategy development",
      "IRS communication",
      "Resolution negotiation",
      "Follow-up and compliance"
    ]
  },
  {
    id: 6,
    title: "Tax Planning",
    description: "Strategic tax planning to minimize tax liability and maximize savings for individuals and businesses.",
    icon: "📈",
    url: "/services/tax-planning",
    category: "individual",
    pricing: {
      business: "$300-800",
      individual: "$200-500",
      nri: "$400-900"
    },
    features: [
      "Tax strategy development",
      "Retirement planning",
      "Investment tax planning",
      "Estate tax planning",
      "Year-end tax moves"
    ],
    benefits: [
      "Minimize tax liability",
      "Optimize financial strategy",
      "Long-term savings",
      "Professional guidance"
    ],
    process: [
      "Financial situation analysis",
      "Tax strategy development",
      "Implementation planning",
      "Regular reviews",
      "Strategy adjustments"
    ]
  },
  {
    id: 7,
    title: "NRI Tax Services",
    description: "Specialized tax services for Non-Resident Indians including FBAR filing and international tax compliance.",
    icon: "🌏",
    url: "/services/nri-tax-services",
    category: "nri",
    pricing: {
      business: "Contact for pricing",
      individual: "Not applicable",
      nri: "$400-1200"
    },
    features: [
      "US-India tax treaty benefits",
      "FBAR and FATCA compliance",
      "Dual taxation issues",
      "Foreign income reporting",
      "Tax residency planning"
    ],
    benefits: [
      "Tax treaty optimization",
      "Compliance assurance",
      "Double taxation relief",
      "Expert guidance"
    ],
    process: [
      "Residency status determination",
      "Income source analysis",
      "Tax treaty application",
      "Return preparation",
      "Ongoing compliance"
    ]
  },
  {
    id: 8,
    title: "Estate Tax Planning",
    description: "Comprehensive estate and gift tax planning to minimize tax burden and ensure smooth wealth transfer.",
    icon: "🏛️",
    url: "/services/estate-tax-planning",
    category: "individual",
    pricing: {
      business: "Not applicable",
      individual: "$500-2000",
      nri: "$800-3000"
    },
    features: [
      "Estate tax returns (706)",
      "Gift tax planning",
      "Trust tax returns",
      "Generation-skipping tax",
      "Charitable giving strategies"
    ],
    benefits: [
      "Minimize estate taxes",
      "Wealth preservation",
      "Family financial security",
      "Legacy planning"
    ],
    process: [
      "Estate valuation",
      "Tax strategy development",
      "Legal structure setup",
      "Implementation",
      "Ongoing management"
    ]
  },
  {
    id: 9,
    title: "Quarterly Tax Estimates",
    description: "Calculation and filing of quarterly estimated tax payments for self-employed individuals and businesses.",
    icon: "📅",
    url: "/services/quarterly-tax-estimates",
    category: "individual",
    pricing: {
      business: "$100-300/quarter",
      individual: "$75-200/quarter",
      nri: "$150-400/quarter"
    },
    features: [
      "Quarterly payment calculations",
      "Safe harbor compliance",
      "Payment voucher preparation",
      "Income projection analysis",
      "Year-end reconciliation"
    ],
    benefits: [
      "Avoid penalties",
      "Better cash flow management",
      "Tax compliance",
      "Professional accuracy"
    ],
    process: [
      "Income and deduction analysis",
      "Tax liability projection",
      "Quarterly payment calculation",
      "Payment submission",
      "Year-end adjustment"
    ]
  }
]