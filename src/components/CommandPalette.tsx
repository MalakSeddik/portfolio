import { useEffect, useId, useMemo, useRef, useState } from "react"
import type { KeyboardEvent } from "react"
import { profile } from "../data/profile"
import "./CommandPalette.css"

type PaletteGroup = "Navigate" | "Actions"

type PaletteItem = {
  id: string
  label: string
  group: PaletteGroup
  perform: () => void
}

type CommandPaletteProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ block: "start" })
}

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const [query, setQuery] = useState("")
  const [activeIndex, setActiveIndex] = useState(0)
  const [announcement, setAnnouncement] = useState("")
  const [entered, setEntered] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const previouslyFocused = useRef<HTMLElement | null>(null)
  // Guards against a "phantom" mouseenter firing when an item re-renders
  // under a pointer that hasn't actually moved (e.g. right after opening),
  // which would otherwise silently override the keyboard-driven selection.
  const pointerMoved = useRef(false)
  const listboxId = useId()

  const items = useMemo<PaletteItem[]>(
    () => [
      { id: "nav-about", label: "About", group: "Navigate", perform: () => scrollToSection("about") },
      { id: "nav-work", label: "Work", group: "Navigate", perform: () => scrollToSection("work") },
      { id: "nav-repos", label: "Repos", group: "Navigate", perform: () => scrollToSection("repos") },
      { id: "nav-contact", label: "Contact", group: "Navigate", perform: () => scrollToSection("contact") },
      {
        id: "action-github",
        label: "Open GitHub",
        group: "Actions",
        perform: () => window.open(profile.github, "_blank", "noopener,noreferrer"),
      },
      {
        id: "action-linkedin",
        label: "Open LinkedIn",
        group: "Actions",
        perform: () => window.open(profile.linkedin, "_blank", "noopener,noreferrer"),
      },
      {
        id: "action-copy-email",
        label: "Copy email",
        group: "Actions",
        perform: () => {
          navigator.clipboard
            ?.writeText(profile.email)
            .then(() => setAnnouncement(`Copied ${profile.email} to clipboard`))
            .catch(() => setAnnouncement(`Couldn't copy automatically — email is ${profile.email}`))
        },
      },
    ],
    [],
  )

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return items
    return items.filter((item) => item.label.toLowerCase().includes(q))
  }, [items, query])

  // Global shortcut: works whether the palette is open or closed.
  useEffect(() => {
    function handleShortcut(event: globalThis.KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault()
        onOpenChange(!open)
      }
    }
    window.addEventListener("keydown", handleShortcut)
    return () => window.removeEventListener("keydown", handleShortcut)
  }, [open, onOpenChange])

  // Capture the trigger on open, restore focus to it on close.
  useEffect(() => {
    if (open) {
      previouslyFocused.current = document.activeElement as HTMLElement | null
    } else if (previouslyFocused.current) {
      previouslyFocused.current.focus()
      previouslyFocused.current = null
    }
  }, [open])

  // Reset transient state and focus the input each time the palette opens.
  useEffect(() => {
    if (!open) {
      setEntered(false)
      return
    }
    setQuery("")
    setActiveIndex(0)
    pointerMoved.current = false
    inputRef.current?.focus()
    // The entered flip happens a frame after mount so the opening transition
    // has a starting state (opacity/scale) to animate from, instead of
    // React committing straight to the "open" visual state.
    const enterFrame = window.requestAnimationFrame(() => setEntered(true))
    return () => window.cancelAnimationFrame(enterFrame)
  }, [open])

  useEffect(() => {
    setActiveIndex(0)
  }, [query])

  useEffect(() => {
    if (!open) return
    const activeItem = filtered[activeIndex]
    if (!activeItem) return
    document.getElementById(activeItem.id)?.scrollIntoView({ block: "nearest" })
  }, [activeIndex, filtered, open])

  function runItem(item: PaletteItem) {
    item.perform()
    onOpenChange(false)
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault()
        pointerMoved.current = false
        setActiveIndex((i) => Math.min(i + 1, filtered.length - 1))
        break
      case "ArrowUp":
        event.preventDefault()
        pointerMoved.current = false
        setActiveIndex((i) => Math.max(i - 1, 0))
        break
      case "Enter": {
        event.preventDefault()
        const item = filtered[activeIndex]
        if (item) runItem(item)
        break
      }
      case "Escape":
        event.preventDefault()
        onOpenChange(false)
        break
      case "Tab":
        // Only one focusable control while open — keep focus locked to it.
        event.preventDefault()
        break
      default:
        break
    }
  }

  return (
    <>
      {/* Kept mounted across open/close so a copy-action announcement is
          still readable by a screen reader after the dialog unmounts. */}
      <div className="sr-only" aria-live="polite">
        {announcement}
      </div>

      {open && (
        <div
          className="command-palette-overlay"
          data-entered={entered}
          onClick={() => onOpenChange(false)}
        >
          <div
            className="command-palette"
            role="dialog"
            aria-modal="true"
            aria-label="Command palette"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="command-palette__field">
              <span
                className="command-palette__caret"
                aria-hidden="true"
                data-visible={query.length === 0}
              />
              <input
                ref={inputRef}
                className="command-palette__input"
                type="text"
                role="combobox"
                aria-expanded="true"
                aria-controls={listboxId}
                aria-activedescendant={filtered[activeIndex]?.id}
                aria-autocomplete="list"
                aria-label="Search commands"
                placeholder="Type a command or search…"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>

            <ul
              id={listboxId}
              className="command-palette__list"
              role="listbox"
              onMouseMove={() => {
                pointerMoved.current = true
              }}
            >
              {filtered.length === 0 && (
                <li className="command-palette__empty" role="presentation">
                  No matches
                </li>
              )}
              {filtered.map((item, index) => {
                const showGroupLabel = index === 0 || filtered[index - 1].group !== item.group
                return (
                  <li key={item.id} role="presentation">
                    {showGroupLabel && (
                      <div className="command-palette__group" role="presentation">
                        {item.group}
                      </div>
                    )}
                    <div
                      id={item.id}
                      role="option"
                      aria-selected={index === activeIndex}
                      className="command-palette__item"
                      data-active={index === activeIndex}
                      onMouseEnter={() => {
                        if (pointerMoved.current) setActiveIndex(index)
                      }}
                      onClick={() => runItem(item)}
                    >
                      {item.label}
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      )}
    </>
  )
}
