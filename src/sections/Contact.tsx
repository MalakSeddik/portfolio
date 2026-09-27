import { profile } from "../data/profile"
import "./Contact.css"

export function Contact() {
  return (
    <section id="contact" className="section container">
      <p className="section-kicker">Contact</p>
      <h2 className="section-heading">Get in touch</h2>
      <p className="contact__intro">
        Best reached by email. I'm based in {profile.location} and open to
        remote and on-site work.
      </p>
      <ul className="contact__list">
        <li>
          <span className="contact__label">Email</span>
          <a className="text-link" href={`mailto:${profile.email}`}>
            {profile.email}
          </a>
        </li>
        <li>
          <span className="contact__label">Phone</span>
          <a className="text-link" href={`tel:${profile.phone.replace(/\s+/g, "")}`}>
            {profile.phone}
          </a>
        </li>
        <li>
          <span className="contact__label">GitHub</span>
          <a
            className="text-link"
            href={profile.github}
            target="_blank"
            rel="noopener"
          >
            github.com/MalakSeddik
          </a>
        </li>
        <li>
          <span className="contact__label">LinkedIn</span>
          <a
            className="text-link"
            href={profile.linkedin}
            target="_blank"
            rel="noopener"
          >
            linkedin.com/in/malakseddik
          </a>
        </li>
      </ul>
    </section>
  )
}
