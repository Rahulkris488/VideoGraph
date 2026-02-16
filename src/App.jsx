import { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
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
import BookingPage from "./components/BookingPage";

function HomePage() {
    return (
        <>
            <Preloader />
            <main>
                <section id="home">
                    <Navbar />
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

function App() {
    const location = useLocation();

    useEffect(() => {
        initLenis();
        return () => destroyLenis();
    }, []);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location.pathname]);

    return (
        <>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/booking" element={<BookingPage />} />
            </Routes>
        </>
    );
}

export default App;
