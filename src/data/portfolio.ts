/** The single editorial source. Image filenames resolve in src/images; downloadable files resolve in public/. */
export const CONTACT_EMAIL: string | null = null;
export const SHOW_CV = false;

export const person = {
  name: 'Raphael Adem', initials: 'RA', jobTitle: 'Aspiring Data Analyst',
  title: 'Aspiring Data Analyst | Business Intelligence | Data Visualization',
  disciplines: 'Data Analyst | Business Intelligence | Data Visualization',
  university: 'Veritas University', education: 'Software Engineering student at Veritas University',
  headshot: 'photo-profile-user.png', portraitAlt: 'Portrait of Raphael Adem', cv: '/Raphael-Adem-CV.pdf',
};

export const profiles = [
  { name: 'LinkedIn', label: 'LinkedIn', url: 'https://www.linkedin.com/in/raphael-adem-578648431', icon: 'linkedin' },
  { name: 'X', label: 'X', url: 'https://x.com/Raphaeladem45', icon: 'x' },
  { name: 'Fiverr', label: 'Hire me on Fiverr', url: 'https://www.fiverr.com/s/wbkwRDw', icon: 'fiverr' },
] as const;

export const nav = [
  { id: 'about', label: 'About' }, { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' }, { id: 'contact', label: 'Contact' },
] as const;

export const copy = {
  siteTitle: 'Raphael Adem | Data Analyst and Business Intelligence',
  description: 'Raphael Adem is an aspiring Data Analyst turning raw data into business insights. Explore independent projects in Excel and Power BI, and connect with Raphael.',
  portfolio: 'Analytics portfolio',
  greeting: "Hi, I'm Raphael Adem", headline: ['Turning data', 'into ', 'decisions.'],
  lead: 'Aspiring Data Analyst and Business Intelligence enthusiast. I transform raw data into clear insights that help businesses understand performance, spot operational problems and make informed decisions.',
  primary: 'View projects', connect: "Let's connect", toolkit: 'Core toolkit',
  workspace: 'Analytics workspace', figure: 'Fig. A', study: 'Abstract study',
  illustrationAlt: 'An abstract isometric dashboard with red columns, a line, a ring and blank KPI tiles on drafting paper. Decorative, not project results.',
  scroll: 'Scroll to explore',
  about: 'About me', aboutParagraphs: [
    'I am an aspiring Data Analyst and Software Engineering student at Veritas University, with a strong interest in transforming raw data into meaningful insights that support business growth and informed decision-making.',
    'My approach goes beyond creating visual reports and dashboards. I focus on understanding business operations, identifying performance gaps, uncovering trends and translating complex datasets into clear, actionable insights.',
    'I have developed hands-on experience through independent analytical projects involving sales performance, financial operations, workforce management, employee attrition and healthcare analytics.',
    'I am particularly interested in applying analytical thinking and AI-assisted workflows to improve reporting processes, uncover business opportunities and support data-driven decisions.',
  ],
  quote: 'Learning, analysing, and building one project at a time.',
  objectiveHeading: 'Career objective', careerObjective: 'To develop innovative, data-driven solutions that help businesses improve operational efficiency and make better strategic decisions.',
  skills: 'Skills and tools', technical: 'Technical skills', technologies: 'Tools and technologies',
  projects: 'Featured projects', projectIntro: 'Independent analytics projects built around real business scenarios. Full dashboards and write-ups are being documented and added here.',
  preview: 'Dashboard preview coming soon', caseStudy: 'Case study', viewCase: 'View case study',
  complete: 'Complete', inProgress: 'In progress', overview: 'Overview', objective: 'Objective',
  areas: 'Key areas', planned: 'Planned', questions: 'Business questions', demonstrates: 'Demonstrates',
  dashboard: 'View dashboard', report: 'Download report',
  contact: "Open to data analyst opportunities, internships and freelance projects. Let's talk about how data can help your business.",
  email: 'Email me', cv: 'Download CV', top: 'Back to top',
  trademarks: 'Product names and logos are trademarks of their owners.',
  ui: {
    skip: 'Skip to content',
    profileLinks: 'Social profiles', all: 'All', filter: 'Filter projects', projectUnit: 'projects',
    projectSingular: 'project', shown: 'shown', openPage: 'Open full page', closeStudy: 'Close case study',
    loading: 'Opening case study…', back: 'Back to projects', enlarge: 'Enlarge dashboard', closeImage: 'Close enlarged image', gallery: 'Dashboard views',
    actual: 'Actual size', fit: 'Fit to screen', enlarged: 'Enlarged dashboard',
    profile: 'Profile', capabilities: 'Capabilities', work: 'Work', contact: 'Contact',
    resources: 'Resources', index: 'Contents', sector: 'Industry', tools: 'Tools', status: 'Status',
    missing: 'Page not found', missingBody: 'This page is not in the portfolio.', home: 'Back to portfolio',
  },
};

export const toolkit = [
  { name: 'Microsoft Excel', short: 'Excel', icon: 'xlsx', core: true },
  { name: 'Power BI', short: 'Power BI', icon: 'power-bi', core: true },
  { name: 'Power Query', short: 'Power Query', icon: 'power-query', core: false },
  { name: 'SQL', short: 'SQL', icon: 'sql', core: true },
] as const;
export const coreTools = toolkit.filter(tool => tool.core);
export const technicalSkills = [
  'Data Cleaning and Preparation', 'Data Analysis', 'Data Visualization', 'Business Intelligence',
  'KPI Development', 'Data Transformation', 'Dashboard Reporting', 'Data Entry', 'Data Annotation',
];
export const industries = {
  'Retail / Sales': 'Retail', 'Human Resources': 'HR', 'Finance / Business Operations': 'Finance',
  Healthcare: 'Healthcare', 'Agriculture / Food Production': 'Agriculture',
  'Information and Communication Technology': 'ICT',
} as const;
export interface Screenshot { file: string; name: string; alt: string }
const shot = (file: string, name: string, alt: string): Screenshot => ({ file, name, alt });
export interface Project {
  title: string; slug: string; industry: keyof typeof industries; tools: ('Microsoft Excel' | 'Excel' | 'Power BI' | 'SQL' | 'Power Query')[];
  overview: string; excerpt: string; objective: string; keyAreas: string[]; businessQuestions: string[]; demonstrates: string;
  status: 'complete' | 'in-progress'; dashboardUrl: string | null; reportUrl: string | null; image: Screenshot | null;
  additionalImages: Screenshot[]; note?: string;
}
type ProjectInput = Omit<Project, 'status' | 'dashboardUrl' | 'reportUrl' | 'image' | 'additionalImages' | 'overview'> &
  Partial<Pick<Project, 'status' | 'dashboardUrl' | 'reportUrl' | 'image' | 'additionalImages'>> & { introduction: string };
function project({ introduction, ...fields }: ProjectInput): Project {
  return {
    status: 'complete', dashboardUrl: null, reportUrl: null,
    image: null, additionalImages: [], ...fields,
    overview: `${introduction} ${fields.objective}`,
  };
}

export const projects: Project[] = [
  project({
    title: 'Sales Performance and Revenue Analysis', slug: 'sales-performance', excerpt: 'Business sales performance over multiple years (2018–2025).', industry: 'Retail / Sales', tools: ['Microsoft Excel', 'Power BI'],
    image: shot('sales-revenue-analysis.png', 'Sales and revenue analytics', 'Sales and revenue dashboard with monthly revenue, sales quantity and regional comparisons.'),
    introduction: 'An analytical project focused on evaluating business sales performance over multiple years (2018–2025).',
    objective: 'The objective is to understand revenue generation, profitability, product performance and sales trends while identifying areas that require business attention.',
    keyAreas: ['Total Revenue', 'Total Profit', 'Total Sales Quantity', 'Cost Analysis', 'Yearly and Monthly Sales Trends', 'Product Performance', 'Revenue and Profitability', 'Sales Performance Comparison'],
    businessQuestions: ['How has the business performed over the years?', 'Which products contribute the most revenue?', 'Are sales increasing or declining?', 'How does business profitability compare with revenue?', 'Which periods generate the highest sales?'],
    demonstrates: 'Sales analysis, financial interpretation, KPI development and trend visualization.',
  }),
  project({
    title: 'Employee Attrition and Workforce Analysis', slug: 'employee-attrition', excerpt: 'The factors associated with workforce attrition.', industry: 'Human Resources', tools: ['Microsoft Excel'],
    image: shot('hr-attrition.png', 'Employee attrition', 'Attrition dashboard showing departures by job role and department.'),
    additionalImages: [shot('workforce-analytics.jpg', 'Workforce analytics', 'Workforce dashboard comparing hires, exits and turnover by department.')],
    introduction: 'An HR analytics project designed to investigate employee turnover and understand the factors associated with workforce attrition.',
    objective: 'The analysis focuses on employee demographics, departmental performance and differences between employees who leave an organization and those who remain.',
    keyAreas: ['Total Employee Count', 'Attrition Count', 'Attrition Rate', 'Average Employee Age', 'Employee Distribution by Department', 'Overtime Analysis', 'Employee Retention', 'Leavers vs. Existing Employees'],
    businessQuestions: ['What percentage of employees leave the organization?', 'Which departments experience the highest attrition?', 'What is the average age of employees leaving?', 'Are there noticeable differences between employees who leave and those who stay?', 'What workforce patterns should management investigate?'],
    demonstrates: 'HR analytics, data cleaning, workforce reporting, KPI calculations and business problem identification.',
  }),
  project({
    title: 'Financial Performance and Profitability Analysis', slug: 'financial-performance', excerpt: 'Examining revenue, expenses and profitability.', industry: 'Finance / Business Operations', tools: ['Microsoft Excel', 'Power BI'],
    image: shot('profitability-analysis.png', 'Profitability analysis', 'Financial dashboard comparing net profit by product and gross margin by department.'),
    additionalImages: [
      shot('budget-and-variance.png', 'Budget and variance', 'Budget dashboard comparing actual and budgeted revenue and expenses.'),
      shot('cash-flow-and-financial-risk.png', 'Cash flow and financial risk', 'Cash flow dashboard showing inflows, outflows and monthly net cash flow.'),
    ],
    introduction: "A financial analytics project designed to evaluate an organization's financial performance by examining revenue, expenses and profitability.",
    objective: 'The objective is to provide management with a clear understanding of financial performance and identify patterns that could influence business decisions.',
    keyAreas: ['Total Revenue', 'Total Expenses', 'Net Profit', 'Profitability Trends', 'Monthly Financial Performance', 'Departmental Financial Performance', 'Revenue and Expense Comparison', 'Period-over-Period Performance'],
    businessQuestions: ['Is the business operating profitably?', 'How do expenses compare with revenue?', 'Which departments contribute most to financial performance?', 'How does profitability change over time?', 'Are expenses increasing faster than revenue?'],
    demonstrates: 'Financial analysis, business performance monitoring, KPI tracking and interactive dashboard development.',
  }),
  project({
    title: 'Healthcare Operations and Patient Analytics', slug: 'healthcare-operations', excerpt: 'Patient demographics and billing performance.', industry: 'Healthcare', tools: ['Microsoft Excel', 'Power BI'],
    image: shot('bio-data-evaluation.png', 'Bio-data evaluation', 'Healthcare dashboard showing patient records, admission trends, length of stay and billing.'),
    additionalImages: [shot('healthconditio.png', 'Health condition analysis', 'Healthcare dashboard comparing billing and patient records by medical condition.')],
    introduction: 'An analytical project focused on examining healthcare operations and patient-related information to understand admission patterns, patient demographics and billing performance.',
    objective: 'The objective is to transform healthcare records into useful operational insights.',
    keyAreas: ['Total Patient Records', 'Average Patient Age', 'Patient Admissions', 'Length of Hospital Stay', 'Total Billing', 'Age Group Distribution', 'Monthly Admission Trends', 'Patient Demographics'],
    businessQuestions: ['What are the patient admission patterns?', 'Which age groups account for the highest number of admissions?', 'What is the average patient length of stay?', 'How does billing vary across patient records?', 'What patterns can be identified in hospital admissions?'],
    demonstrates: 'Healthcare data analysis, operational reporting, demographic analysis and KPI visualization.',
    note: 'Counts reflect records in the dataset, not verified unique patients.',
  }),
  project({
    title: 'IVAAN Rice Ltd.: Business Operations and Financial Performance', slug: 'ivaan-rice', excerpt: 'Income, expenses, profitability and monthly business trends.', industry: 'Agriculture / Food Production', tools: ['Microsoft Excel', 'Power BI'],
    image: shot('ivaaan.png', 'IVAAN Rice operations', 'IVAAN Rice dashboard showing monthly income, expenses and profit.'),
    introduction: 'An independent business analysis project built around a rice production and distribution business scenario.',
    objective: "It evaluates the company's financial and operational performance through income, expenses, profitability and monthly business trends, to understand how the business generates revenue, manages expenses and maintains profitability.",
    keyAreas: ['Total Business Income', 'Total Expenses', 'Net Profit', 'Monthly Income Trends', 'Expense Monitoring', 'Profitability Analysis', 'Financial Performance Indicators', 'Period-over-Period Growth'],
    businessQuestions: ['Is the business generating sustainable profits?', 'How much does the business spend relative to its income?', 'How does profitability change monthly?', 'Are there periods of declining financial performance?', 'What financial areas require management attention?'],
    demonstrates: 'Independent business analysis, financial reporting, profitability monitoring and analytical problem-solving.',
  }),
  project({
    title: 'ICT Operations and Performance Analysis', slug: 'ict-operations', excerpt: 'Operational data within the ICT industry.', industry: 'Information and Communication Technology', tools: ['Excel', 'Power BI'], status: 'in-progress',
    image: shot('service-and-incidence.png', 'Service and incident management', 'ICT dashboard showing incident severity, resolution times and monthly downtime.'),
    additionalImages: [shot('photo_2026-11-18_20-22-29.jpg', 'Asset license management', 'ICT dashboard showing technology assets, licence assignments and maintenance costs.')],
    introduction: 'An independent analytical project exploring operational data within the ICT industry.',
    objective: 'The objective is to investigate how data can support technology operations, performance monitoring and organizational decision-making.',
    keyAreas: ['ICT Operational Performance', 'Service Delivery', 'Departmental Performance', 'Technology Resource Utilization', 'Operational Trends', 'Performance Indicators'],
    businessQuestions: [],
    demonstrates: 'Analytical thinking, data exploration, business intelligence and the application of data analytics to technology operations.',
  }),
];

const completedIndustries = [...new Set(projects.filter(p => p.status === 'complete').map(p => p.industry))];
export const stats = [
  { value: projects.length, label: 'Projects', icon: 'layers' },
  { value: coreTools.length, label: 'Core tools', icon: 'blocks' },
  { value: completedIndustries.length, label: 'Industries', icon: 'grid-2x2' },
] as const;
export const toolLabel = (name: string) => toolkit.find(t => t.name === name || t.short === name)?.short ?? name;
export const filters = [copy.ui.all, ...new Set(projects.flatMap(p => p.tools.map(toolLabel))), ...completedIndustries.map(i => industries[i])];
export const projectLabels = (p: Project) => [...p.tools.map(toolLabel), industries[p.industry]];
export const folio = (number: number) => String(number).padStart(2, '0');
