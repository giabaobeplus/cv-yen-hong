import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useSmoothScroll } from "./lib/useSmoothScroll";
import Header from "./components/Header/Header";
import Hero from "./components/Hero/Hero";
import About from "./components/About/About";
import Skills from "./components/Skills/Skills";
import Experience from "./components/Experience/Experience";
import Journey from "./components/Journey/Journey";
import Certificates from "./components/Certificates/Certificates";
import Contact from "./components/Contact/Contact";
import BackToTop from "./components/BackToTop/BackToTop";
import TrustedBy from "./components/TrustedBy/TrustedBy";

function App() {
  useSmoothScroll();

  return (
    <>
      <Header />

      {/* #smooth-wrapper/#smooth-content: vùng được ScrollSmoother "làm mượt".
          Header (sticky) và BackToTop (fixed) cố tình nằm NGOÀI 2 div này
          nên vẫn bám đúng viewport, không bị transform của ScrollSmoother
          ảnh hưởng. */}
      <div id="smooth-wrapper">
        <div id="smooth-content">
          <main>
            <Hero />
            <About />
            <Skills />
            <Experience />
            <Journey />
            <Certificates />
            <TrustedBy />
            <Contact />
          </main>
        </div>
      </div>

      <BackToTop />

      <ToastContainer
        position="top-right"
        autoClose={3500}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
}

export default App;