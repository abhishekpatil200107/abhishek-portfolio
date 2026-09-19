import { Canvas, useFrame } from "@react-three/fiber";
import { Float, OrbitControls, PointMaterial, Points, Text } from "@react-three/drei";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpRight,
  Check,
  Github,
  Linkedin,
  Mail,
  Menu,
  Send,
  X,
} from "lucide-react";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import * as THREE from "three";
import { trpc } from "@/lib/trpc";

gsap.registerPlugin(ScrollTrigger);

const GITHUB_URL = "https://github.com/abhishekpatil200107";
const LINKEDIN_URL = "https://www.linkedin.com/in/abhishekpatil0072001";

const projects = [
  {
    id: "01",
    type: "MERN STACK APPLICATION",
    title: "Smart Co-Working Space",
    description:
      "A full-stack platform for managing 30+ co-working spaces with real-time room and desk availability across dynamic layouts.",
    detail:
      "Collision-detection scheduling eliminated double-booking conflicts; live React state updates reduced room-selection friction by 35%.",
    tags: ["React.js", "Node.js", "Express.js", "MongoDB"],
    href: "https://github.com/abhishekpatil200107/coworking-space",
    art: "project-art-signal",
  },
  {
    id: "02",
    type: "DJANGO & REACT APPLICATION",
    title: "Student Monitoring System",
    description:
      "An academic tracking portal connecting a Django REST Framework backend to an interactive React analytics dashboard.",
    detail:
      "Role-based permissions protect faculty grading and student viewing; multi-attribute performance searches achieved sub-300ms display latency.",
    tags: ["Django", "DRF", "React.js", "Tailwind CSS"],
    href: "https://github.com/abhishekpatil200107/Student-Monitoring-System",
    art: "project-art-atlas",
  },
  {
    id: "03",
    type: "DJANGO APPLICATION",
    title: "College Management System",
    description:
      "A centralized institutional application managing departmental activities, faculty logs, and student enrollments for 500+ records.",
    detail:
      "Django ORM querysets and SQL schemas protect data integrity across multi-user administrative roles.",
    tags: ["Django", "Python", "SQL", "JavaScript"],
    href: "https://github.com/abhishekpatil200107/college-management-system",
    art: "project-art-form",
  },
  {
    id: "04",
    type: "DJANGO / ERP APPLICATION",
    title: "College ERP System",
    description:
      "An institutional ERP project for organizing college operations, records, and administration workflows.",
    detail:
      "A practical Django application focused on centralizing academic and administrative information.",
    tags: ["Django", "Python", "SQL"],
    href: "https://github.com/abhishekpatil200107/college-erp-system",
    art: "project-art-atlas",
  },
  {
    id: "05",
    type: "WEB APPLICATION",
    title: "Bus Booking System",
    description:
      "A web application project for exploring bus booking flows, route selection, and reservation-oriented user journeys.",
    detail:
      "A practical project demonstrating application workflows for transport and booking management.",
    tags: ["Python", "Web Development", "SQL"],
    href: "https://github.com/abhishekpatil200107/BusBookingSystem",
    art: "project-art-signal",
  },
];

const skills = [
  ["React", [-1.8, 0.9, 0.2], "#d8ff45"],
  ["Node.js", [0.2, 1.25, 0.1], "#65e6d2"],
  ["Django", [1.8, 0.8, -0.15], "#d8ff45"],
  ["DRF", [-1.4, -0.4, 0.1], "#e7ebe7"],
  ["MongoDB", [0.3, -0.6, 0.3], "#65e6d2"],
  ["Python", [1.55, -0.65, -0.1], "#d8ff45"],
  ["REST APIs", [0, 0, 0.6], "#e7ebe7"],
] as const;

type ParticleFieldProps = {
  count?: number;
  accent?: string;
};

function ParticleField({ count = 950, accent = "#65e6d2" }: ParticleFieldProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const mouse = useRef({ x: 0, y: 0 });

  const positions = useMemo(() => {
    const data = new Float32Array(count * 3);

    for (let index = 0; index < count; index += 1) {
      const radius = 1.8 + Math.random() * 3.9;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      data[index * 3] = radius * Math.sin(phi) * Math.cos(theta);
      data[index * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      data[index * 3 + 2] = radius * Math.cos(phi);
    }

    return data;
  }, [count]);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      mouse.current.x = (event.clientX / window.innerWidth - 0.5) * 2;
      mouse.current.y = (event.clientY / window.innerHeight - 0.5) * 2;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useFrame((state, delta) => {
    if (!pointsRef.current) return;

    pointsRef.current.rotation.y += delta * 0.035;
    pointsRef.current.rotation.x +=
      (mouse.current.y * 0.16 - pointsRef.current.rotation.x) * 0.025;
    pointsRef.current.rotation.z +=
      (mouse.current.x * 0.12 - pointsRef.current.rotation.z) * 0.025;
    pointsRef.current.position.x +=
      (mouse.current.x * 0.15 - pointsRef.current.position.x) * 0.018;
    pointsRef.current.position.y +=
      (-mouse.current.y * 0.12 - pointsRef.current.position.y) * 0.018;
    state.camera.position.z +=
      (6.2 + mouse.current.y * 0.22 - state.camera.position.z) * 0.015;
  });

  return (
    <Points ref={pointsRef} positions={positions} stride={3} frustumCulled>
      <PointMaterial
        transparent
        color={accent}
        size={0.018}
        sizeAttenuation
        depthWrite={false}
        opacity={0.7}
      />
    </Points>
  );
}

function SkillsCloud() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;

    groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.24) * 0.2;
    groupRef.current.rotation.x = Math.cos(state.clock.elapsedTime * 0.17) * 0.07;
  });

  return (
    <group ref={groupRef}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.85, 0.006, 8, 96]} />
        <meshBasicMaterial color="#65e6d2" transparent opacity={0.26} />
      </mesh>

      <mesh rotation={[0, Math.PI / 2, 0]}>
        <torusGeometry args={[1.85, 0.006, 8, 96]} />
        <meshBasicMaterial color="#d8ff45" transparent opacity={0.15} />
      </mesh>

      <Float speed={1.35} rotationIntensity={0.12} floatIntensity={0.32}>
        <mesh>
          <icosahedronGeometry args={[0.24, 1]} />
          <meshStandardMaterial
            color="#d8ff45"
            emissive="#d8ff45"
            emissiveIntensity={0.55}
            wireframe
          />
        </mesh>
      </Float>

      {skills.map(([label, position, color]) => (
        <Float key={label} speed={1.2} rotationIntensity={0.18} floatIntensity={0.15}>
          <Text
            position={position}
            fontSize={0.24}
            color={color}
            anchorX="center"
            anchorY="middle"
          >
            {label}
          </Text>
        </Float>
      ))}
    </group>
  );
}

function SectionLabel({ number, children }: { number: string; children: string }) {
  return (
    <div className="mb-8 flex items-center gap-3">
      <span className="eyebrow">{number}</span>
      <span className="h-px w-9 bg-[#65e6d2]/40" />
      <span className="eyebrow text-[#98a39e]">{children}</span>
    </div>
  );
}

function useScrollReveal() {
  useEffect(() => {
    const context = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".reveal").forEach((element) => {
        gsap.fromTo(
          element,
          { opacity: 0, y: 28 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: element,
              start: "top 86%",
              once: true,
            },
          },
        );
      });

      gsap.utils.toArray<HTMLElement>(".project-card").forEach((element, index) => {
        gsap.fromTo(
          element,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            delay: index * 0.08,
            ease: "power3.out",
            scrollTrigger: {
              trigger: element,
              start: "top 88%",
              once: true,
            },
          },
        );
      });
    });

    return () => context.revert();
  }, []);
}

function ProjectCard({ project }: { project: (typeof projects)[number] }) {
  return (
    <a
      className="project-card"
      href={project.href}
      target="_blank"
      rel="noreferrer"
    >
      <div className={`project-art ${project.art}`}>
        <span className="project-art-label">{project.type}</span>
        <span className="project-art-index">{project.id}</span>
      </div>

      <div className="relative z-10 -mt-2 p-6">
        <div className="mb-3 flex items-start justify-between gap-3">
          <h3 className="text-2xl tracking-[-.04em]">{project.title}</h3>
          <ArrowUpRight className="mt-1 shrink-0 text-[#65e6d2]" size={20} />
        </div>
        <p className="mb-3 max-w-[280px] text-sm leading-6 text-[#8f9b94]">
          {project.description}
        </p>
        <p className="mb-5 max-w-[280px] text-xs leading-5 text-[#6f7a74]">
          {project.detail}
        </p>
        <div className="flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <span className="tag" key={tag}>
              {tag}
            </span>
          ))}
        </div>
      </div>
    </a>
  );
}

export default function Home() {
  useScrollReveal();

  const [menuOpen, setMenuOpen] = useState(false);
  const [sent, setSent] = useState(false);

  const contactMutation = trpc.contact.send.useMutation({
    onSuccess: (result) => {
      setSent(true);
      toast.success(
        result.mode === "email"
          ? "Message sent — I’ll be in touch soon."
          : "Message queued — I’ll be in touch soon.",
      );
    },
    onError: () => {
      toast.error("Something went wrong. Try emailing me directly instead.");
    },
  });

  const submitContact = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = Object.fromEntries(new FormData(form).entries());

    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Please fill in your name, email, and message.");
      return;
    }

    contactMutation.mutate(
      {
        name: String(formData.name),
        email: String(formData.email),
        message: String(formData.message),
      },
      { onSuccess: () => form.reset() },
    );
  };

  const navigationItems = ["work", "about", "skills", "contact"];

  return (
    <main className="noise overflow-hidden bg-[#0b0d0d] text-[#e7ebe7]">
      <header className="nav-shell fixed inset-x-0 top-0 z-50">
        <div className="container flex h-[72px] items-center justify-between">
          <a href="#top" className="flex items-center gap-3" aria-label="Abhishek Patil home">
            <span className="flex h-8 w-8 items-center justify-center rounded-full border border-[#65e6d2]/50 text-[#d8ff45]">
              <span className="h-2 w-2 rounded-full bg-[#d8ff45] shadow-[0_0_16px_#d8ff45]" />
            </span>
            <span className="mono text-[.72rem] tracking-[.1em] text-[#dfe7df]">
              ABHISHEK / DEV
            </span>
          </a>

          <nav className="hidden items-center gap-8 md:flex">
            {navigationItems.map((item) => (
              <a className="nav-link" href={`#${item}`} key={item}>
                [ {item} ]
              </a>
            ))}
          </nav>

          <a href="#contact" className="btn-primary hidden md:inline-flex">
            LET’S TALK <ArrowUpRight size={15} />
          </a>

          <button
            className="rounded-full border border-[#34413c] p-2 text-[#65e6d2] md:hidden"
            onClick={() => setMenuOpen((value) => !value)}
            aria-label="Toggle navigation"
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        {menuOpen && (
          <div className="border-t border-[#293530] bg-[#0b0d0d] px-5 py-4 md:hidden">
            <div className="flex flex-col gap-4">
              {navigationItems.map((item) => (
                <a
                  key={item}
                  className="nav-link"
                  href={`#${item}`}
                  onClick={() => setMenuOpen(false)}
                >
                  [ {item} ]
                </a>
              ))}
            </div>
          </div>
        )}
      </header>

      <section
        id="top"
        className="relative flex min-h-[760px] items-end overflow-hidden pb-20 pt-32 md:min-h-[880px] md:pb-28"
      >
        <div className="hero-canvas">
          <Canvas camera={{ position: [0, 0, 6.2], fov: 58 }} dpr={[1, 1.5]}>
            <ambientLight intensity={0.15} />
            <ParticleField />
          </Canvas>
        </div>
        <div className="hero-vignette" />
        <div className="hero-orbit" />

        <div className="hero-profile" aria-label="Portrait of Abhishek Arvind Patil">
          <div className="hero-profile-ring hero-profile-ring-one" />
          <div className="hero-profile-ring hero-profile-ring-two" />
          <div className="hero-profile-image-wrap">
            <img
              src="/abhishek-cartoon-avatar-matched.webp"
              alt="Abhishek Arvind Patil, Full Stack Web Developer"
              className="hero-profile-image"
            />
          </div>
          <div className="hero-profile-label">
            <span className="status-dot" />
            <span className="mono">ABHISHEK / FULL-STACK DEV</span>
          </div>
        </div>

        <div className="hero-content container w-full">
          <div className="mb-10 flex items-center justify-between">
            <span className="status-line">
              <span className="status-dot" /> open to full-stack opportunities
            </span>
            <span className="mono hidden text-[.66rem] tracking-[.08em] text-[#6f7a74] md:block">
              16° 42’ 00” N / 74° 16’ 00” E
            </span>
          </div>

          <div className="max-w-[900px]">
            <p className="eyebrow mb-7">Full Stack Web Developer / MERN & Django</p>
            <h1 className="display max-w-[890px]">
              I build full-stack
              <br />
              <span className="text-[#d8ff45]">web experiences.</span>
            </h1>
            <p className="mt-9 max-w-[470px] text-[1rem] leading-7 text-[#a8b3ac] md:text-[1.1rem]">
              Responsive, user-friendly applications built with React, Node.js, Django, and REST APIs.
            </p>
          </div>

          <div className="mt-11 flex flex-wrap items-center gap-3">
            <a href="#work" className="btn-primary">
              EXPLORE THE WORK <ArrowDown size={15} />
            </a>
            <a href="#contact" className="btn-ghost">
              START A CONVERSATION <ArrowUpRight size={15} />
            </a>
          </div>

          <div className="mt-20 flex gap-8 md:mt-28">
            <div className="hero-stat">
              <strong>MCA</strong>
              <span>candidate / 2027</span>
            </div>
            <div className="hero-stat">
              <strong>MERN</strong>
              <span>full-stack projects</span>
            </div>
            <div className="hero-stat">
              <strong>SANGLI</strong>
              <span>Ishwarpur, Sangli</span>
            </div>
          </div>
        </div>
      </section>

      <div className="section-rule" />

      <section id="about" className="section">
        <div className="container">
          <SectionLabel number="01">about the maker</SectionLabel>
          <div className="grid gap-12 md:grid-cols-[1.1fr_.9fr] md:gap-20">
            <h2 className="section-title reveal">
              The web should feel
              <br />
              <span className="text-[#65e6d2]">a little more human.</span>
            </h2>
            <div className="reveal space-y-7 text-[1rem] leading-7 text-[#9da8a2]">
              <p>
                I’m <span className="text-[#e7ebe7]">Abhishek Arvind Patil</span>, a full-stack web developer and MCA candidate based in Ishwarpur, Sangli. I enjoy building responsive, user-friendly web applications and practical solutions through projects.
              </p>
              <p>
                I work across the MERN stack and Python/Django REST Framework, with a focus on secure REST API design, database query optimization, responsive SPA interfaces, Agile workflows, and Git-based collaboration.
              </p>
              <div className="about-card mt-9 flex items-start gap-4 p-5">
                <span className="bracket">[</span>
                <p className="m-0 text-[.83rem] leading-6 text-[#bdc8c0]">
                  Currently working as a MERN Stack Development Intern at Unified Mentor, building production-grade applications with MongoDB, Express.js, React, and Node.js.
                </p>
                <span className="bracket">]</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="work" className="section bg-[#0e1110]">
        <div className="container">
          <SectionLabel number="02">selected work</SectionLabel>
          <div className="mb-14 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <h2 className="section-title reveal max-w-[690px]">
              A few directions I’m
              <br />
              <span className="text-[#d8ff45]">building toward.</span>
            </h2>
            <p className="reveal max-w-[250px] text-sm leading-6 text-[#7f8c84]">
              Five practical applications spanning MERN, Django, REST APIs, relational data, and workflow management.
            </p>
          </div>
          <div className="grid gap-5 lg:grid-cols-3">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>
      </section>

      <section id="skills" className="section">
        <div className="container">
          <SectionLabel number="03">the toolkit</SectionLabel>
          <div className="grid items-center gap-12 md:grid-cols-[.72fr_1.28fr] md:gap-14">
            <div>
              <h2 className="section-title reveal">
                A stack for
                <br />
                <span className="text-[#65e6d2]">learning by building.</span>
              </h2>
              <p className="reveal mt-8 max-w-[340px] text-sm leading-6 text-[#8f9b94]">
                I build with React.js, Redux Toolkit, Context API, Tailwind CSS, Bootstrap, Django, DRF, Node.js, Express.js, JWT, MongoDB, Mongoose, SQL, Git, GitHub, Postman, and Agile practices.
              </p>
              <div className="reveal mt-9 flex flex-wrap gap-2">
                {[
                  "REACT",
                  "NODE.JS",
                  "DJANGO",
                  "REST APIs",
                  "MONGODB",
                  "SQL",
                  "GIT / GITHUB",
                  "POSTMAN",
                ].map((skill) => (
                  <span className="tag" key={skill}>
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="skills-stage reveal">
              <div className="skill-caption">
                <span className="eyebrow">interactive index</span>
                <p className="mono mt-2 text-[.65rem] text-[#78847d]">drag / orbit / explore</p>
              </div>
              <div className="skill-caption-right">
                <span className="mono text-[.64rem] text-[#78847d]">[ 07 nodes ]</span>
                <p className="mt-2 text-[.7rem] text-[#d8ff45]">always learning</p>
              </div>
              <Canvas camera={{ position: [0, 0, 5], fov: 50 }} dpr={[1, 1.5]}>
                <ambientLight intensity={0.8} />
                <pointLight position={[2, 3, 4]} intensity={2} color="#65e6d2" />
                <SkillsCloud />
                <OrbitControls
                  enablePan={false}
                  enableZoom={false}
                  minPolarAngle={Math.PI / 2.5}
                  maxPolarAngle={Math.PI / 1.7}
                />
              </Canvas>
            </div>
          </div>
        </div>
      </section>

      <section className="section bg-[#0e1110]">
        <div className="container">
          <SectionLabel number="04">experience & education</SectionLabel>
          <div className="grid gap-6 md:grid-cols-[1.1fr_.9fr]">
            <div className="about-card reveal p-7 md:p-9">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="eyebrow">Sep 2026 — Present / Remote</p>
                  <h3 className="mt-3 text-2xl tracking-[-.04em]">MERN Stack Development Intern</h3>
                  <p className="mt-2 text-sm text-[#65e6d2]">Unified Mentor</p>
                </div>
                <span className="tag">CURRENTLY WORKING</span>
              </div>
              <ul className="mt-7 space-y-3 text-sm leading-6 text-[#9da8a2]">
                <li>• Building production-grade MERN applications with MongoDB, Express.js, React, and Node.js.</li>
                <li>• Translating UI/UX requirements into modular React components, cutting client-side re-renders by 30%.</li>
                <li>• Engineering 15+ asynchronous REST endpoints with payload sanitization and structured error handling.</li>
                <li>• Designing normalized Mongoose schemas, compound indexes, and aggregation pipelines that improved data retrieval by 25%.</li>
                <li>• Collaborating through Git/GitHub feature branching and 20+ peer-reviewed pull requests.</li>
              </ul>
            </div>

            <div className="reveal space-y-5">
              <div className="border-b border-[#293530] pb-5">
                <p className="eyebrow">education</p>
                <h3 className="mt-3 text-lg">Master of Computer Applications</h3>
                <p className="mt-1 text-sm text-[#9da8a2]">IMED, Bharati Vidyapeeth University · Expected 2027</p>
                <h3 className="mt-5 text-lg">Bachelor of Computer Applications</h3>
                <p className="mt-1 text-sm text-[#9da8a2]">Yashwantrao Chavan Mahavidyalaya · 2024</p>
                <p className="mono mt-3 text-xs text-[#d8ff45]">CGPA 8.36 / 10 · 78.3%</p>
              </div>
              <div>
                <p className="eyebrow">certifications & workshops</p>
                <p className="mt-3 text-sm leading-6 text-[#9da8a2]">
                  AI and Life & Employability Skills — Magic Bus India Foundation. UI/UX Design, Full Stack Development, Cloud Computing, and AI Tools workshops.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="section contact-panel">
        <div className="container">
          <div className="grid gap-16 md:grid-cols-[.85fr_1.15fr] md:gap-24">
            <div>
              <SectionLabel number="05">make a connection</SectionLabel>
              <h2 className="section-title reveal">
                Have a good
                <br />
                <span className="text-[#d8ff45]">feeling?</span>
              </h2>
              <p className="reveal mt-8 max-w-[330px] text-sm leading-6 text-[#8f9b94]">
                Tell me what you’re making, what’s stuck, or what you’re curious about. I read every note.
              </p>

              <div className="reveal mt-10 space-y-4">
                <a
                  className="flex items-center gap-3 text-sm text-[#bdc8c0] transition-colors hover:text-[#65e6d2]"
                  href="mailto:abhishekpatil200107@gmail.com"
                >
                  <Mail size={16} />
                  abhishekpatil200107@gmail.com
                </a>
                <div className="flex flex-wrap items-center gap-4 pt-3">
                  <a
                    href={GITHUB_URL}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#7f8c84] transition-colors hover:text-[#d8ff45]"
                    aria-label="GitHub"
                  >
                    <Github size={18} />
                  </a>
                  <a
                    href={LINKEDIN_URL}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#7f8c84] transition-colors hover:text-[#d8ff45]"
                    aria-label="LinkedIn"
                  >
                    <Linkedin size={18} />
                  </a>
                  <a
                    href={GITHUB_URL}
                    target="_blank"
                    rel="noreferrer"
                    className="mono text-[.68rem] tracking-[.08em] text-[#bdc8c0] transition-colors hover:text-[#d8ff45]"
                  >
                    VIEW GITHUB PROFILE <ArrowUpRight size={13} className="inline" />
                  </a>
                </div>
              </div>
            </div>

            <div className="reveal">
              <form onSubmit={submitContact} className="space-y-8">
                <div className="grid gap-8 md:grid-cols-2">
                  <label>
                    <span className="form-label">your name</span>
                    <input className="form-field" name="name" placeholder="Jane Doe" autoComplete="name" />
                  </label>
                  <label>
                    <span className="form-label">email address</span>
                    <input className="form-field" type="email" name="email" placeholder="jane@company.com" autoComplete="email" />
                  </label>
                </div>
                <label className="block">
                  <span className="form-label">what’s on your mind?</span>
                  <textarea className="form-field" name="message" placeholder="A new idea, a tricky problem, or just hello..." />
                </label>
                <div className="flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-center">
                  <p className="max-w-[250px] text-xs leading-5 text-[#6f7a74]">
                    By sending this, you’re starting a conversation — not a sales funnel.
                  </p>
                  <button className="btn-primary" type="submit" disabled={contactMutation.isPending || sent}>
                    {sent ? (
                      <>MESSAGE SENT <Check size={15} /></>
                    ) : contactMutation.isPending ? (
                      <>SENDING…</>
                    ) : (
                      <>SEND MESSAGE <Send size={15} /></>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      <footer className="container flex flex-col justify-between gap-5 py-8 sm:flex-row sm:items-center">
        <p className="mono text-[.64rem] tracking-[.08em] text-[#66726b]">
          © 2026 ABHISHEK ARVIND PATIL / FULL-STACK DEVELOPER
        </p>
        <a
          href="#top"
          className="mono flex items-center gap-2 text-[.64rem] tracking-[.08em] text-[#66726b] transition-colors hover:text-[#d8ff45]"
        >
          BACK TO TOP <ArrowUp size={14} />
        </a>
      </footer>
    </main>
  );
}
