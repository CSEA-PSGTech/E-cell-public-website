export type TeamVertical = 'Heads' | 'Technical' | 'Core Team';

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  vertical: TeamVertical;
  initials: string;
  department?: string;
  location?: string;
  image?: string;
  linkedin?: string;
  email?: string;
}

export const teamVerticals: { id: 'All' | TeamVertical; label: string }[] = [
  { id: 'All', label: 'All Members' },
  { id: 'Heads', label: 'Heads' },
  { id: 'Technical', label: 'Technical' },
  { id: 'Core Team', label: 'Core Team' },
];

export const teamMembers: TeamMember[] = [
  {
    id: 'h1',
    name: 'Sanjay J',
    role: 'Director',
    vertical: 'Heads',
    initials: 'SJ',
    department: 'Final Year CSE AIML',
    location: 'Coimbatore',
    image: 'https://res.cloudinary.com/dbmouspo6/image/upload/v1792506887/4dc620c8-eb0f-471b-aa2e-4f676d131e7c_eug8ev.png',
  },
  {
    id: 'h2',
    name: 'Sai Karthi Balaji G',
    role: 'Deputy Director',
    vertical: 'Heads',
    initials: 'SK',
    department: 'Final Year CSE AIML',
    location: 'Coimbatore',
    image: 'https://res.cloudinary.com/drxmhgudx/image/upload/v1789281961/23n243_Sai_Karthi_-_23N243_-_SAI_KARTHI_BALAJI_G_hsmiyb.jpg',
  },
  {
    id: 'h3',
    name: 'Arrvindh P K',
    role: 'Program Manager',
    vertical: 'Heads',
    initials: 'AP',
    department: 'Pre Final Year CSE G1',
    location: 'Coimbatore',
    image: 'https://res.cloudinary.com/drxmhgudx/image/upload/v1789281958/24Z209_Arrvindh_PK_-_24Z209_-_ARRVINDH_PERIYAR_KHAVIYAA_gozubk.jpg',
  },
  {
    id: 'h4',
    name: 'Pravin Ramanaa S',
    role: 'Associate Program Manager',
    vertical: 'Heads',
    initials: 'PR',
    department: 'Pre Final Year CSE G1',
    location: 'Coimbatore',
    image: 'https://res.cloudinary.com/drxmhgudx/image/upload/v1789281953/Pravin_Ramanaa_24Z255_-_24Z255_-_PRAVIN_RAMANAA_S_mmodta.png',
  },
  {
    id: 'h5',
    name: 'Pravith N',
    role: 'Head - Technical',
    vertical: 'Heads',
    initials: 'PN',
    department: 'Final Year CSE AIML',
    location: 'Coimbatore',
    image: 'https://res.cloudinary.com/drxmhgudx/image/upload/v1789281961/23N237_pravith_-_23N237_-_PRAVITH_N_fzwqqo.jpg',
  },
  {
    id: 'h6',
    name: 'Dharneesh S L',
    role: 'Associate Head - Technical',
    vertical: 'Heads',
    initials: 'DS',
    department: 'Pre Final Year CSE G1',
    location: 'Coimbatore',
    image: 'https://res.cloudinary.com/drxmhgudx/image/upload/v1789281956/24Z218_Dharaneeshsl_-_24Z218_-_DHARANEESH_S_L_aqixwd.jpg',
  },
  {
    id: 'h7',
    name: 'Hari Keshav',
    role: 'Associate Head - Technical',
    vertical: 'Heads',
    initials: 'HK',
    department: 'Pre Final Year CSE AIML',
    location: 'Coimbatore',
    image: 'https://res.cloudinary.com/drxmhgudx/image/upload/v1789281960/24N211_HarikesavaVB_-_24N211_-_HARIKESAVA_V_B_tmxubi.jpg',
  },
  {
    id: 'h8',
    name: 'Santhosh M',
    role: 'Head - Industry and Community Outreach',
    vertical: 'Heads',
    initials: 'SM',
    department: 'Final Year CSE AIML',
    location: 'Coimbatore',
    image: 'https://res.cloudinary.com/drxmhgudx/image/upload/v1789281982/22N248_Santhosh_-_22N248_-_SANTHOSH_M_xksxy4.jpg',
  },
  {
    id: 'h9',
    name: 'Rithan Pranaov R',
    role: 'Associate Head - Industry and Community Outreach',
    vertical: 'Heads',
    initials: 'RP',
    department: 'Pre Final Year CSE G1',
    location: 'Coimbatore',
    image: 'https://res.cloudinary.com/drxmhgudx/image/upload/v1789281954/24z261_Rithan_pranaov_R_-_24Z261_-_RITHAN_PRANAOV_R_fuum2b.jpg',
  },

  // ==========================================
  // --- VERTICAL 2: TECHNICAL (4) ---
  // ==========================================
  {
    id: 't1',
    name: 'Prasanth P T',
    role: 'Technical',
    vertical: 'Technical',
    initials: 'PP',
    department: 'Pre Final Year CSE G1',
    location: 'Coimbatore',
  },
  {
    id: 't2',
    name: 'Raksavi R',
    role: 'Technical',
    vertical: 'Technical',
    initials: 'RR',
    department: 'First year CSE G1',
    location: 'Coimbatore',
  },
  {
    id: 't3',
    name: 'J Sharon Sweety',
    role: 'Technical',
    vertical: 'Technical',
    initials: 'JS',
    department: 'First Year CSE G1',
    location: 'Coimbatore',
  },
  {
    id: 't4',
    name: 'Agnesh K K',
    role: 'Technical',
    vertical: 'Technical',
    initials: 'AK',
    department: 'Pre Final Year CSE G1',
    location: 'Coimbatore',
  },

  // ==========================================
  // --- VERTICAL 3: CORE TEAM (12) ---
  // ==========================================
  {
    id: 'c1',
    name: 'Farzana A',
    role: 'Core Member',
    vertical: 'Core Team',
    initials: 'FA',
    department: 'Second Year CSE G2',
    location: 'Coimbatore',
  },
  {
    id: 'c2',
    name: 'Sri Deaksha V',
    role: 'Core Member',
    vertical: 'Core Team',
    initials: 'SD',
    department: 'Second Year CSE G2',
    location: 'Coimbatore',
  },
  {
    id: 'c3',
    name: 'Bavanaa T',
    role: 'Core Member',
    vertical: 'Core Team',
    initials: 'BT',
    department: 'Second Year CSE G2',
    location: 'Coimbatore',
  },
  {
    id: 'c4',
    name: 'Shahil Rehan AR',
    role: 'Core Member',
    vertical: 'Core Team',
    initials: 'SR',
    department: 'Second Year CSE G2',
    location: 'Coimbatore',
  },
  {
    id: 'c5',
    name: 'Aparna R',
    role: 'Core Member',
    vertical: 'Core Team',
    initials: 'AR',
    department: 'Second Year CSE G1',
    location: 'Coimbatore',
  },
  {
    id: 'c6',
    name: 'Risith Rahul R',
    role: 'Core Member',
    vertical: 'Core Team',
    initials: 'RR',
    department: 'First Year CSE G2',
    location: 'Coimbatore',
  },
  {
    id: 'c7',
    name: 'S Prisha',
    role: 'Core Member',
    vertical: 'Core Team',
    initials: 'SP',
    department: 'First Year CSE AIML',
    location: 'Coimbatore',
  },
  {
    id: 'c8',
    name: 'Suvandya N',
    role: 'Core Member',
    vertical: 'Core Team',
    initials: 'SN',
    department: 'First Year CSE G2',
    location: 'Coimbatore',
  },
  {
    id: 'c9',
    name: 'Rithika G',
    role: 'Core Member',
    vertical: 'Core Team',
    initials: 'RG',
    department: 'First Year CSE G1',
    location: 'Coimbatore',
  },
  {
    id: 'c10',
    name: 'Devamitra D',
    role: 'Core Member',
    vertical: 'Core Team',
    initials: 'DD',
    department: 'First year CSE G2',
    location: 'Coimbatore',
  },
  {
    id: 'c11',
    name: 'Harshita P L',
    role: 'Core Member',
    vertical: 'Core Team',
    initials: 'HP',
    department: 'PSG Tech E-Cell',
    location: 'Coimbatore',
  },
  {
    id: 'c12',
    name: 'Shathyashri S',
    role: 'Core Member',
    vertical: 'Core Team',
    initials: 'SS',
    department: 'First year CSE AIML',
    location: 'Coimbatore',
  },
];
