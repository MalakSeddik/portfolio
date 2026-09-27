import { useEffect, useId, useRef, useState } from "react"
import type { Project } from "../data/projects"
import "./ProjectCard.css"

export function ProjectCard({ project }: { project: Project }) {
  const [expanded, setExpanded] = useState(false)
  const [panelHeight, setPanelHeight] = useState(0)
  const panelContentRef = useRef<HTMLDivElement>(null)
  const panelId = useId()
  const triggerId = useId()

  // Track the panel's natural content height so it can be transitioned via
  // max-height. A ResizeObserver keeps this correct if the content reflows
  // (e.g. the window is resized while a card is open).
  useEffect(() => {
    const el = panelContentRef.current
    if (!el) return
    const observer = new ResizeObserver((entries) => {
      setPanelHeight(entries[0].contentRect.height)
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <article className="project-card">
      <div className="project-card__body">
        <button
          type="button"
          className="project-card__trigger"
          aria-expanded={expanded}
          aria-controls={panelId}
          id={triggerId}
          onClick={() => setExpanded((current) => !current)}
        >
          <span className="project-card__trigger-content">
            <span className="project-card__header">
              <span className="section-kicker">{project.category}</span>
              <span className="project-card__name">{project.name}</span>
              <span className="project-card__path" aria-hidden="true">
                ~/projects/{project.id}
              </span>
            </span>
            <span className="project-card__description">{project.description}</span>
            <span className="project-card__stack">
              <span className="sr-only">Stack:</span>
              {project.stack.map((tech) => (
                <span key={tech} className="tag">
                  {tech}
                </span>
              ))}
            </span>
          </span>
          <span className="project-card__read-more" aria-hidden="true">
            {expanded ? "Show less" : "Read more"}
            <span className="project-card__chevron">{"▾"}</span>
          </span>
        </button>
      </div>

      <div
        className="project-card__panel"
        data-expanded={expanded}
        style={{ maxHeight: expanded ? panelHeight : 0 }}
        id={panelId}
        role="region"
        aria-labelledby={triggerId}
        aria-hidden={!expanded}
        // Collapsed is only visually hidden (max-height: 0), so without
        // inert the links and demo controls inside stay in the Tab order.
        inert={!expanded}
      >
        <div className="project-card__panel-inner" ref={panelContentRef}>
          <ul className="project-card__highlights">
            {project.highlights.map((highlight) => (
              <li key={highlight}>{highlight}</li>
            ))}
          </ul>
          <p className="project-card__note">
            <span className="project-card__note-label">Architecture decisions</span>
            {project.note}
          </p>
          {project.demo && <project.demo />}
          <div className="project-card__links">
            {project.link && (
              <a
                className="button"
                href={project.link.url}
                target="_blank"
                rel="noopener"
              >
                {project.link.label} <span aria-hidden="true">↗</span>
              </a>
            )}
            {project.links?.map((link) => (
              <a
                key={link.url}
                className="button"
                href={link.url}
                target="_blank"
                rel="noopener"
              >
                {link.label} <span aria-hidden="true">↗</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </article>
  )
}
