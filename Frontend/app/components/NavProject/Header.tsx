'use client';

import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import { Container, Group, Burger } from '@mantine/core';
import LogoAndita from '@/public/assets/img/logo-andita.png';
import classes from './Header.module.css';
import { useDisclosure } from '@mantine/hooks';

const ActionToggle = dynamic(() =>
  import('@/app/components/ToggleTheme/ActionToggle').then((mod) => mod.default)
);

const links = [
  { link: '/', label: 'Home' },
  { link: '/projects', label: 'All Projects' },
  { link: '/about', label: 'About Us' },
];

export default function Header() {
  const [opened, { toggle }] = useDisclosure(false);

  const items = links.map((link) => (
    <Link
      key={link.label}
      href={link.link}
      className={classes.link}
    >
      {link.label}
    </Link>
  ));

  return (
    <header className={classes.header}>
      <Container size="lg" className={classes.inner}>
        <Image
          src={LogoAndita}
          alt="Andita Logo"
          height={46}
          style={{ filter: 'saturate(1.5) brightness(1.5)' }}
          loading="lazy"
        />
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
