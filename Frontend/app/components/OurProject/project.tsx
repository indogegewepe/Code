'use client';

import React, { useEffect, useState } from 'react';
import { Badge, Container, Image, Text, Title } from '@mantine/core';
import { BentoGrid, BentoGridItem } from '../ui/bento-grid';
import { fetchFromStrapi } from '@/lib/api';

interface ArticleItem {
  id: number;
  title: string;
  description: string;
  createdAt: string;
  publishedAt: string;
  coverUrl: string;
  slug: string;
}

export default function Project() {
  const [articles, setArticles] = useState<ArticleItem[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchFromStrapi('/api/articles?populate=*');
        const items = response.data.map((item: any) => ({ // <-- Added parentheses here
          id: item.id,
          title: item.title,
          description: item.description,
          createdAt: item.createdAt,
          publishedAt: item.publishedAt,
          slug: item.slug,
          coverUrl:
            process.env.NEXT_PUBLIC_API_BASE_URL +
            (item.cover?.formats?.medium?.url || item.cover?.url || ''),
        }));

        setArticles(items);
      } catch (error) {
        console.error('Failed to fetch articles:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <Container size="lg" className="heroContainerThird pb-16">
      <div className="heroContentThird">
        <Title className="text-center">Latest Projects</Title>
        <div>
          <BentoGrid className="mx-auto md:auto-rows-[20rem]">
            {articles.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()).slice(0, 3).map((item) => (
              <BentoGridItem
                key={item.id}
                title={<Text truncate="end">{item.title}</Text>}
                description={<Text truncate="end">{item.description}</Text>}
                header={
                  <Image
                    src={item.coverUrl}
                    alt={item.title}
                    className="object-cover rounded-xl"
                    h={150}
                    radius="md"
                    loading="lazy"
                  />
                }
                className="md:col-span-1"
                icon={
                  <Badge variant="light" radius="sm" color="light-dark(#007BFF, #007BFF)">
                    {new Date(item.publishedAt).toLocaleDateString('id-ID')}
                  </Badge>
                }
                href={`/project/${item.slug}`}
              />
            ))}
          </BentoGrid>
        </div>
      </div>
    </Container>
  );
}
