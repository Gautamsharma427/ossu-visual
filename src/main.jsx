import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const SOURCE = 'https://github.com/ossu/computer-science';

const curriculum = [
  {
    id:'intro', phase:'Intro CS', tone:'green', icon:'✦', required:true,
    description:'Try computer science, computation, imperative programming, and basic data structures and algorithms.',
    topics:['computation','imperative programming','basic data structures and algorithms','and more'],
    courses:[
      {id:'intro-python',title:'Introduction to Computer Science and Programming using Python',provider:'MIT Open Learning',duration:'14 weeks',effort:'6–10 hours/week',prerequisites:'High school algebra',discussion:'https://discord.gg/jvchSm9',url:'https://ocw.mit.edu/courses/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/pages/material-by-lecture/',required:true}
    ]
  },
  {id:'core-programming',phase:'Core Programming',tone:'blue',icon:'</>',required:true,description:'Programming paradigms, testing, requirements, design patterns, OOP, static/dynamic typing and multiple language families.',topics:['functional programming','design for testing','program requirements','common design patterns','unit testing','object-oriented design','static typing','dynamic typing','Standard ML','Racket','Ruby','and more'],courses:[
    {id:'spd',title:'Systematic Program Design',provider:'UBC / edX',duration:'13 weeks',effort:'8–10 hours/week',prerequisites:'None',discussion:'https://discord.gg/RfqAmGJ',url:'https://www.edx.org/learn/coding/university-of-british-columbia-how-to-code-simple-data',required:true,notes:'Work through the archived course sequence and required projects as described by OSSU.'},
    {id:'class-based',title:'Class-based Program Design',provider:'UBC / edX',duration:'13 weeks',effort:'5–10 hours/week',prerequisites:'Systematic Program Design, High School Math',discussion:'https://discord.com/channels/744385009028431943/891411727294562314',url:'https://www.edx.org/learn/coding/university-of-british-columbia-how-to-code-complex-data',required:true},
    {id:'pl',title:'Programming Languages',provider:'University of Washington',duration:'11 weeks',effort:'4–8 hours/week',prerequisites:'Systematic Program Design',discussion:'https://discord.gg/8BkJtXN',url:'https://courses.cs.washington.edu/courses/cse341/19sp/#lectures',required:true},
    {id:'ood',title:'Object-Oriented Design',provider:'Northeastern University',duration:'13 weeks',effort:'5–10 hours/week',prerequisites:'Class-based Program Design',discussion:'https://discord.com/channels/744385009028431943/891412022120579103',url:'https://course.ccs.neu.edu/cs3500f19/',required:true},
    {id:'architecture',title:'Software Architecture',provider:'Coursera',duration:'4 weeks',effort:'2–5 hours/week',prerequisites:'Object-Oriented Design',discussion:'https://discord.com/channels/744385009028431943/891412169638432788',url:'https://www.coursera.org/learn/software-architecture',required:true}
  ]},
  {id:'core-math',phase:'Core Math',tone:'violet',icon:'∑',required:true,description:'Mathematical maturity for computing: calculus, discrete mathematics, proofs, probability, statistics and asymptotic reasoning.',topics:['discrete mathematics','mathematical proofs','basic statistics','O-notation','discrete probability','and more'],courses:[
    {id:'calc1a',title:'Calculus 1A: Differentiation',provider:'MITx',duration:'13 weeks',effort:'6–10 hours/week',prerequisites:'High school math',discussion:'https://discord.gg/mPCt45F',url:'https://openlearninglibrary.mit.edu/courses/course-v1:MITx+18.01.1x+2T2019/about',alternative:'https://ocw.mit.edu/courses/mathematics/18-01sc-single-variable-calculus-fall-2010/index.htm',required:true,notes:'The alternate MIT OCW course covers this and the following two calculus courses.'},
    {id:'calc1b',title:'Calculus 1B: Integration',provider:'MITx',duration:'13 weeks',effort:'5–10 hours/week',prerequisites:'Calculus 1A',discussion:'https://discord.gg/sddAsZg',url:'https://openlearninglibrary.mit.edu/courses/course-v1:MITx+18.01.2x+3T2019/about',required:true},
    {id:'calc1c',title:'Calculus 1C: Coordinate Systems & Infinite Series',provider:'MITx',duration:'6 weeks',effort:'5–10 hours/week',prerequisites:'Calculus 1B',discussion:'https://discord.gg/FNEcNNq',url:'https://openlearninglibrary.mit.edu/courses/course-v1:MITx+18.01.3x+1T2020/about',required:true},
    {id:'mathcs',title:'Mathematics for Computer Science',provider:'MIT Open Learning Library',duration:'13 weeks',effort:'5 hours/week',prerequisites:'Calculus 1C',discussion:'https://discord.gg/EuTzNbF',url:'https://openlearninglibrary.mit.edu/courses/course-v1:OCW+6.042J+2T2019/about',alternative:'https://ocw.mit.edu/courses/6-042j-mathematics-for-computer-science-fall-2010/',required:true,notes:'OSSU lists community solution sets for multiple course years.'}
  ]},
  {id:'tools',phase:'CS Tools',tone:'cyan',icon:'⌘',required:true,description:'The practical tooling layer: terminals, shell scripting, Vim, command-line environments, version control and more.',topics:['terminals and shell scripting','vim','command line environments','version control','and more'],courses:[
    {id:'missing-semester',title:'The Missing Semester of Your CS Education',provider:'MIT',duration:'2 weeks',effort:'12 hours/week',prerequisites:'None',discussion:'https://discord.gg/5FvKycS',url:'https://missing.csail.mit.edu/',required:true}
  ]},
  {id:'systems',phase:'Core Systems',tone:'orange',icon:'◈',required:true,description:'From logic gates and memory to machine language, virtual machines, operating systems and network protocols.',topics:['procedural programming','manual memory management','boolean algebra','gate logic','memory','computer architecture','assembly','machine language','virtual machines','high-level languages','compilers','operating systems','network protocols','and more'],courses:[
    {id:'nand1',title:'Build a Modern Computer from First Principles: From Nand to Tetris',provider:'Coursera / Nand2Tetris',duration:'6 weeks',effort:'7–13 hours/week',prerequisites:'C-like programming language',discussion:'https://discord.gg/vxB2DRV',url:'https://www.coursera.org/learn/build-a-computer',alternative:'https://www.nand2tetris.org/',required:true},
    {id:'nand2',title:'Build a Modern Computer from First Principles: Nand to Tetris Part II',provider:'Coursera / Nand2Tetris',duration:'6 weeks',effort:'12–18 hours/week',prerequisites:'One of the listed programming languages; Nand to Tetris Part I',discussion:'https://discord.gg/AsUXcPu',url:'https://www.coursera.org/learn/nand2tetris2',required:true},
    {id:'ostep',title:'Operating Systems: Three Easy Pieces',provider:'OSTEP',duration:'10–12 weeks',effort:'6–10 hours/week',prerequisites:'Nand to Tetris Part II',discussion:'https://discord.gg/wZNgpep',url:'https://pages.cs.wisc.edu/~remzi/OSTEP/',required:true},
    {id:'networking',title:'Computer Networking: a Top-Down Approach',provider:'UMass Amherst / Kurose & Ross',duration:'8 weeks',effort:'4–12 hours/week',prerequisites:'Algebra, probability, basic CS',discussion:'https://discord.gg/MJ9YXyV',url:'https://gaia.cs.umass.edu/kurose_ross/online_lectures.htm',alternative:'https://gaia.cs.umass.edu/kurose_ross/wireshark.php',required:true,notes:'Wireshark labs are listed as additional assignments.'}
  ]},
  {id:'theory',phase:'Core Theory',tone:'pink',icon:'λ',required:true,description:'Algorithms and problem solving: divide and conquer, graphs, shortest paths, greedy methods, dynamic programming and NP-completeness.',topics:['divide and conquer','sorting and searching','randomized algorithms','graph search','shortest paths','data structures','greedy algorithms','minimum spanning trees','dynamic programming','NP-completeness','and more'],courses:[
    {id:'alg1',title:'Algorithms: Design and Analysis, Part 1',provider:'Stanford / edX',duration:'8 weeks',effort:'4–8 hours/week',prerequisites:'Any programming language, Mathematics for Computer Science',discussion:'https://discord.gg/mKRS7tY',url:'https://www.edx.org/learn/algorithms/stanford-university-algorithms-design-and-analysis-part-1',alternative:'https://www.algorithmsilluminated.org/',required:true},
    {id:'alg2',title:'Algorithms: Design and Analysis, Part 2',provider:'Stanford / edX',duration:'8 weeks',effort:'4–8 hours/week',prerequisites:'Algorithms Part 1',discussion:'https://discord.gg/Qstqe4t',url:'https://www.edx.org/learn/algorithms/stanford-university-algorithms-design-and-analysis-part-2',required:true}
  ]},
  {id:'security',phase:'Core Security',tone:'red',icon:'⌾',required:true,description:'Confidentiality, integrity, availability, secure design, defensive programming, threats, network security and cryptography.',topics:['Confidentiality, Integrity, Availability','secure design','defensive programming','threats and attacks','network security','cryptography','and more'],courses:[
    {id:'cyber',title:'Cybersecurity Fundamentals',provider:'RIT / edX',duration:'8 weeks',effort:'10–12 hours/week',prerequisites:'None',discussion:'https://discord.gg/XdY3AwTFK4',url:'https://www.edx.org/learn/cybersecurity/rochester-institute-of-technology-cybersecurity-fundamentals',required:true},
    {id:'secure-code',title:'Principles of Secure Coding',provider:'Coursera',duration:'4 weeks',effort:'4 hours/week',prerequisites:'None',discussion:'https://discord.gg/5gMdeSK',url:'https://www.coursera.org/learn/secure-coding-principles',required:true},
    {id:'vuln',title:'Identifying Security Vulnerabilities',provider:'Coursera',duration:'4 weeks',effort:'4 hours/week',prerequisites:'None',discussion:'https://discord.gg/V78MjUS',url:'https://www.coursera.org/learn/identifying-security-vulnerabilities',required:true},
    {id:'vuln-c',title:'Identifying Security Vulnerabilities in C/C++ Programming',provider:'Coursera',duration:'4 weeks',effort:'5 hours/week',prerequisites:'None',discussion:'https://discord.gg/Vbxce7A',url:'https://www.coursera.org/learn/identifying-security-vulnerabilities-c-programming',required:false,choiceGroup:'Choose one vulnerability course'},
    {id:'vuln-java',title:'Exploiting and Securing Vulnerabilities in Java Applications',provider:'Coursera',duration:'4 weeks',effort:'5 hours/week',prerequisites:'None',discussion:'https://discord.gg/QxC22rR',url:'https://www.coursera.org/learn/exploiting-securing-vulnerabilities-java-applications',required:false,choiceGroup:'Choose one vulnerability course'}
  ]},
  {id:'applications',phase:'Core Applications',tone:'teal',icon:'▣',required:true,description:'Apply CS to databases, machine learning, computer graphics and software engineering.',topics:['Agile methodology','REST','software specifications','refactoring','relational databases','transaction processing','data modeling','neural networks','supervised learning','unsupervised learning','OpenGL','ray tracing','and more'],courses:[
    {id:'db-model',title:'Databases: Modeling and Theory',provider:'Stanford / edX',duration:'2 weeks',effort:'10 hours/week',prerequisites:'Core programming',discussion:'https://discord.gg/pMFqNf4',url:'https://www.edx.org/learn/databases/stanford-university-databases-modeling-and-theory',required:true},
    {id:'db-sql',title:'Databases: Relational Databases and SQL',provider:'Stanford / edX',duration:'2 weeks',effort:'10 hours/week',prerequisites:'Core programming',discussion:'https://discord.gg/P8SPPyF',url:'https://www.edx.org/learn/relational-databases/stanford-university-databases-relational-databases-and-sql',required:true},
    {id:'db-semi',title:'Databases: Semistructured Data',provider:'Stanford / edX',duration:'2 weeks',effort:'10 hours/week',prerequisites:'Core programming',discussion:'https://discord.gg/duCJ3GN',url:'https://www.edx.org/learn/relational-databases/stanford-university-databases-semistructured-data',required:true},
    {id:'ml',title:'Machine Learning',provider:'DeepLearning.AI',duration:'11 weeks',effort:'9 hours/week',prerequisites:'Basic coding',discussion:'https://discord.gg/NcXHDjy',url:'https://www.deeplearning.ai/courses/machine-learning-specialization/',required:true},
    {id:'graphics',title:'Computer Graphics',provider:'UC San Diego / edX',duration:'6 weeks',effort:'12 hours/week',prerequisites:'C++ or Java, Basic Linear Algebra',discussion:'https://discord.gg/68WqMNV',url:'https://www.edx.org/learn/computer-graphics/the-university-of-california-san-diego-computer-graphics',alternative:'https://cseweb.ucsd.edu/~viscomp/classes/cse167/wi22/schedule.html',required:true},
    {id:'se',title:'Software Engineering: Introduction',provider:'UBC / edX',duration:'6 weeks',effort:'8–10 hours/week',prerequisites:'Core Programming and a sizable project',discussion:'https://discord.gg/5Qtcwtz',url:'https://www.edx.org/learn/software-engineering/university-of-british-columbia-software-engineering-introduction',alternative:'https://github.com/ubccpsc/310/blob/main/resources/README.md',required:true}
  ]},
  {id:'ethics',phase:'Core Ethics',tone:'gold',icon:'⚖',required:true,description:'Social context, analytical tools, professional ethics, intellectual property, privacy and civil liberties.',topics:['social context','analytical tools','professional ethics','intellectual property','privacy and civil liberties','and more'],courses:[
    {id:'ethics-tech',title:'Ethics, Technology and Engineering',provider:'Coursera',duration:'9 weeks',effort:'2 hours/week',prerequisites:'None',discussion:'https://discord.gg/6ttjPmzZbe',url:'https://www.coursera.org/learn/ethics-technology-engineering',required:true},
    {id:'ip',title:'Introduction to Intellectual Property',provider:'Coursera',duration:'4 weeks',effort:'2 hours/week',prerequisites:'None',discussion:'https://discord.gg/YbuERswpAK',url:'https://www.coursera.org/learn/introduction-intellectual-property',required:true},
    {id:'privacy',title:'Data Privacy Fundamentals',provider:'Northeastern / Coursera',duration:'3 weeks',effort:'3 hours/week',prerequisites:'None',discussion:'https://discord.gg/64J34ajNBd',url:'https://www.coursera.org/learn/northeastern-data-privacy',required:true}
  ]},
  {id:'adv-programming',phase:'Advanced Programming',tone:'purple',icon:'↯',required:false,description:'Elective specialization in debugging, parallel computing, programming paradigms, testing and large-scale design.',topics:['debugging theory and practice','goal-oriented programming','parallel computing','object-oriented analysis and design','UML','large-scale software architecture and design','and more'],courses:[
    {id:'parallel',title:'Parallel Programming',provider:'Coursera',duration:'4 weeks',effort:'6–8 hours/week',prerequisites:'Scala programming',url:'https://www.coursera.org/learn/scala-parallel-programming'},
    {id:'compilers',title:'Compilers',provider:'Stanford / edX',duration:'9 weeks',effort:'6–8 hours/week',prerequisites:'None',url:'https://www.edx.org/learn/computer-science/stanford-university-compilers'},
    {id:'haskell',title:'Introduction to Haskell',provider:'University of Pennsylvania',duration:'14 weeks',effort:'—',prerequisites:'None',url:'https://www.seas.upenn.edu/~cis194/fall16/'},
    {id:'prolog',title:'Learn Prolog Now!',provider:'University of Groningen',duration:'12 weeks',effort:'—',prerequisites:'None',url:'https://www.let.rug.nl/bos/lpn//lpnpage.php?pageid=online',alternative:'https://github.com/ossu/computer-science/files/6085884/lpn.pdf',notes:'The book is by Blackburn, Bos and Striegnitz and is redistributed under a CC license.'},
    {id:'debugging',title:'Software Debugging',provider:'University of Saarland / YouTube',duration:'8 weeks',effort:'6 hours/week',prerequisites:'Python, object-oriented programming',url:'https://www.youtube.com/playlist?list=PLAwxTw4SYaPkxK63TiT88oEe-AIBhr96A'},
    {id:'testing',title:'Software Testing',provider:'University of Saarland / YouTube',duration:'4 weeks',effort:'6 hours/week',prerequisites:'Python, programming experience',url:'https://www.youtube.com/playlist?list=PLAwxTw4SYaPkWVHeC_8aSIbSxE_NXI76g'}
  ]},
  {id:'adv-systems',phase:'Advanced Systems',tone:'orange',icon:'▤',required:false,description:'Digital signaling, circuits, processor architecture, caches, pipelining, virtualization, parallel processing and synchronization.',topics:['digital signaling','combinational logic','CMOS technologies','sequential logic','finite state machines','processor instruction sets','caches','pipelining','virtualization','parallel processing','virtual memory','synchronization primitives','system call interface','and more'],courses:[
    {id:'comp-structures1',title:'Computation Structures 1: Digital Circuits',provider:'MITx',duration:'10 weeks',effort:'6 hours/week',prerequisites:'Nand2Tetris II',url:'https://learning.edx.org/course/course-v1:MITx+6.004.1x_3+3T2016',alternatives:['https://ocw.mit.edu/courses/6-004-computation-structures-spring-2017/','https://ocw.mit.edu/courses/6-004-computation-structures-spring-2009/'],notes:'Alternate links contain all three courses.'},
    {id:'comp-structures2',title:'Computation Structures 2: Computer Architecture',provider:'MITx',duration:'10 weeks',effort:'6 hours/week',prerequisites:'Computation Structures 1',url:'https://learning.edx.org/course/course-v1:MITx+6.004.2x+3T2015'},
    {id:'comp-structures3',title:'Computation Structures 3: Computer Organization',provider:'MITx',duration:'10 weeks',effort:'6 hours/week',prerequisites:'Computation Structures 2',url:'https://learning.edx.org/course/course-v1:MITx+6.004.3x_2+1T2017'}
  ]},
  {id:'adv-theory',phase:'Advanced Theory',tone:'pink',icon:'Ω',required:false,description:'Formal languages, Turing machines, computability, concurrency, distributed systems, computational geometry and game theory.',topics:['formal languages','Turing machines','computability','event-driven concurrency','automata','distributed shared memory','consensus algorithms','state machine replication','computational geometry theory','propositional logic','relational logic','Herbrand logic','game trees','and more'],courses:[
    {id:'toc',title:'Theory of Computation',provider:'MIT OpenCourseWare',duration:'13 weeks',effort:'10 hours/week',prerequisites:'Mathematics for Computer Science, logic, algorithms',url:'https://ocw.mit.edu/courses/18-404j-theory-of-computation-fall-2020/',alternative:'https://www.youtube.com/playlist?list=PLEE7DF8F5E0203A56'},
    {id:'geometry',title:'Computational Geometry',provider:'Tsinghua / edX',duration:'16 weeks',effort:'8 hours/week',prerequisites:'Algorithms, C++',url:'https://www.edx.org/learn/geometry/tsinghua-university-ji-suan-ji-he-computational-geometry'},
    {id:'game-theory',title:'Algorithmic Game Theory',provider:'Tim Roughgarden',duration:'10 weeks',effort:'12 hours/week',prerequisites:'Core Theory',url:'https://timroughgarden.org/f13/f13.html'}
  ]},
  {id:'adv-security',phase:'Advanced Information Security',tone:'red',icon:'⌁',required:false,description:'Web security, governance, forensics and secure software development across the lifecycle.',topics:['web security','security governance','compliance','digital forensics','secure requirements','secure design','secure implementation','verification','specialized topics'],courses:[
    {id:'websec',title:'Web Security Fundamentals',provider:'KU Leuven / edX',duration:'5 weeks',effort:'4–6 hours/week',prerequisites:'Understanding basic web technologies',url:'https://www.edx.org/learn/computer-security/ku-leuven-web-security-fundamentals'},
    {id:'governance',title:'Security Governance & Compliance',provider:'Coursera',duration:'3 weeks',effort:'3 hours/week',prerequisites:'None',url:'https://www.coursera.org/learn/security-governance-compliance'},
    {id:'forensics',title:'Digital Forensics Concepts',provider:'Coursera',duration:'3 weeks',effort:'2–3 hours/week',prerequisites:'Core Security',url:'https://www.coursera.org/learn/digital-forensics-concepts'},
    {id:'secure-req',title:'Secure Software Development: Requirements, Design, and Reuse',provider:'Linux Foundation / edX',duration:'7 weeks',effort:'1–2 hours/week',prerequisites:'Core Programming and Core Security',url:'https://www.edx.org/learn/software-development/the-linux-foundation-secure-software-development-requirements-design-and-reuse'},
    {id:'secure-impl',title:'Secure Software Development: Implementation',provider:'Linux Foundation / edX',duration:'7 weeks',effort:'1–2 hours/week',prerequisites:'Secure Software Development: Requirements, Design, and Reuse',url:'https://www.edx.org/learn/software-development/the-linux-foundation-secure-software-development-implementation'},
    {id:'secure-verify',title:'Secure Software Development: Verification and More Specialized Topics',provider:'Linux Foundation / edX',duration:'7 weeks',effort:'1–2 hours/week',prerequisites:'Secure Software Development: Implementation',url:'https://www.edx.org/learn/software-engineering/the-linux-foundation-secure-software-development-verification-and-more-specialized-topics'}
  ]},
  {id:'adv-math',phase:'Advanced Math',tone:'violet',icon:'π',required:false,description:'Linear algebra, numerical methods, formal logic and probability for deeper CS specialization.',topics:['linear algebra','numerical methods','formal logic','set theory','probability','and more'],courses:[
    {id:'essence-la',title:'Essence of Linear Algebra',provider:'3Blue1Brown',duration:'—',effort:'—',prerequisites:'High school math',discussion:'https://discord.gg/m6wHbP6',url:'https://www.youtube.com/playlist?list=PLZHQObOWTQDPD3MizzM2xVFitgF8hE_ab'},
    {id:'linear-algebra',title:'Linear Algebra',provider:'MIT OpenCourseWare',duration:'14 weeks',effort:'12 hours/week',prerequisites:'Corequisite: Essence of Linear Algebra',discussion:'https://discord.gg/k7nSWJH',url:'https://ocw.mit.edu/courses/mathematics/18-06sc-linear-algebra-fall-2011/'},
    {id:'numerical',title:'Introduction to Numerical Methods',provider:'MIT OpenCourseWare',duration:'14 weeks',effort:'12 hours/week',prerequisites:'Linear Algebra',discussion:'https://discord.gg/FNEcNNq',url:'https://ocw.mit.edu/courses/mathematics/18-335j-introduction-to-numerical-methods-spring-2019/index.htm'},
    {id:'formal-logic',title:'Introduction to Formal Logic',provider:'Open Logic Project',duration:'10 weeks',effort:'4–8 hours/week',prerequisites:'Set Theory',discussion:'https://discord.gg/MbM2Gg5',url:'https://forallx.openlogicproject.org/'},
    {id:'probability',title:'Probability',provider:'Harvard Stat 110',duration:'15 weeks',effort:'5–10 hours/week',prerequisites:'Differentiation and Integration',discussion:'https://discord.gg/UVjs9BU',url:'https://stat110.hsites.harvard.edu/'}
  ]},
  {id:'final',phase:'Final Project',tone:'gold',icon:'🚀',required:true,final:true,description:'After Core CS and the Advanced CS relevant to you, identify a real problem and build something that demonstrates your knowledge.',topics:['build something new','improve an existing tool','apply course knowledge','document your work','share and validate the result'],courses:[
    {id:'fullstack',title:'Fullstack Open',provider:'University of Helsinki',duration:'12 weeks',effort:'15 hours/week',prerequisites:'Programming',url:'https://fullstackopen.com/en/'},
    {id:'robotics',title:'Modern Robotics',provider:'Northwestern University',duration:'26 weeks',effort:'2–5 hours/week',prerequisites:'Freshman-level physics, linear algebra, calculus, linear ODEs',url:'https://modernrobotics.northwestern.edu'},
    {id:'project-data-mining',title:'Data Mining (Specialization)',provider:'Coursera',duration:'30 weeks',effort:'2–5 hours/week',prerequisites:'Machine learning',url:'https://www.coursera.org/specializations/data-mining'},
    {id:'project-bigdata',title:'Big Data (Specialization)',provider:'Coursera',duration:'30 weeks',effort:'3–5 hours/week',prerequisites:'None',url:'https://www.coursera.org/specializations/big-data'},
    {id:'project-iot',title:'Internet of Things (Specialization)',provider:'Coursera',duration:'30 weeks',effort:'1–5 hours/week',prerequisites:'Strong programming',url:'https://www.coursera.org/specializations/internet-of-things'},
    {id:'project-cloud',title:'Cloud Computing (Specialization)',provider:'Coursera',duration:'30 weeks',effort:'2–6 hours/week',prerequisites:'C++ programming',url:'https://www.coursera.org/specializations/cloud-computing'},
    {id:'project-ds',title:'Data Science (Specialization)',provider:'Johns Hopkins / Coursera',duration:'43 weeks',effort:'1–6 hours/week',prerequisites:'None',url:'https://www.coursera.org/specializations/jhu-data-science'},
    {id:'project-scala',title:'Functional Programming in Scala (Specialization)',provider:'Coursera',duration:'29 weeks',effort:'4–5 hours/week',prerequisites:'One year programming experience',url:'https://www.coursera.org/specializations/scala'},
    {id:'project-unity',title:'Game Design and Development with Unity 2020 (Specialization)',provider:'Coursera',duration:'6 months',effort:'5 hours/week',prerequisites:'Programming, interactive design',url:'https://www.coursera.org/specializations/game-design-and-development'}
  ]}
];

const extras = [
  ['Introduction to Computational Thinking and Data Science','10 weeks · 15 hours/week'],['Introduction to Computer Science - CS50','12 weeks · 10–20 hours/week'],['Introduction to Computer Science (Udacity)','7 weeks · 10–20 hours/week'],['An Introduction to Interactive Programming in Python (Part 1)','5 weeks'],['Computing In Python, Part I: Fundamentals and Procedural Programming','5 weeks · 10 hours/week'],['Introduction to Mathematical Thinking','10 weeks · 10 hours/week'],['Precalculus','5 weeks · 6 hours/week'],['Advanced Precalculus','4 weeks · 5 hours/week'],['Calculus Applied!','10 weeks · 6 hours/week'],['Introduction to Probability and Data','—'],['Linear Algebra (Strang)','—'],['Introduction to Computational Thinking','—'],['Multivariable Calculus','13 weeks · 12 hours/week'],['Introduction to Probability - The Science of Uncertainty','18 weeks · 12 hours/week'],['Matrix Methods In Data Analysis, Signal Processing, And Machine Learning','—'],['Cloud Computing / Distributed Programming','5 weeks · 5–10 hours/week']
];

const allCourses = curriculum.flatMap(s => s.courses.map(c => ({...c, section:s.phase, sectionId:s.id, tone:s.tone})));
const requiredCourses = allCourses.filter(c => c.required !== false && !['vuln-c','vuln-java'].includes(c.id));

function readStoredState(key, fallback) {
  try {
    const saved = localStorage.getItem(key);
    if (saved === null || saved === undefined || saved === '') return fallback;
    return saved;
  } catch {
    return fallback;
  }
}

function readStoredJson(key, fallback) {
  try {
    const saved = readStoredState(key, null);
    if (saved === null) return fallback;
    const parsed = JSON.parse(saved);
    return parsed && typeof parsed === 'object' ? parsed : fallback;
  } catch {
    return fallback;
  }
}

function Icon({children}){ return <span className="icon">{children}</span> }
function pct(done,total){ return total ? Math.round(done/total*100) : 0 }

function App(){
  const [view,setView]=useState('roadmap');
  const [active,setActive]=useState('overview');
  const [query,setQuery]=useState('');
  const [filter,setFilter]=useState('all');
  const [selected,setSelected]=useState(null);
  const [progress,setProgress]=useState(()=>readStoredJson('ossu-progress', {}));
  const [theme,setTheme]=useState(()=>readStoredState('ossu-theme', 'dark'));
  const [mobileNav,setMobileNav]=useState(false);
  const [showExtras,setShowExtras]=useState(false);

  useEffect(()=>{
    try {
      localStorage.setItem('ossu-progress', JSON.stringify(progress));
    } catch {}
  }, [progress]);
  useEffect(()=>{
    try {
      localStorage.setItem('ossu-theme', theme);
    } catch {}
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  const completed = Object.values(progress).filter(Boolean).length;
  const total = allCourses.length;
  const requiredDone = requiredCourses.filter(c=>progress[c.id]).length;
  const overall = pct(completed,total);

  const filteredSections = useMemo(()=>curriculum.map(section=>({...section,courses:section.courses.filter(c=>{
    const matchesQuery=!query || [c.title,c.provider,c.prerequisites,section.phase,...section.topics].join(' ').toLowerCase().includes(query.toLowerCase());
    const matchesFilter=filter==='all' || (filter==='completed'&&progress[c.id]) || (filter==='remaining'&&!progress[c.id]) || (filter==='required'&&c.required!==false) || (filter==='advanced'&& !section.required);
    return matchesQuery && matchesFilter;
  })})).filter(s=>s.courses.length),[query,filter,progress]);

  const toggle = id=>setProgress(p=>({...p,[id]:!p[id]}));
  const goToView = (nextView, targetId='curriculum') => {
    setView(nextView);
    setActive(targetId === 'curriculum' ? 'overview' : targetId);
    requestAnimationFrame(() => {
      const target = document.getElementById(targetId) || document.getElementById('overview');
      target?.scrollIntoView({behavior:'smooth', block:'start'});
    });
    setMobileNav(false);
  };
  const scrollTo=id=>{setActive(id);document.getElementById(id)?.scrollIntoView({behavior:'smooth',block:'start'});setMobileNav(false)};

  return <div className="app">
    <header className="topbar">
      <button className="brand" onClick={()=>scrollTo('overview')}><span className="logo">◈</span><span><b>OSSU</b><small>COMPUTER SCIENCE</small></span></button>
      <nav className="topnav"><button className={active==='overview'?'active':''} onClick={()=>scrollTo('overview')}>Home</button><button onClick={()=>goToView('roadmap','curriculum')}>Roadmap</button><button onClick={()=>goToView('courses','curriculum')}>Courses</button><button onClick={()=>scrollTo('final')}>Final Project</button></nav>
      <div className="top-actions"><label className="search"><span>⌕</span><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search courses, topics…"/><kbd>⌘ K</kbd></label><button className="circle" onClick={()=>setTheme(t=>t==='dark'?'light':'dark')} aria-label="Toggle theme">{theme==='dark'?'☼':'☾'}</button><button className="primary" onClick={()=>scrollTo('core-programming')}>Get Started <span>→</span></button><button className="mobile-menu" onClick={()=>setMobileNav(v=>!v)}>☰</button></div>
    </header>

    <aside className={mobileNav?'sidebar open':'sidebar'}>
      <div className="side-group"><div className="side-label">EXPLORE</div><button className={active==='overview'?'selected':''} onClick={()=>scrollTo('overview')}><Icon>⌂</Icon>Overview</button><button onClick={()=>goToView('roadmap','curriculum')}><Icon>⌁</Icon>Roadmap</button><button onClick={()=>goToView('courses','curriculum')}><Icon>▦</Icon>All Courses</button><button onClick={()=>scrollTo('core-math')}><Icon>∑</Icon>Math Track</button><button onClick={()=>scrollTo('adv-programming')}><Icon>✦</Icon>Advanced CS</button><button onClick={()=>scrollTo('final')}><Icon>🚀</Icon>Final Project</button></div>
      <div className="side-group"><div className="side-label">TOOLS</div><button onClick={()=>goToView('progress','curriculum')}><Icon>✓</Icon>Progress Tracker <span className="side-count">{overall}%</span></button><button onClick={()=>setFilter('remaining')}><Icon>◌</Icon>Remaining</button><button onClick={()=>setShowExtras(v=>!v)}><Icon>＋</Icon>Extras</button></div>
      <div className="side-note">“A free, open, high-quality education for everyone.”<b>— OSSU</b></div>
      <div className="side-progress"><div className="mini-progress"><span style={{width:`${overall}%`}}/></div><strong>{overall}% complete</strong><small>{completed} of {total} curriculum courses</small><button onClick={()=>goToView('progress','curriculum')}>Track Your Progress →</button></div>
    </aside>

    <main className="main">
      <section id="overview" className="hero">
        <div className="hero-copy"><div className="eyebrow">OPEN SOURCE SOCIETY UNIVERSITY</div><h1>A Free Computer Science Education for <em>Everyone</em></h1><p>A self-directed, open source curriculum to teach you Computer Science using high-quality online resources. Learn at your own pace, with the entire curriculum transformed into a visual learning journey.</p><div className="hero-buttons"><button className="primary large" onClick={()=>scrollTo('intro')}>Start the Roadmap <span>→</span></button><button className="ghost large" onClick={()=>goToView('courses','curriculum')}>View Curriculum</button></div><div className="stats"><Stat icon="▤" value={`${total}+`} label="mapped courses"/><Stat icon="◷" value="~2 years" label="at ~20 hrs/week"/><Stat icon="◇" value="Core + Advanced" label="full CS pathway"/><Stat icon="∞" value="Free" label="mostly open access"/></div></div>
        <div className="hero-art"><div className="stars">✦　·　✧　·　✦<br/>　·　✦　·　·　✧</div><div className="mountain m1"/><div className="mountain m2"/><div className="mountain m3"/><div className="trail"/><div className="traveler">●</div><div className="flag">⚑<small>Your future<br/>starts here</small></div><div className="quote">“Learn deeply.<br/>Build boldly.”</div></div>
      </section>

      <section className="learning-path"><div className="section-heading"><div><div className="eyebrow">THE JOURNEY</div><h2>The Learning Path</h2><p>Follow the curriculum in order, explore by subject, or jump directly into a course.</p></div><div className="view-toggle"><button className={view==='roadmap'?'active':''} onClick={()=>goToView('roadmap','curriculum')}>Roadmap</button><button className={view==='courses'?'active':''} onClick={()=>goToView('courses','curriculum')}>Courses</button><button className={view==='progress'?'active':''} onClick={()=>goToView('progress','curriculum')}>Progress</button></div></div>
        <div className="path-grid">
          {[
            ['01','Foundations','Intro CS + prerequisites','green','intro'],['02','Core CS','Required CS foundation','blue','core-programming'],['03','Advanced CS','Elective specializations','purple','adv-programming'],['04','Build','Final project + application','orange','final'],['05','Beyond','Keep learning & contribute','red','conclusion']
          ].map(([n,t,d,c,id])=><button className={`path-card ${c}`} key={id} onClick={()=>id==='conclusion'?scrollTo('conclusion'):scrollTo(id)}><span className="path-number">{n}</span><div className="path-icon">{c==='green'?'🌱':c==='blue'?'◇':c==='purple'?'◒':c==='orange'?'▣':'↗'}</div><h3>{t}</h3><p>{d}</p><small>{id==='intro'?'1 course':id==='core-programming'?'30+ courses':id==='adv-programming'?'electives':id==='final'?'9 project tracks':'next steps'} →</small></button>)}
        </div>
      </section>

      <section className="subject-strip"><div className="section-heading"><div><div className="eyebrow">EXPLORE BY SUBJECT</div><h2>Every branch of the curriculum</h2></div><button className="text-button" onClick={()=>goToView('courses','curriculum')}>View all courses →</button></div><div className="subject-grid">{curriculum.filter(s=>!s.final).map(s=><button key={s.id} className="subject-card" onClick={()=>scrollTo(s.id)}><span className={`subject-icon ${s.tone}`}>{s.icon}</span><div><strong>{s.phase}</strong><p>{s.courses.length} course{s.courses.length!==1?'s':''} · {s.required?'Required':'Elective'}</p></div><span>→</span></button>)}</div></section>

      <section id="curriculum" className="workspace">
        <div className="section-heading"><div><div className="eyebrow">CURRICULUM</div><h2>{view==='progress'?'Your Progress':view==='courses'?'All Courses':'Visual Roadmap'}</h2><p>{view==='progress'?'Your completion is saved locally in this browser.':view==='courses'?'Search, filter and open any course for its full metadata and links.':'Each node is a real OSSU curriculum section. Open a node to see courses, requirements and resources.'}</p></div><div className="filters"><button className={filter==='all'?'active':''} onClick={()=>setFilter('all')}>All</button><button className={filter==='required'?'active':''} onClick={()=>setFilter('required')}>Required</button><button className={filter==='advanced'?'active':''} onClick={()=>setFilter('advanced')}>Advanced</button><button className={filter==='remaining'?'active':''} onClick={()=>setFilter('remaining')}>Remaining</button><button className={filter==='completed'?'active':''} onClick={()=>setFilter('completed')}>Completed</button></div></div>
        {view==='progress' ? <ProgressView sections={curriculum} progress={progress} onOpen={setSelected} /> : <div className="curriculum-flow">{filteredSections.map((s,i)=><SectionNode key={s.id} section={s} index={i} progress={progress} onToggle={toggle} onOpen={setSelected} view={view}/>)}</div>}
      </section>

      {showExtras && <section className="extras"><div className="section-heading"><div><div className="eyebrow">OSSU EXTRAS</div><h2>Great courses outside the main path</h2><p>These are additional high-quality resources listed by OSSU but not part of the core curriculum.</p></div><button className="text-button" onClick={()=>setShowExtras(false)}>Hide extras ×</button></div><div className="extra-grid">{extras.map(([t,d])=><div className="extra-card" key={t}><span>＋</span><div><strong>{t}</strong><small>{d}</small></div></div>)}</div></section>}

      <section id="final" className="final-banner"><div><div className="eyebrow">AFTER THE CURRICULUM</div><h2>Part of learning is doing.</h2><p>OSSU's final project asks you to identify a real problem and use the knowledge you've acquired to build something meaningful. You can create something new or improve an existing tool.</p></div><button className="primary large" onClick={()=>setSelected(allCourses.find(c=>c.id==='fullstack'))}>Explore project tracks →</button></section>
      <section id="conclusion" className="conclusion"><div><span className="big-check">✓</span><div><div className="eyebrow">CONGRATULATIONS</div><h2>Keep learning.</h2><p>After the required curriculum and relevant advanced study, OSSU points learners toward jobs, classic CS readings, developer communities and emerging technologies such as Elixir, Rust and Idris.</p></div></div><a href={SOURCE} target="_blank" rel="noreferrer">Open the original OSSU repository ↗</a></section>
      <footer><span>Visual OSSU Roadmap</span><span>Data mapped from the OSSU Computer Science repository · {new Date().getFullYear()}</span><a href={SOURCE} target="_blank" rel="noreferrer">Source ↗</a></footer>
    </main>

    {selected && <CourseDrawer course={selected} done={!!progress[selected.id]} onToggle={()=>toggle(selected.id)} onClose={()=>setSelected(null)} />}
  </div>
}

function Stat({icon,value,label}){return <div className="stat"><span>{icon}</span><div><strong>{value}</strong><small>{label}</small></div></div>}

function SectionNode({section,index,progress,onToggle,onOpen,view}){
  const done=section.courses.filter(c=>progress[c.id]).length;
  const percent=pct(done,section.courses.length);
  return <article id={section.id} className={`section-node ${section.tone} ${section.final?'final-node':''}`}>
    <div className="node-rail"><div className="node-dot">{section.icon}</div>{index<curriculum.length-1&&<div className="node-line"/>}</div>
    <div className="node-content"><div className="node-header"><div><div className="node-kicker">{section.required?'CORE / REQUIRED':'ADVANCED / ELECTIVE'}</div><h3>{section.phase}</h3><p>{section.description}</p></div><div className="node-progress"><strong>{percent}%</strong><small>{done}/{section.courses.length}</small><div><span style={{width:`${percent}%`}}/></div></div></div>
      <div className="topic-row">{section.topics.slice(0,8).map(t=><span key={t}>{t}</span>)}{section.topics.length>8&&<span>+{section.topics.length-8}</span>}</div>
      <div className="course-grid">{section.courses.map(c=><CourseCard key={c.id} course={c} done={!!progress[c.id]} onToggle={()=>onToggle(c.id)} onOpen={()=>onOpen({...c,section:section.phase,tone:section.tone})}/>)}</div>
    </div>
  </article>
}

function CourseCard({course,done,onToggle,onOpen}){return <div className={`course-card ${done?'done':''}`}><button className="check" onClick={onToggle} aria-label={done?'Mark incomplete':'Mark complete'}>{done?'✓':''}</button><button className="course-main" onClick={onOpen}><div className="course-meta"><span>{course.required===false?'ELECTIVE':'REQUIRED'}</span>{course.choiceGroup&&<span className="choice">CHOICE</span>}</div><h4>{course.title}</h4><p>{course.provider}</p><div className="course-stats"><span>◷ {course.duration}</span><span>◌ {course.effort}</span></div><div className="open-row">View course details <b>→</b></div></button></div>}

function CourseDrawer({course,done,onToggle,onClose}){return <div className="drawer-backdrop" onMouseDown={onClose}><aside className={`drawer ${course.tone||''}`} onMouseDown={e=>e.stopPropagation()}><button className="drawer-close" onClick={onClose}>×</button><div className="drawer-top"><span className="drawer-icon">{course.required===false?'✦':'✓'}</span><div><div className="eyebrow">{course.section||'OSSU COURSE'}</div><h2>{course.title}</h2><p>{course.provider}</p></div></div><div className="drawer-actions"><button className={done?'complete active':'complete'} onClick={onToggle}>{done?'✓ Completed':'Mark complete'}</button><a href={course.url} target="_blank" rel="noreferrer">Open resource ↗</a></div><div className="detail-grid"><Detail label="Duration" value={course.duration}/><Detail label="Weekly effort" value={course.effort}/><Detail label="Prerequisites" value={course.prerequisites}/><Detail label="Type" value={course.required===false?'Advanced elective':'Core curriculum'}/></div>{course.choiceGroup&&<div className="callout">⚡ <b>Choice requirement:</b> {course.choiceGroup}. OSSU marks this branch as a choice rather than requiring both courses.</div>}{course.notes&&<div className="drawer-section"><h3>OSSU notes</h3><p>{course.notes}</p></div>}{course.alternative&&<div className="drawer-section"><h3>Alternative</h3><a className="resource-link" href={course.alternative} target="_blank" rel="noreferrer">Open alternative resource ↗</a></div>}{course.alternatives&&<div className="drawer-section"><h3>Alternative resources</h3>{course.alternatives.map(a=><a className="resource-link" key={a} href={a} target="_blank" rel="noreferrer">{a} ↗</a>)}</div>}{course.discussion&&<div className="drawer-section"><h3>Community discussion</h3><a className="resource-link" href={course.discussion} target="_blank" rel="noreferrer">Open OSSU discussion ↗</a></div>}<div className="drawer-section source"><h3>Source</h3><a className="resource-link" href={SOURCE} target="_blank" rel="noreferrer">OSSU Computer Science repository ↗</a></div></aside></div>}
function Detail({label,value}){return <div className="detail"><small>{label}</small><strong>{value}</strong></div>}

function ProgressView({sections,progress,onOpen}){const courses=sections.flatMap(s=>s.courses.map(c=>({...c,section:s.phase,tone:s.tone})));const done=courses.filter(c=>progress[c.id]);return <div className="progress-view"><div className="progress-hero"><div className="progress-ring" style={{'--p':`${pct(done.length,courses.length)}%`}}><strong>{pct(done.length,courses.length)}%</strong></div><div><div className="eyebrow">YOUR OSSU JOURNEY</div><h3>{done.length} of {courses.length} courses completed</h3><p>Progress is stored locally in your browser. Use the checkmarks on any course to build your own visual transcript.</p></div></div><div className="progress-columns"><div><h3>Completed</h3>{done.length?<div className="completed-list">{done.map(c=><button key={c.id} onClick={()=>onOpen(c)}><span>✓</span>{c.title}<small>{c.section}</small></button>)}</div>:<div className="empty">No completed courses yet. Start with the first node above.</div>}</div><div><h3>Next up</h3><div className="completed-list">{courses.filter(c=>!progress[c.id]).slice(0,8).map(c=><button key={c.id} onClick={()=>onOpen(c)}><span>○</span>{c.title}<small>{c.section}</small></button>)}</div></div></div></div>}

createRoot(document.getElementById('root')).render(<App />);
