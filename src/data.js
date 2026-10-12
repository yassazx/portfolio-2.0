export const projects = [
  {
    id: 'quality', company: 'CAPGEMINI', year: '2026', discipline: 'DevOps & QA automation',
    title: ['SHIP WITH', 'CONFIDENCE.'], description: 'A quality-first delivery pipeline for Bouygues Telecom. Catch issues early. Keep every release moving.',
    role: 'DevOps & QA Automation Intern', date: 'June — August 2026',
    stack: ['GitLab CI/CD', 'SonarQube', 'Docker', 'Python', 'Robot Framework'],
    details: 'Modernized the GitLab CI/CD pipeline with an automated Quality Stage and fail-fast SonarQube quality gates. Built containerized end-to-end regression tests with Robot Framework, Python, and Selenium.',
  },
  {
    id: 'data', company: 'INETUM', year: '2025', discipline: 'Data & cloud engineering',
    title: ['FROM DATA', 'TO DECISIONS.'], description: 'Turning deployment and application logs into a clearer picture of performance. Less reporting. More understanding.',
    role: 'Data & Cloud Engineering Intern', date: 'June — August 2025',
    stack: ['Python', 'SQL', 'Power BI', 'DAX', 'Jenkins'],
    details: 'Built Python and SQL pipelines processing approximately 20,000 records per day for Codep reporting. Designed a star schema around deployments and resource usage, and delivered three Power BI dashboards covering 12 KPIs. Weekly reporting fell from four hours to 30 minutes.',
  },
  {
    id: 'software', company: 'CAPGEMINI', year: '2024', discipline: 'Full-stack development',
    title: ['CONNECTED', 'BY DESIGN.'], description: 'A full-stack application for internal resource tracking. Bringing the interface, business logic, and data together.',
    role: 'Software Development Intern', date: 'July — August 2024',
    stack: ['Java', 'Spring Boot', 'Angular', 'REST APIs', 'Git'],
    details: 'Developed an internal resource tracking web application with a Java Spring Boot backend and an Angular frontend. Integrated REST APIs and collaborated through Git.',
  },
];

export const skills = [
  { title: 'Build', subtitle: 'Software engineering', items: ['Java / Spring Boot', 'React / Angular', 'Node.js / Express', 'PostgreSQL / MySQL / MongoDB'] },
  { title: 'Connect', subtitle: 'Data & intelligence', items: ['Python / SQL / PySpark', 'Power BI / DAX / Power Query', 'Databricks / Microsoft Fabric', 'ETL / Data warehousing / Lakehouse'] },
  { title: 'Deliver', subtitle: 'Cloud & DevOps', items: ['Docker / Kubernetes / Helm', 'GitLab CI/CD / Jenkins / ArgoCD', 'Amazon Web Services', 'Oracle Cloud Infrastructure'] },
];
