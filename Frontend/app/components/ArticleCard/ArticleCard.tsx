// components/ArticleCard.tsx (Optional, for reusability)
// If this component also uses client-side hooks directly or is rendered independently
// from a client component, it might also need "use client".
// For now, assuming it's consumed by a client component (ArticlesPage).
import { Card, Image, Text, Badge, Group, Title } from '@mantine/core';
import Link from 'next/link'; // Assuming Next.js for routing

interface ArticleCardProps {
  id: number;
  title: string;
  description: string;
  coverUrl: string;
  slug: string;
  createdAt: string;
  publishedAt: string | null; // publishedAt can be null
}

export function ArticleCard({ id, title, description, coverUrl, slug, createdAt, publishedAt }: ArticleCardProps) {
  const displayDate = publishedAt
    ? new Date(publishedAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })
    : new Date(createdAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Card.Section>
        {coverUrl && (
          <Image
            src={coverUrl}
            height={160}
            alt={title}
            fit="cover" // Ensure image covers the area
          />
        )}
      </Card.Section>

      <Group justify="space-between" mt="md" mb="xs">
        <Title order={5}>{title}</Title>
        <Badge variant="light" radius="sm" color="light-dark(#007BFF, #007BFF)">
          {displayDate}
        </Badge>
      </Group>

      <Text size="sm" c="dimmed" lineClamp={3}>
        {description}
      </Text>

      {/* Using Link for navigation, which is a client-side component */}
      <Link href={`/articles/${slug}`} passHref>
        <Text component="a" size="sm" color="blue" mt="md" style={{ textDecoration: 'none' }}>
          Baca Selengkapnya
        </Text>
      </Link>
    </Card>
  );
}