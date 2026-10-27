import { projects, getProject } from "./project-data.js";
import { messages } from "./i18n.js";

/* ===== BASE PATH =====
   Derived from this module's own URL, so one build works at the domain root
   (http://localhost:8000/), under a GitHub Pages project subpath
   (/Sunatillo-dev_ai/) and under a custom domain — without editing a constant. */
const SITE_BASE = new URL("../", import.meta.url).pathname;
const isExternalUrl = (value) => /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(String(value));
const siteUrl = (value = "") => {
  if (isExternalUrl(value)) return String(value);
  return `${SITE_BASE}${String(value).replace(/^\.?\//, "")}`;
};

const root = document.querySelector("#app");
const pad = (value) => String(value).padStart(2, "0");
const languages = ["uz", "ru", "en"];
const defaultLanguage = "ru";
let language = localStorage.getItem("portfolio-language") || defaultLanguage;
if (!messages[language]) language = defaultLanguage;
const t = (key) => messages[language][key];
const localizedProject = (project) => {
  const [category, role, summary, product, challenge, impact] = t("project")[project.slug];
  return {
    ...project,
    category,
    role,
    summary,
    product,
    challenge,
    impact,
    status: t("statuses")[project.status],
    team: project.team === "Individual project" ? t("individualProject") : t("repoUnverified")
  };
};
const languageSwitcher = () => `<div class="language-switch" aria-label="${t("language")}">${languages.map((code) => `<button type="button" data-language="${code}" aria-pressed="${language === code}" lang="${code}">${code.toUpperCase()}</button>`).join("")}</div>`;

/* ===== SHAXSIY MA'LUMOT (my_data) ===== */
const profile = {
  name: "Sunatillo-dev_ai",
  firstName: "Sunatillo",
  title: "Python Backend Developer",
  location: "Uzgen, Osh Region, Kyrgyzstan",
  summary: "Python Backend Developer focused on building web APIs, database-driven applications, Telegram bots, and business automation tools.",
  about: [
    "I'm a Python Backend Developer from Kyrgyzstan who enjoys solving practical problems through software development.",
    "My main focus is backend development with Python, Django, Django REST Framework, and relational databases. I have also worked with FastAPI, Telegram bot development, Redis, Celery, and Docker across personal and practice projects.",
    "I learn by building applications, exploring unfamiliar technologies, debugging issues, and improving existing implementations.",
    "My current goal is to join a development team, contribute to real products, strengthen my engineering skills, and grow through practical experience."
  ],
  skills: ["Python","SQL","JavaScript","HTML & CSS","Bash","Django","Django REST Framework","FastAPI","REST API Design","Authentication & Authorization","Aiogram 3","PostgreSQL","MySQL","SQLite","Redis","SQLAlchemy","Alembic","Git & GitHub","Docker","Linux","Nginx","Celery","AI-assisted Development"],
  experience: [
    { period: "Ongoing", role: "Independent Backend Developer", company: "Project-based", detail: "Designing and developing personal software projects to practise backend engineering and solve practical use cases." }
  ],
  education: [
    { title: "Backend Development Training", detail: "8 months · Practical backend development focused on Python and web application development." },
    { title: "Independent Technical Learning", detail: "Continuously developing skills through personal projects, documentation, debugging, and hands-on experimentation." }
  ],
  languages: [
    { name: "Uzbek", level: "Fluent" },
    { name: "English", level: "B2" },
    { name: "Russian", level: "A2–B1" },
    { name: "Kyrgyz", level: "Basic" }
  ],
  github: "https://github.com/Sunatillo2024",
  telegram: "https://t.me/Sunatillo2024",
  email: "sunatlohgafur1214@gmail.com"
};
const contactLinks = [
  { label: "Telegram", url: profile.telegram },
  { label: "Email", url: profile.email ? `mailto:${profile.email}` : "" },
  { label: "GitHub", url: profile.github }
].filter((item) => item.url);

/* ===== VISUAL PREVIEWS ===== */
function projectVisual(project, large = false) {
  const largeClass = large ? " project-image-large" : "";
  if (project.cover) {
    return `<div class="project-image project-image-${project.coverFit || "cover"}${largeClass}"><img src="${siteUrl(project.cover)}" alt="${project.name} ${t("productInterface")}" loading="lazy"></div>`;
  }
  // Fallback visuals based on project.visual type
  if (project.visual === "social") {
    return `<div class="project-image product-preview social-preview${largeClass}"><div class="chat-bubble left">Hey 👋</div><div class="chat-bubble right">Match! 💙</div><div class="chat-orb">RY</div></div>`;
  }
  if (project.visual === "realtime") {
    return `<div class="project-image product-preview realtime-preview${largeClass}"><div class="call-ring"></div><div class="call-card"><span>● LIVE</span><strong>WebRTC Call</strong><p>Signaling · JWT · Presence</p></div></div>`;
  }
  if (project.visual === "finance") {
    return `<div class="project-image product-preview finance-preview${largeClass}"><div class="wallet-card"><span>BALANCE</span><strong>$ 4,821.50</strong><small>•••• 4821</small></div><div class="tx-row">+ $120.00</div><div class="tx-row out">− $45.90</div></div>`;
  }
  if (project.visual === "documents") {
    return `<div class="project-image product-preview docs-preview${largeClass}"><div class="doc-page"><span>{{NAME}}</span><span>{{DATE}}</span><span>{{AMOUNT}}</span></div><div class="doc-check">✓</div></div>`;
  }
  if (project.visual === "healthcare") {
    return `<div class="project-image product-preview health-preview${largeClass}"><div class="pulse-icon">＋</div><div class="health-card"><strong>Dr. Profile</strong><span>Cardiology · Verified</span></div></div>`;
  }
  if (project.visual === "fitness") {
    return `<div class="project-image product-preview fitness-preview${largeClass}"><div class="rep-count">12</div><div class="rep-label">REPS · TIMER 00:38</div><div class="rep-bar"></div></div>`;
  }
  if (project.visual === "food") {
    return `<div class="project-image product-preview food-preview${largeClass}"><div class="order-card"><strong>Order #248</strong><span>2 items · $14.50</span></div><div class="order-status">Preparing…</div></div>`;
  }
  if (project.visual === "publishing") {
    return `<div class="project-image product-preview pub-preview${largeClass}"><div class="article-line lg"></div><div class="article-line"></div><div class="article-line short"></div><div class="premium-badge">★ PREMIUM</div></div>`;
  }
  if (project.visual === "media") {
    return `<div class="project-image product-preview media-preview${largeClass}"><div class="poster"></div><div class="poster"></div><div class="poster"></div><div class="poster"></div></div>`;
  }
  if (project.visual === "retail") {
    return `<div class="project-image product-preview retail-preview${largeClass}"><div class="pos-card"><span>POS · STORE 1</span><strong>$ 86.40</strong><i>Checkout →</i></div><div class="barcode"></div></div>`;
  }
  return `<div class="project-image product-preview default-preview${largeClass}"><div class="default-orb">${project.mark}</div></div>`;
}

function detailGrid(items, numbered = false) {
  return `<div class="detail-grid ${numbered ? "detail-grid-numbered" : ""}">${items.map((item, index) => `<article>${numbered ? `<span>${pad(index + 1)}</span>` : ""}<h3>${item.title}</h3><p>${item.detail}</p></article>`).join("")}</div>`;
}

/* ===== HOME PAGE ===== */
function homePage() {
  document.title = `Sunatillo — ${t("backendDeveloper")}`;
  const localizedProjects = projects.map(localizedProject);
  return `<main>
    <nav class="nav-shell" aria-label="${t("primaryNavigation")}">
      <a class="brand" href="#top" aria-label="${t("home")}">S<span>.</span></a>
      <div class="nav-links"><a href="#work">${t("work")}</a><a href="#about">${t("aboutKicker")}</a><a href="#experience">${t("experience")}</a><a class="nav-cta" href="#contact">${t("talk")}</a>${languageSwitcher()}</div>
    </nav>

    <section class="hero section-shell" id="top">
      <div class="hero-copy">
        <p class="eyebrow"><span class="status-dot"></span> ${t("available")}</p>
        <h1>${t("heroTitle")}</h1>
        <p class="hero-lead">${t("heroLead")}</p>
        <div class="hero-actions">
          <a class="button button-primary" href="#work">${t("explore")} <span>↘</span></a>
          <a class="button button-quiet" href="${profile.github}" target="_blank" rel="noreferrer">GitHub ↗</a>
        </div>
      </div>
      <div class="hero-visual" aria-label="${t("portrait")}">
        <div class="portrait-frame"><img src="${siteUrl("assets/images/sunatillo.png")}" alt="${profile.name}"></div>
        <div class="portrait-caption"><span>Python</span><strong>${t("backendDeveloper")}</strong></div>
      </div>
    </section>

    <section class="proof-strip" aria-label="${t("highlights")}">
      <div><strong>${projects.length}</strong><span>${t("documentedProjects")}</span></div>
      <div><strong>${profile.skills.length}</strong><span>${t("technologiesUsed")}</span></div>
      <div><strong>${profile.languages.find(l=>l.name==="English").level}</strong><span>${t("englishLevel")}</span></div>
      <div><strong>4</strong><span>${t("languagesSpoken")}</span></div>
    </section>

    <section class="section-shell work-section" id="work">
      <div class="section-heading">
        <div><p class="section-kicker">01 · ${t("selectedWork")}</p><h2>${t("workTitle")}</h2></div>
        <p>${t("workIntro")}</p>
      </div>
      <div class="visual-project-grid">
        ${localizedProjects.map((project, index) => `
          <a class="visual-project-card" href="${siteUrl(`projects/${project.slug}/`)}">
            ${projectVisual(project)}
            <div class="visual-project-body">
              <div class="project-card-top"><span>${pad(index + 1)} · ${project.category}</span><span class="project-status">${project.status}</span></div>
              <h3>${project.name}</h3>
              <p class="what-it-is"><small>${t("whatItIs")}</small>${project.summary}</p>
              <div class="project-clarity">
                <div><small>${t("myRole")}</small><strong>${project.role}</strong></div>
                <div><small>${t("result")}</small><strong>${project.impact}</strong></div>
              </div>
              <div class="project-card-footer">
                <div class="project-tags">${project.tech.slice(0, 3).map((item) => `<em>${item}</em>`).join("")}</div>
                <b>${t("readCase")} ↗</b>
              </div>
            </div>
          </a>`).join("")}
      </div>
    </section>

    <section class="about-section" id="about">
      <div class="section-shell about-grid">
        <div><p class="section-kicker">02 · ${t("aboutKicker")}</p><h2>${t("aboutTitle")}</h2></div>
        <div class="about-copy">
          <p class="about-lead">${t("about")[0]}</p>
          ${t("about").slice(1).map(p => `<p>${p}</p>`).join("")}
          <div class="about-links">
            <a href="${profile.github}" target="_blank" rel="noreferrer">GitHub ↗</a>
            <a href="#contact">${t("getInTouch")} ↗</a>
          </div>
        </div>
      </div>
    </section>

    <section class="section-shell toolkit-section">
      <div class="section-heading compact">
        <div><p class="section-kicker">03 · ${t("toolkit")}</p><h2>${t("toolkitTitle")}</h2></div>
        <p>${t("toolkitIntro")}</p>
      </div>
      <div class="skills-cloud">${profile.skills.map((skill, index) => `<span><small>${pad(index + 1)}</small>${skill}</span>`).join("")}</div>
    </section>

    <section class="experience-section" id="experience">
      <div class="section-shell">
        <div class="section-heading compact">
          <div><p class="section-kicker">04 · ${t("experienceKicker")}</p><h2>${t("experienceTitle")}</h2></div>
        </div>
        <div class="timeline">
          <article><time>${t("ongoing")}</time><h3>${t("independentRole")}</h3><strong>${t("projectBased")}</strong><p>${t("experienceDetail")}</p></article>
        </div>
      </div>
    </section>

    <section class="section-shell credentials-section">
      <div class="education-card"><p class="section-kicker">${t("education")}</p><h3>${t("educationOne")}</h3><p>${t("educationOneDetail")}</p></div>
      <div class="education-card"><p class="section-kicker">${t("education")}</p><h3>${t("educationTwo")}</h3><p>${t("educationTwoDetail")}</p></div>
      <div class="language-card">
        <p class="section-kicker">${t("languages")}</p>
        <div class="b2-mark">${profile.languages.find(l=>l.name==="English").level}</div>
        <h3>${t("english")}</h3>
        <p>${t("languageSummary")}</p>
      </div>
    </section>

    <footer id="contact">
      <div class="section-shell footer-grid">
        <div><p class="section-kicker">05 · ${t("contactKicker")}</p><h2>${t("contactTitle")}</h2></div>
        <div class="footer-actions">
          <p>${t("contactIntro")}</p>
          ${contactLinks.map((item) => `<a href="${item.url}" target="_blank" rel="noreferrer">${item.label} <span>↗</span></a>`).join("\n          ")}
          <a href="#work">${t("seeProjects")} <span>↗</span></a>
        </div>
      </div>
      <div class="footer-bottom section-shell"><span>© 2026 ${profile.name}</span><span>${t("footerLocation")}</span></div>
    </footer>
  </main>`;
}

/* ===== PROJECT PAGE ===== */
function projectPage(project) {
  const index = projects.findIndex((item) => item.slug === project.slug);
  const next = projects[(index + 1) % projects.length];
  const localized = localizedProject(project);
  document.title = `${project.name} — Sunatillo`;
  return `<main class="case-page">
    <nav class="nav-shell case-nav" aria-label="${t("caseStudy")}"><a class="brand" href="${siteUrl()}">S<span>.</span></a><div class="case-nav-actions"><a class="back-link" href="${siteUrl("#work")}">← ${t("allProjects")}</a>${languageSwitcher()}</div></nav>
    <header class="case-hero section-shell">
      <div class="case-hero-main">
        <p class="eyebrow">${t("caseStudy")} · ${pad(index + 1)}</p>
        <h1>${project.name}</h1>
        <p>${localized.summary}</p>
        <div class="case-actions">
          ${project.live ? `<a class="button button-primary" href="${project.live}" target="_blank" rel="noreferrer">${t("visitProduct")} ↗</a>` : ""}
          ${project.repository ? `<a class="button button-quiet" href="${project.repository}" target="_blank" rel="noreferrer">${t("sourceCode")} ↗</a>` : ""}
        </div>
      </div>
      <div class="case-identity" aria-hidden="true"><span>${project.mark}</span></div>
    </header>
    <section class="case-facts"><div class="section-shell">
      <div><span>${t("domain")}</span><strong>${localized.category}</strong></div>
      <div><span>${t("myRole")}</span><strong>${localized.role}</strong></div>
      <div><span>${t("team")}</span><strong>${localized.team}</strong></div>
      <div><span>${t("status")}</span><strong>${localized.status}</strong></div>
    </div></section>
    <section class="section-shell case-overview">
      <div class="case-overview-copy"><p class="section-kicker">${t("product")}</p><h2>${localized.product}</h2><p><strong>${t("challenge")}:</strong> ${localized.challenge}</p></div>
      ${projectVisual(project, true)}
    </section>
    ${project.metrics?.length ? `<section class="case-metrics section-shell" aria-label="${t("metrics")}">${project.metrics.map((metric) => `<article><strong>${metric.value}</strong><span>${t("metricsLabels")[metric.label] || metric.label}</span></article>`).join("")}</section>` : ""}
    <section class="section-shell case-story case-story-bordered"><div class="case-label"><span>01</span><p>${t("productMap")}</p></div><div class="case-content"><p class="case-overline">${t("connectPieces")}</p><h2>${t("operatingSystem")}</h2>${detailGrid(project.ecosystem)}</div></section>
    <section class="case-dark-panel"><div class="section-shell case-story"><div class="case-label"><span>02</span><p>${t("backendArchitecture")}</p></div><div class="case-content"><p class="case-overline">${t("systemLayers")}</p><h2>${t("technicalShape")}</h2><div class="architecture-flow">${project.architecture.map((item, itemIndex) => `<article><span>${pad(itemIndex + 1)}</span><div><h3>${item.title}</h3><p>${item.detail}</p></div></article>`).join("")}</div></div></div></section>
    <section class="section-shell case-story"><div class="case-label"><span>03</span><p>${t("coreWorkflow")}</p></div><div class="case-content"><p class="case-overline">${t("inputOutcome")}</p><h2>${t("userAction")}</h2>${detailGrid(project.workflow, true)}</div></section>
    <section class="section-shell case-story case-story-bordered"><div class="case-label"><span>04</span><p>${t("contribution")}</p></div><div class="case-content"><p class="case-overline">${t("directOwnership")}</p><h2>${t("responsibleFor")}</h2><div class="contribution-list">${project.contribution.map((item, itemIndex) => `<div><span>${pad(itemIndex + 1)}</span><p>${item}</p></div>`).join("")}</div><p class="team-note"><strong>${t("teamContext")}:</strong> ${localized.team}.</p></div></section>
    <section class="case-capabilities"><div class="section-shell case-story"><div class="case-label"><span>05</span><p>${t("capabilities")}</p></div><div class="case-content"><p class="case-overline">${t("systemDoes")}</p><h2>${t("productLogic")}</h2><div class="capability-grid">${project.features.map((item) => `<article><span>✓</span><h3>${item}</h3></article>`).join("")}</div></div></div></section>
    <section class="section-shell case-story"><div class="case-label"><span>06</span><p>${t("decisions")}</p></div><div class="case-content"><p class="case-overline">${t("whyBuilt")}</p><h2>${t("tradeoffs")}</h2>${detailGrid(project.engineering)}</div></section>
    ${project.images?.length ? `<section class="case-gallery-wrap"><div class="section-shell case-gallery-section"><div class="case-label"><span>07</span><p>${t("evidence")}</p></div><div><p class="case-overline">${t("safelyPresented")}</p><h2 class="gallery-heading">${t("context")}</h2><div class="case-gallery">${project.images.map((image) => `<figure><img src="${siteUrl(image.src)}" alt="${image.alt}" loading="lazy"><figcaption>${image.caption}</figcaption></figure>`).join("")}</div></div></div></section>` : ""}
    <section class="section-shell case-outcome"><div><p class="section-kicker">${t("impact")}</p><h2>${localized.impact}</h2></div><div class="case-tech"><div class="stack-list"><span>${t("technology")}</span>${project.tech.map((item) => `<em>${item}</em>`).join("")}</div><div class="stack-list"><span>${t("integrations")}</span>${project.integrations.map((item) => `<em>${item}</em>`).join("")}</div></div></section>
    <a class="next-case" href="${siteUrl(`projects/${next.slug}/`)}"><div class="section-shell"><p>${t("nextCase")}</p><h2>${next.name}</h2><span>↗</span></div></a>
    <footer class="case-footer"><div class="footer-bottom section-shell"><span>© 2026 Sunatillo</span><a href="${siteUrl()}">${t("returnHome")} ↑</a></div></footer>
  </main>`;
}

/* ===== ROUTER ===== */
// Every project also ships as a real static page (projects/<slug>/index.html),
// so direct visits and refreshes are served by GitHub Pages itself. `?path=`
// stays supported so 404.html can forward an unknown URL to the right case study.
function stripSiteBase(path) {
  let result = String(path).split("#")[0].split("?")[0];
  if (SITE_BASE !== "/" && result.startsWith(SITE_BASE)) result = "/" + result.slice(SITE_BASE.length);
  // Also covers file:/// and hosting prefixes that differ from the link prefix.
  const marker = result.indexOf("/projects/");
  if (marker > -1) result = result.slice(marker);
  return result;
}

const requestedPath = stripSiteBase(new URLSearchParams(location.search).get("path") || location.pathname);
const match = requestedPath.match(/^\/projects\/([^/]+)/);
const project = match ? getProject(decodeURIComponent(match[1])) : null;

/* ===== SCROLL ANIMATIONS ===== */
const io = new IntersectionObserver((entries) => {
  entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("revealed"); io.unobserve(e.target); } });
}, { threshold: 0.12, rootMargin: "0px 0px -50px 0px" });

function initReveal() {
  document.querySelectorAll(".visual-project-card, .about-grid > *, .section-heading, .skills-cloud span, .timeline article, .education-card, .language-card, .case-hero-main, .case-identity, .case-overview > *, .case-story, .case-metrics article, .capability-grid article, .case-outcome > *, .proof-strip div, .footer-grid > *").forEach((el, i) => {
    el.classList.add("reveal");
    el.style.transitionDelay = `${Math.min(i * 40, 400)}ms`;
    io.observe(el);
  });
}

function scrollToHash() {
  if (!location.hash || location.hash.length < 2) return;
  let id = location.hash.slice(1);
  try { id = decodeURIComponent(id); } catch (error) { /* keep the raw value */ }
  // The markup is rendered after load, so the browser cannot jump on its own.
  document.getElementById(id)?.scrollIntoView();
}

function render() {
  document.documentElement.lang = language;
  document.querySelector('meta[name="description"]')?.setAttribute("content", t("metaDescription"));
  root.innerHTML = project ? projectPage(project) : homePage();
  root.querySelectorAll("[data-language]").forEach((button) => {
    button.addEventListener("click", () => {
      language = button.dataset.language;
      localStorage.setItem("portfolio-language", language);
      render();
    });
  });
  initReveal();
  scrollToHash();
}

render();