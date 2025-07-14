'use client';

import { useState } from 'react';
import { IconBrandInstagram, IconBrandLinkedin, IconBrandYoutube } from '@tabler/icons-react';
import { Button, Container, Image, Text, TextInput } from '@mantine/core';
import classes from './Footer.module.css';

const data = [
  {
    title: 'Quick Links',
    links: [
      { link: '#home', label: 'Home' },
      { link: '#services', label: 'Services' },
      { link: '#projects', label: 'Projects' },
      { link: '#partners', label: 'Partners' },
      { link: '#faq', label: 'FAQ' },
      { link: '#contact', label: 'Contact Us' },
    ],
  },
  {
    title: 'Follow us',
    class: 'flex flex-row gap-2',
    links: [
      {
        label: <IconBrandInstagram size={18} stroke={1.5} />,
        link: '#',
      },
      {
        label: <IconBrandYoutube size={18} stroke={1.5} />,
        link: '#',
      },
      {
        label: <IconBrandLinkedin size={18} stroke={1.5} />,
        link: '#',
      },
    ],
  },
  {
    title: 'Newsletter',
    links: [],
  },
];

function NewsletterForm() {
  const [email, setEmail] = useState('');
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        // handle subscribe logic here
      }}
      style={{ display: 'flex', gap: 8 }}
    >
      <TextInput
        placeholder="Your email"
        value={email}
        onChange={(event) => setEmail(event.currentTarget.value)}
        required
        type="email"
        size="xs"
        style={{ flex: 1 }}
      />
      <Button type="submit" size="xs" variant="filled" color="#007BFF">
        Subscribe
      </Button>
    </form>
  );
}

// Replace Newsletter group rendering in Footer
data[2].links = [
  {
    label: <NewsletterForm />,
    link: '#',
  },
];

export default function Footer() {
  const groups = data.map((group) => {
    const links = group.links.map((link, index) => (
      <Text<'a'>
        key={index}
        className={classes.link}
        component="a"
        href={link.link}
        onClick={(event) => {
          event.preventDefault();

          const target = document.querySelector(link.link);
          if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
          }
        }}
      >
        {link.label}
      </Text>
    ));

    return (
      <div className={classes.wrapper} key={group.title}>
        <Text className={classes.title}>{group.title}</Text>
        <div className={group.class ?? ''}>{links}</div>
      </div>
    );
  });

  return (
    <footer className={classes.footer}>
      <Container size="lg" className={classes.inner}>
        <div className={classes.logo}>
          <Image
            src="/assets/img/logo-andita.png"
            alt="Logo Andita"
            className={classes.img}
            width={100}
            height={50}
            loading="lazy"
          />
          <Text size="xs" c="dimmed" className={classes.description}>
            High-speed internet, Wi-Fi, and cloud hosting for the digital era.
          </Text>
        </div>
        <div className={classes.groups}>{groups}</div>
      </Container>
      <Container size="lg" className={classes.afterFooter}>
        <Text c="dimmed" size="sm" className="text-center">
          © 2025 CV Andita. All rights reserved.
        </Text>
      </Container>
    </footer>
  );
}
