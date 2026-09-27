import "./About.css"

const stack = [
  "TypeScript",
  "Next.js",
  "PostgreSQL",
  "Supabase",
  "Prisma",
  "ASP.NET Core",
  "Kotlin / Jetpack Compose",
  "Python",
]

export function About() {
  return (
    <section id="about" className="section container about">
      <p className="section-kicker">About</p>
      <div className="about__grid">
        <p className="about__bio">
          I work across the stack: Next.js and PostgreSQL on the web, Kotlin
          and Jetpack Compose on Android, ASP.NET Core on the backend. A lot
          of that work centers on access control that actually holds up,
          enforced with tools like Postgres Row-Level Security and
          server-side exam timers rather than trusted to the client.
          Alongside that I do offensive security work: scanning, auditing,
          and building intentionally vulnerable apps to teach how those
          failures happen in practice.
        </p>
        <ul className="about__stack" aria-label="Technologies I work with">
          {stack.map((tech) => (
            <li key={tech} className="tag">
              {tech}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
