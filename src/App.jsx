import React from 'react';
import Nav from './components/Nav.jsx';
import Hero from './components/Hero.jsx';
import About from './components/About.jsx';
import Services from './components/Services.jsx';
import Products from './components/Products.jsx';
import Contact from './components/Contact.jsx';
import Footer from './components/Footer.jsx';

export default function App() {
  return (
    <>
      <Nav />
      <Hero />
      <About />
      <Services />
      <Products />
      <Contact />
      <Footer />
    </>
  );
}
