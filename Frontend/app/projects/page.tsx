"use client";

import dynamic from 'next/dynamic';
import React, { useState, useEffect } from 'react';
import { Container, Title, Image, Text, Center, Alert } from '@mantine/core'; // Import SimpleGrid for layout
import { IconAlertCircle } from '@tabler/icons-react';
import { fetchFromStrapi } from '@/lib/api';
import { Loader } from './loader';
import ArticlesContent from './content';

const Header = dynamic(() => import('@/app/components/Header/Header'));
const Footer = dynamic(() => import('@/app/components/Footer/Footer'));
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

// Renamed component to reflect its purpose: displaying multiple projects
export default function ProyekPage() {
  // State now holds an array of ProyekItem
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

        // Simpan dalam array agar layout grid tetap jalan
        setProyekItems([proyek]);
      } catch (err) {
        console.error('Failed to load projects content:', err);
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
            <div 
              key={proyek.id} 
              className="bg-blue-500 rounded-md p-6 text-white grid grid-flow-row md:grid-flow-col items-center gap-6"
            >
              <div>
                <Title order={3} my="sm">{proyek.title}</Title>
                <Text my="md" lineClamp={3}>{proyek.description}</Text>
              </div>
              {proyek.image.url ? ( 
                <Image 
                  src={proyek.image.formats?.medium?.url || proyek.image.formats?.large?.url || proyek.image.url} 
                  alt={proyek.image.alternativeText || proyek.title}
                  radius="md"
                  h={200}
                  fit="cover"
                />
              ) : (
                <Center style={{ height: 200, width: '100%', border: '1px dashed #ccc', borderRadius: '8px' }}>
                  <Text size="sm" c="dimmed">No image available</Text>
                </Center>
              )}
            </div>
          ))
        }

        <Center m="lg">
          <Title order={1}>Latest Projects</Title>
        </Center>

        <ArticlesContent />
      </Container>

      <Footer />
      <WhatsappButton />
    </>
  );
}