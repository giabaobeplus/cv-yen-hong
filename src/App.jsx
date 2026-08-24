import Header from "./components/Header/Header"
import Hero from "./components/Hero/Hero"
import About from "./components/About/About"
import Skills from "./components/Skills/Skills"
import Experience from "./components/Experience/Experience"
import Journey from "./components/Journey/Journey"
import Certificates from "./components/Certificates/Certificates"
import BackToTop from "./components/BackToTop/BackToTop"

function App() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <About />
        <Skills />
        <Experience />
        <Journey />
        <Certificates />
      </main>
      <BackToTop />
    </>
  )
}

export default App