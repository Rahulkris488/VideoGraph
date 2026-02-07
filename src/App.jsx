import { useEffect } from "react";
import { initLenis, destroyLenis } from "./core/lenis";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import FilmTape from "./components/FilmTape";
import About from "./components/About";
import Gallery from "./components/Gallery";
import RecentWork from "./components/RecentWork";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

function App() {
    useEffect(() => {
        initLenis();
        return () => destroyLenis();
    }, []);

    return (
        <>
            <Navbar />
            <main>
                <section id="home">
                    <Hero />
                </section>
                <FilmTape />
                <About />
                <Gallery />
                <RecentWork />
                <Contact />
            </main>
            <Footer />
        </>
    );
}

export default App;
