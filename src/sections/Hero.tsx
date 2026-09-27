import { useEffect, useRef, useState } from "react"
import { profile } from "../data/profile"
import { HeroCodeTexture } from "../components/HeroCodeTexture"
import "./Hero.css"

type CopyState = "idle" | "copied" | "failed"

// Legacy fallback for when the async Clipboard API is unavailable or denied
// (older browsers, some permissions-policy contexts). Deprecated, but still
// broadly supported, and it doesn't require any permission prompt.
function legacyCopy(text: string): boolean {
  const textarea = document.createElement("textarea")
  textarea.value = text
  textarea.style.position = "fixed"
  textarea.style.opacity = "0"
  document.body.appendChild(textarea)
  textarea.focus()
  textarea.select()
  let succeeded = false
  try {
    succeeded = document.execCommand("copy")
  } catch {
    succeeded = false
  }
  document.body.removeChild(textarea)
  return succeeded
}

export function Hero() {
  const [copyState, setCopyState] = useState<CopyState>("idle")
  const resetTimeoutRef = useRef<number | null>(null)
  const fallbackTextRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    return () => {
      if (resetTimeoutRef.current !== null) window.clearTimeout(resetTimeoutRef.current)
    }
  }, [])

  // When the copy fails outright, select the revealed plain-text address so
  // the user only has to press Ctrl/Cmd+C themselves.
  useEffect(() => {
    if (copyState !== "failed") return
    const el = fallbackTextRef.current
    if (!el) return
    const selection = window.getSelection()
    const range = document.createRange()
    range.selectNodeContents(el)
    selection?.removeAllRanges()
    selection?.addRange(range)
  }, [copyState])

  async function handleEmailClick() {
    let success = false
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(profile.email)
        success = true
      }
    } catch {
      success = false
    }
    if (!success) {
      success = legacyCopy(profile.email)
    }

    if (resetTimeoutRef.current !== null) window.clearTimeout(resetTimeoutRef.current)

    if (success) {
      setCopyState("copied")
      resetTimeoutRef.current = window.setTimeout(() => setCopyState("idle"), 2000)
    } else {
      setCopyState("failed")
    }
  }

  return (
    <section id="top" className="hero">
      {/* Full-bleed: spans the whole section, not just the text column below,
          so it has real empty margin to sit in on wide screens (see
          HeroCodeTexture.css for the density mask that uses that margin). */}
      <HeroCodeTexture />
      <div className="hero__inner container">
        <p className="section-kicker">{profile.location}</p>
        <h1 className="hero__name">{profile.name}</h1>
        <p className="hero__role">{profile.title}</p>
        <p className="hero__focus">{profile.focus}</p>
        <p className="hero__summary">
          I build role-based systems that enforce access at the database
          layer, payment and auth flows for e-commerce, native Android apps
          with clean module boundaries, and REST APIs with versioned
          contracts. Outside of that, I write and use offensive-security
          tooling: port scanners, brute-force auditors, and deliberately
          vulnerable apps built for authorized testing and teaching.
        </p>
        <div className="hero__actions">
          <div className="hero__email-group" aria-live="polite">
            <button
              type="button"
              className="button button--accent"
              onClick={handleEmailClick}
            >
              {copyState === "copied" ? "Copied!" : "Email me"}
            </button>
            {copyState === "failed" && (
              <span className="hero__email-fallback">
                Couldn't copy automatically — select and copy:{" "}
                <span ref={fallbackTextRef} className="hero__email-text">
                  {profile.email}
                </span>
              </span>
            )}
          </div>
          <a
            className="button"
            href={profile.github}
            target="_blank"
            rel="noopener"
          >
            GitHub
          </a>
          <a
            className="button"
            href={profile.linkedin}
            target="_blank"
            rel="noopener"
          >
            LinkedIn
          </a>
        </div>
      </div>
    </section>
  )
}
