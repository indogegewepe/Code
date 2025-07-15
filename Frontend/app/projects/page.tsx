"use client";

import React, { useState, useEffect } from 'react';
import { Container, SimpleGrid, Title, Text, Center, Loader, Space, Alert } from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';
import { fetchFromStrapi } from '@/lib/api';
import { ArticleCard } from '@/app/components/ArticleCard/ArticleCard';

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

export default function ArticlesPage() {
  const [articles, setArticles] = useState<ArticleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Utility function for fetching from Strapi
  // You might already have this, if not, create utils/api.ts
  // For simplicity, I'm providing a basic fetchFromStrapi here.
  // In a real app, you'd likely handle errors and responses more robustly.
  // Make sure process.env.NEXT_PUBLIC_API_BASE_URL is set in your .env.local file
  // e.g., NEXT_PUBLIC_API_BASE_URL=http://localhost:1337
  // Or remove it if your Strapi is on the same domain and relative paths work.
  /*
    // utils/api.ts (Example, adjust as per your actual fetch implementation)
    export async function fetchFromStrapi(path: string) {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:1337'; // Fallback for development
      const response = await fetch(`${baseUrl}${path}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    }
  */

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetchFromStrapi('/api/articles?populate=*');
        
        const mappedItems: ArticleItem[] = response.data.map((item: any) => {
          // Refined: Safely get cover attributes, then construct coverUrl
          // Access item.cover directly, as per the provided JSON structure
          const coverAttributes = item.cover?.formats?.medium || item.cover; // <--- Corrected access path
          const coverUrl = process.env.NEXT_PUBLIC_API_BASE_URL +
            (coverAttributes?.url || ''); // Fallback to empty string if no cover

          return {
            id: item.id,
            title: item.title, // <--- Corrected to item.title (direct access)
            description: item.description, // <--- Corrected to item.description (direct access)
            createdAt: item.createdAt, // <--- Corrected to item.createdAt (direct access)
            slug: item.slug, // <--- Corrected to item.slug (direct access)
            publishedAt: item.publishedAt, // This can be null
            coverUrl: coverUrl,
            author: item.author || { name: 'Unknown Author', email: '' }, // <--- Corrected to item.author (direct access)
            categories: item.categories || [], // <--- Corrected to item.categories (direct access)
            content: item.content, // <--- Corrected to item.content (direct access)
          };
        });
        setArticles(mappedItems);
      } catch (err) {
        console.error('Failed to fetch articles:', err);
        setError('Failed to load articles. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); // Empty dependency array means this runs once on mount

  if (loading) {
    return (
      <Container size="lg" py="xl">
        <Center style={{ height: '300px' }}>
          <Loader size="lg" />
          <Text ml="md">Loading articles...</Text>
        </Center>
      </Container>
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
    <Container size="lg" py="xl">
      <Title order={1} mb="lg" ta="center">Artikel Terbaru</Title>
      <Text size="lg" c="dimmed" ta="center" mb="xl">Temukan berbagai artikel menarik seputar teknologi, budaya, dan ekonomi.</Text>

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
            <ArticleCard
              key={article.id}
              id={article.id}
              title={article.title}
              description={article.description}
              coverUrl={article.coverUrl}
              slug={article.slug}
              createdAt={article.createdAt}
              publishedAt={article.publishedAt}
            />
          ))}
        </SimpleGrid>
      )}
      <Space h="xl" />
      <Space h="xl" />
    </Container>
  );
}