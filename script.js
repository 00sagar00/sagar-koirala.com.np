const navItems = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'projects', label: 'Projects' },
  { id: 'skills', label: 'Skills' },
  { id: 'contact', label: 'Contact' },
];

const projects = [
  {
    id: 1,
    title: 'PulseBoard',
    description: 'Realtime analytics dashboard for creator communities.',
    image:
      'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=1200&q=80',
    stack: ['React', 'Node API', 'WebSocket'],
    live: 'https://example.com',
    code: 'https://github.com',
    details:
      'Live cards animate based on stream velocity and top events, with a custom alerting pipeline.',
  },
  {
    id: 2,
    title: 'Nomad Notes',
    description: 'Offline-first travel journal with map moments and voice notes.',
    image:
      'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
    stack: ['PWA', 'IndexedDB', 'GSAP'],
    live: 'https://example.com',
    code: 'https://github.com',
    details:
      'Entries sync when online and preserve transitions with buttery route animations on weak networks.',
  },
  {
    id: 3,
    title: 'SkillSprint',
    description: 'Gamified learning challenge app for coding cohorts.',
    image:
      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80',
    stack: ['React', 'Firebase', 'Charting'],
    live: 'https://example.com',
    code: 'https://github.com',
    details:
      'Weekly challenge ladders, streak mechanics, and cohort heatmaps boosted completion by 32%.',
  },
];

const skills = [
  { name: 'React / Next.js', value: 92 },
  { name: 'UI Motion (GSAP)', value: 88 },
  { name: 'Node + APIs', value: 84 },
  { name: 'Design Systems', value: 79 },
];

const state = {
  theme: 'dark',
  activeProject: 1,
  tapCount: 0,
  party: false,
  mouse: { x: 0.5, y: 0.5 },
};

const elements = {
  appShell: document.getElementById('app-shell'),
  navItems: document.getElementById('nav-items'),
  themeToggle: document.getElementById('theme-toggle'),
  projectGrid: document.getElementById('project-grid'),
  projectPreview: document.getElementById('project-preview'),
  skillList: document.getElementById('skill-list'),
  secretTapTarget: document.getElementById('secret-tap-target'),
  particleLayer: document.getElementById('particle-layer'),
  cursorOrb: document.getElementById('cursor-orb'),
  contactForm: document.getElementById('contact-form'),
  submitBtn: document.getElementById('submit-btn'),
  formNote: document.getElementById('form-note'),
};

function setTheme(theme) {
  state.theme = theme;
  document.documentElement.setAttribute('data-theme', theme);
  elements.themeToggle.textContent = theme === 'dark' ? 'Light Mode' : 'Dark Mode';
}

function buildNav() {
  elements.navItems.innerHTML = navItems
    .map((item) => `<li><a href="#${item.id}">${item.label}</a></li>`)
    .join('');
}

function getActiveProject() {
  return projects.find((project) => project.id === state.activeProject) || projects[0];
}

function renderProjects() {
  elements.projectGrid.innerHTML = projects
    .map(
      (project) => `
      <article class="project-card ${project.id === state.activeProject ? 'active' : ''}" data-project-id="${project.id}">
        <img src="${project.image}" alt="${project.title}" loading="lazy" />
        <div class="project-body">
          <h3>${project.title}</h3>
          <p>${project.description}</p>
        </div>
      </article>
    `,
    )
    .join('');
}

function renderProjectPreview() {
  const active = getActiveProject();
  elements.projectPreview.innerHTML = `
    <h3>${active.title}</h3>
    <p>${active.details}</p>
    <div class="chips">
      ${active.stack.map((tech) => `<span>${tech}</span>`).join('')}
    </div>
    <div class="preview-actions">
      <a href="${active.live}" target="_blank" rel="noreferrer">Live Demo</a>
      <a href="${active.code}" target="_blank" rel="noreferrer">Source Code</a>
    </div>
  `;
}

function bindProjectClicks() {
  elements.projectGrid.addEventListener('click', (event) => {
    const card = event.target.closest('.project-card');
    if (!card) {
      return;
    }

    state.activeProject = Number(card.dataset.projectId);
    renderProjects();
    renderProjectPreview();
  });
}

function renderSkills() {
  elements.skillList.innerHTML = skills
    .map(
      (skill) => `
      <div class="skill-row">
        <div class="skill-meta">
          <span>${skill.name}</span>
          <strong>${skill.value}%</strong>
        </div>
        <div class="skill-track">
          <div class="skill-fill" data-skill-value="${skill.value}"></div>
        </div>
      </div>
    `,
    )
    .join('');
}

function animateSkillBars() {
  const bars = document.querySelectorAll('.skill-fill');

  bars.forEach((bar, index) => {
    const value = Number(bar.dataset.skillValue || 0);
    if (window.gsap) {
      window.gsap.to(bar, {
        width: `${value}%`,
        duration: 1,
        delay: 0.15 * index,
        ease: 'power2.out',
      });
      return;
    }

    bar.style.transition = `width 1s ease ${0.15 * index}s`;
    bar.style.width = `${value}%`;
  });
}

function revealOnScroll() {
  const revealElements = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        if (window.gsap) {
          window.gsap.to(entry.target, {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.8,
            ease: 'power3.out',
          });
        } else {
          entry.target.style.transition = 'transform 0.8s ease, opacity 0.8s ease';
          entry.target.style.transform = 'translateY(0) scale(1)';
          entry.target.style.opacity = '1';
        }

        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.16 },
  );

  revealElements.forEach((element) => observer.observe(element));
}

function bindThemeToggle() {
  elements.themeToggle.addEventListener('click', () => {
    setTheme(state.theme === 'dark' ? 'light' : 'dark');
  });
}

function bindSecretTap() {
  elements.secretTapTarget.addEventListener('click', () => {
    state.tapCount += 1;

    if (state.tapCount < 5) {
      return;
    }

    state.tapCount = 0;
    state.party = true;
    elements.appShell.classList.add('party');

    if (window.gsap) {
      const tween = window.gsap.fromTo(
        '.hero-badge',
        { rotate: -3, scale: 1 },
        {
          rotate: 3,
          scale: 1.08,
          repeat: 7,
          yoyo: true,
          duration: 0.2,
        },
      );

      setTimeout(() => {
        tween.kill();
        elements.appShell.classList.remove('party');
        state.party = false;
      }, 2200);
      return;
    }

    setTimeout(() => {
      elements.appShell.classList.remove('party');
      state.party = false;
    }, 2200);
  });
}

function bindPointerEffect() {
  window.addEventListener('pointermove', (event) => {
    state.mouse.x = event.clientX / window.innerWidth;
    state.mouse.y = event.clientY / window.innerHeight;
    const x = state.mouse.x * 70 - 35;
    const y = state.mouse.y * 70 - 35;
    elements.cursorOrb.style.transform = `translate(${x}px, ${y}px)`;
  });
}

function startParticles() {
  const canvas = elements.particleLayer;
  const ctx = canvas.getContext('2d');
  const particles = [];
  const count = 60;

  const resize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };

  resize();

  for (let i = 0; i < count; i += 1) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 2.6 + 0.6,
    });
  }

  const render = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const targetX = state.mouse.x * canvas.width;
    const targetY = state.mouse.y * canvas.height;

    particles.forEach((particle) => {
      const dx = targetX - particle.x;
      const dy = targetY - particle.y;
      const dist = Math.max(80, Math.hypot(dx, dy));

      particle.vx += (dx / dist) * 0.0015;
      particle.vy += (dy / dist) * 0.0015;
      particle.vx *= 0.99;
      particle.vy *= 0.99;

      particle.x += particle.vx;
      particle.y += particle.vy;

      if (particle.x < 0) particle.x = canvas.width;
      if (particle.x > canvas.width) particle.x = 0;
      if (particle.y < 0) particle.y = canvas.height;
      if (particle.y > canvas.height) particle.y = 0;

      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255,255,255,0.45)';
      ctx.fill();
    });

    requestAnimationFrame(render);
  };

  render();
  window.addEventListener('resize', resize);
}

function setFormMessage(message, isError) {
  elements.formNote.hidden = false;
  elements.formNote.className = isError ? 'form-note error' : 'form-note';
  elements.formNote.textContent = message;
}

function bindContactForm() {
  elements.contactForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData(elements.contactForm);
    const payload = {
      name: formData.get('name'),
      email: formData.get('email'),
      message: formData.get('message'),
    };

    const endpoint = window.FORMSPREE_ENDPOINT || '';

    if (!endpoint) {
      const subject = encodeURIComponent(`Portfolio inquiry from ${payload.name}`);
      const body = encodeURIComponent(
        `Name: ${payload.name}\nEmail: ${payload.email}\n\n${payload.message}`,
      );
      window.location.href = `mailto:sagar@example.com?subject=${subject}&body=${body}`;
      setFormMessage('Email draft opened. Set window.FORMSPREE_ENDPOINT for direct API send.', false);
      return;
    }

    try {
      elements.submitBtn.disabled = true;
      elements.submitBtn.textContent = 'Sending...';
      elements.formNote.hidden = true;

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Request failed');
      }

      elements.contactForm.reset();
      setFormMessage('Thanks! Message sent successfully.', false);
    } catch {
      setFormMessage('Could not send right now. Please try again in a bit.', true);
    } finally {
      elements.submitBtn.disabled = false;
      elements.submitBtn.textContent = 'Send Message';
    }
  });
}

function init() {
  setTheme(state.theme);
  buildNav();
  renderProjects();
  renderProjectPreview();
  bindProjectClicks();
  renderSkills();
  animateSkillBars();
  revealOnScroll();
  bindThemeToggle();
  bindSecretTap();
  bindPointerEffect();
  startParticles();
  bindContactForm();
}

init();
