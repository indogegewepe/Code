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
}

function ContactIcon({ icon: Icon, title, description, ...others }: ContactIconProps) {
  return (
    <div className={classes.wrapper} {...others}>
      <Box mr="md">
        <Icon size={24} />
      </Box>
      <div>
        <Text size="xs" className={classes.title}>
          {title}
        </Text>
        <Text className={classes.description}>{description}</Text>
      </div>
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
    },
    {
      title: 'Phone',
      description: `+62 ${contact.Phone}`,
      icon: IconPhone,
    },
    {
      title: 'Address',
      description: contact.Location,
      icon: IconMapPin,
    },
    {
      title: 'Working hours',
      description: `${formatTime(contact.WorkingStart)} AM – ${formatTime(contact.WorkingEnd)} PM`,
      icon: IconSun,
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
