/* ============================================================
   Sonu Sharma — Portfolio interactions
   ============================================================ */

(function () {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Theme ---------- */
  const root = document.documentElement;
  const themeToggle = document.getElementById("themeToggle");
  const themeMeta = document.querySelector('meta[name="theme-color"]');
  const systemLight = window.matchMedia("(prefers-color-scheme: light)");
  const THEME_COLORS = { dark: "#08090d", light: "#f6f5f1" };

  function storedTheme() {
    try {
      const t = localStorage.getItem("theme");
      return t === "dark" || t === "light" ? t : null;
    } catch (e) {
      return null;
    }
  }

  function setTheme(theme, animate, persist) {
    root.dataset.theme = theme;
    if (themeMeta) themeMeta.setAttribute("content", THEME_COLORS[theme]);

    if (themeToggle) {
      const next = theme === "dark" ? "light" : "dark";
      themeToggle.setAttribute("aria-label", "Switch to " + next + " mode");
      themeToggle.setAttribute("aria-pressed", theme === "light" ? "true" : "false");
    }

    if (persist) {
      try {
        localStorage.setItem("theme", theme);
      } catch (e) {}
    }

    if (animate && !reduceMotion) {
      root.classList.add("theme-anim");
      window.setTimeout(function () {
        root.classList.remove("theme-anim");
      }, 420);
    }
  }

  setTheme(root.dataset.theme === "light" ? "light" : "dark", false, false);

  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      setTheme(root.dataset.theme === "light" ? "dark" : "light", true, true);
    });
  }

  if (systemLight.addEventListener) {
    systemLight.addEventListener("change", function (e) {
      if (!storedTheme()) setTheme(e.matches ? "light" : "dark", true, false);
    });
  }

  /* ---------- Year ---------- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ---------- Nav: scroll state + progress + active link ---------- */
  const nav = document.getElementById("nav");
  const progressBar = document.getElementById("progressBar");
  const navLinks = Array.from(document.querySelectorAll('.nav__links a[href^="#"]'));
  const menuLinks = Array.from(document.querySelectorAll(".nav__links a"));
  const sections = navLinks
    .map((a) => document.querySelector(a.getAttribute("href")))
    .filter(Boolean);

  let ticking = false;

  function onScroll() {
    const y = window.scrollY || window.pageYOffset;

    if (nav) nav.classList.toggle("is-scrolled", y > 12);

    if (progressBar) {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const ratio = max > 0 ? Math.min(y / max, 1) : 0;
      progressBar.style.transform = "scaleX(" + ratio + ")";
    }

    const probe = y + 140;
    let currentId = "";
    for (const section of sections) {
      if (section.offsetTop <= probe) currentId = section.id;
    }
    navLinks.forEach((a) => {
      a.classList.toggle("is-active", a.getAttribute("href") === "#" + currentId);
    });

    ticking = false;
  }

  window.addEventListener(
    "scroll",
    function () {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(onScroll);
      }
    },
    { passive: true }
  );
  onScroll();

  /* ---------- Mobile menu ---------- */
  const navToggle = document.getElementById("navToggle");

  function closeMenu() {
    document.body.classList.remove("nav-open");
    const panel = document.getElementById("navLinks");
    if (panel) panel.classList.remove("is-open");
    if (navToggle) {
      navToggle.setAttribute("aria-expanded", "false");
      navToggle.setAttribute("aria-label", "Open menu");
    }
  }

  if (navToggle) {
    navToggle.addEventListener("click", function () {
      const panel = document.getElementById("navLinks");
      const isOpen = document.body.classList.toggle("nav-open");
      if (panel) panel.classList.toggle("is-open", isOpen);
      navToggle.setAttribute("aria-expanded", String(isOpen));
      navToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
    });
  }

  menuLinks.forEach((a) => a.addEventListener("click", closeMenu));

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeMenu();
  });

  window.addEventListener("resize", function () {
    if (window.innerWidth > 860) closeMenu();
  });

  /* ---------- Reveal on scroll ---------- */
  const revealEls = document.querySelectorAll(".reveal");

  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  } else {
    const revealObserver = new IntersectionObserver(
      function (entries, observer) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach((el) => revealObserver.observe(el));
  }

  /* ---------- Timeline spine draw ---------- */
  const timelineEl = document.querySelector(".timeline");
  if (timelineEl) {
    if (reduceMotion || !("IntersectionObserver" in window)) {
      timelineEl.classList.add("is-visible");
    } else {
      const tlObs = new IntersectionObserver(function (entries, o) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { timelineEl.classList.add("is-visible"); o.unobserve(timelineEl); }
        });
      }, { threshold: 0.05 });
      tlObs.observe(timelineEl);
    }
  }

  /* ---------- Animated counters ---------- */
  const counters = document.querySelectorAll("[data-count]");

  function animateCount(el) {
    const target = parseFloat(el.getAttribute("data-count"));
    const prefix = el.getAttribute("data-prefix") || "";
    const suffix = el.getAttribute("data-suffix") || "";
    const duration = 2000;
    const start = performance.now();
    el.classList.add("is-counting");

    function frame(now) {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = prefix + Math.round(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(frame);
      else {
        el.textContent = prefix + target + suffix;
        el.classList.remove("is-counting");
      }
    }
    requestAnimationFrame(frame);
  }

  // Start from 0 so the count-up is visibly animated (no flash of final value)
  counters.forEach((el) => {
    el.textContent =
      (el.getAttribute("data-prefix") || "") +
      "0" +
      (el.getAttribute("data-suffix") || "");
  });

  if (reduceMotion || !("IntersectionObserver" in window)) {
    counters.forEach((el) => {
      el.textContent =
        (el.getAttribute("data-prefix") || "") +
        el.getAttribute("data-count") +
        (el.getAttribute("data-suffix") || "");
    });
  } else {
    const countObserver = new IntersectionObserver(
      function (entries, observer) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCount(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.6 }
    );
    counters.forEach((el) => countObserver.observe(el));
  }

  /* ---------- Copy email ---------- */
  const copyBtn = document.getElementById("copyEmail");
  const toast = document.getElementById("toast");
  let toastTimer;

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toast.classList.remove("is-visible");
    }, 2200);
  }

  if (copyBtn) {
    copyBtn.addEventListener("click", function () {
      const email = copyBtn.getAttribute("data-email") || "";
      const label = copyBtn.querySelector("span");
      const done = function () {
        showToast("Email copied to clipboard");
        if (label) {
          const original = label.textContent;
          label.textContent = "Copied!";
          setTimeout(function () {
            label.textContent = original;
          }, 2000);
        }
      };

      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(email).then(done).catch(function () {
          showToast(email);
        });
      } else {
        const ta = document.createElement("textarea");
        ta.value = email;
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        try {
          document.execCommand("copy");
          done();
        } catch (err) {
          showToast(email);
        }
        document.body.removeChild(ta);
      }
    });
  }

  /* ---------- Pointer glow on skill cards ---------- */
  if (!reduceMotion && window.matchMedia("(hover: hover)").matches) {
    document.querySelectorAll(".skill-card").forEach(function (card) {
      card.addEventListener("pointermove", function (e) {
        const rect = card.getBoundingClientRect();
        card.style.setProperty("--mx", ((e.clientX - rect.left) / rect.width) * 100 + "%");
        card.style.setProperty("--my", ((e.clientY - rect.top) / rect.height) * 100 + "%");
      });
    });
  }
})();

(function () {
  "use strict";
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  /* ---------- Ambient particle field ---------- */
  const canvas = document.querySelector(".bg-particles");
  if (canvas && !reduceMotion) {
    const ctx = canvas.getContext("2d");
    let w = 0, h = 0, dpr = 1;
    let particles = [];
    const COUNT = 42;

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function makeParticle() {
      return {
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.6 + 0.4,
        vx: (Math.random() - 0.5) * 0.18,
        vy: -Math.random() * 0.22 - 0.05,
        a: Math.random() * 0.5 + 0.15,
        hue: Math.random() < 0.6 ? "accent" : "accent2",
      };
    }

    function init() {
      resize();
      particles = [];
      for (let i = 0; i < COUNT; i++) particles.push(makeParticle());
    }

    function isDark() {
      return document.documentElement.dataset.theme !== "light";
    }

    let running = true;
    document.addEventListener("visibilitychange", function () {
      running = !document.hidden;
      if (running) tick();
    });

    function tick() {
      if (!running) return;
      ctx.clearRect(0, 0, w, h);
      const dark = isDark();
      particles.forEach(function (p) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.y < -10) { p.y = h + 10; p.x = Math.random() * w; }
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = dark
          ? (p.hue === "accent" ? "rgba(139,123,255," + p.a + ")" : "rgba(78,224,200," + (p.a * 0.8) + ")")
          : (p.hue === "accent" ? "rgba(107,91,255," + (p.a * 0.7) + ")" : "rgba(12,124,110," + (p.a * 0.6) + ")");
        ctx.fill();
      });
      requestAnimationFrame(tick);
    }

    init();
    window.addEventListener("resize", function () { resize(); });
    tick();
  }
})();

(function () {
  "use strict";
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  if (!window.matchMedia("(hover: hover)").matches) return;

  /* ---------- 3D tilt on cards ---------- */
  const tiltTargets = document.querySelectorAll(".job__card, .skill-card, .panel, .award, .edu");
  tiltTargets.forEach(function (el) {
    el.addEventListener("mousemove", function (e) {
      const rect = el.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      const rx = (-py * 7).toFixed(2);
      const ry = (px * 9).toFixed(2);
      el.style.transform = "perspective(900px) rotateX(" + rx + "deg) rotateY(" + ry + "deg) translateY(-4px)";
    });
    el.addEventListener("mouseleave", function () {
      el.style.transform = "";
    });
  });

  /* ---------- Magnetic buttons ---------- */
  document.querySelectorAll(".btn, .theme-toggle, .nav__links a").forEach(function (btn) {
    btn.addEventListener("mousemove", function (e) {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = "translate(" + (x * 0.18).toFixed(1) + "px, " + (y * 0.22).toFixed(1) + "px)";
    });
    btn.addEventListener("mouseleave", function () {
      btn.style.transform = "";
    });
  });

  /* ---------- Hero portrait parallax ---------- */
  const portrait = document.querySelector(".portrait");
  const hero = document.querySelector(".hero");
  if (portrait && hero) {
    hero.addEventListener("mousemove", function (e) {
      const rect = hero.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      portrait.style.transform = "translate(" + (px * -12).toFixed(1) + "px, " + (py * -10).toFixed(1) + "px) rotate(" + (px * 2).toFixed(2) + "deg)";
    });
    hero.addEventListener("mouseleave", function () {
      portrait.style.transform = "";
    });
  }
})();
