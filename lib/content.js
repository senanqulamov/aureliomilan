// Site copy and data. Pages read everything from here.
import { photos } from './photos';

export const p = (key) => photos[key];

export const site = {
  name: 'Aurelio Milan',
  url: 'https://aureliomilan.com',
  locale: 'en_US',
  tagline: 'Model · Athlete · Entrepreneur',
  title: 'Aurelio Milan — Model · Athlete · Entrepreneur',
  description:
    'Aurelio Milan is a model, former professional footballer and entrepreneur based in Baku and Milan. Editorial, red carpet and brand work — booking enquiries welcome.',
  keywords: [
    'Aurelio Milan', 'Azad Gholikimilan', 'male model', 'model Baku', 'model Milan', 'Azerbaijani model',
    'fashion model', 'editorial model', 'Cannes Film Festival 2026', 'former footballer', 'brand ambassador',
  ],
  instagram: 'https://www.instagram.com/aureliomilann',
  instagramHandle: '@aureliomilann',
  email: 'booking@aureliomilan.com',
  // Form submissions open the visitor's mail app. To post them to a form service
  // (Formspree, Getform, Basin …) instead, put its endpoint URL here.
  formEndpoint: '',
  footerNote: 'Baku · Milan · Istanbul — available worldwide',
  shareImage: '/og.jpg',
};

// Used for structured data (schema.org Person)
export const person = {
  name: 'Aurelio Milan',
  alternateName: 'Azad Gholikimilan',
  jobTitle: 'Model',
  heightCm: 187,
  homeLocation: 'Baku, Azerbaijan',
  languages: ['English', 'Turkish', 'Azerbaijani', 'Kurdish', 'Persian'],
  education: 'Payam Nur University',
  knowsAbout: ['Fashion modelling', 'Editorial photography', 'Red carpet', 'Professional football', 'Acting'],
};

// Page titles and descriptions (search results and link previews)
export const seo = {
  '/': { title: site.title, description: site.description },
  '/fashion': {
    title: 'Fashion Work',
    description: 'Projects, fashion weeks and events by Aurelio Milan — Cannes Film Festival red carpet, studio editorials and the Old City Baku street series.',
  },
  '/press': {
    title: 'Press & Events',
    description: 'Press coverage and event appearances of Aurelio Milan — featured in 30+ publications across Türkiye and on the red carpet at Cannes 2026.',
  },
  '/blog': {
    title: 'Blog',
    description: "A running journal of Aurelio Milan's work — new shoots, editorials and events, from Cannes to Baku.",
  },
  '/gallery': {
    title: 'Gallery',
    description: 'Photography of Aurelio Milan — red carpet, editorial, studio and street work, with a map of where each shoot took place.',
  },
  '/about': {
    title: 'About',
    description: 'From professional football to modelling — the story, career and philosophy of Aurelio Milan, a 187 cm model based in Baku and working across Europe.',
  },
  '/contact': {
    title: 'Contact & Booking',
    description: 'Book Aurelio Milan for campaigns, editorials, runway and brand partnerships. Direct booking by email or Instagram.',
  },
};

export const nav = [
  { path: '/', label: 'Home' },
  { path: '/fashion', label: 'Fashion Work' },
  { path: '/press', label: 'Press & Events' },
  { path: '/blog', label: 'Blog' },
  { path: '/gallery', label: 'Gallery' },
  { path: '/about', label: 'About' },
];

export const home = {
  heroImage: 'red-carpet-05', // options: 'general-01' (editorial), 'red-carpet-05' (red carpet), 'general-36' (suede)
  heroLabel: 'Cannes · 2026',
  intro:
    'From elite European football to the red carpet of Cannes — a presence shaped by discipline, built for the camera. Now working between Italy, Türkiye and Azerbaijan.',
  stats: [
    { value: '187 cm', label: 'Height' },
    { value: '25', label: 'Age' },
    { value: '5', label: 'Languages' },
    { value: 'Baku · Milan', label: 'Based · Available to travel' },
  ],
  statement:
    'Seven years in elite sport shaped him with discipline, mental resilience and a powerful on-camera presence — qualities that now define his work in modelling.',
  cannes: {
    title: 'Cannes Film Festival',
    year: '2026',
    caption:
      "Walking the red carpet steps of the Palais des Festivals — photographed among the international press at one of fashion and cinema's most watched stages.",
    images: [
      { key: 'red-carpet-05', alt: 'Cannes red carpet', cap: 'Palais des Festivals' },
      { key: 'red-carpet-08', alt: 'Cannes stairs', cap: 'The steps' },
      { key: 'red-carpet-10', alt: 'On the red carpet', cap: 'White tuxedo' },
      { key: 'festival-04', alt: 'Cannes, Croisette', cap: 'La Croisette' },
      { key: 'red-carpet-07', alt: "Photographers' wall", cap: 'The press wall' },
      { key: 'red-carpet-13', alt: 'Cannes 2026', cap: 'Night of the premiere' },
    ],
  },
  showQuote: true,
  quote:
    'Life is a river — flowing, unpredictable, full of possibility for those who learn to navigate it. If you do not choose your own path, it is no longer your life.',
  selected: [
    { title: 'Studio Editorial', meta: 'Tailoring · Portrait Series', key: 'general-06', year: '2026' },
    { title: 'Old City, Baku', meta: 'Street Editorial · Linen', key: 'general-25', year: '2026' },
    { title: 'Golden Hour, Stone', meta: 'Suede · Natural Light', key: 'general-34', year: '2026' },
    { title: 'Cannes Film Festival', meta: 'Red Carpet · France', key: 'red-carpet-12', year: '2026' },
  ],
};

export const about = {
  portrait: 'general-06',
  title: ['From the pitch', 'to the lens.'],
  profile: [
    ['Name', 'Azad Gholikimilan — “Aurelio Milan”'],
    ['Age', '25'],
    ['Height', '187 cm (6′1″)'],
    ['Based', 'Baku, Azerbaijan — available for travel'],
    ['Languages', 'English, Turkish, Azerbaijani, Kurdish, Farsi'],
    ['Education', 'Business Administration, Payam Nur University'],
  ],
  sections: [
    {
      title: 'Journey & Transition',
      body: [
        'Aurelio Milan is a former professional footballer whose career took him across Europe — playing for clubs including Qarabağ FK (Azerbaijan), Shkupi (North Macedonia) and Dinamo-Auto (Moldova). Seven years in elite sport shaped him with discipline, mental resilience and a powerful on-camera presence — qualities that now define his work in modelling.',
        'Leaving football was a bold, conscious choice: a move toward a path aligned with his passion, creativity and long-term vision. For Aurelio, modelling is not just a profession — it is where he expresses his identity, evolves artistically, and builds a future rooted in ambition and authenticity.',
      ],
    },
    {
      title: 'Career & Vision',
      body: [
        'After completing a degree in Business Administration, he built an entrepreneurial career managing international ventures in logistics, consulting and trading. Today he is building a serious, professional modelling career in Italy — producing high-quality editorial work, collaborating with experienced creatives, and beginning partnerships with Italian brands in fashion and design.',
        'His work has been featured on more than 30 websites in Türkiye and has appeared in magazines. He is now expanding into the European fashion scene — with campaigns, editorials and brand partnerships in discussion for the coming season.',
      ],
    },
    {
      title: 'Philosophy & Character',
      body: [
        'What distinguishes Aurelio is not only his appearance but his philosophy. He describes life as a river — flowing, unpredictable, yet full of possibility for those who learn to navigate it. Calm and warm in person, he is known for being highly focused, disciplined and committed in his work. He values honesty, sincerity and respect — because every human being deserves dignity.',
      ],
    },
    {
      title: 'Lifestyle & Craft',
      body: [
        'He trains daily, reads philosophy and psychology, and is developing his craft as an actor through theatre — broadening his artistic range and deepening his expression in front of the camera. Drawn to the blend of strength, charisma and storytelling embodied by figures like Michele Morrone, Tom Hardy and Can Yaman, he works confidently across international environments in five languages.',
      ],
    },
  ],
  closing: [
    { key: 'general-11', alt: 'Train editorial' },
    { key: 'general-15', alt: 'White on marble' },
  ],
};

export const fashion = {
  title: 'Projects, fashion weeks & events.',
  sub: "Each project carries Aurelio's own reflections — what the work meant, and where it leads next.",
  projects: [
    {
      title: 'Cannes Film Festival',
      meta: ['Cannes, France', '2026', 'Red Carpet'],
      layout: 'feature', // first image spans two rows
      images: [
        { key: 'red-carpet-05', alt: 'Red carpet, Palais des Festivals' },
        { key: 'red-carpet-01', alt: 'On the stairs' },
        { key: 'red-carpet-12', alt: 'With press' },
        { key: 'festival-02', alt: 'On the Croisette' },
        { key: 'red-carpet-07', alt: "Photographers' wall" },
      ],
      description:
        "An invitation to the steps of the Palais des Festivals — white shawl-lapel tuxedo, photographed by the international press on cinema's most famous staircase. A milestone appearance marking Aurelio's arrival on the European scene.",
      quote: '',
    },
    {
      title: 'Studio Editorial',
      meta: ['Portrait Series', 'Tailoring'],
      layout: 'grid2',
      images: [
        { key: 'general-06', alt: 'Pinstripe suit' },
        { key: 'general-04', alt: 'White shirt, wine' },
        { key: 'general-03', alt: 'Black on grey' },
        { key: 'general-07', alt: 'Reclined, monochrome' },
      ],
      description:
        'A controlled studio series exploring contrast — sharp tailoring against soft textures, stillness against intensity. Produced with an experienced creative team to build a professional editorial portfolio.',
      quote: '',
    },
    {
      title: 'Old City, Baku',
      meta: ['Street Editorial', 'Linen'],
      layout: 'grid3',
      images: [
        { key: 'general-25', alt: 'Walking, Old City' },
        { key: 'general-22', alt: 'Against the stone' },
        { key: 'general-34', alt: 'Golden hour suede' },
      ],
      description:
        "Shot through the cobbled streets and stone walls of Baku's Old City — relaxed linen by day, suede at golden hour. A study in ease and place, connecting his roots to his craft.",
      quote: '',
    },
  ],
  next: {
    title: 'Next — Milano',
    note: 'Italian brand campaigns, editorials and fashion week appearances for the coming season will be announced here.',
  },
};

export const press = {
  title: 'Featured in 30+ publications.',
  sub: 'Coverage across Türkiye and beyond — magazines, websites and event appearances.',
  // Add articles as { publication, title, date, url }. While the list is empty the page
  // shows the press-kit note below instead.
  items: [],
  emptyNote:
    'Features across Turkish fashion and lifestyle media, with more in Europe for the coming season. A full press list and press kit are available to brands and agencies on request.',
  events: [
    { title: 'Cannes Film Festival — Red Carpet', meta: 'Cannes, France · May 2026', date: '2026-05-20', key: 'red-carpet-08' },
  ],
};

export const blog = {
  title: 'Milan, as it happens.',
  sub: "Every new shoot lands here first — a running journal of Aurelio's work.",
  posts: [
    {
      slug: 'the-steps-of-cannes',
      title: 'The steps of Cannes',
      cat: 'Event',
      date: '2026',
      key: 'red-carpet-13',
      excerpt: 'White tuxedo, the Palais staircase, and a wall of photographers — notes from a first Cannes red carpet.',
    },
    {
      slug: 'water-and-light',
      title: 'Water & light',
      cat: 'Editorial',
      date: '2026',
      key: 'general-12',
      excerpt: 'A high-energy session in water and sun — pushing expression beyond the studio.',
    },
    {
      slug: 'the-locomotive-series',
      title: 'The locomotive series',
      cat: 'Editorial',
      date: '2026',
      key: 'general-09',
      excerpt: 'Vintage suspenders and steel — a period story shot on a retired steam engine.',
    },
  ],
};

const couple = new Set(['festival-02', 'festival-04', 'red-carpet-01', 'red-carpet-08', 'red-carpet-12', 'red-carpet-13', 'general-16']);
const g = (key, label) => ({ key, label, category: couple.has(key) ? 'couple' : 'solo' });

export const gallery = {
  title: 'The full picture.',
  filters: [
    { id: 'all', label: 'All' },
    { id: 'solo', label: 'Solo' },
    { id: 'couple', label: 'Couple' },
  ],
  items: [
    g('red-carpet-05', 'Cannes 2026'), g('general-01', 'Editorial'), g('general-34', 'Baku'),
    g('red-carpet-08', 'Cannes 2026'), g('general-04', 'Studio'), g('general-12', 'Editorial'),
    g('festival-04', 'Cannes 2026'), g('general-06', 'Studio'), g('general-25', 'Baku'),
    g('general-09', 'Locomotive'), g('red-carpet-01', 'Cannes 2026'), g('general-14', 'Editorial'),
    g('general-11', 'Locomotive'), g('general-02', 'Night'), g('general-22', 'Baku'),
    g('red-carpet-12', 'Cannes 2026'), g('general-15', 'Editorial'), g('general-03', 'Studio'),
    g('general-36', 'Baku'), g('festival-02', 'Cannes 2026'), g('general-29', 'Baku'),
    g('general-07', 'Studio'), g('general-10', 'Editorial'), g('red-carpet-07', 'Cannes 2026'),
    g('general-16', 'Editorial'), g('general-28', 'Baku'), g('general-13', 'Night'),
    g('red-carpet-13', 'Cannes 2026'), g('general-31', 'Baku'), g('general-05', 'Studio'),
  ],
};

export const contact = {
  title: ['Work with', 'Aurelio.'],
  sub: 'For campaigns, editorials, runway and brand partnerships — reach out directly or through Instagram.',
  subject: 'Booking inquiry — Aurelio Milan',
};

// Map (Home + Gallery). lat/lon place the pin; dx/dy move its label (map units, 1000 wide).
// keys = photos for that place. upcoming: true draws a hollow pin with no photos.
export const map = {
  eyebrow: 'On location',
  title: ['Where he', 'has worked.'],
  sub: 'Every pin is a shoot or an appearance. Select a place to see the photos taken there.',
  places: [
    {
      id: 'cannes', city: 'Cannes', country: 'France', year: '2026',
      title: 'Film Festival — red carpet',
      lat: 43.5528, lon: 7.0174, dx: 40, dy: 115,
      keys: ['red-carpet-05', 'red-carpet-08', 'red-carpet-01', 'red-carpet-12', 'red-carpet-13', 'red-carpet-07', 'festival-04', 'festival-02'],
    },
    {
      id: 'baku', city: 'Baku', country: 'Azerbaijan', year: '2026',
      title: 'Old City — street editorial',
      lat: 40.3667, lon: 49.8352, dx: -120, dy: -150,
      keys: ['general-25', 'general-22', 'general-34', 'general-36', 'general-29', 'general-28', 'general-31'],
    },
    {
      id: 'milan', city: 'Milan', country: 'Italy', year: 'Next',
      title: 'Italian brand campaigns — coming soon',
      lat: 45.4642, lon: 9.19, dx: 90, dy: -150,
      keys: [], upcoming: true,
    },
  ],
};

// Photos shown during the intro loader
export const preloaderImages = ['general-01', 'general-36', 'red-carpet-06', 'general-15', 'general-12', 'red-carpet-05'];
