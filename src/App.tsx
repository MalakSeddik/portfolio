import { useState } from "react"
import { Nav } from "./components/Nav"
import { Footer } from "./components/Footer"
import { CommandPalette } from "./components/CommandPalette"
import { Hero } from "./sections/Hero"
import { About } from "./sections/About"
import { SelectedWork } from "./sections/SelectedWork"
import { MoreRepos } from "./sections/MoreRepos"
import { Contact } from "./sections/Contact"

function App() {
  const [paletteOpen, setPaletteOpen] = useState(false)

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Nav onOpenPalette={() => setPaletteOpen(true)} />
      <main id="main">
        <Hero />
        <About />
        <SelectedWork />
        <MoreRepos />
        <Contact />
      </main>
      <Footer />
      <CommandPalette open={paletteOpen} onOpenChange={setPaletteOpen} />
    </>
  )
}

export default App
