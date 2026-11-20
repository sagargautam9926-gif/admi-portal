import { STORAGE_KEYS } from '../utils/constants';

const SEED_USERS = [
  {
    id: 'user-1',
    email: 'admin@codeeagle.in',
    password: 'Admin@123',
    name: 'Admin CEIS',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'user-2',
    email: 'editor@codeeagle.in',
    password: 'Editor@123',
    name: 'Editor CEIS',
    role: 'editor',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  },
];

const SEED_SERVICES = [
  {
    id: 'srv-1',
    name: 'Web Development',
    description: 'High-performance, scalable web portals and enterprise applications built using modern full-stack architectures.',
    icon: 'Globe',
    active: true,
    createdAt: '2026-01-10T09:00:00.000Z',
    updatedAt: '2026-01-10T09:00:00.000Z',
  },
  {
    id: 'srv-2',
    name: 'Mobile App Development',
    description: 'Cross-platform (Flutter, React Native) and native Android/iOS mobile solutions engineered for exceptional UX.',
    icon: 'Smartphone',
    active: true,
    createdAt: '2026-01-12T10:30:00.000Z',
    updatedAt: '2026-01-12T10:30:00.000Z',
  },
  {
    id: 'srv-3',
    name: 'AI & ML Solutions',
    description: 'Bespoke machine learning pipelines, predictive analytics, natural language processing, and generative AI agents.',
    icon: 'Brain',
    active: true,
    createdAt: '2026-01-15T14:15:00.000Z',
    updatedAt: '2026-01-15T14:15:00.000Z',
  },
  {
    id: 'srv-4',
    name: 'Cloud & DevOps',
    description: 'Automated CI/CD workflows, microservices orchestration, containerization (Docker/K8s), and resilient cloud infrastructure.',
    icon: 'Cloud',
    active: true,
    createdAt: '2026-01-20T11:00:00.000Z',
    updatedAt: '2026-01-20T11:00:00.000Z',
  },
  {
    id: 'srv-5',
    name: 'UI/UX Design',
    description: 'Human-centered user experiences, cohesive design systems, interactive prototypes, and usability testing.',
    icon: 'Palette',
    active: true,
    createdAt: '2026-01-25T16:45:00.000Z',
    updatedAt: '2026-01-25T16:45:00.000Z',
  },
  {
    id: 'srv-6',
    name: 'IT Consulting',
    description: 'Strategic tech roadmapping, cloud modernization advisement, security posture evaluation, and digital transformation.',
    icon: 'Briefcase',
    active: true,
    createdAt: '2026-02-01T08:20:00.000Z',
    updatedAt: '2026-02-01T08:20:00.000Z',
  },
];

const SEED_JOBS = [
  {
    id: 'job-1',
    title: 'React Developer',
    location: 'Indore, India',
    type: 'Full Time',
    description: 'We are seeking an experienced React.js Developer to architect and deliver responsive, high-performance web applications with state management and clean UI implementations.',
    status: 'Open',
    createdAt: '2026-02-05T10:00:00.000Z',
    updatedAt: '2026-02-05T10:00:00.000Z',
  },
  {
    id: 'job-2',
    title: 'Mobile App Developer',
    location: 'Indore, India',
    type: 'Full Time',
    description: 'Looking for a dedicated Mobile Engineer proficient in Flutter and React Native to build modern applications with seamless API integrations and offline synchronization.',
    status: 'Open',
    createdAt: '2026-02-08T11:30:00.000Z',
    updatedAt: '2026-02-08T11:30:00.000Z',
  },
  {
    id: 'job-3',
    title: 'UI/UX Designer',
    location: 'Indore, India',
    type: 'Full Time',
    description: 'Talented designer to lead wireframing, high-fidelity user journeys, Figma prototypes, design tokens, and user research for our client web and mobile solutions.',
    status: 'Open',
    createdAt: '2026-02-12T14:00:00.000Z',
    updatedAt: '2026-02-12T14:00:00.000Z',
  },
];

const SEED_INQUIRIES = [
  {
    id: 'inq-101',
    name: 'Aarav Sharma',
    email: 'aarav.sharma@techspire.in',
    phone: '+91 98260 11223',
    service: 'Web Development',
    message: 'We want to migrate our existing monolithic e-commerce platform to a headless Next.js frontend with microservices. Looking for an MVP delivery in 3 months.',
    date: '2026-03-01T10:15:00.000Z',
    status: 'New',
  },
  {
    id: 'inq-102',
    name: 'Priya Mukherjee',
    email: 'priya.m@fintechpulse.com',
    phone: '+91 98765 43210',
    service: 'Mobile App Development',
    message: 'Need a cross-platform mobile wallet application with biometric authentication, UPI deep linking, and encrypted local storage on Flutter.',
    date: '2026-03-02T11:45:00.000Z',
    status: 'In Progress',
  },
  {
    id: 'inq-103',
    name: 'Rohan Mehta',
    email: 'rohan@logisticshub.co',
    phone: '+91 99887 76655',
    service: 'AI & ML Solutions',
    message: 'Looking for computer vision models to track packages on automated conveyor belts in our warehouse facility in Dewas.',
    date: '2026-03-03T14:20:00.000Z',
    status: 'New',
  },
  {
    id: 'inq-104',
    name: 'Ananya Verma',
    email: 'ananya.v@edulearn.org',
    phone: '+91 91234 56789',
    service: 'UI/UX Design',
    message: 'We require a complete UX overhaul and interactive design system for our K-12 learning management system, including dark mode support.',
    date: '2026-03-04T09:30:00.000Z',
    status: 'Resolved',
  },
  {
    id: 'inq-105',
    name: 'Vikram Joshi',
    email: 'vikram.j@cloudmatrix.io',
    phone: '+91 98930 45678',
    service: 'Cloud & DevOps',
    message: 'Our AWS monthly bill is surging. Need a comprehensive cloud architecture audit, Kubernetes cluster autoscaling setup, and CI/CD pipelines.',
    date: '2026-03-05T16:10:00.000Z',
    status: 'In Progress',
  },
  {
    id: 'inq-106',
    name: 'Sunita Patel',
    email: 'sunita.patel@healthfirst.in',
    phone: '+91 97555 88990',
    service: 'IT Consulting',
    message: 'Seeking HIPAA/NDHM compliance consulting and data architecture review for our hospital management software in Central India.',
    date: '2026-03-06T12:00:00.000Z',
    status: 'New',
  },
  {
    id: 'inq-107',
    name: 'Kabir Singhania',
    email: 'kabir.s@singhaniaholdings.com',
    phone: '+91 98270 33445',
    service: 'Web Development',
    message: 'Looking for a bespoke corporate investor relations portal with real-time stock ticker integration, board documents repository, and multilingual support.',
    date: '2026-03-07T15:40:00.000Z',
    status: 'New',
  },
  {
    id: 'inq-108',
    name: 'Deepika Nair',
    email: 'deepika.n@foodexpress.in',
    phone: '+91 94250 67890',
    service: 'Mobile App Development',
    message: 'We want to rebuild our customer delivery tracking app to reduce battery drain and improve real-time map GPS smoothness.',
    date: '2026-03-08T10:05:00.000Z',
    status: 'In Progress',
  },
  {
    id: 'inq-109',
    name: 'Aditya Gupta',
    email: 'aditya@insurancenet.com',
    phone: '+91 98111 22334',
    service: 'AI & ML Solutions',
    message: 'Need an automated insurance claims document analysis OCR pipeline with LLM summary extraction for instant claim approvals.',
    date: '2026-03-09T13:25:00.000Z',
    status: 'Resolved',
  },
  {
    id: 'inq-110',
    name: 'Meera Chawla',
    email: 'meera.chawla@retailwave.in',
    phone: '+91 99260 77889',
    service: 'UI/UX Design',
    message: 'Need quick prototype designs for an upcoming venture investor pitch. Deliverables include wireframes and 15 interactive Figma screens.',
    date: '2026-03-10T17:15:00.000Z',
    status: 'New',
  },
  {
    id: 'inq-111',
    name: 'Harsh Vardhan',
    email: 'harsh.v@supplychain360.com',
    phone: '+91 97110 55443',
    service: 'Cloud & DevOps',
    message: 'Looking for multi-cloud disaster recovery setup across AWS Mumbai and GCP Delhi with automated failover and zero data loss SLA.',
    date: '2026-03-11T11:10:00.000Z',
    status: 'In Progress',
  },
  {
    id: 'inq-112',
    name: 'Neha Saxena',
    email: 'neha.saxena@urbanretail.in',
    phone: '+91 98263 99887',
    service: 'IT Consulting',
    message: 'We need guidance on transitioning our retail inventory management from legacy on-premise ERP to cloud-native microservices.',
    date: '2026-03-12T09:45:00.000Z',
    status: 'New',
  },
];

const SEED_SETTINGS = {
  contact: {
    email: 'info@codeeagle.in',
    phone: '+91 731 456 7890',
    officeLocation: 'Crystal IT Park, Ring Road, Indore, MP 452001, India',
  },
  stats: {
    yearsExperience: 8,
    projectsCompleted: 150,
    activeClients: 45,
    clientSatisfaction: 99,
  },
};

const SEED_WEEKLY_VISITORS = [
  { day: 'Mon', visitors: 620, pageViews: 1450 },
  { day: 'Tue', visitors: 780, pageViews: 1890 },
  { day: 'Wed', visitors: 940, pageViews: 2210 },
  { day: 'Thu', visitors: 890, pageViews: 2040 },
  { day: 'Fri', visitors: 1050, pageViews: 2600 },
  { day: 'Sat', visitors: 710, pageViews: 1650 },
  { day: 'Sun', visitors: 530, pageViews: 1220 },
];

export const getInitialDb = () => ({
  users: SEED_USERS,
  services: SEED_SERVICES,
  jobs: SEED_JOBS,
  inquiries: SEED_INQUIRIES,
  settings: SEED_SETTINGS,
  weeklyVisitors: SEED_WEEKLY_VISITORS,
});

export const getDb = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.MOCK_DB);
    if (!raw) {
      const initial = getInitialDb();
      localStorage.setItem(STORAGE_KEYS.MOCK_DB, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading mock DB from localStorage:', err);
    return getInitialDb();
  }
};

export const saveDb = (db) => {
  try {
    localStorage.setItem(STORAGE_KEYS.MOCK_DB, JSON.stringify(db));
  } catch (err) {
    console.error('Error saving mock DB to localStorage:', err);
  }
};

export const resetDb = () => {
  const initial = getInitialDb();
  saveDb(initial);
  return initial;
};

