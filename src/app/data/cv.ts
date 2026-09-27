import { Certification, Experience, Lang } from '../models';

interface CvContent {
  summaryTitle: string;
  summary: string;
  experienceTitle: string;
  experience: Experience[];
  projectsTitle: string;
  projects: { name: string; stack: string; detail: string }[];
  skillsTitle: string;
  skills: { label: string; value: string }[];
  certTitle: string;
  educationTitle: string;
  education: { school: string; location: string; degree: string; graduated: string; detail: string };
}

const SKILLS_EN = [
  {
    label: 'Data Analytics & Visualization',
    value: 'Power BI (Advanced DAX & Data Modeling), Google Looker Studio, SQL, Python (pandas/NumPy, scikit-learn), Chart.js, Advanced Excel, R.',
  },
  {
    label: 'Web Application Development',
    value: 'Angular, TypeScript, JavaScript, HTML/CSS, Google Apps Script (REST web apps), GitHub Actions & GitHub Pages.',
  },
  {
    label: 'Cloud & IT Infrastructure',
    value:
      'Google Workspace Super Admin (Admin SDK, Apps Script, AppSheet), Microsoft 365 (Admin Center, Entra ID/Azure, SharePoint, Microsoft Graph, Power Platform), Cloud Data Migration, Microsoft Fabric.',
  },
  {
    label: 'AI & Automation',
    value:
      'Generative AI Integration (Azure OpenAI, Gemini, Groq LLaMA, ChatGPT), Prompt Engineering, RAG Chatbots, n8n Workflows, ETL/ELT Pipeline Automation.',
  },
  {
    label: 'Security & Governance',
    value: 'Access Control & Identity (Entra ID, Google Identity), Data Privacy by Design, Content Security Policy, Data Governance.',
  },
  {
    label: 'Core Competencies',
    value: 'Knowledge Management, Digital Transformation, Business Intelligence, Strategic Reporting, Technical Documentation.',
  },
];

const SKILLS_ID = [
  { label: 'Analitik & Visualisasi Data', value: SKILLS_EN[0].value },
  { label: 'Pengembangan Aplikasi Web', value: SKILLS_EN[1].value },
  { label: 'Cloud & Infrastruktur TI', value: SKILLS_EN[2].value },
  { label: 'AI & Otomasi', value: SKILLS_EN[3].value },
  { label: 'Keamanan & Tata Kelola', value: 'Kontrol akses & identitas (Entra ID, Google Identity), privasi data sejak desain, Content Security Policy, tata kelola data.' },
  { label: 'Kompetensi Inti', value: 'Knowledge Management, Transformasi Digital, Business Intelligence, Pelaporan Strategis, Dokumentasi Teknis.' },
];

export const CV: Record<Lang, CvContent> = {
  en: {
    summaryTitle: 'Professional Summary',
    summary:
      'Tech & Data Specialist with over 10 years of experience in IT governance, organizational automation, and Business Intelligence (BI). Transforms semi-manual workflows into secure, data-driven systems across the Google and Microsoft ecosystems — from Angular web applications and Apps Script backends to Power BI dashboards, cloud migrations, and AI-assisted automation. Acts as the technical bridge between strategic management and hands-on delivery, with a strong focus on data privacy, access control, and maintainable documentation.',
    experienceTitle: 'Experience',
    experience: [
      {
        role: 'Knowledge Management Systems (KMS) Specialist',
        company: 'YBM BRILiaN',
        location: 'Jakarta Pusat, Indonesia',
        period: 'Nov 2023 — Present',
        points: [
          'Served as the primary technical bridge in translating organizational strategy into functional digital implementations and KMS solutions that align with business goals.',
          'Independently developed rapid automated data architectures when operational data was not yet available in the central system, feeding directly into internal division dashboards.',
          'Utilized VS Code as the primary development environment to integrate custom data, process it via Python, and leverage AI Assistants to accelerate data cleaning before loading into Power BI.',
          'Served as the automation technical bridge in a semi-manual work environment, optimizing data collaboration between Microsoft SharePoint and Google Workspace.',
          'Designed and launched a centralized Knowledge Management portal, eliminating information silos and ensuring seamless document access for 100+ employees.',
          'Built a modular Angular-based Corporate Governance Portal unifying activity reports, account management, meeting minutes, and cloud monitoring.',
          'Developed a Scholarship Information System covering registration, SAW-based selection, disbursement, and reporting with Google sign-in and role-based access.',
          'Integrated Generative AI into organizational document workflows to enable instant summarization and data-driven search (chat-with-data).',
          'Developed interactive Business Intelligence dashboards to visualize operational metrics in real time for executive leadership.',
          'Created custom automation scripts using Google Apps Script, cutting annual administrative report preparation time by 40%.',
          'Managed cloud infrastructure governance, user access via Entra ID/Azure and Google Admin, and secured large-scale data migrations from SharePoint to Google Drive.',
        ],
      },
      {
        role: 'Database Management Staff',
        company: 'YBM BRILiaN',
        location: 'Jakarta Pusat, Indonesia',
        period: 'Dec 2016 — Jun 2023',
        points: [
          'Managed the central database for the Program Division, ensuring high integrity and accuracy for regional reporting.',
          'Conducted Business Feasibility Analysis and due diligence on application documents for partnership programs.',
          'Evaluated division budget spending reports to monitor financial accountability and regulatory compliance.',
          'Transformed conventional physical archiving into a structured digital document ecosystem, accelerating data retrieval.',
        ],
      },
      {
        role: 'Frontliner Staff',
        company: 'YBM BRILiaN',
        location: 'Jakarta Pusat, Indonesia',
        period: 'Dec 2014 — Nov 2016',
        points: [
          'First line of information collection and data quality assurance, minimizing errors from the initial input stage.',
          'Conducted structured interviews and preliminary assessments of prospective aid program beneficiaries.',
        ],
      },
    ],
    skillsTitle: 'Technical Skills',
    skills: SKILLS_EN,
    projectsTitle: 'Selected Projects',
    projects: [
      { name: 'Corporate Governance Portal', stack: 'Angular, TypeScript, Apps Script', detail: 'Modular workspace unifying activity reports, account management, meeting minutes, and cloud monitoring.' },
      { name: 'Scholarship Information System', stack: 'JavaScript, Apps Script, Google Sheets', detail: 'End-to-end scholarship management with SAW ranking, disbursement files, printable reports, and demo mode.' },
      { name: 'Cloud Migration & Identity Management', stack: 'Python, Microsoft Graph, Google Drive API', detail: 'Resumable copy-only SharePoint → Google Shared Drive migration with checkpoints, verification, and monitoring.' },
      { name: 'SiagaAI — IDCamp 2025 Developer Challenge', stack: 'JavaScript, BMKG Open Data, Groq LLaMA', detail: 'Disaster-preparedness web app with live earthquake data, AI assistant, and emergency guides.' },
      { name: 'Interactive BI Dashboards', stack: 'Chart.js, PapaParse, Google Sheets', detail: 'SuperStore, Marketing Omnichannel, and Rig Operations dashboards with KPIs, segmentation, and export.' },
      { name: 'ML Fraud Detection', stack: 'Python, scikit-learn', detail: 'K-Means labelling and Random Forest classification of 2,512 transactions (96.02% accuracy).' },
    ],
    certTitle: 'Training & Certifications',
    educationTitle: 'Education',
    education: {
      school: 'Universitas Indraprasta PGRI (UNINDRA)',
      location: 'Jakarta Timur, Indonesia',
      degree: 'Bachelor of Computer Science (S.Kom.) — Informatics',
      graduated: 'Graduated: Feb 2020',
      detail: 'GPA: 3.20 | Faculty of Engineering and Computer Science | Focus: Software Engineering, Data Structures.',
    },
  },
  id: {
    summaryTitle: 'Ringkasan Profesional',
    summary:
      'Tech & Data Specialist dengan pengalaman lebih dari 10 tahun di bidang tata kelola teknologi, otomatisasi organisasi, dan Business Intelligence (BI). Mentransformasi alur kerja semi-manual menjadi sistem berbasis data yang aman di ekosistem Google dan Microsoft — mulai dari aplikasi web Angular dan backend Apps Script hingga dashboard Power BI, migrasi cloud, serta otomasi berbantuan AI. Berperan sebagai jembatan teknis antara manajemen strategis dan eksekusi, dengan fokus kuat pada privasi data, kontrol akses, dan dokumentasi yang mudah dipelihara.',
    experienceTitle: 'Pengalaman Kerja',
    experience: [
      {
        role: 'Knowledge Management Systems (KMS) Specialist',
        company: 'YBM BRILiaN',
        location: 'Jakarta Pusat, Indonesia',
        period: 'Nov 2023 — Sekarang',
        points: [
          'Menjadi jembatan teknis utama dalam menerjemahkan strategi organisasi menjadi implementasi digital dan solusi KMS yang fungsional.',
          'Mengembangkan arsitektur data otomatis secara mandiri saat data operasional belum tersedia di sistem pusat, untuk disajikan langsung di dashboard divisi internal.',
          'Menggunakan VS Code sebagai lingkungan kerja utama untuk mengintegrasikan data kustom, mengolahnya via Python, dan memanfaatkan AI Assistant untuk mempercepat data cleaning sebelum ditarik ke Power BI.',
          'Menjadi jembatan teknis otomatisasi di lingkungan kerja semi-manual, terutama kolaborasi data antara Microsoft SharePoint dan Google Workspace.',
          'Merancang dan meluncurkan portal Knowledge Management terpusat yang menghilangkan sekat informasi bagi 100+ karyawan.',
          'Membangun Corporate Governance Portal berbasis Angular yang menyatukan laporan aktivitas, pengelolaan akun, risalah rapat, dan pemantauan cloud.',
          'Mengembangkan Sistem Informasi Beasiswa: pendaftaran, seleksi metode SAW, pencairan, dan laporan dengan login Google serta hak akses berbasis peran.',
          'Mengintegrasikan Generative AI ke alur kerja dokumen untuk ringkasan instan dan pencarian berbasis data (chat-with-data).',
          'Membangun dashboard Business Intelligence interaktif untuk memvisualisasikan metrik operasional bagi pimpinan.',
          'Membuat skrip otomatisasi Google Apps Script yang memangkas waktu penyusunan laporan administrasi tahunan hingga 40%.',
          'Mengelola tata kelola infrastruktur cloud, hak akses pengguna melalui Entra ID/Azure dan Google Admin, serta mengamankan migrasi data berskala besar dari SharePoint ke Google Drive.',
        ],
      },
      {
        role: 'Database Management Staff',
        company: 'YBM BRILiaN',
        location: 'Jakarta Pusat, Indonesia',
        period: 'Des 2016 — Jun 2023',
        points: [
          'Mengelola basis data pusat Divisi Program untuk menjamin integritas dan akurasi pelaporan regional.',
          'Melakukan analisis kelayakan bisnis dan uji tuntas dokumen pengajuan program kemitraan.',
          'Mengevaluasi laporan penggunaan anggaran divisi untuk memantau akuntabilitas dan kepatuhan regulasi.',
          'Mentransformasi pengarsipan fisik menjadi ekosistem dokumen digital yang terstruktur.',
        ],
      },
      {
        role: 'Frontliner Staff',
        company: 'YBM BRILiaN',
        location: 'Jakarta Pusat, Indonesia',
        period: 'Des 2014 — Nov 2016',
        points: [
          'Garda pertama pengumpulan informasi dan penjaminan kualitas data sejak tahap input awal.',
          'Melakukan wawancara terstruktur dan penilaian awal calon penerima manfaat program bantuan.',
        ],
      },
    ],
    skillsTitle: 'Keahlian Teknis',
    skills: SKILLS_ID,
    projectsTitle: 'Proyek Pilihan',
    projects: [
      { name: 'Corporate Governance Portal', stack: 'Angular, TypeScript, Apps Script', detail: 'Ruang kerja modular yang menyatukan laporan aktivitas, pengelolaan akun, risalah rapat, dan pemantauan cloud.' },
      { name: 'Sistem Informasi Beasiswa', stack: 'JavaScript, Apps Script, Google Sheets', detail: 'Pengelolaan beasiswa end-to-end dengan peringkat SAW, file pencairan, laporan siap cetak, dan mode demo.' },
      { name: 'Cloud Migration & Identity Management', stack: 'Python, Microsoft Graph, Google Drive API', detail: 'Migrasi copy-only SharePoint → Google Shared Drive yang dapat dilanjutkan, dengan checkpoint, verifikasi, dan pemantauan.' },
      { name: 'SiagaAI — IDCamp 2025 Developer Challenge', stack: 'JavaScript, BMKG Open Data, Groq LLaMA', detail: 'Aplikasi kesiapsiagaan bencana dengan data gempa terkini, asisten AI, dan panduan darurat.' },
      { name: 'Interactive BI Dashboards', stack: 'Chart.js, PapaParse, Google Sheets', detail: 'Dashboard SuperStore, Marketing Omnichannel, dan Rig Operations dengan KPI, segmentasi, dan ekspor.' },
      { name: 'ML Fraud Detection', stack: 'Python, scikit-learn', detail: 'Pelabelan K-Means dan klasifikasi Random Forest atas 2.512 transaksi (akurasi 96,02%).' },
    ],
    certTitle: 'Pelatihan & Sertifikasi',
    educationTitle: 'Pendidikan',
    education: {
      school: 'Universitas Indraprasta PGRI (UNINDRA)',
      location: 'Jakarta Timur, Indonesia',
      degree: 'Sarjana Komputer (S.Kom.) — Informatika',
      graduated: 'Lulus: Feb 2020',
      detail: 'IPK: 3.20 | Fakultas Teknik dan Ilmu Komputer | Fokus: Rekayasa Perangkat Lunak, Struktur Data.',
    },
  },
};

export const CERTIFICATIONS: Certification[] = [
  { title: 'Belajar Dasar Cloud dan Gen AI di AWS', issuer: 'Dicoding × AWS', provider: 'dicoding', date: 'Sep 2026', highlight: true },
  { title: 'Spec-Driven Development dengan Kiro', issuer: 'Dicoding', provider: 'dicoding', date: 'Sep 2026' },
  { title: 'Belajar Machine Learning untuk Pemula', issuer: 'Dicoding × Google Developers', provider: 'dicoding', date: 'Mar 2026', highlight: true },
  { title: 'Membangun Aplikasi Gen AI dengan Microsoft Azure', issuer: 'Dicoding × Microsoft', provider: 'dicoding', date: 'Mar 2026', highlight: true },
  { title: 'Belajar Penerapan Data Science dengan Microsoft Fabric', issuer: 'Dicoding × Microsoft', provider: 'dicoding', date: 'Mar 2026' },
  { title: 'Microsoft Elevate Training Center — Sertifikat Apresiasi (14 jam)', issuer: 'Microsoft Indonesia × Dicoding', provider: 'dicoding', date: 'Mar 2026' },
  { title: 'Data Science Track: Probability & Statistics', issuer: 'Dicoding', provider: 'dicoding', date: 'Okt 2025' },
  { title: 'Belajar Dasar AI', issuer: 'Dicoding', provider: 'dicoding', date: 'Okt 2025' },
  { title: 'DevCoach 159: Database 101', issuer: 'Dicoding', provider: 'dicoding', date: 'Jul 2024' },
  { title: 'Memulai Pemrograman dengan Python', issuer: 'Dicoding', provider: 'dicoding', date: 'Sep 2023' },
  { title: 'Belajar Dasar Structured Query Language (SQL)', issuer: 'Dicoding', provider: 'dicoding', date: 'Sep 2023' },
  { title: 'Belajar Dasar Data Science', issuer: 'Dicoding', provider: 'dicoding', date: 'Sep 2023' },
  { title: 'Dicoding Developer Coaching #15: Android', issuer: 'Dicoding Event', provider: 'dicoding', date: 'Des 2020' },
  { title: 'BEKRAF Developer Day 2017 — Bogor', issuer: 'Kemenparekraf × Dicoding', provider: 'dicoding', date: 'Mar 2017' },
  { title: 'Data Analyst Career Track', issuer: 'DQLab', provider: 'dqlab', date: 'Okt 2025', highlight: true },
  { title: 'Bootcamp Data Analyst with SQL & Python in Google Platform (Batch 20)', issuer: 'DQLab', provider: 'dqlab', date: '2025' },
  { title: 'Study Case Bootcamp: Machine Learning & AI for Beginner', issuer: 'DQLab', provider: 'dqlab', date: 'Okt 2025' },
  { title: 'Study Case Bootcamp: Data Analyst with SQL & Python', issuer: 'DQLab', provider: 'dqlab', date: 'Okt 2025' },
  { title: 'Study Case Bootcamp: Data Analyst with Excel', issuer: 'DQLab', provider: 'dqlab', date: 'Okt 2025' },
  { title: 'Guide to Learn R with AI at DQLab', issuer: 'DQLab', provider: 'dqlab', date: 'Okt 2025' },
  { title: 'Introduction to Data Science with R', issuer: 'DQLab', provider: 'dqlab', date: 'Apr 2025' },
  { title: 'Mini Bootcamp: Introduction to Data Analytics (Batch 3 & 8)', issuer: 'DQLab', provider: 'dqlab', date: '2025' },
  { title: 'AI & ChatGPT untuk Akademik dan Perkantoran (Batch 4, 6 JP)', issuer: 'PT Taalenta Digital Inteleksia', provider: 'taalenta', date: 'Des 2023' },
  { title: 'Sertifikasi Kompetensi Ahli Amil Zakat (Level 3)', issuer: 'BNSP', provider: 'bnsp', date: 'Jul 2025', highlight: true },
];
