import { Expertise } from '../models';

export const PROFILE = {
  name: 'Febri Nahdatun',
  role: 'Tech & Data Specialist',
  tagline: 'Data · Automation · Digital Systems',
  location: 'Depok, Indonesia',
  photo: 'assets/img/profile.webp',
  siteUrl: 'https://febrinahdatun-lab.github.io/portfolio/',
  yearsExperience: '10+',
  contact: {
    email: 'febri.nahdatun@gmail.com',
    whatsapp: 'https://wa.me/6287888893111',
    telegram: 'https://t.me/+6287888893111',
    linkedin: 'https://www.linkedin.com/in/febri-nahdatun-49b437126/',
    github: 'https://github.com/febrinahdatun-lab',
    upwork: 'https://www.upwork.com/freelancers/~01d5db3fe731ecbb42',
  },
} as const;

export const EXPERTISE: Expertise[] = [
  {
    icon: 'microsoft',
    title: 'Enterprise Systems',
    description:
      'Microsoft 365, Entra ID/Azure AD, dan SharePoint — tata kelola cloud, kontrol akses, governance, dan migrasi data yang aman.',
  },
  {
    icon: 'google',
    title: 'Google Workspace',
    description:
      'Super Admin, migrasi data, email routing, optimasi penyimpanan, serta otomasi lanjutan melalui Apps Script & AppSheet.',
  },
  {
    icon: 'chart',
    title: 'Data Analytics & BI',
    description:
      'Power BI (data modeling & DAX), SQL, Python (pandas/NumPy), R, dan Looker Studio untuk insight strategis yang selalu terbarui.',
  },
  {
    icon: 'network',
    title: 'AI & Process Automation',
    description:
      'Integrasi Generative AI (Azure OpenAI, Gemini, ChatGPT), prompt engineering, workflow chatbot RAG, dan pipeline otomasi n8n.',
  },
  {
    icon: 'sitemap',
    title: 'Knowledge Management',
    description:
      'Merancang portal KMS terpusat, ringkasan dokumen berbantuan AI, dan pencarian berbasis data yang tetap menghormati hak akses.',
  },
  {
    icon: 'code',
    title: 'Web App & Integrasi',
    description:
      'Angular, TypeScript, JavaScript, dan Python di VS Code — membangun aplikasi operasional, API bridge, dan pipeline data yang rapi.',
  },
];

export const PRINCIPLES = [
  {
    title: 'Pahami alurnya.',
    text: 'Mulai dari siapa yang menggunakan data, pekerjaan yang berulang, dan keputusan yang perlu dibuat.',
  },
  {
    title: 'Hubungkan bagian-bagiannya.',
    text: 'Susun sumber data, aturan proses, antarmuka, dan dokumentasi menjadi alur yang dapat ditelusuri.',
  },
  {
    title: 'Jaga data, ukur hasil.',
    text: 'Privasi dan hak akses dirancang sejak awal. Klaim manfaat perlu diukur dan ditinjau, bukan sekadar ditulis.',
  },
];
