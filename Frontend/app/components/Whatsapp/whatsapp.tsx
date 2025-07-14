'use client';

import { IconBrandWhatsappFilled } from '@tabler/icons-react';
import { Button } from '@mantine/core';
import { ContainerTextFlip } from '@/app/components/ui/container-text-flip';
import { fetchFromStrapi } from '@/lib/api';
import { useEffect, useState } from 'react';

export function WhatsappText() {
  const [wasapText, setWasapText] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchFromStrapi("/api/text-whats-apps");
        const words = data.data.map((item: any) => item.CTA);
        setWasapText(words);
      } catch (error) {
        console.error("Failed to fetch WhatsApp text:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <ContainerTextFlip
      words={wasapText.length > 0 ? wasapText : ['Loading...']}
    />
  );
}

export default function WhatsappButton() {
  const [wasapNum, setWasapNum] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchFromStrapi("/api/whats-app");

        // Ambil nomor dari response
        const phone = data.data?.PhoneNumber?.replace('+', ''); // wa.me tidak pakai "+"
        if (phone) setWasapNum(+6289526975000);
      } catch (error) {
        console.error("Failed to fetch WhatsApp Phone Number:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <Button
      component="a"
      target="_blank"
      href={wasapNum ? `https://wa.me/${wasapNum}` : undefined}
      variant="light"
      color="green"
      radius="xl"
      size="xl"
      className="Whatsapp"
      rightSection={<IconBrandWhatsappFilled />}
      disabled={!wasapNum} // tombol nonaktif saat nomor belum siap
    >
      <WhatsappText />
    </Button>
  );
}