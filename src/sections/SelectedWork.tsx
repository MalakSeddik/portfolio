import { useEffect, useRef, useState } from "react"
import type { KeyboardEvent, WheelEvent } from "react"
import { projects } from "../data/projects"
import { ProjectCard } from "../components/ProjectCard"
import "./SelectedWork.css"

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
}

export function SelectedWork() {
  const [activeIndex, setActiveIndex] = useState(0)
  const viewportRef = useRef<HTMLDivElement>(null)
  const slideRefs = useRef<(HTMLLIElement | null)[]>([])
  const [edgeFade, setEdgeFade] = useState({ start: false, end: true })

  // Track whichever slide is most visible in the viewport — covers both
  // programmatic navigation (arrows/dots/keys) and manual scrolling (swipe,
  // trackpad, dragging the scrollbar), so the controls stay in sync no
  // matter how the user got there.
  useEffect(() => {
    const viewport = viewportRef.current
    if (!viewport) return

    const ratios = new Map<number, number>()

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const indexAttr = (entry.target as HTMLElement).dataset.index
          if (indexAttr === undefined) continue
          ratios.set(Number(indexAttr), entry.intersectionRatio)
        }
        let bestIndex = 0
        let bestRatio = -1
        ratios.forEach((ratio, index) => {
          if (ratio > bestRatio) {
            bestRatio = ratio
            bestIndex = index
          }
        })
        setActiveIndex(bestIndex)
      },
      { root: viewport, threshold: [0, 0.25, 0.5, 0.75, 1] },
    )

    slideRefs.current.forEach((el) => {
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  // Fade an edge only while a card is actually cut off there. Based on
  // geometry rather than scroll position alone: at a middle snap point the
  // left edge sits flush with a fully visible card, which must not be dimmed.
  useEffect(() => {
    const viewport = viewportRef.current
    if (!viewport) return

    let frame = 0
    function update() {
      frame = 0
      if (!viewport) return
      const { left, right } = viewport.getBoundingClientRect()
      let start = false
      let end = false
      for (const slide of slideRefs.current) {
        if (!slide) continue
        const rect = slide.getBoundingClientRect()
        if (rect.left < left - 1 && rect.right > left + 1) start = true
        if (rect.left < right - 1 && rect.right > right + 1) end = true
      }
      setEdgeFade((prev) =>
        prev.start === start && prev.end === end ? prev : { start, end },
      )
    }
    function schedule() {
      if (!frame) frame = requestAnimationFrame(update)
    }

    update()
    viewport.addEventListener("scroll", schedule, { passive: true })
    window.addEventListener("resize", schedule)
    return () => {
      viewport.removeEventListener("scroll", schedule)
      window.removeEventListener("resize", schedule)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])

  function goTo(index: number) {
    const clamped = Math.max(0, Math.min(projects.length - 1, index))
    const viewport = viewportRef.current
    const slide = slideRefs.current[clamped]
    if (!viewport || !slide) return
    // Deliberately not slide.scrollIntoView(): it walks the whole scroll
    // ancestor chain, including the page itself, and was nudging the
    // page's vertical scroll position on every card change. Scrolling the
    // viewport's own scrollLeft directly touches only this element.
    const viewportRect = viewport.getBoundingClientRect()
    const slideRect = slide.getBoundingClientRect()
    const targetLeft = viewport.scrollLeft + (slideRect.left - viewportRect.left)
    viewport.scrollTo({
      left: targetLeft,
      behavior: prefersReducedMotion() ? "auto" : "smooth",
    })
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "ArrowLeft") {
      event.preventDefault()
      goTo(activeIndex - 1)
    } else if (event.key === "ArrowRight") {
      event.preventDefault()
      goTo(activeIndex + 1)
    }
  }

  // Defensive belt-and-suspenders: a vertical (wheel) gesture over the
  // carousel should always scroll the page, never this element's
  // horizontal axis. Some browsers redirect vertical wheel input onto a
  // horizontal-only scroll container instead of letting it bubble to the
  // page; explicitly forwarding the delta ourselves removes any doubt.
  function handleWheel(event: WheelEvent<HTMLDivElement>) {
    if (Math.abs(event.deltaY) > Math.abs(event.deltaX)) {
      event.preventDefault()
      window.scrollBy(0, event.deltaY)
    }
  }

  const activeProject = projects[activeIndex]

  return (
    <section id="work" className="section">
      <div className="container">
        <p className="section-kicker">Selected work</p>
        <h2 className="section-heading">Projects</h2>
      </div>

      <div className="carousel container">
        <div
          className="carousel__frame"
          data-fade-start={edgeFade.start}
          data-fade-end={edgeFade.end}
        >
          <div
            className="carousel__viewport"
            ref={viewportRef}
            tabIndex={0}
            role="region"
            aria-roledescription="carousel"
            aria-label="Selected work projects"
            onKeyDown={handleKeyDown}
            onWheel={handleWheel}
          >
            <ul className="carousel__track">
              {projects.map((project, index) => (
                <li
                  className="carousel__slide"
                  key={project.id}
                  data-index={index}
                  ref={(el) => {
                    slideRefs.current[index] = el
                  }}
                >
                  <ProjectCard project={project} />
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="carousel__controls">
          <button
            type="button"
            className="carousel__arrow"
            onClick={() => goTo(activeIndex - 1)}
            disabled={activeIndex === 0}
            aria-label="Previous project"
          >
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M10 3 5 8l5 5" />
            </svg>
          </button>

          <div className="carousel__dots">
            {projects.map((project, index) => (
              <button
                key={project.id}
                type="button"
                className="carousel__dot"
                data-active={index === activeIndex}
                aria-label={`Go to project ${index + 1} of ${projects.length}: ${project.name}`}
                aria-current={index === activeIndex ? "true" : undefined}
                onClick={() => goTo(index)}
              />
            ))}
          </div>

          <button
            type="button"
            className="carousel__arrow"
            onClick={() => goTo(activeIndex + 1)}
            disabled={activeIndex === projects.length - 1}
            aria-label="Next project"
          >
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M6 3l5 5-5 5" />
            </svg>
          </button>
        </div>

        <p className="sr-only" aria-live="polite">
          Showing project {activeIndex + 1} of {projects.length}: {activeProject.name}
        </p>
      </div>
    </section>
  )
}
