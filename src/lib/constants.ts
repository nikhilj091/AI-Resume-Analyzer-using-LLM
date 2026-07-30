export const COMPANIES = [
  {
    id: "google",
    name: "Google",
    focus: ["innovation", "scalable", "distributed systems", "leadership", "algorithm", "data structure"],
    weights: { keyword: 0.4, format: 0.1, skills: 0.25, experience: 0.15, projects: 0.1 },
  },
  {
    id: "amazon",
    name: "Amazon",
    focus: ["ownership", "customer obsession", "cloud", "aws", "scale", "bias for action", "impact"],
    weights: { keyword: 0.35, format: 0.15, skills: 0.2, experience: 0.2, projects: 0.1 },
  },
  {
    id: "microsoft",
    name: "Microsoft",
    focus: ["azure", "collaboration", "enterprise", "c#", ".net", "impact", "inclusive"],
    weights: { keyword: 0.35, format: 0.2, skills: 0.2, experience: 0.15, projects: 0.1 },
  },
  {
    id: "meta",
    name: "Meta",
    focus: ["impact", "fast-paced", "react", "graphql", "scale", "hack", "data-driven"],
    weights: { keyword: 0.4, format: 0.1, skills: 0.2, experience: 0.15, projects: 0.15 },
  },
  {
    id: "apple",
    name: "Apple",
    focus: ["design", "user experience", "swift", "objective-c", "detail-oriented", "innovation"],
    weights: { keyword: 0.3, format: 0.25, skills: 0.2, experience: 0.15, projects: 0.1 },
  },
  {
    id: "netflix",
    name: "Netflix",
    focus: ["freedom and responsibility", "microservices", "streaming", "high availability", "java", "node.js"],
    weights: { keyword: 0.35, format: 0.15, skills: 0.2, experience: 0.2, projects: 0.1 },
  },
  {
    id: "tcs",
    name: "TCS",
    focus: ["sdlc", "java", "communication", "agile", "consulting", "enterprise", "delivery"],
    weights: { keyword: 0.25, format: 0.3, skills: 0.25, experience: 0.1, projects: 0.1 },
  },
  {
    id: "infosys",
    name: "Infosys",
    focus: ["agile", "java", "cloud", "transformation", "client-facing", "process"],
    weights: { keyword: 0.25, format: 0.25, skills: 0.25, experience: 0.15, projects: 0.1 },
  },
  {
    id: "accenture",
    name: "Accenture",
    focus: ["consulting", "ai", "transformation", "cloud", "strategy", "delivery"],
    weights: { keyword: 0.3, format: 0.2, skills: 0.2, experience: 0.2, projects: 0.1 },
  },
  {
    id: "generic",
    name: "Generic (Default)",
    focus: ["teamwork", "communication", "problem solving", "leadership", "development"],
    weights: { keyword: 0.35, format: 0.2, skills: 0.2, experience: 0.15, projects: 0.05, education: 0.05 },
  }
];

export const TARGET_ROLES = [
  {
    id: "software_engineer",
    name: "Software Engineer",
    keywords: ["java", "python", "c++", "data structures", "algorithms", "system design", "git", "api", "database", "sql"],
  },
  {
    id: "frontend_developer",
    name: "Frontend Developer",
    keywords: ["html", "css", "javascript", "typescript", "react", "vue", "angular", "next.js", "ui/ux", "responsive", "web accessibility"],
  },
  {
    id: "backend_developer",
    name: "Backend Developer",
    keywords: ["node.js", "python", "java", "spring boot", "go", "ruby", "sql", "nosql", "mongodb", "postgresql", "redis", "docker", "kubernetes", "microservices"],
  },
  {
    id: "full_stack_developer",
    name: "Full Stack Developer",
    keywords: ["react", "node.js", "javascript", "typescript", "mongodb", "express", "sql", "rest", "graphql", "aws", "docker"],
  },
  {
    id: "ai_engineer",
    name: "AI Engineer",
    keywords: ["python", "machine learning", "deep learning", "nlp", "tensorflow", "pytorch", "llm", "prompt engineering", "openai", "langchain"],
  },
  {
    id: "ml_engineer",
    name: "ML Engineer",
    keywords: ["python", "scikit-learn", "tensorflow", "pytorch", "model deployment", "mlops", "data pipeline", "aws sagemaker", "pandas", "numpy"],
  },
  {
    id: "data_scientist",
    name: "Data Scientist",
    keywords: ["python", "r", "statistics", "machine learning", "pandas", "numpy", "sql", "data visualization", "tableau", "ab testing", "predictive modeling"],
  },
  {
    id: "data_analyst",
    name: "Data Analyst",
    keywords: ["sql", "excel", "tableau", "power bi", "python", "data visualization", "reporting", "dashboards", "statistics"],
  },
  {
    id: "devops_engineer",
    name: "DevOps Engineer",
    keywords: ["linux", "bash", "aws", "azure", "gcp", "docker", "kubernetes", "ci/cd", "jenkins", "github actions", "terraform", "ansible"],
  },
  {
    id: "cloud_engineer",
    name: "Cloud Engineer",
    keywords: ["aws", "azure", "gcp", "cloud architecture", "serverless", "ec2", "s3", "lambda", "docker", "kubernetes", "networking"],
  },
  {
    id: "cybersecurity_analyst",
    name: "Cybersecurity Analyst",
    keywords: ["security", "network security", "penetration testing", "vulnerability assessment", "firewalls", "siem", "incident response", "cryptography"],
  },
  {
    id: "qa_engineer",
    name: "QA Engineer",
    keywords: ["testing", "automation", "selenium", "cypress", "jest", "pytest", "test cases", "jira", "ci/cd", "bug tracking"],
  },
  {
    id: "product_manager",
    name: "Product Manager",
    keywords: ["product strategy", "agile", "scrum", "roadmap", "user stories", "jira", "analytics", "cross-functional", "market research"],
  },
  {
    id: "ui_ux_designer",
    name: "UI/UX Designer",
    keywords: ["figma", "sketch", "adobe xd", "wireframing", "prototyping", "user research", "usability testing", "interaction design"],
  }
];

export const TECHNICAL_SKILLS = [
  "Python", "Java", "JavaScript", "TypeScript", "C++", "C", "C#", "Go", "Rust", "Ruby", "PHP", "Swift", "Kotlin", "Objective-C",
  "Node.js", "React", "Next.js", "Express", "Spring Boot", "Django", "Flask", "Angular", "Vue", "Svelte",
  "TensorFlow", "PyTorch", "Scikit-learn", "Keras", "Pandas", "Numpy", "Matplotlib", "Seaborn",
  "SQL", "MySQL", "PostgreSQL", "MongoDB", "Redis", "Cassandra", "Elasticsearch", "DynamoDB", "Firebase", "Supabase",
  "Docker", "Kubernetes", "AWS", "Azure", "GCP", "Git", "Linux", "Bash", "Terraform", "Ansible", "Jenkins", "GitHub Actions",
  "GraphQL", "REST APIs", "gRPC", "WebSockets",
  "HTML", "CSS", "Tailwind CSS", "SASS", "Bootstrap", "Material UI"
];
