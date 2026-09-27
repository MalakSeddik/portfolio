import { useEffect, useId, useRef, useState } from "react"
import "./MigClassroomDemo.css"

const DEMO_DURATION_MS = 30_000

function formatRemaining(ms: number) {
  const totalSeconds = Math.ceil(ms / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${minutes}:${String(seconds).padStart(2, "0")}`
}

function ExamTimerDemo() {
  // endAt is the one piece of state that matters: a fixed target timestamp.
  // Remaining time is always (endAt - now), recomputed on each tick — never
  // decremented — so it can't drift, get "paused" by a stalled tab, or be
  // fooled by anything short of changing the system clock.
  const [endAt, setEndAt] = useState<number | null>(null)
  const [remainingMs, setRemainingMs] = useState(DEMO_DURATION_MS)
  const [statusMessage, setStatusMessage] = useState("")
  const endAtRef = useRef<number | null>(null)
  const statusId = useId()

  function start() {
    const target = Date.now() + DEMO_DURATION_MS
    endAtRef.current = target
    setEndAt(target)
    setRemainingMs(DEMO_DURATION_MS)
    setStatusMessage(`Timer started, ${DEMO_DURATION_MS / 1000} seconds.`)
  }

  useEffect(() => {
    if (endAt === null) return

    function tick() {
      const next = Math.max(0, endAtRef.current! - Date.now())
      setRemainingMs(next)
      if (next === 0) {
        setStatusMessage("Time's up.")
        window.clearInterval(intervalId)
      }
    }

    tick()
    const intervalId = window.setInterval(tick, 250)
    return () => window.clearInterval(intervalId)
  }, [endAt])

  // Recompute the moment the tab regains focus, rather than waiting for the
  // next tick — makes the "no drift from backgrounding" claim checkable by
  // switching tabs and coming back.
  useEffect(() => {
    function handleVisibility() {
      if (document.visibilityState !== "visible" || endAtRef.current === null) return
      const next = Math.max(0, endAtRef.current - Date.now())
      setRemainingMs(next)
      setStatusMessage("Recalculated from the target timestamp after the tab was hidden — no drift.")
    }
    document.addEventListener("visibilitychange", handleVisibility)
    return () => document.removeEventListener("visibilitychange", handleVisibility)
  }, [])

  const running = endAt !== null && remainingMs > 0
  const finished = endAt !== null && remainingMs === 0

  return (
    <div className="exam-demo__block">
      <p className="exam-demo__label">Server-authoritative exam timer (30s demo)</p>
      <div className="exam-demo__timer-row">
        <div
          className="exam-demo__display"
          role="timer"
          aria-label={`${formatRemaining(remainingMs)} remaining`}
        >
          {formatRemaining(remainingMs)}
        </div>
        <div className="exam-demo__progress" role="presentation">
          <div
            className="exam-demo__progress-fill"
            style={{ width: `${(remainingMs / DEMO_DURATION_MS) * 100}%` }}
          />
        </div>
        <button type="button" className="button" onClick={start}>
          {finished ? "Start again" : running ? "Restart" : "Start"}
        </button>
      </div>
      <p className="sr-only" aria-live="polite" id={statusId}>
        {statusMessage}
      </p>
      <p className="exam-demo__note">
        Remaining time is <code>endAt - Date.now()</code>, computed fresh on every tick, never
        decremented from a counter. That's the same principle the real exam timer uses server-side: the
        deadline is a timestamp the client can display but not control.
      </p>
    </div>
  )
}

export function MigClassroomDemo() {
  return (
    <div className="exam-demo">
      <p className="section-kicker">Live demo</p>
      <details className="exam-demo__disclosure">
        <summary className="exam-demo__summary">
          <span className="exam-demo__summary-chevron" aria-hidden="true">
            ▸
          </span>
          Try the exam timer
        </summary>
        <ExamTimerDemo />
      </details>
    </div>
  )
}
