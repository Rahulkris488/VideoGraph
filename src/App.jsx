import { useEffect, useState } from "react";
import { initLenis, destroyLenis } from "./core/lenis";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import FilmTape from "./components/FilmTape";
import About from "./components/About";
import TransitionStrip from "./components/TransitionStrip";
import Gallery from "./components/Gallery";
import RecentWork from "./components/RecentWork";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import Preloader from "./components/Preloader";

function App() {
    useEffect(() => {
        initLenis();
        return () => destroyLenis();
    }, []);

    return (
        <>
            <Preloader />
            <Navbar />
            <main>
                <section id="home">
                    <Hero />
                </section>
                <FilmTape />
                <About />
                <TransitionStrip />
                <Gallery />
                <RecentWork />
                <Contact />
            </main>
            <Footer />
        </>
    );
}

export default App;
