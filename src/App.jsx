import { useEffect, useMemo, useRef, useState } from 'react'
import { gsap } from 'gsap'

const navItems = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'projects', label: 'Projects' },
  { id: 'skills', label: 'Skills' },
  { id: 'contact', label: 'Contact' },
]

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
]

const skills = [
  { name: 'React / Next.js', value: 92 },
  { name: 'UI Motion (GSAP)', value: 88 },
  { name: 'Node + APIs', value: 84 },
  { name: 'Design Systems', value: 79 },
]

function App() {
  const [theme, setTheme] = useState('dark')
  const [activeProject, setActiveProject] = useState(1)
  const [party, setParty] = useState(false)
  const [tapCount, setTapCount] = useState(0)
  const [formState, setFormState] = useState({
    loading: false,
    message: '',
    error: false,
  })
  const [mouse, setMouse] = useState({ x: 0.5, y: 0.5 })
  const canvasRef = useRef(null)
  const progressRefs = useRef([])

  const activeProjectData = useMemo(
    () => projects.find((project) => project.id === activeProject),
    [activeProject],
  )

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  useEffect(() => {
    const onMove = (event) => {
      setMouse({
        x: event.clientX / window.innerWidth,
        y: event.clientY / window.innerHeight,
      })
    }

    window.addEventListener('pointermove', onMove)
    return () => window.removeEventListener('pointermove', onMove)
  }, [])

  useEffect(() => {
    const revealElements = gsap.utils.toArray('.reveal')
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return
          }
          gsap.to(entry.target, {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.8,
            ease: 'power3.out',
          })
          observer.unobserve(entry.target)
        })
      },
      { threshold: 0.16 },
    )

    revealElements.forEach((element) => observer.observe(element))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    progressRefs.current.forEach((node, index) => {
      if (!node) {
        return
      }
      gsap.to(node, {
        width: `${skills[index].value}%`,
        duration: 1,
        delay: 0.15 * index,
        ease: 'power2.out',
      })
    })
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) {
      return
    }

    const ctx = canvas.getContext('2d')
    const particles = []
    const count = 60
    let frameId

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resize()

    for (let i = 0; i < count; i += 1) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: Math.random() * 2.6 + 0.6,
      })
    }

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const targetX = mouse.x * canvas.width
      const targetY = mouse.y * canvas.height

      particles.forEach((particle) => {
        const dx = targetX - particle.x
        const dy = targetY - particle.y
        const dist = Math.max(80, Math.hypot(dx, dy))

        particle.vx += (dx / dist) * 0.0015
        particle.vy += (dy / dist) * 0.0015
        particle.vx *= 0.99
        particle.vy *= 0.99

        particle.x += particle.vx
        particle.y += particle.vy

        if (particle.x < 0) particle.x = canvas.width
        if (particle.x > canvas.width) particle.x = 0
        if (particle.y < 0) particle.y = canvas.height
        if (particle.y > canvas.height) particle.y = 0

        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.r, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(255,255,255,0.45)'
        ctx.fill()
      })

      frameId = requestAnimationFrame(render)
    }

    render()
    window.addEventListener('resize', resize)
    return () => {
      cancelAnimationFrame(frameId)
      window.removeEventListener('resize', resize)
    }
  }, [mouse])

  useEffect(() => {
    if (!party) {
      return
    }
    const tween = gsap.fromTo(
      '.hero-badge',
      { rotate: -3, scale: 1 },
      {
        rotate: 3,
        scale: 1.08,
        repeat: 7,
        yoyo: true,
        duration: 0.2,
      },
    )

    const timeout = setTimeout(() => setParty(false), 2200)
    return () => {
      tween.kill()
      clearTimeout(timeout)
    }
  }, [party])

  const handleSecretTap = () => {
    const next = tapCount + 1
    setTapCount(next)
    if (next >= 5) {
      setParty(true)
      setTapCount(0)
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const payload = {
      name: formData.get('name'),
      email: formData.get('email'),
      message: formData.get('message'),
    }

    const endpoint = import.meta.env.VITE_FORMSPREE_ENDPOINT

    if (!endpoint) {
      const subject = encodeURIComponent(`Portfolio inquiry from ${payload.name}`)
      const body = encodeURIComponent(
        `Name: ${payload.name}\nEmail: ${payload.email}\n\n${payload.message}`,
      )
      window.location.href = `mailto:sagar@example.com?subject=${subject}&body=${body}`
      setFormState({
        loading: false,
        message: 'Email draft opened. Set VITE_FORMSPREE_ENDPOINT for direct API send.',
        error: false,
      })
      return
    }

    try {
      setFormState({ loading: true, message: '', error: false })
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        throw new Error('Request failed')
      }

      event.currentTarget.reset()
      setFormState({
        loading: false,
        message: 'Thanks! Message sent successfully.',
        error: false,
      })
    } catch {
      setFormState({
        loading: false,
        message: 'Could not send right now. Please try again in a bit.',
        error: true,
      })
    }
  }

  return (
    <div className={`app-shell ${party ? 'party' : ''}`}>
      <canvas ref={canvasRef} className="particle-layer" aria-hidden="true" />
      <div
        className="cursor-orb"
        style={{
          transform: `translate(${mouse.x * 70 - 35}px, ${mouse.y * 70 - 35}px)`,
        }}
        aria-hidden="true"
      />

      <header className="navbar">
        <a href="#home" className="brand">
          Sagar <span>Koirala</span>
        </a>
        <nav>
          <ul>
            {navItems.map((item) => (
              <li key={item.id}>
                <a href={`#${item.id}`}>{item.label}</a>
              </li>
            ))}
          </ul>
        </nav>
        <button
          type="button"
          className="theme-toggle"
          onClick={() => setTheme((current) => (current === 'dark' ? 'light' : 'dark'))}
        >
          {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
        </button>
      </header>

      <main>
        <section id="home" className="hero-section reveal">
          <p className="hero-badge">Creative Developer and UI Engineer</p>
          <h1 onClick={handleSecretTap}>
            Building playful digital products that feel
            <span> alive on every scroll.</span>
          </h1>
          <p className="hero-text">
            I craft modern web experiences with motion, clarity, and personality. Tap the heading five
            times for a tiny surprise.
          </p>
          <div className="hero-actions">
            <a href="#projects" className="btn btn-primary">
              See Projects
            </a>
            <a href="#contact" className="btn btn-ghost">
              Contact Me
            </a>
          </div>
        </section>

        <section id="about" className="about-section reveal">
          <div className="about-copy">
            <h2>About Me</h2>
            <p>
              I am Sagar, a builder who mixes engineering with storytelling. I enjoy turning complex
              product goals into crisp interfaces that people remember.
            </p>
            <ul className="fun-facts">
              <li>Favorite debugging playlist: synthwave and lo-fi.</li>
              <li>Can redesign a flow faster than I can order coffee.</li>
              <li>Weekend hobby: micro games and interactive UI experiments.</li>
            </ul>
          </div>
          <figure className="about-photo">
            <img
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=700&q=80"
              alt="Portrait of Sagar Koirala"
            />
          </figure>
        </section>

        <section id="projects" className="projects-section reveal">
          <div className="section-head">
            <h2>Projects</h2>
            <p>Interactive previews that expand when selected.</p>
          </div>
          <div className="project-grid">
            {projects.map((project) => (
              <article
                key={project.id}
                className={`project-card ${activeProject === project.id ? 'active' : ''}`}
                onClick={() => setActiveProject(project.id)}
              >
                <img src={project.image} alt={project.title} loading="lazy" />
                <div className="project-body">
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>
                </div>
              </article>
            ))}
          </div>

          <div className="project-preview" role="region" aria-live="polite">
            <h3>{activeProjectData.title}</h3>
            <p>{activeProjectData.details}</p>
            <div className="chips">
              {activeProjectData.stack.map((tech) => (
                <span key={tech}>{tech}</span>
              ))}
            </div>
            <div className="preview-actions">
              <a href={activeProjectData.live} target="_blank" rel="noreferrer">
                Live Demo
              </a>
              <a href={activeProjectData.code} target="_blank" rel="noreferrer">
                Source Code
              </a>
            </div>
          </div>
        </section>

        <section id="skills" className="skills-section reveal">
          <div className="section-head">
            <h2>Skills</h2>
            <p>Animated bars represent practical depth from product work.</p>
          </div>
          <div className="skill-list">
            {skills.map((skill, index) => (
              <div key={skill.name} className="skill-row">
                <div className="skill-meta">
                  <span>{skill.name}</span>
                  <strong>{skill.value}%</strong>
                </div>
                <div className="skill-track">
                  <div ref={(element) => (progressRefs.current[index] = element)} className="skill-fill" />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="contact" className="contact-section reveal">
          <div className="section-head">
            <h2>Contact</h2>
            <p>Tell me about your idea, product, or collaboration opportunity.</p>
          </div>
          <form className="contact-form" onSubmit={handleSubmit}>
            <label>
              Name
              <input name="name" type="text" required />
            </label>
            <label>
              Email
              <input name="email" type="email" required />
            </label>
            <label>
              Message
              <textarea name="message" rows="5" required />
            </label>
            <button type="submit" className="btn btn-primary" disabled={formState.loading}>
              {formState.loading ? 'Sending...' : 'Send Message'}
            </button>
            {formState.message && (
              <p className={formState.error ? 'form-note error' : 'form-note'}>{formState.message}</p>
            )}
          </form>
        </section>
      </main>
    </div>
  )
}

export default App
