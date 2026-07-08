/* ============================================================
   JV.OS — Portfólio · boot sequence, glow orb e interações
   ============================================================ */

(() => {
  // ?boot na URL força a animação mesmo com prefers-reduced-motion (útil pra demo)
  const forceBoot = new URLSearchParams(location.search).has("boot");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches && !forceBoot;

  /* ---------- BOOT SEQUENCE ---------- */
  const boot = document.getElementById("boot");
  const bootLines = document.getElementById("bootLines");
  const bootDots = document.getElementById("bootDots");
  const bootPercent = document.getElementById("bootPercent");
  const bootSkip = document.getElementById("bootSkip");

  const LINES = [
    "> inicializando jv.os v1.0",
    "> carregando módulos: fullstack",
    "> python ......... ok",
    "> html/css ....... ok",
    "> café ........... ok",
    "> bem-vindo(a).",
  ];

  const TOTAL_DOTS = 24;
  let bootFinished = false;

  function finishBoot() {
    if (bootFinished) return;
    bootFinished = true;
    boot.classList.add("boot--flicker");
    setTimeout(() => {
      boot.classList.add("boot--done");
      document.body.classList.add("booted");
      revealHeroTitle();
    }, 450);
  }

  function runBoot() {
    // pontos da barra de progresso
    for (let i = 0; i < TOTAL_DOTS; i++) {
      bootDots.appendChild(document.createElement("span"));
    }
    const dots = bootDots.querySelectorAll("span");

    const DURATION = 2200;
    const start = performance.now();

    function tick(now) {
      if (bootFinished) return;
      const t = Math.min((now - start) / DURATION, 1);
      // easing com "trancos" pra parecer boot real
      const eased = t < 0.7 ? t * 0.8 : 0.56 + (t - 0.7) * 1.4667;
      const pct = Math.floor(eased * 100);
      bootPercent.textContent = pct + "%";
      dots.forEach((d, i) => d.classList.toggle("on", i / TOTAL_DOTS < eased));

      const lineIdx = Math.floor(t * LINES.length);
      while (bootLines.children.length < Math.min(lineIdx + 1, LINES.length)) {
        const el = document.createElement("div");
        el.className = "boot__line";
        el.textContent = LINES[bootLines.children.length];
        if (el.textContent.includes("ok")) el.classList.add("boot__line--ok");
        bootLines.appendChild(el);
      }

      if (t < 1) {
        requestAnimationFrame(tick);
      } else {
        bootPercent.textContent = "100%";
        setTimeout(finishBoot, 250);
      }
    }

    requestAnimationFrame(tick);
  }

  if (reducedMotion) {
    boot.remove();
    document.body.classList.add("booted");
  } else {
    runBoot();
    bootSkip.addEventListener("click", finishBoot);
    window.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === "Escape") finishBoot();
    });
  }

  /* ---------- TÍTULO DO HERO (letra por letra) ---------- */
  function splitChars(el) {
    const text = el.textContent;
    el.textContent = "";
    el.setAttribute("aria-label", text);
    [...text].forEach((ch, i) => {
      const span = document.createElement("span");
      span.className = "char";
      span.style.setProperty("--i", i);
      span.setAttribute("aria-hidden", "true");
      span.textContent = ch === " " ? " " : ch;
      el.appendChild(span);
    });
  }

  const heroLines = document.querySelectorAll(".hero__line");
  let heroSplit = false;

  function revealHeroTitle() {
    if (heroSplit || reducedMotion) return;
    heroSplit = true;
    heroLines.forEach(splitChars);
  }

  /* ---------- GLOW ORB (segue o mouse) ---------- */
  const orb = document.getElementById("orb");
  let ox = window.innerWidth / 2;
  let oy = window.innerHeight / 3;
  let tx = ox;
  let ty = oy;

  if (!reducedMotion) {
    window.addEventListener("pointermove", (e) => {
      tx = e.clientX;
      ty = e.clientY;
    });

    (function animateOrb() {
      ox += (tx - ox) * 0.06;
      oy += (ty - oy) * 0.06;
      orb.style.transform = `translate(${ox - 280}px, ${oy - 280}px)`;
      requestAnimationFrame(animateOrb);
    })();
  } else {
    orb.style.transform = `translate(${ox - 280}px, ${oy - 280}px)`;
  }

  /* ---------- NAVBAR ---------- */
  const nav = document.getElementById("nav");
  window.addEventListener("scroll", () => {
    nav.classList.toggle("nav--scrolled", window.scrollY > 20);
  }, { passive: true });

  /* ---------- SCROLL REVEAL ---------- */
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

  /* ---------- SPOTLIGHT NOS CARDS DE PROJETO ---------- */
  document.querySelectorAll(".project").forEach((card) => {
    card.addEventListener("pointermove", (e) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${e.clientX - rect.left}px`);
      card.style.setProperty("--my", `${e.clientY - rect.top}px`);
    });
  });

  /* ---------- NÍVEIS DAS SKILLS (bolinhas) ---------- */
  document.querySelectorAll(".skill").forEach((skill) => {
    const level = parseInt(skill.dataset.level, 10) || 0;
    const dotsEl = skill.querySelector(".skill__dots");
    for (let i = 0; i < 5; i++) {
      const dot = document.createElement("span");
      if (i < level) dot.classList.add("on");
      dotsEl.appendChild(dot);
    }
  });

  /* ---------- ANO NO FOOTER ---------- */
  document.getElementById("year").textContent = new Date().getFullYear();
})();
