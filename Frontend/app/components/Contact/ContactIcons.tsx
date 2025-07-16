'use client';

import { useEffect, useState } from 'react';
import { IconAt, IconMapPin, IconPhone, IconSun } from '@tabler/icons-react';
import { Box, Stack, Text } from '@mantine/core';
import classes from './ContactIcons.module.css';
import { fetchFromStrapi } from '@/lib/api';

const formatTime = (time: string) => time.slice(0, 5).replace(':', '.');

interface ContactIconProps extends Omit<React.ComponentPropsWithoutRef<'div'>, 'title'> {
  icon: typeof IconSun;
  title: React.ReactNode;
  description: React.ReactNode;
  href: string | null; // href can now be null
}

function ContactIcon({ icon: Icon, title, description, ...others }: ContactIconProps) {
  return (
    <div className={classes.wrapper} {...others}>
      <Box mr="md">
        <Icon size={24} />
      </Box>
      {/* Conditionally render <a> tag only if href exists */}
      {others.href ? (
        <a href={others.href} className={classes.link}>
          <Text size="xs" className={classes.title}>
            {title}
          </Text>
          <Text className={classes.description}>{description}</Text>
        </a>
      ) : (
        <Box> {/* Use Box or a similar container if no link is needed */}
          <Text size="xs" className={classes.title}>
            {title}
          </Text>
          <Text>{description}</Text>
        </Box>
      )}
    </div>
  );
}

export function ContactIconsList() {
  const [contact, setContact] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchFromStrapi("/api/contact");
        setContact(response.data);
      } catch (error) {
        console.error("Failed to fetch contact:", error);
      }
    };

    fetchData();
  }, []);

  if (!contact) return <Text>Loading...</Text>; // atau return null

  const contactData = [
    {
      title: 'Email',
      description: contact.Email,
      icon: IconAt,
      href: `mailto:${contact.Email}`,
    },
    {
      title: 'Phone',
      description: `+62 ${contact.Phone}`,
      icon: IconPhone,
      href: `tel:+62${contact.Phone}`,
    },
    {
      title: 'Address',
      description: contact.Location,
      icon: IconMapPin,
      // Corrected line for Google Maps URL
      href: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(contact.Location)}`,
    },
    {
      title: 'Working hours',
      description: `${formatTime(contact.WorkingStart)} AM – ${formatTime(contact.WorkingEnd)} PM`,
      icon: IconSun,
      href: null, // No direct link for working hours, as it's just text
    },
  ];

  return (
    <Stack>
      {contactData.map((item, index) => (
        <ContactIcon key={index} {...item} />
      ))}
    </Stack>
  );
}