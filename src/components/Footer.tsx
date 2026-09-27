import { profile } from "../data/profile"
import "./Footer.css"

export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <span>{profile.name}</span>
        <span>{profile.location}</span>
      </div>
    </footer>
  )
}
