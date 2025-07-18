'use client';

import dynamic from 'next/dynamic';
import { IconComponents, IconBuildingSkyscraper } from '@tabler/icons-react';
import { useInView } from 'react-intersection-observer';
import { Button, Container } from '@mantine/core';
import { fetchFromStrapi } from '../lib/api';
import React, { useEffect, useState } from 'react';

import GridServices from './components/GridServices/grid-services'

const Header = dynamic(() => import('./components/Header/Header'));
const Footer = dynamic(() => import('./components/Footer/Footer'));
const WhatsappButton = dynamic(() => import('./components/Whatsapp/whatsapp'), { ssr: false, });
const ContactUs = dynamic(() => import('./components/Contact/ContactUs'), { ssr: false, });
const Faq = dynamic(() => import('./components/FAQ/faq'), { ssr: false });
const Partners = dynamic(() => import('./components/Partners/Partners'), { ssr: false, });
const Project = dynamic(() => import('./components/OurProject/project'), { ssr: false, });
const Globe = dynamic(() => import('./components/Globe/Globe'), { ssr: false, });

export default function HomePage() {
  const [gridRef, gridInView] = useInView({ triggerOnce: true, threshold: 0.2 });
  const [projectRef, projectInView] = useInView({ triggerOnce: true, threshold: 0.2 });
  const [partnersRef, partnersInView] = useInView({ triggerOnce: true, threshold: 0.2 });
  const [faqRef, faqInView] = useInView({ triggerOnce: true, threshold: 0.2 });
  const [contactRef, contactInView] = useInView({ triggerOnce: true, threshold: 0.2 });
  const [hero, setHero] = useState({ Title: '', Description: '' });
  const [showGlobe, setShowGlobe] = useState(false);

  useEffect(() => {
    fetchFromStrapi('/api/hero')
      .then(data => {
        setHero({
          Title: data.data.Title,
          Description: data.data.Description,
        });
      })
  }, []);

  useEffect(() => {
    if (gridInView && projectInView && partnersInView && faqInView && contactInView) {
      setShowGlobe(true);
    }
  }, [gridInView, projectInView, partnersInView, faqInView, contactInView]);

  return (
    <>
      <nav className="header">
        <Header />
      </nav>

      <Container size="lg" className="heroContainer" id="home">
        <div className="heroContent">
          <h1>{hero.Title}</h1>
          <p>{hero.Description}</p>
          <div className="heroButtons">
            <Button component="a" href="/about" variant="filled" color="#007BFF" leftSection={<IconBuildingSkyscraper size={14} />}>
              About Us
            </Button>
            <Button
              component="a"
              href="/projects"
              variant="outline"
              color="#007BFF"
              rightSection={<IconComponents size={14} />}
              style={{ backdropFilter: 'blur(5px)' }}
            >
              Our Projects
            </Button>
          </div>
        </div>
      </Container>

      <div className="heroGlobe">
        {showGlobe && <Globe />}
      </div>

      <div id="services" ref={gridRef}>
        {gridInView && <GridServices />}
      </div>

      <div className="scroll-mt-12" id="projects" ref={projectRef}>
        {projectInView && <Project />}
      </div>

      <div className="scroll-mt-12" id="partners" ref={partnersRef}>
        {partnersInView && <Partners />}
      </div>

      <div className="scroll-mt-8" id="faq" ref={faqRef}>
        {faqInView && <Faq />}
      </div>

      <div className="scroll-mt-14" id="contact" ref={contactRef}>
        {contactInView && <ContactUs />}
      </div>

      <Footer />

      <WhatsappButton />
    </>
  );
}
