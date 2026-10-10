import { prisma } from '../src/core/prisma';

const forms = [
  {
    name: 'Contact Form',
    slug: 'contact-form',
    status: 'PUBLISHED' as const,
    config: {
      name: 'Contact Form',
      slug: 'contact-form',
      fields: [
        {
          id: 'field-1',
          type: 'text',
          label: 'Full Name',
          name: 'fullName',
          placeholder: 'John Doe',
          required: true,
        },
        {
          id: 'field-2',
          type: 'text',
          label: 'Email Address',
          name: 'email',
          placeholder: 'john@example.com',
          required: true,
        },
        {
          id: 'field-3',
          type: 'text',
          label: 'Subject',
          name: 'subject',
          placeholder: 'How can we help?',
        },
        {
          id: 'field-4',
          type: 'autocomplete',
          label: 'Category',
          name: 'category',
          options: [
            { label: 'General Inquiry', value: 'general' },
            { label: 'Technical Support', value: 'support' },
            { label: 'Billing', value: 'billing' },
            { label: 'Partnership', value: 'partnership' },
          ],
          searchable: true,
          clearable: true,
        },
        {
          id: 'field-5',
          type: 'autocomplete',
          label: 'Message',
          name: 'message',
          placeholder: 'Tell us more...',
          required: true,
        },
      ],
      actions: [
        { id: 'action-1', type: 'submit', label: 'Send Message', variant: 'primary' },
        { id: 'action-2', type: 'reset', label: 'Clear Form', variant: 'ghost' },
      ],
    },
  },
  {
    name: 'Newsletter Signup',
    slug: 'newsletter-signup',
    status: 'PUBLISHED' as const,
    config: {
      name: 'Newsletter Signup',
      slug: 'newsletter-signup',
      fields: [
        {
          id: 'field-6',
          type: 'text',
          label: 'Email Address',
          name: 'email',
          placeholder: 'you@example.com',
          required: true,
        },
        {
          id: 'field-7',
          type: 'select',
          label: 'Frequency',
          name: 'frequency',
          options: [
            { label: 'Daily', value: 'daily' },
            { label: 'Weekly', value: 'weekly' },
            { label: 'Monthly', value: 'monthly' },
          ],
          searchable: false,
          clearable: false,
        },
        {
          id: 'field-8',
          type: 'select',
          label: 'Topics',
          name: 'topics',
          multiple: true,
          options: [
            { label: 'Product Updates', value: 'product' },
            { label: 'Blog Posts', value: 'blog' },
            { label: 'Tutorials', value: 'tutorials' },
            { label: 'Industry News', value: 'news' },
          ],
          searchable: true,
          clearable: true,
        },
      ],
      actions: [
        { id: 'action-3', type: 'submit', label: 'Subscribe', variant: 'primary' },
      ],
    },
  },
  {
    name: 'Job Application',
    slug: 'job-application',
    status: 'DRAFT' as const,
    config: {
      name: 'Job Application',
      slug: 'job-application',
      fields: [
        {
          id: 'field-9',
          type: 'text',
          label: 'Full Name',
          name: 'fullName',
          placeholder: 'Jane Smith',
          required: true,
        },
        {
          id: 'field-10',
          type: 'text',
          label: 'Email',
          name: 'email',
          placeholder: 'jane@example.com',
          required: true,
        },
        {
          id: 'field-11',
          type: 'text',
          label: 'Phone',
          name: 'phone',
          placeholder: '+1 (555) 123-4567',
        },
        {
          id: 'field-12',
          type: 'select',
          label: 'Position Applied For',
          name: 'position',
          options: [
            { label: 'Software Engineer', value: 'software-engineer' },
            { label: 'Frontend Developer', value: 'frontend-dev' },
            { label: 'Backend Developer', value: 'backend-dev' },
            { label: 'Full Stack Developer', value: 'fullstack-dev' },
            { label: 'DevOps Engineer', value: 'devops' },
            { label: 'Other', value: 'other' },
          ],
          searchable: true,
          clearable: true,
          required: true,
        },
        {
          id: 'field-13',
          type: 'number',
          label: 'Years of Experience',
          name: 'experience',
          min: 0,
          max: 50,
          step: 1,
        },
        {
          id: 'field-14',
          type: 'autocomplete',
          label: 'Skills',
          name: 'skills',
          multiple: true,
          options: [
            { label: 'React', value: 'react' },
            { label: 'TypeScript', value: 'typescript' },
            { label: 'Node.js', value: 'nodejs' },
            { label: 'PostgreSQL', value: 'postgresql' },
            { label: 'Docker', value: 'docker' },
            { label: 'Kubernetes', value: 'kubernetes' },
            { label: 'AWS', value: 'aws' },
            { label: 'GraphQL', value: 'graphql' },
          ],
          searchable: true,
          clearable: true,
        },
        {
          id: 'field-15',
          type: 'autocomplete',
          label: 'Cover Letter',
          name: 'coverLetter',
          placeholder: 'Why are you a good fit?',
        },
      ],
      actions: [
        { id: 'action-4', type: 'submit', label: 'Submit Application', variant: 'primary' },
        { id: 'action-5', type: 'reset', label: 'Reset', variant: 'ghost' },
      ],
    },
  },
  {
    name: 'Event Registration',
    slug: 'event-registration',
    status: 'PUBLISHED' as const,
    config: {
      name: 'Event Registration',
      slug: 'event-registration',
      fields: [
        {
          id: 'field-16',
          type: 'text',
          label: 'Attendee Name',
          name: 'attendeeName',
          placeholder: 'Alex Johnson',
          required: true,
        },
        {
          id: 'field-17',
          type: 'text',
          label: 'Email',
          name: 'email',
          placeholder: 'alex@example.com',
          required: true,
        },
        {
          id: 'field-18',
          type: 'select',
          label: 'Ticket Type',
          name: 'ticketType',
          options: [
            { label: 'Early Bird - $49', value: 'early-bird' },
            { label: 'Regular - $79', value: 'regular' },
            { label: 'VIP - $149', value: 'vip' },
            { label: 'Student - $29', value: 'student' },
          ],
          required: true,
        },
        {
          id: 'field-19',
          type: 'select',
          label: 'Dietary Requirements',
          name: 'dietary',
          multiple: true,
          options: [
            { label: 'Vegetarian', value: 'vegetarian' },
            { label: 'Vegan', value: 'vegan' },
            { label: 'Gluten-Free', value: 'gluten-free' },
            { label: 'Halal', value: 'halal' },
            { label: 'Kosher', value: 'kosher' },
            { label: 'None', value: 'none' },
          ],
        },
        {
          id: 'field-20',
          type: 'number',
          label: 'Number of Guests',
          name: 'guests',
          min: 0,
          max: 10,
          step: 1,
          defaultValue: 0,
        },
        {
          id: 'field-21',
          type: 'autocomplete',
          label: 'Special Requests',
          name: 'specialRequests',
          placeholder: 'Any accessibility needs or special requests?',
        },
      ],
      actions: [
        { id: 'action-6', type: 'submit', label: 'Register Now', variant: 'primary' },
        { id: 'action-7', type: 'cancel', label: 'Cancel', variant: 'ghost' },
      ],
    },
  },
];

const experiences = [
  {
    role: 'Software Engineer',
    company: 'AirAsia Philippines',
    start: 'Nov 2022',
    end: 'Present',
    responsibilities: [
      'Pioneered AI-assisted and vibe coding workflows on the team, accelerating development cycles and improving code quality.',
      'Pioneered development of an internal airline system and co-led its pricing module.',
      'Engineered a data sync service that fetches Workday updates, persists them to a central database, and propagates changes to downstream applications.',
      'Revamped a Vite module-federated flight scheduling app, integrating 25 report modules, each with distinct UI, data sources, and Excel and PDF exports.',
      'Enhanced seat and baggage recommendation engines on AirAsia Move, implementing sit-together and child-adult pairing logic that drove ancillary sales uplift.',
      'Shipped a real-time airport operations monitoring app covering all AirAsia airports, helping flight operations and network teams surface and escalate live issues faster.',
      'Developed a Workvivo chatbot with self-service features including ISR creation, password reset, and account unlock, with live agent transfer.',
      'Built a C-level KPI dashboard with 100+ BigQuery queries and LLM-generated insights per chart.',
      'Delivered a pilot training tracker app with offline-first capabilities, letting pilots log training progress during flights and sync on reconnection.',
      'Created a crew portal for tracking sales, commissions, and flight schedules, with data sourced from BigQuery.',
      'Developed a recruitment app that pulls job postings from Workday, lets users create hiring events with shareable applicant form links and custom email templates, and syncs candidate assessments back to Workday.',
      'Collaborated with Malaysia-based teams on cross-functional projects, including on-site work and training in Kuala Lumpur.',
    ],
  },
  {
    role: 'Flutter Developer',
    company: 'Ben Edictio Corp.',
    start: 'Nov 2021',
    end: 'Nov 2022',
    responsibilities: [
      'Assigned to Indra Philippines, Inc. as Flutter Developer; later seconded to AirAsia as Software Engineer and subsequently absorbed.',
      'Helped develop, debug, test, and maintain applications used by thousands of AirAsia users.',
    ],
  },
  {
    role: 'Mobile Developer',
    company: 'Bookdis Technology',
    start: 'Jun 2020',
    end: 'Oct 2021',
    responsibilities: [
      'Led development of multiple Flutter mobile apps for a food delivery service, including pricing logic and Google Maps integration.',
      'Built an order monitoring website to track and manage ongoing deliveries in real time.',
      'Translated UI/UX designs into smooth, user-friendly interfaces across mobile and web.',
    ],
  },
  {
    role: 'Freelance Web Developer',
    company: 'Oolong Media & Social Garden',
    start: 'Aug 2018',
    end: 'Feb 2020',
    responsibilities: [
      'Converted PSD and design mockups into custom WordPress pages and templates for Oolong Media.',
      'Built responsive Gravity Forms with dynamic fields to capture marketing leads.',
      'Optimized WordPress sites through image deferring, performance tuning, and page speed testing.',
      'Maintained WordPress sites by keeping plugins up to date and ensuring overall stability.',
      "Built Unbounce landing pages for Social Garden's real estate developer clients, showcasing properties and floor plans.",
      'Built custom dynamic Unbounce forms to capture and convert leads.',
    ],
  },
];

const gigs = [
  {
    title: 'Digital products',
    description: 'I sell digital products like landing pages, wallpapers, ebooks, and other useful digital assets.',
    details: ['Landing pages', 'Wallpapers', 'Other digital assets'],
    link: '/shop',
    linkLabel: 'View digital products',
    external: false,
  },
  {
    title: 'Design to live website',
    description: 'I convert your Figma designs, HTML templates, and PSDs into live, responsive websites.',
    details: ['React and Angular', 'WordPress and Unbounce', 'Performance and page speed tuning'],
    link: 'https://mail.google.com/mail/?view=cm&fs=1&to=flxrzjr%40gmail.com&su=Request%20a%20website&body=Hi%20Felix%2C%0A%0AI%27d%20like%20to%20discuss%20turning%20my%20design%20into%20a%20live%20website.%0A%0AProject%20details%3A%0A',
    linkLabel: 'Request a website',
    external: true,
  },
  {
    title: 'Mobile apps',
    description: 'I build cross-platform mobile apps, from idea to a polished release, with real-world integrations.',
    details: ['Flutter apps', 'Maps and pricing logic', 'Offline-first support'],
    link: 'https://mail.google.com/mail/?view=cm&fs=1&to=flxrzjr%40gmail.com&su=Mobile%20app%20request&body=Hi%20Felix%2C%0A%0AI%27d%20like%20to%20discuss%20building%20a%20mobile%20app.%0A%0AProject%20details%3A%0A',
    linkLabel: 'Build my app',
    external: true,
  },
  {
    title: 'Dashboards and internal tools',
    description: 'I build data-driven dashboards and internal apps that help teams see and act on what matters.',
    details: ['BigQuery dashboards', 'Excel and PDF exports', 'Real-time monitoring'],
    link: 'https://mail.google.com/mail/?view=cm&fs=1&to=flxrzjr%40gmail.com&su=Dashboard%20or%20internal%20tool&body=Hi%20Felix%2C%0A%0AI%27d%20like%20to%20discuss%20a%20dashboard%20or%20internal%20tool.%0A%0AProject%20details%3A%0A',
    linkLabel: 'Discuss a dashboard',
    external: true,
  },
  {
    title: 'Work on your project',
    description: 'You can hire me to help build, improve, or ship a part of your project, from backend services to UI.',
    details: ['Full-stack feature development', 'Cloud-native microservices', 'AI-assisted development workflows'],
    link: 'https://mail.google.com/mail/?view=cm&fs=1&to=flxrzjr%40gmail.com&su=Project%20collaboration&body=Hi%20Felix%2C%0A%0AI%27d%20like%20to%20discuss%20having%20you%20help%20with%20my%20project.%0A%0AProject%20details%3A%0A',
    linkLabel: 'Hire me for your project',
    external: true,
  },
];

const stacks = [
  { category: 'Frontend', label: 'React', key: 'react', color: '#61DAFB' },
  { category: 'Frontend', label: 'Next.js', key: 'nextjs', color: 'var(--foreground)' },
  { category: 'Frontend', label: 'Tailwind', key: 'tailwind', color: '#38BDF8' },
  { category: 'Frontend', label: 'Vite', key: 'vite', color: '#A855F7' },
  { category: 'Frontend', label: 'Angular', key: 'angular', color: '#DD0031' },
  { category: 'Frontend', label: 'Flutter', key: 'flutter', color: '#02569B' },
  { category: 'Backend', label: 'Node.js', key: 'nodejs', color: '#5FA04E' },
  { category: 'Backend', label: 'NestJS', key: 'nestjs', color: '#E0234E' },
  { category: 'Backend', label: 'Fastify', key: 'fastify', color: 'var(--foreground)' },
  { category: 'Backend', label: 'Express', key: 'express', color: 'var(--foreground)' },
  { category: 'Backend', label: 'PostgreSQL', key: 'postgresql', color: '#4169E1' },
  { category: 'Backend', label: 'Drizzle', key: 'drizzle', color: '#C5F74F' },
  { category: 'Backend', label: 'Prisma', key: 'prisma', color: 'var(--foreground)' },
  { category: 'Backend', label: 'BigQuery', key: 'bigquery', color: '#669DF6' },
  { category: 'Backend', label: 'REST', key: 'rest', color: '#F97316' },
  { category: 'Backend', label: 'SOAP', key: 'soap', color: '#3B82F6' },
  { category: 'Cloud & DevOps', label: 'Google Cloud', key: 'googlecloud', color: '#4285F4' },
  { category: 'Cloud & DevOps', label: 'Cloud Firestore', key: 'cloudfirestore', color: '#FFCA28' },
  { category: 'Cloud & DevOps', label: 'Pub/Sub', key: 'pubsub', color: '#4285F4' },
  { category: 'Cloud & DevOps', label: 'Git', key: 'git', color: '#F05032' },
  { category: 'Cloud & DevOps', label: 'GitLab', key: 'gitlab', color: '#FC6D26' },
  { category: 'Cloud & DevOps', label: 'CI/CD', key: 'cicd', color: '#22C55E' },
  { category: 'AI & Agentic Tools', label: 'Claude', key: 'claude', color: '#D97757' },
  { category: 'AI & Agentic Tools', label: 'Cursor', key: 'cursor', color: 'var(--foreground)' },
  { category: 'AI & Agentic Tools', label: 'Gemini', key: 'gemini', color: '#8E75F1' },
  { category: 'AI & Agentic Tools', label: 'GitHub Copilot', key: 'githubcopilot', color: 'var(--foreground)' },
  { category: 'AI & Agentic Tools', label: 'Antigravity', key: 'antigravity', color: '#4285F4' },
  { category: 'AI & Agentic Tools', label: 'Vibe Coding', key: 'vibecoding', color: '#EC4899' },
  { category: 'Tools & Design', label: 'Jira', key: 'jira', color: '#0052CC' },
  { category: 'Tools & Design', label: 'Postman', key: 'postman', color: '#FF6C37' },
  { category: 'Tools & Design', label: 'Figma', key: 'figma', color: '#F24E1E' },
  { category: 'Tools & Design', label: 'Wordpress', key: 'wordpress', color: '#21759b' },
];

const certifications = [
  {
    title: 'ITIL Foundation Certificate',
    issuer: 'PeopleCert',
    issuedAt: 'March 2025',
    description: 'IT Service Management',
  },
];

const trainings = [
  {
    title: 'ITIL Foundation Certificate',
    provider: 'PeopleCert',
    completedAt: 'March 2025',
    description: 'IT Service Management',
  },
];

const main = async () => {
  // Get or create a default user for forms
  let defaultUser = await prisma.user.findFirst();
  if (!defaultUser) {
    defaultUser = await prisma.user.create({
      data: {
        email: 'admin@example.com',
        username: 'admin',
        password: '$2b$10$defaulthash', // placeholder
        name: 'Admin User',
      },
    });
  }

  for (const form of forms) {
    const existing = await prisma.form.findFirst({ where: { slug: form.slug } });

    if (existing) {
      await prisma.form.update({
        where: { id: existing.id },
        data: { ...form, userId: defaultUser.id, isDeleted: false, deletedAt: null, deletedBy: null },
      });
    } else {
      await prisma.form.create({ data: { ...form, userId: defaultUser.id } });
    }
  }

  for (const experience of experiences) {
    const existing = await prisma.experience.findFirst({
      where: {
        start: experience.start,
        end: experience.end,
      },
    });

    if (existing) {
      await prisma.experience.update({
        where: { id: existing.id },
        data: { ...experience, isDeleted: false, deletedAt: null, deletedBy: null },
      });
    } else {
      await prisma.experience.create({ data: experience });
    }
  }

  for (const gig of gigs) {
    const existing = await prisma.gig.findFirst({ where: { title: gig.title } });

    if (existing) {
      await prisma.gig.update({
        where: { id: existing.id },
        data: { ...gig, isDeleted: false, deletedAt: null, deletedBy: null },
      });
    } else {
      await prisma.gig.create({ data: gig });
    }
  }

  for (const stack of stacks) {
    const existing = await prisma.stack.findUnique({ where: { key: stack.key } });

    if (existing) {
      await prisma.stack.update({
        where: { id: existing.id },
        data: { ...stack, isDeleted: false, deletedAt: null, deletedBy: null },
      });
    } else {
      await prisma.stack.create({ data: stack });
    }
  }

  for (const certification of certifications) {
    const existing = await prisma.certification.findFirst({
      where: {
        title: certification.title,
        issuer: certification.issuer,
        issuedAt: certification.issuedAt,
      },
    });

    if (existing) {
      await prisma.certification.update({
        where: { id: existing.id },
        data: { ...certification, isDeleted: false, deletedAt: null, deletedBy: null },
      });
    } else {
      await prisma.certification.create({ data: certification });
    }
  }

  for (const training of trainings) {
    const existing = await prisma.training.findFirst({
      where: {
        title: training.title,
        provider: training.provider,
        completedAt: training.completedAt,
      },
    });

    if (existing) {
      await prisma.training.update({
        where: { id: existing.id },
        data: { ...training, isDeleted: false, deletedAt: null, deletedBy: null },
      });
    } else {
      await prisma.training.create({ data: training });
    }
  }
};

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
