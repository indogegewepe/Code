import React from 'react';
import { Badge, Container, Image, Text, Title } from '@mantine/core';
import { BentoGrid, BentoGridItem } from '../ui/bento-grid';

export default function Project() {
  return (
    <Container size="lg" className="heroContainerThird pb-16">
      <div className="heroContentThird">
        <Title className="text-center">Latest Projects</Title>
        <div>
          <BentoGrid className="mx-auto md:auto-rows-[20rem]">
            {items.map((item, i) => (
              <BentoGridItem
                key={i}
                title={<Text truncate="end">{item.title}</Text>}
                description={<Text truncate="end">{item.description}</Text>}
                header={item.header}
                className={item.className}
                icon={item.icon}
                href={item.href}
              />
            ))}
          </BentoGrid>
        </div>
      </div>
    </Container>
  );
}

const items = [
  {
    title: 'Fiber Optic Installation – Jakarta Office Tower',
    description:
      'A state-of-the-art fiber optic network installation in a high-rise office tower in Jakarta, enhancing connectivity and speed for tenants.',
    header: (
      <Image
        src="/assets/img/splasing jaringan.webp"
        alt="Fiber optic project"
        className="object-cover rounded-xl"
        h={150}
        w="auto"
        radius="md"
        loading="lazy"
      />
    ),
    className: 'md:col-span-1',
    icon: (
      <Badge variant="light" color="light-dark(#ff9800, #007bff)" radius="sm">
        02/07/2025
      </Badge>
    ),
    href: '#',
  },
  {
    title: 'Campus WiFi & CCTV - Bandung University',
    description:
      'Comprehensive WiFi and CCTV installation across the Bandung University campus, ensuring robust connectivity and security for students and faculty.',
    header: (
      <Image
        src="/assets/img/splacing jaringan fo.webp"
        alt="University project"
        className="object-cover rounded-xl"
        h={150}
        w="auto"
        radius="md"
        loading="lazy"
      />
    ),
    className: 'md:col-span-1',
    icon: (
      <Badge variant="light" color="light-dark(#ff9800, #007bff)" radius="sm">
        04/07/2024
      </Badge>
    ),
    href: '#',
  },
  {
    title: 'Hotel WiFi & CCTV - Bali',
    description:
      'A comprehensive WiFi and CCTV installation project at a luxury hotel in Bali, providing seamless connectivity and security for guests.',
    header: (
      <Image
        src="/assets/img/pembuatan jalur tanam fo.webp"
        alt="Hotel project"
        className="object-cover rounded-xl"
        h={150}
        w="auto"
        radius="md"
        loading="lazy"
      />
    ),
    className: 'md:col-span-1',
    icon: (
      <Badge variant="light" color="light-dark(#ff9800, #007bff)" radius="sm">
        01/01/2023
      </Badge>
    ),
    href: '#',
  },
];
