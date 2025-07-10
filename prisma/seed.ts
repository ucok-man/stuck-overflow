import {
  PrismaClient,
  type Answer,
  type Question,
  type Tag,
  type User,
} from "@prisma/client";
// import { answersData } from "./initial-data";

const prisma = new PrismaClient();

async function main() {
  /* ---------------------------------------------------------------- */
  /*                           create users                           */
  /* ---------------------------------------------------------------- */
  const USER_DATAS = [
    {
      id: "67081f2162015f27d5e61411",
      clerkId: "clerk_0",
      name: "John Doe",
      username: "johndoe",
      picture: "/assets/images/anonymus.jpg",
      email: "john.doe@example.com",
      password: "password123",
      bio: "A software engineer from New York.",
      location: "New York, USA",
      website: "https://johndoe.com",
      reputation: 250,
    },
    {
      id: "67081f375f2b1ae257cb128c",
      clerkId: "clerk_1",
      name: "Jane Smith",
      username: "janesmith",
      picture: "/assets/images/anonymus.jpg",
      email: "jane.smith@example.com",
      password: "password456",
      bio: "A front-end developer specializing in React and UI/UX design.",
      location: "San Francisco, USA",
      website: "https://janesmith.dev",
      reputation: 320,
    },
    {
      id: "67081f67ada72fee8d547655",
      clerkId: "clerk_2",
      name: "Carlos Rodríguez",
      username: "carlosr",
      picture: "/assets/images/anonymus.jpg",
      email: "carlos.rodriguez@example.com",
      password: "password789",
      bio: "Backend developer with expertise in Node.js and databases.",
      location: "Mexico City, Mexico",
      website: "https://carlosr.dev",
      reputation: 180,
    },
    {
      id: "67081f836a6e64d87aa160ec",
      clerkId: "clerk_3",
      name: "Aisha Khan",
      username: "aishak",
      picture: "/assets/images/anonymus.jpg",
      email: "aisha.khan@example.com",
      password: "password321",
      bio: "DevOps engineer with a focus on cloud infrastructure.",
      location: "Dubai, UAE",
      website: "https://aishakhan.io",
      reputation: 400,
    },
    {
      id: "67081f97b73e83a2a1bc4f65",
      clerkId: "clerk_4",
      name: "Maria Garcia",
      username: "mariag",
      picture: "/assets/images/anonymus.jpg",
      email: "maria.garcia@example.com",
      password: "password654",
      bio: "Full-stack developer with experience in Angular and Java.",
      location: "Madrid, Spain",
      website: "https://mariag.dev",
      reputation: 210,
    },
    {
      id: "67081fc2aa5c4d8b504604d2",
      clerkId: "clerk_5",
      name: "Li Wei",
      username: "liwei",
      picture: "/assets/images/anonymus.jpg",
      email: "li.wei@example.com",
      password: "password987",
      bio: "Mobile developer focused on iOS and Swift.",
      location: "Beijing, China",
      website: "https://liwei.io",
      reputation: 290,
    },
    {
      id: "67081fde19b9d67041469119",
      clerkId: "clerk_6",
      name: "Anna Ivanova",
      username: "annai",
      picture: "/assets/images/anonymus.jpg",
      email: "anna.ivanova@example.com",
      password: "password135",
      bio: "Data scientist with a focus on machine learning and AI.",
      location: "Moscow, Russia",
      website: "https://annaivanova.ai",
      reputation: 350,
    },
    {
      id: "67081ff7432c86060c4979ed",
      clerkId: "clerk_7",
      name: "David Kim",
      username: "davidkim",
      picture: "/assets/images/anonymus.jpg",
      email: "david.kim@example.com",
      password: "password468",
      bio: "Security expert specializing in web application security.",
      location: "Seoul, South Korea",
      website: "https://davidkim.secure",
      reputation: 275,
    },
    {
      id: "6708201b4819c029232dbae9",
      clerkId: "clerk_8",
      name: "Emily Johnson",
      username: "emilyj",
      picture: "/assets/images/anonymus.jpg",
      email: "emily.johnson@example.com",
      password: "password579",
      bio: "UI/UX designer with a passion for creating seamless user experiences.",
      location: "London, UK",
      website: "https://emilyjdesign.com",
      reputation: 330,
    },
    {
      id: "67082031c230d3629ab5241c",
      clerkId: "clerk_9",
      name: "Ahmed Ali",
      username: "ahmedali",
      picture: "/assets/images/anonymus.jpg",
      email: "ahmed.ali@example.com",
      password: "password912",
      bio: "Blockchain developer with a focus on Ethereum and smart contracts.",
      location: "Cairo, Egypt",
      website: "https://ahmedali.dev",
      reputation: 340,
    },
  ];

  const users: User[] = [];
  for (const data of USER_DATAS) {
    const user = await prisma.user.create({
      data: {
        id: data.id,
        clerkId: data.clerkId,
        email: data.email,
        name: data.name,
        picture: data.picture,
        username: data.username,
        bio: data.bio,
        location: data.location,
        portfolioWebsite: data.website,
        reputation: data.reputation,
      },
    });
    users.push(user);
  }
  const questionUsers = users.slice(0, 5);
  const answerUsers = users.slice(5, 10);

  /* ---------------------------------------------------------------- */
  /*                            create tags                           */
  /* ---------------------------------------------------------------- */
  enum TagEnum {
    React = "605c72f19e7b8a3f7c0f3d5b",
    Netlify = "605c72f19e7b8a3f7c0f3d5c",
    MongoDB = "605c72f19e7b8a3f7c0f3d5d",
    Database = "605c72f19e7b8a3f7c0f3d5e",
    JWT = "605c72f19e7b8a3f7c0f3d5f",
    NodeJs = "605c72f19e7b8a3f7c0f3d60",
    Authentication = "605c72f19e7b8a3f7c0f3d61",
    Redux = "605c72f19e7b8a3f7c0f3d62",
    StateManagement = "605c72f19e7b8a3f7c0f3d63",
    Concurrency = "605c72f19e7b8a3f7c0f3d64",
    Performance = "605c72f19e7b8a3f7c0f3d65",
    ProjectSetup = "605c72f19e7b8a3f7c0f3d66",
    TypeScript = "605c72f19e7b8a3f7c0f3d67",
    GraphQL = "605c72f19e7b8a3f7c0f3d68",
    Pagination = "605c72f19e7b8a3f7c0f3d69",
    ApiDesign = "605c72f19e7b8a3f7c0f3d6a",
    Docker = "605c72f19e7b8a3f7c0f3d6b",
    Kubernetes = "605c72f19e7b8a3f7c0f3d6c",
    Containers = "605c72f19e7b8a3f7c0f3d6d",
    Angular = "605c72f19e7b8a3f7c0f3d6e",
    Architecture = "605c72f19e7b8a3f7c0f3d6f",
    ProjectStructure = "605c72f19e7b8a3f7c0f3d70",
    CICD = "605c72f19e7b8a3f7c0f3d71",
    Automation = "605c72f19e7b8a3f7c0f3d72",
    Security = "605c72f19e7b8a3f7c0f3d73",
    Scaling = "605c72f19e7b8a3f7c0f3d74",
    Microservices = "605c72f19e7b8a3f7c0f3d75",
    AWS = "605c72f19e7b8a3f7c0f3d76",
    OAuth = "605c72f19e7b8a3f7c0f3d77",
    Flask = "605c72f19e7b8a3f7c0f3d78",
    Production = "605c72f19e7b8a3f7c0f3d79",
    Deployment = "605c72f19e7b8a3f7c0f3d7a",
    Optimization = "605c72f19e7b8a3f7c0f3d7b",
    Django = "605c72f19e7b8a3f7c0f3d7c",
    SASS = "605c72f19e7b8a3f7c0f3d7d",
    AWSLambda = "605c72f19e7b8a3f7c0f3d7e",
    Serverless = "605c72f19e7b8a3f7c0f3d7f",
    Python = "605c72f19e7b8a3f7c0f3d80",
    SchemaDesign = "605c72f19e7b8a3f7c0f3d81",
    CSS = "605c72f19e7b8a3f7c0f3d82",
  }

  const TAG_DATAS = [
    {
      id: "605c72f19e7b8a3f7c0f3d5b",
      name: "React",
      description: "A JavaScript library for building user interfaces.",
    },
    {
      id: "605c72f19e7b8a3f7c0f3d5c",
      name: "Netlify",
      description: "A platform for automating web projects.",
    },
    {
      id: "605c72f19e7b8a3f7c0f3d5d",
      name: "MongoDB",
      description: "A NoSQL database for modern applications.",
    },
    {
      id: "605c72f19e7b8a3f7c0f3d5e",
      name: "Database",
      description: "A structured set of data held in a computer.",
    },
    {
      id: "605c72f19e7b8a3f7c0f3d5f",
      name: "JWT",
      description: "JSON Web Tokens for secure data transmission.",
    },
    {
      id: "605c72f19e7b8a3f7c0f3d60",
      name: "NodeJs",
      description: "JavaScript runtime built on Chrome's V8 engine.",
    },
    {
      id: "605c72f19e7b8a3f7c0f3d61",
      name: "Authentication",
      description: "The process of verifying identity.",
    },
    {
      id: "605c72f19e7b8a3f7c0f3d62",
      name: "Redux",
      description: "A predictable state container for JavaScript apps.",
    },
    {
      id: "605c72f19e7b8a3f7c0f3d63",
      name: "StateManagement",
      description: "Managing the state of an application.",
    },
    {
      id: "605c72f19e7b8a3f7c0f3d64",
      name: "Concurrency",
      description: "Managing multiple tasks at the same time.",
    },
    {
      id: "605c72f19e7b8a3f7c0f3d65",
      name: "Performance",
      description: "The efficiency of a system in accomplishing tasks.",
    },
    {
      id: "605c72f19e7b8a3f7c0f3d66",
      name: "ProjectSetup",
      description: "Initial configuration and setup of a project.",
    },
    {
      id: "605c72f19e7b8a3f7c0f3d67",
      name: "TypeScript",
      description: "A superset of JavaScript that adds static types.",
    },
    {
      id: "605c72f19e7b8a3f7c0f3d68",
      name: "GraphQL",
      description: "A query language for APIs.",
    },
    {
      id: "605c72f19e7b8a3f7c0f3d69",
      name: "Pagination",
      description: "The process of dividing content into pages.",
    },
    {
      id: "605c72f19e7b8a3f7c0f3d6a",
      name: "ApiDesign",
      description: "The structure and architecture of APIs.",
    },
    {
      id: "605c72f19e7b8a3f7c0f3d6b",
      name: "Docker",
      description:
        "A platform for developing, shipping, and running applications in containers.",
    },
    {
      id: "605c72f19e7b8a3f7c0f3d6c",
      name: "Kubernetes",
      description:
        "An orchestration tool for managing containerized applications.",
    },
    {
      id: "605c72f19e7b8a3f7c0f3d6d",
      name: "Containers",
      description:
        "Lightweight, portable, and self-sufficient software packages.",
    },
    {
      id: "605c72f19e7b8a3f7c0f3d6e",
      name: "Angular",
      description:
        "A platform for building mobile and desktop web applications.",
    },
    {
      id: "605c72f19e7b8a3f7c0f3d6f",
      name: "Architecture",
      description: "The overall design and structure of a system.",
    },
    {
      id: "605c72f19e7b8a3f7c0f3d70",
      name: "ProjectStructure",
      description: "The organization of files and directories in a project.",
    },
    {
      id: "605c72f19e7b8a3f7c0f3d71",
      name: "CICD",
      description:
        "Continuous Integration and Continuous Deployment practices.",
    },
    {
      id: "605c72f19e7b8a3f7c0f3d72",
      name: "Automation",
      description:
        "Using technology to perform tasks with minimal human intervention.",
    },
    {
      id: "605c72f19e7b8a3f7c0f3d73",
      name: "Security",
      description: "Protecting systems against threats and vulnerabilities.",
    },
    {
      id: "605c72f19e7b8a3f7c0f3d74",
      name: "Scaling",
      description: "Adjusting resources to handle increased load.",
    },
    {
      id: "605c72f19e7b8a3f7c0f3d75",
      name: "Microservices",
      description:
        "Architectural style that structures an application as a collection of loosely coupled services.",
    },
    {
      id: "605c72f19e7b8a3f7c0f3d76",
      name: "AWS",
      description:
        "Amazon Web Services, a comprehensive cloud computing platform.",
    },
    {
      id: "605c72f19e7b8a3f7c0f3d77",
      name: "OAuth",
      description: "An open standard for access delegation.",
    },
    {
      id: "605c72f19e7b8a3f7c0f3d78",
      name: "Flask",
      description: "A micro web framework for Python.",
    },
    {
      id: "605c72f19e7b8a3f7c0f3d79",
      name: "Production",
      description: "The environment where applications are run for end users.",
    },
    {
      id: "605c72f19e7b8a3f7c0f3d7a",
      name: "Deployment",
      description:
        "The process of making a software application available for use.",
    },
    {
      id: "605c72f19e7b8a3f7c0f3d7b",
      name: "Optimization",
      description: "The process of making a system as effective as possible.",
    },
    {
      id: "605c72f19e7b8a3f7c0f3d7c",
      name: "Django",
      description:
        "A high-level Python web framework that encourages rapid development.",
    },
    {
      id: "605c72f19e7b8a3f7c0f3d7d",
      name: "SASS",
      description: "A preprocessor scripting language for CSS.",
    },
    {
      id: "605c72f19e7b8a3f7c0f3d7e",
      name: "AWSLambda",
      description:
        "A serverless compute service that runs code in response to events.",
    },
    {
      id: "605c72f19e7b8a3f7c0f3d7f",
      name: "Serverless",
      description: "A cloud-computing model that abstracts server management.",
    },
    {
      id: "605c72f19e7b8a3f7c0f3d80",
      name: "Python",
      description:
        "A high-level programming language known for its readability.",
    },
    {
      id: "605c72f19e7b8a3f7c0f3d81",
      name: "SchemaDesign",
      description: "The structure of a database and how data is organized.",
    },
    {
      id: "605c72f19e7b8a3f7c0f3d82",
      name: "CSS",
      description:
        "A style sheet language used for describing the presentation of a document.",
    },
  ];

  const tags: Tag[] = [];
  for (const data of TAG_DATAS) {
    const tag = await prisma.tag.create({
      data: {
        id: data.id,
        name: data.name,
      },
    });
    tags.push(tag);
  }

  /* ---------------------------------------------------------------- */
  /*                         create questions                         */
  /* ---------------------------------------------------------------- */
  enum QuestionEnum {
    Q0 = "507f1f77bcf86cd799439011",
    Q1 = "507f1f77bcf86cd799439012",
    Q2 = "507f1f77bcf86cd799439013",
    Q3 = "507f1f77bcf86cd799439014",
    Q4 = "507f1f77bcf86cd799439015",
    Q5 = "507f1f77bcf86cd799439016",
    Q6 = "507f1f77bcf86cd799439017",
    Q7 = "507f1f77bcf86cd799439018",
    Q8 = "507f1f77bcf86cd799439019",
    Q9 = "507f1f77bcf86cd79943901a",
    Q10 = "507f1f77bcf86cd79943901b",
    Q11 = "507f1f77bcf86cd79943901c",
    Q12 = "507f1f77bcf86cd79943901d",
    Q13 = "507f1f77bcf86cd79943901e",
    Q14 = "507f1f77bcf86cd79943901f",
    Q15 = "507f1f77bcf86cd799439020",
    Q16 = "507f1f77bcf86cd799439021",
    Q17 = "507f1f77bcf86cd799439022",
    Q18 = "507f1f77bcf86cd799439023",
    Q19 = "507f1f77bcf86cd799439024",
    Q20 = "507f1f77bcf86cd799439025",
    Q21 = "507f1f77bcf86cd799439026",
    Q22 = "507f1f77bcf86cd799439027",
    Q23 = "507f1f77bcf86cd799439028",
    Q24 = "507f1f77bcf86cd799439029",
    Q25 = "507f1f77bcf86cd79943902a",
    Q26 = "507f1f77bcf86cd79943902b",
    Q27 = "507f1f77bcf86cd79943902c",
  }

  const QUESTION_DATAS = [
    {
      id: "507f1f77bcf86cd799439011",
      title: "How to deploy a React app to Netlify?",
      content:
        "<p>What steps are required to deploy a React application on Netlify?</p>",
      views: 120,
      authorId: pickRandom(questionUsers),
      tags: [TagEnum.React, TagEnum.Netlify, TagEnum.SASS],
      // savedByIds: [],
      // upvotedByIds: [],
      // downvotedByIds: [],
    },
    {
      id: "507f1f77bcf86cd799439012",
      title: "Best practices for MongoDB indexing?",
      content:
        "<p>How can I optimize MongoDB queries with proper indexing techniques?</p>",
      views: 340,
      authorId: pickRandom(questionUsers),
      tags: [TagEnum.MongoDB, TagEnum.Database],
      // savedByIds: [],
      // upvotedByIds: [],
      // downvotedByIds: [],
    },
    {
      id: "507f1f77bcf86cd799439013",
      title: "How to secure a Node.js API with JWT?",
      content:
        "<p>What is the best way to implement JWT authentication in a Node.js API?</p>",
      views: 410,
      authorId: pickRandom(questionUsers),
      tags: [TagEnum.NodeJs, TagEnum.JWT, TagEnum.Authentication],
      // savedByIds: [],
      // upvotedByIds: [],
      // downvotedByIds: [],
    },
    {
      id: "507f1f77bcf86cd799439014",
      title: "Managing global state with Redux?",
      content:
        "<p>How do I manage global state efficiently in a large-scale React application using Redux?</p>",
      views: 230,
      authorId: pickRandom(questionUsers),
      tags: [TagEnum.React, TagEnum.Redux],
      // savedByIds: [],
      // upvotedByIds: [],
      // downvotedByIds: [],
    },
    {
      id: "507f1f77bcf86cd799439015",
      title: "Handling concurrency in Node.js applications?",
      content:
        "<p>What are the best practices for handling concurrent requests in a Node.js application?</p>",
      views: 320,
      authorId: pickRandom(questionUsers),
      tags: [TagEnum.NodeJs, TagEnum.Concurrency, TagEnum.Performance],
      // savedByIds: [],
      // upvotedByIds: [],
      // downvotedByIds: [],
    },
    {
      id: "507f1f77bcf86cd799439016",
      title: "How to set up a TypeScript project for Node.js?",
      content:
        "<p>What are the necessary steps to configure a TypeScript project for Node.js development?</p>",
      views: 250,
      authorId: pickRandom(questionUsers),
      tags: [TagEnum.TypeScript, TagEnum.NodeJs, TagEnum.ProjectSetup],
      // savedByIds: [],
      // upvotedByIds: [],
      // downvotedByIds: [],
    },
    {
      id: "507f1f77bcf86cd799439017",
      title: "How to implement pagination in GraphQL?",
      content:
        "<p>What is the best way to implement pagination for queries in GraphQL?</p>",
      views: 470,
      authorId: pickRandom(questionUsers),
      tags: [TagEnum.GraphQL, TagEnum.Python, TagEnum.Pagination],
      // savedByIds: [],
      // upvotedByIds: [],
      // downvotedByIds: [],
    },
    {
      id: "507f1f77bcf86cd799439018",
      title: "What is the difference between Docker and Kubernetes?",
      content:
        "<p>Can someone explain the key differences between Docker and Kubernetes in managing containers?</p>",
      views: 540,
      authorId: pickRandom(questionUsers),
      tags: [TagEnum.Docker, TagEnum.Kubernetes, TagEnum.Containers],
      // savedByIds: [],
      // upvotedByIds: [],
      // downvotedByIds: [],
    },
    {
      id: "507f1f77bcf86cd799439019",
      title: "How to structure a large-scale Angular application?",
      content:
        "<p>What is the recommended approach to structure a large-scale Angular application for maintainability?</p>",
      views: 330,
      authorId: pickRandom(questionUsers),
      tags: [TagEnum.Angular, TagEnum.ProjectStructure, TagEnum.Architecture],
    },
    {
      id: "507f1f77bcf86cd79943901a",
      title: "How to set up a CI/CD pipeline for Node.js?",
      content:
        "<p>What are the best practices to set up a continuous integration and deployment pipeline for Node.js applications?</p>",
      views: 670,
      authorId: pickRandom(questionUsers),
      tags: [TagEnum.NodeJs, TagEnum.CICD, TagEnum.Deployment],
    },
    {
      id: "507f1f77bcf86cd79943901b",
      title: "What are the benefits of using TypeScript in large projects?",
      content:
        "<p>Why should I consider using TypeScript for larger codebases?</p>",
      views: 170,
      authorId: pickRandom(questionUsers),
      tags: [TagEnum.TypeScript, TagEnum.ProjectSetup],
    },
    {
      id: "507f1f77bcf86cd79943901c",
      title: "How to secure JWT tokens in a web app?",
      content:
        "<p>What are the key considerations for securing JWT tokens in a web application?</p>",
      views: 360,
      authorId: pickRandom(questionUsers),
      tags: [TagEnum.JWT, TagEnum.Security, TagEnum.Authentication],
    },
    {
      id: "507f1f77bcf86cd79943901d",
      title: "How to implement GraphQL in an existing REST API?",
      content: "<p>What are the steps for migrating a REST API to GraphQL?</p>",
      views: 260,
      authorId: pickRandom(questionUsers),
      tags: [TagEnum.GraphQL, TagEnum.ApiDesign],
    },
    {
      id: "507f1f77bcf86cd79943901e",
      title: "Scaling Node.js applications with Kubernetes?",
      content:
        "<p>What are the best practices for scaling Node.js applications using Kubernetes?</p>",
      views: 280,
      authorId: pickRandom(questionUsers),
      tags: [TagEnum.NodeJs, TagEnum.Kubernetes, TagEnum.Scaling],
    },
    {
      id: "507f1f77bcf86cd79943901f",
      title: "How to use Docker in microservices architecture?",
      content:
        "<p>What are the key considerations for using Docker in a microservices-based architecture?</p>",
      views: 340,
      authorId: pickRandom(questionUsers),
      tags: [TagEnum.Docker, TagEnum.Microservices, TagEnum.Containers],
    },
    {
      id: "507f1f77bcf86cd799439020",
      title: "Best practices for securing AWS resources?",
      content:
        "<p>What are the top security practices when working with AWS?</p>",
      views: 240,
      authorId: pickRandom(questionUsers),
      tags: [TagEnum.AWS, TagEnum.Security],
    },
    {
      id: "507f1f77bcf86cd799439021",
      title: "How to automate deployments using CI/CD pipelines?",
      content:
        "<p>What are the best tools and techniques for automating deployments using CI/CD?</p>",
      views: 230,
      authorId: pickRandom(questionUsers),
      tags: [TagEnum.CICD, TagEnum.Automation, TagEnum.Deployment],
    },
    {
      id: "507f1f77bcf86cd799439022",
      title: "How to optimize React app performance?",
      content:
        "<p>What techniques can be employed to enhance the performance of a React app?</p>",
      views: 190,
      authorId: pickRandom(questionUsers),
      tags: [TagEnum.React, TagEnum.Performance, TagEnum.Optimization],
    },
    {
      id: "507f1f77bcf86cd799439023",
      title: "How to integrate third-party APIs in a React app?",
      content:
        "<p>What is the best way to integrate third-party APIs into a React application?</p>",
      views: 360,
      authorId: pickRandom(questionUsers),
      tags: [TagEnum.React, TagEnum.ApiDesign],
    },
    {
      id: "507f1f77bcf86cd799439024",
      title: "How to securely store JWT tokens?",
      content:
        "<p>What is the best way to securely store JWT tokens in a web or mobile application?</p>",
      views: 370,
      authorId: pickRandom(questionUsers),
      tags: [TagEnum.JWT, TagEnum.Security],
    },
    {
      id: "507f1f77bcf86cd799439025",
      title: "How to use AWS Lambda with Django?",
      content:
        "<p>What is the best way to integrate AWS Lambda functions into a Django project?</p>",
      views: 190,
      authorId: pickRandom(questionUsers),
      tags: [TagEnum.AWS, TagEnum.AWSLambda, TagEnum.Django],
    },
    {
      id: "507f1f77bcf86cd799439026",
      title: "How to use Python with GraphQL?",
      content:
        "<p>What is the recommended way to implement GraphQL in a Python-based web application?</p>",
      views: 250,
      authorId: pickRandom(questionUsers),
      tags: [TagEnum.Python, TagEnum.GraphQL],
    },
    {
      id: "507f1f77bcf86cd799439027",
      title: "How to manage state in a Redux-based application?",
      content:
        "<p>What are the best practices for managing state in a complex Redux-based application?</p>",
      views: 410,
      authorId: pickRandom(questionUsers),
      tags: [TagEnum.Redux, TagEnum.StateManagement],
    },
    {
      id: "507f1f77bcf86cd799439028",
      title: "How to containerize a Flask app using Docker?",
      content:
        "<p>What is the process of creating a Docker container for a Flask application?</p>",
      views: 220,
      authorId: pickRandom(questionUsers),
      tags: [TagEnum.Flask, TagEnum.Docker, TagEnum.Containers],
    },
    {
      id: "507f1f77bcf86cd799439029",
      title: "How to optimize MongoDB schemas?",
      content:
        "<p>What are the best strategies to optimize MongoDB schemas for high-performance queries?</p>",
      views: 290,
      authorId: pickRandom(questionUsers),
      tags: [TagEnum.MongoDB, TagEnum.SchemaDesign, TagEnum.Database],
    },
    {
      id: "507f1f77bcf86cd79943902a",
      title: "How to optimize GraphQL queries for better performance?",
      content:
        "<p>What techniques can be used to optimize GraphQL queries?</p>",
      views: 280,
      authorId: pickRandom(questionUsers),
      tags: [TagEnum.GraphQL, TagEnum.Optimization],
    },
    {
      id: "507f1f77bcf86cd79943902b",
      title: "How to structure a large-scale SASS project?",
      content:
        "<p>What are the recommended best practices for structuring a large-scale SASS project for maintainability?</p>",
      views: 340,
      authorId: pickRandom(questionUsers),
      tags: [TagEnum.SASS, TagEnum.ProjectStructure, TagEnum.CSS],
    },
    {
      id: "507f1f77bcf86cd79943902c",
      title: "Best practices for handling concurrency in Kubernetes?",
      content:
        "<p>What are the best practices for managing concurrency and scaling in a Kubernetes-based infrastructure?</p>",
      views: 410,
      authorId: pickRandom(questionUsers),
      tags: [TagEnum.Kubernetes, TagEnum.Concurrency, TagEnum.Scaling],
    },
  ];

  const questions: Question[] = [];
  for (const data of QUESTION_DATAS) {
    const question = await prisma.question.create({
      data: {
        id: data.id,
        title: data.title,
        content: data.content,
        authorId: data.authorId.id,
        tags: {
          connect: data.tags.map((id) => ({ id: id })),
        },
      },
    });
    questions.push(question);
  }

  /* ---------------------------------------------------------------- */
  /*                           create answer                          */
  /* ---------------------------------------------------------------- */
  const ANSWER_DATAS = [
    {
      id: "67081df118a54aa5bf02d7b3",
      content:
        "<p>To deploy a React app on Netlify, first create a build of your app using `npm run build`. Then, log in to your Netlify account, click 'New site from Git', and connect your repository. Choose the branch to deploy and set the build command to `npm run build` and the publish directory to `build`. Finally, click 'Deploy site' to finish.</p>",

      questionId: QuestionEnum.Q0,
    },
    {
      id: "67081e67a613a21f86179440",
      content:
        "<p>You can also deploy your React app on Netlify by dragging and dropping your build folder into the Netlify dashboard. This is a quick way to deploy without setting up a Git repository. Just make sure your app runs correctly by testing it locally first.</p>",
      questionId: QuestionEnum.Q0,
    },
    {
      id: "67081e817d9817b77f56003f",
      content:
        "<p>To optimize MongoDB queries, you should create indexes on fields that are frequently queried, such as those used in filters and sorts. Compound indexes can also be useful when you need to query multiple fields. Monitor your query performance using the `explain()` method to identify which queries would benefit from indexing.</p>",
      questionId: QuestionEnum.Q1,
    },
    {
      id: "67081e92c3cf6c6f5b42c3b6",
      content:
        "<p>It's important to keep in mind that while indexes can speed up read operations, they can also slow down write operations. Therefore, you should only index fields that are critical for performance. Additionally, consider using TTL (Time-To-Live) indexes for data that only needs to be retained for a specific duration.</p>",
      questionId: QuestionEnum.Q1,
    },
    {
      id: "67081ea73c8bd3d4ff6ae1b6",
      content:
        "<p>Regularly analyze your indexes and remove any that are unused to reduce storage costs and improve performance. Use the `db.collection.getIndexes()` method to review existing indexes and assess their usage with the help of the query profiler to understand the impact on performance.</p>",
      questionId: QuestionEnum.Q1,
    },
    {
      id: "67081ebbde23aaccffa9ab09",
      content:
        "<p>To implement JWT authentication in a Node.js API, start by installing the `jsonwebtoken` package. First, create a login route that verifies user credentials and, upon successful authentication, generates a JWT using `jsonwebtoken.sign()`, including a secret key and user information. Send this token back to the client. For protected routes, use middleware to verify the token with `jsonwebtoken.verify()`. Ensure that you handle token expiration and refresh tokens appropriately for enhanced security.</p>",
      questionId: QuestionEnum.Q2,
    },
  ];

  const answers: Answer[] = [];
  for (const data of ANSWER_DATAS) {
    const question = await prisma.answer.create({
      data: {
        id: data.id,
        content: data.content,
        authorId: pickRandom(answerUsers).id,
        questionId: data.questionId,
      },
    });
    answers.push(question);
  }
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

function pickRandom<T>(items: T[]): T {
  if (items.length === 0) throw new Error("pick on empty array");
  const index = Math.floor(Math.random() * items.length);
  return items[index]!;
}
