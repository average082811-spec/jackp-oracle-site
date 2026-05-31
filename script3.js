const header = document.querySelector("[data-header]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const mobileMenu = document.querySelector("[data-mobile-menu]");
const modalRoot = document.querySelector("[data-modal-root]");
const modalOpeners = document.querySelectorAll("[data-modal-open]");
const modalClosers = document.querySelectorAll("[data-modal-close]");
const backToTop = document.querySelector("[data-back-to-top]");
const waveCanvas = document.querySelector("[data-wave-canvas]");
const particleCanvas = document.querySelector("[data-particle-canvas]");

const closeMobileMenu = () => {
  header?.classList.remove("menu-open");
  menuToggle?.setAttribute("aria-label", "메뉴 열기");
};

menuToggle?.addEventListener("click", () => {
  const isOpen = header?.classList.toggle("menu-open");
  menuToggle.setAttribute("aria-label", isOpen ? "메뉴 닫기" : "메뉴 열기");
});

mobileMenu?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", closeMobileMenu);
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
);

document.querySelectorAll(".reveal").forEach((element) => {
  revealObserver.observe(element);
});

const closeModal = () => {
  modalRoot?.classList.remove("is-open");
  modalRoot?.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  document.querySelectorAll("[data-modal]").forEach((modal) => {
    modal.classList.remove("is-open");
  });
};

const openModal = (modalId) => {
  const target = document.querySelector(`[data-modal="${modalId}"]`);
  if (!target || !modalRoot) return;

  document.querySelectorAll("[data-modal]").forEach((modal) => {
    modal.classList.toggle("is-open", modal === target);
  });

  modalRoot.classList.add("is-open");
  modalRoot.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  target.querySelector("button, a")?.focus();
};

modalOpeners.forEach((button) => {
  button.addEventListener("click", () => openModal(button.dataset.modalOpen));
});

modalClosers.forEach((button) => {
  button.addEventListener("click", closeModal);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeModal();
    closeMobileMenu();
  }
});

backToTop?.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

if (waveCanvas) {
  const ctx = waveCanvas.getContext("2d");
  let frameId;
  let time = 0;

  const resizeWave = () => {
    const ratio = window.devicePixelRatio || 1;
    waveCanvas.width = Math.floor(window.innerWidth * ratio);
    waveCanvas.height = Math.floor(window.innerHeight * ratio);
    waveCanvas.style.width = `${window.innerWidth}px`;
    waveCanvas.style.height = `${window.innerHeight}px`;
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  };

  const drawWave = () => {
    const width = window.innerWidth;
    const height = Math.max(window.innerHeight, 760);
    ctx.clearRect(0, 0, width, height);
    time += 0.004;

    const ribbons = [
      {
        y: 0.48,
        amplitude: 78,
        frequency: 0.0031,
        speed: 1.1,
        width: 34,
        colorA: "rgba(124, 60, 255, 0)",
        colorB: "rgba(124, 60, 255, 0.22)",
        colorC: "rgba(82, 138, 255, 0.15)",
        offset: 0,
      },
      {
        y: 0.58,
        amplitude: 92,
        frequency: 0.0024,
        speed: 0.86,
        width: 46,
        colorA: "rgba(78, 124, 255, 0)",
        colorB: "rgba(78, 124, 255, 0.14)",
        colorC: "rgba(170, 111, 255, 0.2)",
        offset: 2.1,
      },
      {
        y: 0.37,
        amplitude: 58,
        frequency: 0.0036,
        speed: 1.35,
        width: 22,
        colorA: "rgba(255, 74, 105, 0)",
        colorB: "rgba(255, 74, 105, 0.11)",
        colorC: "rgba(124, 60, 255, 0.13)",
        offset: 4.3,
      },
    ];

    ctx.globalCompositeOperation = "lighter";
    ctx.filter = "blur(14px)";

    ribbons.forEach((ribbon) => {
      const gradient = ctx.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, ribbon.colorA);
      gradient.addColorStop(0.36, ribbon.colorB);
      gradient.addColorStop(0.7, ribbon.colorC);
      gradient.addColorStop(1, ribbon.colorA);
      ctx.strokeStyle = gradient;
      ctx.lineWidth = ribbon.width;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      for (let layer = 0; layer < 4; layer += 1) {
        ctx.beginPath();

        for (let x = -80; x <= width + 80; x += 16) {
          const drift = time * ribbon.speed + ribbon.offset + layer * 0.55;
          const y =
            height * ribbon.y +
            Math.sin(x * ribbon.frequency + drift) * ribbon.amplitude +
            Math.cos(x * 0.0014 + drift * 0.8) * 36 +
            Math.sin(x * 0.006 + drift * 1.4) * 10 +
            layer * 18;

          if (x === -80) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }

        ctx.globalAlpha = 0.26 - layer * 0.04;
        ctx.stroke();
      }
    });

    ctx.filter = "blur(2px)";
    ctx.globalAlpha = 0.22;
    ctx.lineWidth = 1.2;

    ribbons.forEach((ribbon) => {
      ctx.beginPath();
      ctx.strokeStyle = ribbon.colorB;

      for (let x = -80; x <= width + 80; x += 12) {
        const drift = time * ribbon.speed + ribbon.offset;
        const y =
          height * ribbon.y +
          Math.sin(x * ribbon.frequency + drift) * ribbon.amplitude +
          Math.cos(x * 0.0014 + drift * 0.8) * 36;

        if (x === -80) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }

      ctx.stroke();
    });

    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = "source-over";
    ctx.filter = "none";

    const glow = ctx.createRadialGradient(width * 0.08, height * 0.88, 0, width * 0.08, height * 0.88, width * 0.46);
    glow.addColorStop(0, "rgba(124, 60, 255, 0.22)");
    glow.addColorStop(0.38, "rgba(124, 60, 255, 0.08)");
    glow.addColorStop(1, "rgba(124, 60, 255, 0)");
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, width, height);

    const topGlow = ctx.createRadialGradient(width * 0.82, height * 0.16, 0, width * 0.82, height * 0.16, width * 0.34);
    topGlow.addColorStop(0, "rgba(78, 124, 255, 0.16)");
    topGlow.addColorStop(1, "rgba(78, 124, 255, 0)");
    ctx.fillStyle = topGlow;
    ctx.fillRect(0, 0, width, height);

    ctx.globalAlpha = 0.06;
    ctx.strokeStyle = "rgba(255,255,255,0.72)";
    ctx.lineWidth = 1;

    for (let i = 0; i < 18; i += 1) {
      const x = (width / 18) * i + Math.sin(time * 0.8 + i) * 10;
      const y = height * (0.2 + ((i * 37) % 60) / 100);
      ctx.beginPath();
      ctx.arc(x, y, 1.4, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.globalAlpha = 1;

    frameId = requestAnimationFrame(drawWave);
  };

  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    resizeWave();
    drawWave();
    window.addEventListener("resize", resizeWave);
  }
}

if (particleCanvas) {
  const ctx = particleCanvas.getContext("2d");
  let particles = [];
  let width = 0;
  let height = 0;
  let ratio = 1;
  let frameId;
  const pointer = { x: null, y: null, radius: 140 };

  const createParticles = () => {
    const baseCount = Math.floor((width * height) / 13500);
    const count = width < 760 ? Math.min(54, Math.max(30, baseCount)) : Math.min(132, Math.max(72, baseCount));

    const anchors =
      width < 760
        ? [
            [0.14, 0.16],
            [0.22, 0.3],
            [0.1, 0.48],
            [0.26, 0.62],
            [0.48, 0.18],
            [0.7, 0.34],
            [0.82, 0.58],
            [0.66, 0.78],
          ]
        : [
            [0.08, 0.2],
            [0.14, 0.34],
            [0.07, 0.52],
            [0.18, 0.68],
            [0.28, 0.22],
            [0.36, 0.52],
            [0.48, 0.76],
            [0.68, 0.2],
            [0.82, 0.36],
            [0.9, 0.58],
            [0.78, 0.78],
          ];

    particles = anchors.map(([x, y]) => ({
      x: x * width,
      y: y * height,
      dx: (Math.random() - 0.5) * 0.28,
      dy: (Math.random() - 0.5) * 0.28,
      size: 1.9 + Math.random() * 1.4,
      alpha: 0.72 + Math.random() * 0.2,
    }));

    const remaining = Math.max(0, count - particles.length);
    particles.push(
      ...Array.from({ length: remaining }, (_, index) => {
        const leftField = index % 2 === 0;
        const rightField = index % 5 === 0;
        const x = leftField
          ? width * (0.04 + Math.random() * 0.44)
          : rightField
            ? width * (0.62 + Math.random() * 0.34)
            : Math.random() * width;
      return {
        x,
        y: Math.random() * height,
        dx: (Math.random() - 0.5) * 0.42,
        dy: (Math.random() - 0.5) * 0.42,
        size: 0.85 + Math.random() * 1.85,
        alpha: leftField ? 0.52 + Math.random() * 0.34 : 0.38 + Math.random() * 0.48,
      };
      })
    );
  };

  const resizeParticles = () => {
    const hero = particleCanvas.closest(".hero-alt") || particleCanvas.parentElement;
    const rect = hero.getBoundingClientRect();
    ratio = Math.min(window.devicePixelRatio || 1, 2);
    width = Math.max(1, Math.floor(rect.width));
    height = Math.max(1, Math.floor(rect.height));
    particleCanvas.width = Math.floor(width * ratio);
    particleCanvas.height = Math.floor(height * ratio);
    particleCanvas.style.width = `${width}px`;
    particleCanvas.style.height = `${height}px`;
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    createParticles();
  };

  const updateParticle = (particle) => {
    particle.x += particle.dx;
    particle.y += particle.dy;

    if (particle.x < -12 || particle.x > width + 12) particle.dx *= -1;
    if (particle.y < -12 || particle.y > height + 12) particle.dy *= -1;

    if (pointer.x !== null && pointer.y !== null) {
      const dx = pointer.x - particle.x;
      const dy = pointer.y - particle.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < pointer.radius && distance > 0) {
        const force = (pointer.radius - distance) / pointer.radius;
        particle.x -= (dx / distance) * force * 1.6;
        particle.y -= (dy / distance) * force * 1.6;
      }
    }
  };

  const drawParticle = (particle) => {
    const glow = ctx.createRadialGradient(particle.x, particle.y, 0, particle.x, particle.y, particle.size * 9);
    glow.addColorStop(0, `rgba(255, 255, 255, ${particle.alpha * 0.9})`);
    glow.addColorStop(0.34, `rgba(178, 143, 255, ${particle.alpha * 0.5})`);
    glow.addColorStop(1, "rgba(124, 60, 255, 0)");
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.size * 8, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = `rgba(224, 213, 255, ${Math.min(0.9, particle.alpha + 0.08)})`;
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
    ctx.fill();
  };

  const connectParticles = () => {
    const maxDistance = width < 760 ? 120 : 170;
    for (let i = 0; i < particles.length; i += 1) {
      for (let j = i + 1; j < particles.length; j += 1) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < maxDistance) {
          const opacity = (1 - distance / maxDistance) * 0.44;
          const gradient = ctx.createLinearGradient(particles[i].x, particles[i].y, particles[j].x, particles[j].y);
          gradient.addColorStop(0, `rgba(178, 143, 255, ${opacity})`);
          gradient.addColorStop(1, `rgba(94, 164, 255, ${opacity * 0.72})`);
          ctx.strokeStyle = gradient;
          ctx.lineWidth = 0.96;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
  };

  const drawParticles = (animate = true) => {
    ctx.clearRect(0, 0, width, height);
    ctx.globalCompositeOperation = "lighter";

    particles.forEach((particle) => {
      if (animate) updateParticle(particle);
    });

    connectParticles();
    particles.forEach(drawParticle);
    ctx.globalCompositeOperation = "source-over";

    if (animate) {
      frameId = requestAnimationFrame(drawParticles);
    }
  };

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  resizeParticles();
  drawParticles(!reducedMotion);

  window.addEventListener("resize", () => {
    resizeParticles();
    if (reducedMotion) drawParticles(false);
  });

  window.addEventListener("pagehide", () => cancelAnimationFrame(frameId));

  if (!reducedMotion) {
    particleCanvas.parentElement.addEventListener("pointermove", (event) => {
      const rect = particleCanvas.getBoundingClientRect();
      pointer.x = event.clientX - rect.left;
      pointer.y = event.clientY - rect.top;
    });

    particleCanvas.parentElement.addEventListener("pointerleave", () => {
      pointer.x = null;
      pointer.y = null;
    });
  }
}
