"use client";

import dynamic from 'next/dynamic';
import React, { useState, useEffect } from 'react';
import { Container, SimpleGrid, Title, Card, Image, Text, Center, Alert, Group, Badge, Button } from '@mantine/core';
import { IconChevronRight, IconAlertCircle } from '@tabler/icons-react';
import { fetchFromStrapi } from '@/lib/api';
import Loader from './loader';

const Header = dynamic(() => import('@/app/components/Header/Header'));
const Footer = dynamic(() => import('@/app/components/Footer/Footer'));
const WhatsappButton = dynamic(() => import('@/app/components/Whatsapp/whatsapp'));

interface ArticleItem {
  id: number;
  title: string;
  description: string;
  createdAt: string;
  slug: string;
  publishedAt: string | null;
  cover: {
    formats: {
      medium?: { url: string };
      thumbnail?: { url: string };
      small?: { url: string };
      large?: { url: string };
    };
    url: string;
  } | null;
  author: {
    name: string;
    email: string;
  };
  categories: {
    name: string;
    slug: string;
  }[];
  coverUrl: string;
  content: string;
}

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
    };
  };
}

export default function ArticlesPage() {
  const [articles, setArticles] = useState<ArticleItem[]>([]);
  const [proyek, setProjects] = useState<ProyekItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [articlesRes, proyekRes] = await Promise.all([
          fetchFromStrapi('/api/articles?populate=*'),
          fetchFromStrapi('/api/title-proyek?populate=images'),
        ]);

        // Mapping articles
        const mappedArticles: ArticleItem[] = articlesRes.data.map((item: any) => {
          const coverAttributes = item.cover?.formats?.medium || item.cover;
          const coverUrl = process.env.NEXT_PUBLIC_API_BASE_URL +
            (coverAttributes?.url || '');

          return {
           id: item.id,
            title: item.title,
            description: item.description,
            createdAt: item.createdAt,
            slug: item.slug,
            publishedAt: item.publishedAt,
            coverUrl,
            author: item.author || { name: 'Unknown Author', email: '' },
            categories: item.categories || [],
            content: item.content,
          };
        });

        const proyekData = proyekRes.data;
        let mappedProyek: ProyekItem | null = null;

        if (proyekData && proyekData.images) {
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '';
        const image = proyekData.images;

        mappedProyek = {
          id: proyekData.id,
          title: proyekData.Title,
          description: proyekData.Description,
          image: {
            url: baseUrl + (image.url || ''),
            alternativeText: image.alternativeText || null,
            width: image.width || 0,
            height: image.height || 0,
            formats: {
              medium: image.formats?.medium?.url
                ? { url: baseUrl + image.formats.medium.url }
                : undefined,
            },
          },
        };
      }

        setProjects(mappedProyek);
        setArticles(mappedArticles);
      } catch (err) {
        console.error('Failed to fetch data:', err);
        setError('Failed to load content. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Loader />
    );
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
        {proyek && (
          <div className="bg-blue-500 flex flex-col-reverse md:flex-row h-auto rounded-md mb-6 p-6 md:p-12 items-center justify-center gap-6 ">
            <div>
              <Title order={1} mb="lg">{proyek.title}</Title>
              <Text mb="lg">{proyek.description}</Text>
            </div>
            <Image 
              src={proyek.image?.formats?.medium?.url || proyek.image.url} 
              alt={proyek.image?.alternativeText || proyek.title}
              radius="md"
              h={250}
              w={350}
            />
          </div>
        )}
        
        <Center>
          <Title order={1} m="lg">Latest Project</Title>
        </Center>

        {articles.length === 0 ? (
          <Center style={{ height: '200px' }}>
            <Text size="lg" c="dimmed">No articles found.</Text>
          </Center>
        ) : (
          <SimpleGrid
            cols={{ base: 1, sm: 2, md: 3 }}
            spacing="lg"
            verticalSpacing="xl"
          >
            {articles.map((article) => (
              <Card 
                shadow="sm" 
                padding="lg" 
                radius="md" 
                withBorder 
                component="a"
                href={`/project/${article.slug}`}
                target="_blank"
                key={article.id}
                >
                <Card.Section>
                  <Image
                    src={article.coverUrl}
                    alt={article.title}
                    radius="md"
                    loading="lazy"
                    className='rounded-md h-56 w-full object-cover'
                  />
                </Card.Section>
                <Group justify="space-between" mt="md" mb="xs">
                  <Badge color="#007BFF" variant="light" radius="sm">
                    {article.publishedAt ? new Date(article.publishedAt).toLocaleDateString('id-ID') : 'N/A'}
                  </Badge>
                  <Text fw={500} truncate="end">{article.title}</Text>
                </Group>
                <Text size="sm" c="dimmed" truncate="end">
                  {article.description}
                </Text>
                <Button variant="transparent" color="blue" fullWidth mt="md" radius="md" rightSection={<IconChevronRight size={14} />}>
                  Baca Selengkapnya
                </Button>
              </Card>
            ))}
          </SimpleGrid>
        )}
      </Container>

      <Footer />

      <WhatsappButton />
    </>
  );
}