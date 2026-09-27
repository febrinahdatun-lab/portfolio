import { Certification, Experience, Lang } from '../models';

interface CvContent {
  summaryTitle: string;
  summary: string;
  experienceTitle: string;
  experience: Experience[];
  skillsTitle: string;
  skills: { label: string; value: string }[];
  certTitle: string;
  educationTitle: string;
  education: { school: string; location: string; degree: string; graduated: string; detail: string };
}

const SKILLS_EN = [
  {
    label: 'Data Analytics & Visualization',
    value: 'Power BI (Advanced DAX & Data Modeling), Google Looker Studio, SQL, Python (Pandas/NumPy), Advanced Excel, R.',
  },
  {
    label: 'Workspace & Technical Integration',
    value: 'Visual Studio Code, Angular, TypeScript, Microsoft Fabric, ETL/ELT Pipeline Automation.',
  },
  {
    label: 'Cloud & IT Infrastructure',
    value:
      'Google Workspace Super Admin (Apps Script, AppSheet), Microsoft 365 (Admin Center, Entra ID/Azure, SharePoint, Power Platform), Email Routing, Storage Optimization, Cloud Data Migration.',
  },
  {
    label: 'AI & Automation',
    value:
      'Generative AI Integration (Azure OpenAI, Gemini, ChatGPT), Prompt Engineering, RAG Chatbot Integration, n8n, Process Automation.',
  },
  {
    label: 'Core Competencies',
    value: 'Knowledge Management, Digital Transformation, Business Intelligence, Data Governance, Strategic Reporting.',
  },
];

export const CV: Record<Lang, CvContent> = {
  en: {
    summaryTitle: 'Professional Summary',
    summary:
      'Tech & Data Specialist with over 10 years of experience in IT governance, organizational automation, and Business Intelligence (BI). Possesses deep expertise in transforming semi-manual workflows into data-driven automated systems leveraging Google and Microsoft ecosystems. Adept at serving as a technical bridge between strategic management and advanced data execution. Experienced in building rapid data pipelines using VS Code and Python, accelerated by AI assistants, to deliver custom data into internal division dashboards and Knowledge Management System (KMS) platforms.',
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
      'Tech & Data Specialist dengan pengalaman lebih dari 10 tahun di bidang tata kelola teknologi, otomatisasi organisasi, dan Business Intelligence (BI). Memiliki keahlian mentransformasi ekosistem kerja semi-manual menjadi sistem otomatis berbasis data menggunakan ekosistem Google dan Microsoft. Mahir menjadi jembatan teknis antara manajemen strategis dan eksekusi pengolahan data tingkat lanjut. Berpengalaman membangun data pipeline cepat menggunakan VS Code dan Python dengan akselerasi AI Assistant untuk dashboard divisi internal maupun platform Knowledge Management System (KMS).',
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
    skills: SKILLS_EN,
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
  { title: 'Belajar Machine Learning untuk Pemula', issuer: 'Dicoding × Google Developers', date: 'Mar 2026', highlight: true },
  { title: 'Membangun Aplikasi Gen AI dengan Microsoft Azure', issuer: 'Dicoding × Microsoft', date: 'Mar 2026', highlight: true },
  { title: 'Belajar Penerapan Data Science dengan Microsoft Fabric', issuer: 'Dicoding × Microsoft', date: 'Mar 2026' },
  { title: 'Data Science Track: Probability & Statistics', issuer: 'Dicoding', date: 'Okt 2025' },
  { title: 'Belajar Dasar AI', issuer: 'Dicoding', date: 'Okt 2025' },
  { title: 'Data Analyst Career Track', issuer: 'DQLab', date: 'Okt 2025', highlight: true },
  { title: 'Machine Learning & AI for Beginner Bootcamp', issuer: 'DQLab', date: 'Okt 2025' },
  { title: 'Data Analyst with SQL & Python Bootcamp', issuer: 'DQLab', date: 'Okt 2025' },
  { title: 'Data Analyst with Excel Bootcamp', issuer: 'DQLab', date: 'Okt 2025' },
  { title: 'Mini Bootcamp: Introduction to Data Analytics', issuer: 'DQLab', date: '2025' },
  { title: 'Sertifikasi Kompetensi Ahli Amil Zakat (Level 3)', issuer: 'BNSP', date: 'Jul 2025', highlight: true },
  { title: 'DevCoach 159: Database 101', issuer: 'Dicoding', date: 'Jul 2024' },
  { title: 'AI & ChatGPT untuk Akademik dan Perkantoran', issuer: 'Taalenta', date: 'Des 2023' },
  { title: 'Memulai Pemrograman dengan Python', issuer: 'Dicoding', date: 'Sep 2023' },
  { title: 'Belajar Dasar Structured Query Language (SQL)', issuer: 'Dicoding', date: 'Sep 2023' },
];
