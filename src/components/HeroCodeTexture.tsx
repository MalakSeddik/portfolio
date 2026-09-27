import "./HeroCodeTexture.css"

// Real logic, not lorem-code: this is the same target-timestamp countdown
// used by the exam timer demo on the MIG Classroom card (see
// src/components/MigClassroomDemo.tsx), shown here purely as a faint
// decorative texture behind the hero.
const SNIPPET = `// server-authoritative exam timer
function start() {
  const target = Date.now() + DURATION_MS
  endAtRef.current = target
  setEndAt(target)
}

useEffect(() => {
  if (endAt === null) return

  function tick() {
    const next = Math.max(
      0,
      endAtRef.current - Date.now()
    )
    setRemainingMs(next)
    if (next === 0) {
      window.clearInterval(id)
    }
  }

  tick()
  const id = window.setInterval(tick, 250)
  return () => window.clearInterval(id)
}, [endAt])

useEffect(() => {
  function onVisible() {
    if (document.visibilityState !== "visible") return
    if (endAtRef.current === null) return
    const next = Math.max(
      0,
      endAtRef.current - Date.now()
    )
    setRemainingMs(next)
  }
  document.addEventListener(
    "visibilitychange",
    onVisible
  )
  return () =>
    document.removeEventListener(
      "visibilitychange",
      onVisible
    )
}, [])`

// Repeated (not duplicated content pretending to be different) so the same
// real snippet has enough width to reach the dense margins on wide screens —
// see the mask in HeroCodeTexture.css for where "dense" actually is.
const COPIES = 3

export function HeroCodeTexture() {
  return (
    <div className="hero-code-texture" aria-hidden="true">
      {Array.from({ length: COPIES }, (_, i) => (
        <pre className="hero-code-texture__copy" key={i}>
          <code>{SNIPPET}</code>
        </pre>
      ))}
    </div>
  )
}
