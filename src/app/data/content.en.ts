import { Expertise, Lab, ProjectCategory } from '../models';

export const CATEGORY_EN: Record<ProjectCategory, string> = {
  'Aplikasi Operasional': 'Operational Apps',
  'Cloud & Integrasi': 'Cloud & Integration',
  'Data & Dashboard': 'Data & Dashboards',
  'Analitik Data': 'Data Analytics',
  'AI & Otomasi': 'AI & Automation',
  'Dokumen & Pengetahuan': 'Documents & Knowledge',
};

export const TAGLINE_EN = 'Data · Automation · Digital Systems';

export const EXPERTISE_EN: Expertise[] = [
  { icon: 'microsoft', title: 'Enterprise Systems', description: 'Microsoft 365, Entra ID/Azure AD, and SharePoint — cloud governance, access control, and secure data migrations.' },
  { icon: 'google', title: 'Google Workspace', description: 'Super Admin, data migration, email routing, storage optimisation, and advanced automation with Apps Script & AppSheet.' },
  { icon: 'chart', title: 'Data Analytics & BI', description: 'Power BI (data modelling & DAX), SQL, Python (pandas/NumPy), R, and Looker Studio for always-current strategic insight.' },
  { icon: 'network', title: 'AI & Process Automation', description: 'Generative AI integration (Azure OpenAI, Gemini, ChatGPT), prompt engineering, RAG chatbot workflows, and n8n automation pipelines.' },
  { icon: 'sitemap', title: 'Knowledge Management', description: 'Centralised KMS portals, AI-assisted document summaries, and data-driven search that respects access rights.' },
  { icon: 'code', title: 'Web Apps & Integration', description: 'Angular, TypeScript, JavaScript, and Python in VS Code — building operational apps, API bridges, and clean data pipelines.' },
];

export const PRINCIPLES_EN = [
  { title: 'Understand the flow.', text: 'Start with who uses the data, which work repeats, and which decisions need to be made.' },
  { title: 'Connect the pieces.', text: 'Arrange data sources, process rules, interfaces, and documentation into a traceable flow.' },
  { title: 'Protect data, measure results.', text: 'Privacy and access rights are designed in from day one. Claimed benefits are measured and reviewed, not just written.' },
];

export interface ProjectTextEn {
  title?: string;
  subtitle?: string;
  summary: string;
  problem: string;
  approach: string[];
  output: string;
  note?: string;
  captions?: string[];
  links?: string[];
}

export const PROJECTS_EN: Record<string, ProjectTextEn> = {
  'governance-portal': {
    subtitle: 'One door for work that is connected.',
    summary: 'A modular Angular portal that brings activity reports, account management, meeting minutes, and cloud monitoring into a single workspace.',
    problem: 'Scattered operational modules forced users to jump between systems and learn different access patterns.',
    approach: [
      'Built an Angular portal shell with modules that can be developed independently.',
      'Used Apps Script for authorisation and a user directory based on Google Identity.',
      'Designed in-memory caching and background refresh so navigation between modules stays fast.',
    ],
    output: 'Angular portal, inter-module integration contracts, backend structure, and baseline security tests. The earlier dashboard became the foundation of this portal.',
    note: 'Internal system. No login, employee directory, or internal module is exposed in this portfolio.',
  },
  'sistem-beasiswa': {
    title: 'Scholarship Information System',
    subtitle: 'From registration to disbursement, in one flow.',
    summary: 'A web app for managing scholarship programmes: registration, criteria-based selection, fund disbursement, reports, and user management.',
    problem: 'Managing scholarships in manual spreadsheets made it hard to track applicant status, keep scoring consistent, and summarise disbursements per region.',
    approach: [
      'Modelled master data for regional offices, education levels, and selection criteria & weights.',
      'Selection with the SAW (Simple Additive Weighting) method — scores and rankings are computed automatically from 6 benefit/cost criteria.',
      'Registration → selection → disbursement (including salary-crediting files) → print-ready reports.',
      'Google sign-in, user roles (admin/PIC), an isolated demo mode, and an interactive guided tour.',
    ],
    output: 'Single-page app with a summary dashboard, CRUD modules, SAW calculation, reports & export, plus an Apps Script + Google Sheets backend.',
    note: 'Source code and backend endpoints are not published. All screenshots come from Demo Mode with sample data — not real applicant data.',
    captions: [
      'Dashboard summarising applicant status and distribution per regional office.',
      'SAW selection: score per criterion, final score, and automatic ranking.',
      'Criteria & weight settings — total weight is validated to equal 1.00.',
      'Fund disbursement with status tracking and salary-crediting file generation.',
    ],
  },
  siagaai: {
    subtitle: 'A small app for big preparedness.',
    summary: 'A disaster-preparedness platform for the IDCamp 2025 Developer Challenge: BMKG earthquake monitoring, an AI assistant, and emergency guides.',
    problem: 'Earthquake information and safety guidance are scattered and hard for the public to digest quickly during emergencies.',
    approach: [
      'Shows the latest and recent BMKG earthquakes through a backend relay.',
      'Provides an AI assistant (Google Gemini, with automatic API-key failover) with quick preparedness questions.',
      'Practical guides for earthquakes, tsunamis, floods, landslides, and fires.',
    ],
    output: 'A public web app plus its source-code repository on GitHub.',
    captions: [
      'Architecture (frontend → Apps Script proxy → BMKG & AI), live earthquake monitor, and AI assistant.',
      'Recent earthquakes and preparedness guides for five disaster types.',
    ],
    links: ['Open app', 'GitHub repository'],
  },
  'cloud-migration': {
    subtitle: 'Moving data. Keeping its trail.',
    summary: 'A copy-only migration from SharePoint to Google Shared Drive with checkpoints, file verification, a monitoring dashboard, and Entra ID & Google Admin account governance.',
    problem: 'Cross-cloud archive transfers must be resumable when interrupted, without deleting the source or losing the status trail of each file.',
    approach: [
      'Separated inventory, copy, and verification stages.',
      'Recorded per-file status and checkpoints so the process can resume safely.',
      'Combined a monitoring dashboard, capacity audit, and an operational runbook.',
    ],
    output: 'Python migration engine, monitoring dashboard, storage-audit scripts, account-management CLI, and an operational runbook.',
    note: 'File names, folder structures, and organisational account data are not shown.',
  },
  'activity-dashboard': {
    subtitle: 'Linking activity reports with publications.',
    summary: 'A dashboard that shows report counts, publication status, periods, work units, and programme pillars in one view.',
    problem: 'Activity reports and published articles need to be read together so teams know what is documented and what has not yet been published.',
    approach: [
      'Summary of reports and publication ratio.',
      'Filters for period, work unit, and programme pillar.',
      'Opens activity details and article links straight from the summary.',
    ],
    output: 'Dashboard with KPI cards, charts, an activity table, and article previews.',
    note: 'Institutional programme figures are not published.',
  },
  'bi-dashboards': {
    subtitle: 'Public datasets, read like a control room.',
    summary: 'Three interactive analytics dashboards: SuperStore (sales & profit), Marketing Omnichannel (funnel & CTR), and Rig Operations Telemetry (productivity & fuel).',
    problem: 'Thousands of raw rows are hard to read without KPI summaries, segmentation, and consistent visuals to support decisions.',
    approach: [
      'Cleaned and aggregated CSV data directly in the browser (9,900+ rows for SuperStore).',
      'KPIs, trends, region/channel segmentation, and ranking tables in themed tabs.',
      'Chart cards that can be reordered, expanded, and downloaded as PNG.',
    ],
    output: 'SuperStore Analytics, Marketing Analytics (7 tabs from overview to funnel), and Rig Operations Telemetry (DDR, fuel, productivity).',
    note: 'Uses public/practice datasets, not organisational data.',
    captions: [
      'SuperStore Intelligence — revenue, profit, orders, margin KPIs, and monthly trend.',
      'Marketing Analytics — impressions, clicks, CTR, and omnichannel trends.',
      'Rig Operations Telemetry — daily productivity and fuel efficiency per rig.',
    ],
  },
  'ml-fraud-detection': {
    subtitle: 'Cluster first, then classify.',
    summary: 'Transaction anomaly detection: K-Means for cluster labelling, then classification with Decision Tree and Random Forest (best accuracy 96.02%).',
    problem: 'The transaction dataset had no fraud labels, so anomaly patterns had to be discovered before a classifier could be trained.',
    approach: [
      'Exploration and pre-processing of 2,512 transactions.',
      'K-Means clustering to create labels, then trained Decision Tree (93.63%) and Random Forest (95.62%).',
      'Hyperparameter-tuned Random Forest reaching 96.02% accuracy, plus an interactive risk simulator.',
    ],
    output: 'Analysis notebook, model comparison, and a browser-based risk-score simulator.',
    note: 'Learning project from Dicoding “Belajar Machine Learning untuk Pemula” using a practice dataset.',
    captions: ['Project overview: K-Means clustering → Random Forest classification (96.02% accuracy).'],
  },
  'program-mapping': {
    subtitle: 'Reading programme reach by region.',
    summary: 'A normalisation and aggregation pipeline for an interactive map of programme distribution by region and pillar.',
    problem: 'Data spread across many sheets had to be normalised before it could be mapped and compared consistently.',
    approach: ['Mapped sheets to programmes and pillars.', 'Location normalisation, geocoding, and aggregation.', 'Results shown on a Leaflet map with clustering and regional filters.'],
    output: 'Python pipeline, programme mapping, and a Leaflet frontend.',
    note: 'No beneficiary names, addresses, or coordinates are published.',
  },
  'meeting-records': {
    subtitle: 'From meeting notes to structured archives.',
    summary: 'A meeting-minutes app with attachments, recordings, revisions, PDF signature placement, and document history.',
    problem: 'Minutes, attendance, recordings, and documentation lived in different places, making review and tracing slow.',
    approach: ['One input flow for meeting information and attachments.', 'History, revision notes, and signature positions on PDFs.', 'Separated file storage, metadata, and user interface.'],
    output: 'Input, history, and login pages, an Apps Script backend, and frontend logic.',
    note: 'Meeting content and internal documents are not published.',
  },
  'report-automation': {
    subtitle: 'Stitching data, photos, and periodic reports.',
    summary: 'An n8n workflow connecting SharePoint, AI Vision-assisted photo curation, and Canva report preparation.',
    problem: 'Periodic reports involve repetitive data pulls, photo selection, caption writing, and template filling.',
    approach: ['Separated source connection, photo curation, and report assembly.', 'AI Vision photo scoring and captions with human review.', 'Data preparation for Canva Bulk Create.'],
    output: 'n8n workflows, integration docs, and CSV/JSON exports.',
  },
  'workspace-admin': {
    summary: 'Active-account reconciliation, group management, inactive-candidate checks, and administrative approval flows.',
    problem: 'The account directory must match active staff data while protecting admin accounts and operational exceptions.',
    approach: ['Python CLI for directory operations.', 'Mandatory dry-run before any change.', 'Documented exceptions, grace periods, approvals, and report history.'],
    output: 'CLI and documentation for Google Workspace & Microsoft 365 account management.',
  },
  'sheet-sync': {
    summary: 'Syncs selected data from SharePoint Excel to Google Sheets with completeness and status rules.',
    problem: 'Programme data needed to be available on another reporting platform without copying rows by hand.',
    approach: ['Reads workbooks via Microsoft Graph.', 'Filters by realisation status and column completeness.', 'One-off, scheduled, or Apps Script-based runs.'],
    output: 'Sync scripts, configuration guide, and process logs.',
  },
  'unit-performance': {
    summary: 'Work-unit performance summary: plan vs actual, fundraising, distribution, and balances.',
    problem: 'Decision-making needs a cross-indicator view with consistent unit and period filters.',
    approach: ['Indicators grouped into themed panels.', 'Plan vs actual comparison.', 'Breakdown by programme, channel, fund source, and region.'],
    output: 'Dashboard and Apps Script backend with export paths.',
    note: 'Transaction values and donor data are not shown.',
  },
  'disaster-response': {
    summary: 'Situation dashboard and daily report forms for response timelines, aid, and field documentation.',
    problem: 'Field response information must be compiled into summaries that are easy to read and update.',
    approach: ['Links aid summaries with activity timelines.', 'Daily report forms and documentation storage.', 'Report aggregates from Apps Script for an Angular dashboard.'],
    output: 'Situation dashboard, form mapping, and daily reporting documentation.',
  },
  'knowledge-hub': {
    summary: 'A policy-document portal with categories, years, document preview, and access restrictions.',
    problem: 'Reference documents must be easy to find without losing their category context and access rights.',
    approach: ['Documents grouped by category and year.', 'Single entry point to dashboards and reference documents.', 'Separate login, access-denied, and document-preview pages.'],
    output: 'KMS portal for 100+ employees with an Apps Script backend.',
  },
  'wbs-awareness': {
    summary: 'Awareness assessment e-form with question navigation, timer, automatic scoring, and response recap.',
    problem: 'Internal education activities need a structured way to collect responses and compute results.',
    approach: ['Question interface with progress indicator and timer.', 'Respondent identity validated against the internal directory.', 'Results, duration, and response details recorded via Apps Script.'],
    output: 'Assessment frontend, backend, and deployment guide.',
  },
  'regulatory-reporting': {
    summary: 'A reporting data workspace: fundraising, donors, distribution, and beneficiaries before submission.',
    problem: 'Cross-department data must be arranged to the reporting structure and checked before submission.',
    approach: ['Summary panels and reporting tables.', 'Period selection and validation status.', 'Dashboard separated from the external submission process.'],
    output: 'Reporting dashboard and automation source.',
  },
  'qurban-operations': {
    summary: 'Cross-campaign dashboard (fundraising, stock, report progress) plus a “Cek Qurbanmu” page for regional report access.',
    problem: 'Different programme schemes and reporting stages had to be summarised without losing per-unit detail.',
    approach: ['Separate menus for campaigns and operations.', 'Fundraising, stock, and report-progress trends on one screen.', 'GitHub Pages frontend separated from the Apps Script backend, plus report link & PDF consolidation.'],
    output: 'Dashboard, report landing page, link-sync scripts, and a PDF merging tool.',
    note: 'The public lookup demo was removed from this portfolio to protect donors’ personal data.',
  },
  'economic-reporting': {
    summary: 'Group report portal, reporting history, and facilitator database management.',
    problem: 'Group-level reporting needs structured input and a traceable history for different roles.',
    approach: ['Separated frontend and spreadsheet backend.', 'User access via Google Identity.', 'Modular menus and facilitator administration.'],
    output: 'Modular portal with an Apps Script backend.',
  },
  'telegram-workflows': {
    summary: 'Consent-based message archiving, request/report candidate detection, and messaging with dry-run mode.',
    problem: 'Data requests and reports easily get lost in long group conversations.',
    approach: ['Exports messages with topic context.', 'Category rules to filter candidates, reviewed by humans.', 'Dry-run as the default before sending.'],
    output: 'Exporter, candidate detector, frontend, and Python backend.',
  },
  'minutes-drafting': {
    summary: 'Turns notes into Word meeting-minute drafts with templates, follow-ups, and validation notes.',
    problem: 'Conversation notes must be sorted by context before becoming consistent meeting drafts.',
    approach: ['Separated source selection, meeting context, and drafting.', 'Reference table structures and document styles.', 'Flags information that still needs confirmation.'],
    output: 'Word draft generator for human review.',
  },
  'document-engineering': {
    summary: 'Helper tools for evidence matrices, programme recaps, audio transcription, and structured documents.',
    problem: 'Reporting needs often start from forms, audio, and workbooks with inconsistent structures.',
    approach: ['Good-practice and evidence matrices.', 'Programme recaps with regional mapping.', 'Timestamped transcription into Word documents.'],
    output: 'Scripts and outputs for spreadsheets, recaps, and transcripts.',
  },
};

export const LABS_EN: Lab[] = [
  { title: 'Knowledge Assistant / RAG', detail: 'Telegram workflow with a language model, memory, and vector store. Answer quality and grounding are still being evaluated.', stack: 'n8n · Qdrant · Ollama · Embeddings' },
  { title: 'Submission Automation Prototype', detail: 'Sync and browser-automation design. Final response validation is still under test.', stack: 'Playwright · GitHub Actions · Apps Script' },
  { title: 'Data Engineering / Fabric', detail: 'Notebook and SQL workspace for exploring data engineering on Microsoft Fabric.', stack: 'Microsoft Fabric · PySpark · SQL' },
  { title: 'Desktop Meeting Automation', detail: 'Desktop and browser UI automation with OCR fallback and logging.', stack: 'Python · UI Automation · Playwright · OCR' },
];
