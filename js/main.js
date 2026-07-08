/* ============================================================
   JV/MATOS — Portfólio v2
   boot · scramble · typewriter · cursor · spotlight · tilt
   count-up · timeline · magnetic · reveal
   ============================================================ */

(() => {
  // ?boot na URL força a animação mesmo com prefers-reduced-motion (útil pra demo)
  const forceBoot = new URLSearchParams(location.search).has("boot");
  const reducedMotion =
    window.matchMedia("(prefers-reduced-motion: reduce)").matches && !forceBoot;
  const finePointer = window.matchMedia("(pointer: fine)").matches;

  const SCRAMBLE_CHARS = "▓▒░<>/\\|_-·JVM10";

  /* ---------- SCRAMBLE (efeito decode nos títulos) ---------- */
  function scramble(el, duration = 700) {
    const target = el.dataset.text || el.textContent;
    const start = performance.now();

    function frame(now) {
      const t = Math.min((now - start) / duration, 1);
      const solved = Math.floor(t * target.length);
      let out = "";
      for (let i = 0; i < target.length; i++) {
        if (target[i] === " ") { out += " "; continue; }
        out += i < solved
          ? target[i]
          : SCRAMBLE_CHARS[(Math.random() * SCRAMBLE_CHARS.length) | 0];
      }
      el.textContent = out;
      if (t < 1) requestAnimationFrame(frame);
      else el.textContent = target;
    }

    requestAnimationFrame(frame);
  }

  /* ---------- BOOT ---------- */
  const boot = document.getElementById("boot");
  let bootDone = false;
  let heroStarted = false;

  function endBoot() {
    if (bootDone) return;
    bootDone = true;
    boot.classList.add("boot--done");
    startHero();
  }

  if (reducedMotion) {
    boot.remove();
    // adia para depois da inicialização de todas as declarações do script
    queueMicrotask(startHero);
  } else {
    const bar = document.getElementById("bootBar");
    const status = document.getElementById("bootStatus");
    const nameEl = document.getElementById("bootName");
    const STATUSES = ["carregando", "compilando estilo", "ligando luzes", "pronto"];

    scramble(nameEl, 900);

    const DURATION = 1700;
    const t0 = performance.now();

    (function tick(now) {
      if (bootDone) return;
      const t = Math.min((now - t0) / DURATION, 1);
      bar.style.width = (t * 100).toFixed(0) + "%";
      status.textContent = STATUSES[Math.min((t * STATUSES.length) | 0, STATUSES.length - 1)];
      if (t < 1) requestAnimationFrame(tick);
      else setTimeout(endBoot, 200);
    })(t0);

    window.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === "Escape") endBoot();
    });
    boot.addEventListener("click", endBoot);
  }

  /* ---------- HERO: scramble no nome + typewriter + terminal ---------- */
  function startHero() {
    if (heroStarted) return;
    heroStarted = true;

    if (!reducedMotion) {
      document.querySelectorAll(".hero__title .scramble").forEach((el, i) => {
        setTimeout(() => scramble(el, 850), i * 200);
      });
    }

    startTypewriter();
    startTerminal();
  }

  /* typewriter dos papéis */
  const ROLES = [
    "sistemas fullstack",
    "APIs em Python",
    "interfaces com alma",
    "automações úteis",
    "PWAs instaláveis",
  ];

  function startTypewriter() {
    const swap = document.getElementById("roleSwap");
    const span = swap.querySelector(".type-caret");

    if (reducedMotion) { span.textContent = ROLES[0]; return; }

    let roleIdx = 0;

    function typeRole() {
      const word = ROLES[roleIdx];
      let i = 0;

      (function typeChar() {
        span.textContent = word.slice(0, ++i);
        if (i < word.length) setTimeout(typeChar, 55);
        else setTimeout(eraseRole, 2100);
      })();
    }

    function eraseRole() {
      let text = span.textContent;

      (function eraseChar() {
        text = text.slice(0, -1);
        span.textContent = text;
        if (text.length) setTimeout(eraseChar, 28);
        else {
          roleIdx = (roleIdx + 1) % ROLES.length;
          setTimeout(typeRole, 300);
        }
      })();
    }

    span.textContent = "";
    typeRole();
  }

  /* terminal do hero */
  const TERMINAL_LINES = [
    { text: "$ whoami", cls: "t-text" },
    { text: "joao-victor · eng. de software", cls: "" },
    { text: "$ cat stack.txt", cls: "t-text" },
    { text: "python · fastapi · html/css · js", cls: "" },
    { text: "$ status", cls: "t-text" },
    { text: "▸ construindo o próximo projeto…", cls: "t-accent" },
  ];

  function startTerminal() {
    const body = document.getElementById("terminalBody");
    if (!body) return;

    if (reducedMotion) {
      body.innerHTML = TERMINAL_LINES
        .map((l) => `<span class="${l.cls}">${l.text}</span>`)
        .join("\n");
      return;
    }

    let li = 0;

    function nextLine() {
      if (li >= TERMINAL_LINES.length) return;
      const line = TERMINAL_LINES[li++];
      const span = document.createElement("span");
      span.className = line.cls;
      body.appendChild(span);

      let ci = 0;
      (function typeChar() {
        span.textContent = line.text.slice(0, ++ci);
        if (ci < line.text.length) setTimeout(typeChar, 22);
        else {
          body.appendChild(document.createTextNode("\n"));
          setTimeout(nextLine, line.text.startsWith("$") ? 180 : 420);
        }
      })();
    }

    setTimeout(nextLine, 600);
  }

  /* ---------- SPOTLIGHT (CSS vars — leve e robusto) ---------- */
  const spotlight = document.getElementById("spotlight");

  if (finePointer && !reducedMotion) {
    let sx = innerWidth / 2, sy = innerHeight / 4, txs = sx, tys = sy;

    window.addEventListener("pointermove", (e) => { txs = e.clientX; tys = e.clientY; }, { passive: true });

    (function animSpot() {
      sx += (txs - sx) * 0.08;
      sy += (tys - sy) * 0.08;
      spotlight.style.setProperty("--sx", sx + "px");
      spotlight.style.setProperty("--sy", sy + "px");
      requestAnimationFrame(animSpot);
    })();
  }

  /* ---------- CURSOR CUSTOMIZADO ---------- */
  if (finePointer && !reducedMotion) {
    const cursor = document.getElementById("cursor");
    const ring = document.getElementById("cursorRing");
    let cx = -100, cy = -100, rx = -100, ry = -100;
    let cursorShown = false;

    window.addEventListener("pointermove", (e) => {
      cx = e.clientX; cy = e.clientY;
      if (!cursorShown) { cursorShown = true; document.body.classList.add("cursor-on"); }
    }, { passive: true });

    (function animCursor() {
      rx += (cx - rx) * 0.18;
      ry += (cy - ry) * 0.18;
      cursor.style.transform = `translate(${cx}px, ${cy}px) translate(-50%, -50%)`;
      ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
      requestAnimationFrame(animCursor);
    })();

    document.querySelectorAll("[data-hover]").forEach((el) => {
      el.addEventListener("pointerenter", () => ring.classList.add("cursor-ring--hover"));
      el.addEventListener("pointerleave", () => ring.classList.remove("cursor-ring--hover"));
    });
  }

  /* ---------- SCROLL: navbar + barra de progresso + timeline ---------- */
  const nav = document.getElementById("nav");
  const progress = document.getElementById("scrollProgress");
  const timelineLine = document.getElementById("timelineLine");
  const timeline = document.querySelector(".timeline");

  function onScroll() {
    const y = window.scrollY;
    nav.classList.toggle("nav--scrolled", y > 20);

    const max = document.documentElement.scrollHeight - innerHeight;
    progress.style.width = (max > 0 ? (y / max) * 100 : 0) + "%";

    if (timeline && timelineLine) {
      const rect = timeline.getBoundingClientRect();
      const visible = Math.min(Math.max((innerHeight * 0.8 - rect.top) / rect.height, 0), 1);
      timelineLine.style.setProperty("--grow", visible.toFixed(3));
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- REVEAL com stagger ---------- */
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("visible");
      revealObs.unobserve(entry.target);
    });
  }, { threshold: 0.12 });

  document.querySelectorAll(".reveal").forEach((el, i) => {
    // stagger leve entre irmãos próximos
    el.style.setProperty("--stagger", `${(i % 4) * 0.08}s`);
    revealObs.observe(el);
  });

  /* ---------- SCRAMBLE nos títulos de seção ao aparecer ---------- */
  if (!reducedMotion) {
    const scrambleObs = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        scramble(entry.target, 650);
        scrambleObs.unobserve(entry.target);
      });
    }, { threshold: 0.5 });

    document.querySelectorAll(".section__header .scramble").forEach((el) => scrambleObs.observe(el));
  }

  /* ---------- COUNT-UP das estatísticas ---------- */
  const statObs = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const valueEl = el.querySelector(".stat__value");
      const target = parseInt(el.dataset.count, 10) || 0;
      const suffix = el.dataset.suffix || "";
      statObs.unobserve(el);

      if (reducedMotion) { valueEl.textContent = target + suffix; return; }

      const t0 = performance.now();
      (function count(now) {
        const t = Math.min((now - t0) / 1200, 1);
        const eased = 1 - Math.pow(1 - t, 3);
        valueEl.textContent = Math.round(eased * target) + suffix;
        if (t < 1) requestAnimationFrame(count);
      })(t0);
    });
  }, { threshold: 0.6 });

  document.querySelectorAll(".stat").forEach((el) => statObs.observe(el));

  /* ---------- NÍVEL DAS SKILLS (barra %) ---------- */
  document.querySelectorAll(".skill").forEach((skill) => {
    const level = parseInt(skill.dataset.level, 10) || 0;
    skill.style.setProperty("--pct", level * 20);
  });

  /* ---------- SPOTLIGHT nos cards de projeto ---------- */
  document.querySelectorAll(".project").forEach((card) => {
    card.addEventListener("pointermove", (e) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${e.clientX - rect.left}px`);
      card.style.setProperty("--my", `${e.clientY - rect.top}px`);
    });
  });

  /* ---------- TILT 3D ---------- */
  if (finePointer && !reducedMotion) {
    document.querySelectorAll(".tilt").forEach((el) => {
      el.addEventListener("pointermove", (e) => {
        const rect = el.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width - 0.5;
        const py = (e.clientY - rect.top) / rect.height - 0.5;
        el.style.transform = `perspective(700px) rotateY(${px * 8}deg) rotateX(${py * -8}deg)`;
      });
      el.addEventListener("pointerleave", () => {
        el.style.transform = "perspective(700px) rotateY(0deg) rotateX(0deg)";
      });
    });
  }

  /* ---------- BOTÕES MAGNÉTICOS ---------- */
  if (finePointer && !reducedMotion) {
    document.querySelectorAll("[data-magnetic]").forEach((el) => {
      el.addEventListener("pointermove", (e) => {
        const rect = el.getBoundingClientRect();
        const dx = e.clientX - (rect.left + rect.width / 2);
        const dy = e.clientY - (rect.top + rect.height / 2);
        el.style.transform = `translate(${dx * 0.18}px, ${dy * 0.18}px)`;
      });
      el.addEventListener("pointerleave", () => {
        el.style.transform = "translate(0, 0)";
      });
    });
  }

  /* ---------- ANO ---------- */
  document.getElementById("year").textContent = new Date().getFullYear();
})();
