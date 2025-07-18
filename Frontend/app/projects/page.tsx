"use client";

import dynamic from 'next/dynamic';
import React, { useState, useEffect } from 'react';
import { Container, Title, Text, Alert, Card } from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';
import { fetchFromStrapi } from '@/lib/api';
import { Loader } from './loader';
import ArticlesContent from './content';

const Header = dynamic(() => import('@/app/components/NavProject/Header'));
const Footer = dynamic(() => import('@/app/components/NavProject/Footer'));
const WhatsappButton = dynamic(() => import('@/app/components/Whatsapp/whatsapp'));

// Interface for a single project item
interface ProyekItem {
  id: number;
  title: string;
  description: string;
  image: {
    url: string;
    alternativeText?: string | null;
    width: number;
    height: number;
    formats: {
      medium?: { url: string };
      large?: { url: string };
    };
  };
}

export default function ProyekPage() {
  const [proyekItems, setProyekItems] = useState<ProyekItem[]>([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetchFromStrapi('/api/title-proyek?populate=images');
        const data = response.data;

        if (!data) {
          setError('No data found');
          return;
        }

        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '';
        const imageFromStrapi = data.images;

        const imageData: ProyekItem['image'] = imageFromStrapi
          ? {
              url: imageFromStrapi.url.startsWith('http') ? imageFromStrapi.url : baseUrl + imageFromStrapi.url,
              alternativeText: imageFromStrapi.alternativeText || null,
              width: imageFromStrapi.width || 0,
              height: imageFromStrapi.height || 0,
              formats: {
                medium: imageFromStrapi.formats?.medium?.url
                  ? {
                      url: imageFromStrapi.formats.medium.url.startsWith('http')
                        ? imageFromStrapi.formats.medium.url
                        : baseUrl + imageFromStrapi.formats.medium.url,
                    }
                  : undefined,
                large: imageFromStrapi.formats?.large?.url
                  ? {
                      url: imageFromStrapi.formats.large.url.startsWith('http')
                        ? imageFromStrapi.formats.large.url
                        : baseUrl + imageFromStrapi.formats.large.url,
                    }
                  : undefined,
              },
            }
          : {
              url: '',
              alternativeText: 'No image available',
              width: 0,
              height: 0,
              formats: {},
            };

        const proyek: ProyekItem = {
          id: data.id,
          title: data.Title,
          description: data.Description,
          image: imageData,
        };

        setProyekItems([proyek]);
      } catch (err) {
        setError('Failed to load Projects. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <Container size="lg" py="xl">
        <Alert icon={<IconAlertCircle size="1rem" />} title="Error!" color="red">
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <>
      <nav className="header">
        <Header />
      </nav>

      <Container size="lg" className='pt-20'>
        {proyekItems.map((proyek) => (
          <Card shadow="sm"
              radius="md"
              withBorder 
              style={{
                backgroundImage: `url(${proyek.image.url})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                backgroundBlendMode: 'darken',
                backgroundColor: 'light-dark(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.6))',
              }}
              className="rounded-md p-6 text-white flex flex-col items-center justify-center gap-6 bg-no-repeat w-full shadow-md"
              key={proyek.id} 
              >
            <div
              className="rounded-md p-6 text-white flex flex-col items-center gap-6"
            >
                <Title order={1}>{proyek.title}</Title>
                <Text lineClamp={3}>{proyek.description}</Text>
            </div>
        </Card>
        ))
        }

        <ArticlesContent />
      </Container>

      <Footer />
      <WhatsappButton />
    </>
  );
}