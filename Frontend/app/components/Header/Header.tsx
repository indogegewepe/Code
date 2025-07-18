'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { Burger, Container, Group, Image } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import classes from './Header.module.css';

const ActionToggle = dynamic(() =>
  import('@/app/components/ToggleTheme/ActionToggle').then((mod) => mod.default)
);

const links = [
  { link: '#home', label: 'Home' },
  { link: '#services', label: 'Services' },
  { link: '#projects', label: 'Projects' },
  { link: '#partners', label: 'Partners' },
  { link: '#faq', label: 'FAQ' },
  { link: '#contact', label: 'Contact Us' },
];

export default function Header() {
  const [opened, { toggle }] = useDisclosure(false);
  const [active, setActive] = useState(links[0].link);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActive(`#${entry.target.id}`);
          }
        }
      },
      {
        rootMargin: '0px 0px -80% 0px',
        threshold: 0.1,
      }
    );

    links.forEach((link) => {
      const section = document.querySelector(link.link);
      if (section) {
        observer.observe(section);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  const items = links.map((link) => (
    <a
      key={link.label}
      href={link.link}
      className={classes.link}
      data-active={active === link.link || undefined}
      onClick={(event) => {
        event.preventDefault();
        toggle();

        const target = document.querySelector(link.link);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
        }
      }}
    >
      {link.label}
    </a>
  ));

  return (
    <header className={classes.header}>
      <Container size="lg" className={classes.inner}>
        <Link href="/" className="inline-block">
          <Image
            src="/assets/img/logo-andita.png"
            alt="Andita Logo"
            w='auto'
            h={42}
            style={{ objectFit: 'contain', filter: 'saturate(1.5) brightness(1.5)' }}
            loading="lazy"
          />
        </Link>
        <Group gap={5} visibleFrom="sm">
          {items}
          <ActionToggle />
        </Group>

        <Group hiddenFrom="sm" gap={5}>
          <Burger opened={opened} onClick={toggle} className={classes.burger} />
          <ActionToggle />
        </Group>
      </Container>

      {opened && <div className={classes.dropdown}>{items}</div>}
    </header>
  );
}
