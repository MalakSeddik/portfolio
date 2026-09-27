import "./Nav.css"

const links = [
  { href: "#about", label: "About" },
  { href: "#work", label: "Selected work" },
  { href: "#repos", label: "More repos" },
  { href: "#contact", label: "Contact" },
]

const isMac =
  typeof navigator !== "undefined" && /Mac|iPhone|iPad|iPod/.test(navigator.userAgent)

export function Nav({ onOpenPalette }: { onOpenPalette: () => void }) {
  return (
    <header className="nav">
      <div className="container nav__inner">
        <a href="#top" className="nav__name">
          Malak Seddik
        </a>
        <nav aria-label="Section navigation">
          <ul className="nav__links">
            {links.map((link) => (
              <li key={link.href}>
                <a className="text-link" href={link.href}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <button
          type="button"
          className="nav__palette-trigger"
          onClick={onOpenPalette}
          aria-label="Open command palette"
        >
          <kbd>{isMac ? "⌘" : "Ctrl"}</kbd>
          <kbd>K</kbd>
        </button>
      </div>
    </header>
  )
}
