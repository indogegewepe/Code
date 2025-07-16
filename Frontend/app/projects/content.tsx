import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import React, { useState, useEffect, useCallback } from 'react';
import {
  SimpleGrid,
  Title,
  Card,
  Image,
  Text,
  Center,
  Group,
  Badge,
  Button,
  Select,
  TextInput,
} from '@mantine/core';
import { IconRestore } from '@tabler/icons-react';
import { fetchFromStrapi } from '@/lib/api';
import { LoaderNews } from './loader';
import { DatePickerInput } from '@mantine/dates';
import InfiniteScroll from 'react-infinite-scroll-component';

interface ArticleItem {
    id: number;
    documentId: string;
    title: string;
    description: string;
    slug: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string | null;
    content: string;
    cover: {
        url: string;
        formats: {
        thumbnail?: { url: string };
        small?: { url: string };
        medium?: { url: string };
        large?: { url: string };
        };
    };
    author: {
        name: string;
        email: string;
    };
    categories: {
        id: number;
        name: string;
        slug: string;
    }[];
    coverUrl: string;
}

export default function ArticlesContent() {
  const [articles, setArticles] = useState<ArticleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedAuthor, setSelectedAuthor] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);
  const [availableAuthors, setAvailableAuthors] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalArticles, setTotalArticles] = useState(0);

  const buildQueryParams = useCallback(
    (currentPage: number) => {
      const queryParams = new URLSearchParams();
      queryParams.append('pagination[page]', currentPage.toString());
      queryParams.append('pagination[pageSize]', '9');
      if (selectedCategory) {
        queryParams.append('filters[categories][name][$eq]', selectedCategory);
      }
      if (selectedAuthor) {
        queryParams.append('filters[author][name][$eq]', selectedAuthor);
      }
      if (searchQuery) {
        queryParams.append('filters[$or][0][title][$containsi]', searchQuery);
        queryParams.append('filters[$or][1][description][$containsi]', searchQuery);
      }
      if (startDate) {
        const parsedStartDate = new Date(startDate);
        parsedStartDate.setDate(parsedStartDate.getDate() - 1);
        parsedStartDate.setUTCHours(17, 0, 0, 0);
        queryParams.append('filters[publishedAt][$gte]', parsedStartDate.toISOString());
      }
      if (endDate) {
        const parsedEndDate = new Date(endDate);
        parsedEndDate.setUTCHours(16, 59, 59, 999);
        queryParams.append('filters[publishedAt][$lte]', parsedEndDate.toISOString());
      }
      return queryParams;
    },
    [selectedCategory, selectedAuthor, searchQuery, startDate, endDate]
  );

    const mapArticles = (data: any[]): ArticleItem[] => {
        return data.map((item) => {
            const coverFormats = item.cover?.formats;
            const coverUrl = process.env.NEXT_PUBLIC_API_BASE_URL + (coverFormats?.medium?.url || item.cover?.url || '');

            return {
                id: item.id,
                documentId: item.documentId,
                title: item.title,
                description: item.description,
                slug: item.slug,
                createdAt: item.createdAt,
                updatedAt: item.updatedAt,
                publishedAt: item.publishedAt,
                content: item.content,
                cover: item.cover,
                author: item.author || { name: 'Unknown Author', email: '' },
                categories: item.categories || [],
                coverUrl
            };
        });
    };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const queryParams = buildQueryParams(1);
        const articlesQuery = `/api/articles?populate=*&${queryParams.toString()}`;
        const articlesRes = await fetchFromStrapi(articlesQuery);
        const mappedArticles = mapArticles(articlesRes.data);

        const categoriesSet = new Set<string>();
        const authorsSet = new Set<string>();
        mappedArticles.forEach((item) => {
          item.categories.forEach((cat) => categoriesSet.add(cat.name));
          authorsSet.add(item.author.name);
        });

        setAvailableCategories(Array.from(categoriesSet));
        setAvailableAuthors(Array.from(authorsSet));
        setArticles(mappedArticles);
        setPage(1);
        setTotalArticles(articlesRes.meta.pagination.total);
        setHasMore(
          articlesRes.meta.pagination.page * articlesRes.meta.pagination.pageSize <
            articlesRes.meta.pagination.total
        );
      } catch (err) {
        console.error('Failed to load initial content:', err);
        setError('Failed to load content. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [selectedCategory, searchQuery, selectedAuthor, startDate, endDate, buildQueryParams]);

  const fetchMoreData = async () => {
    if (!hasMore) return;
    try {
      const nextPage = page + 1;
      const queryParams = buildQueryParams(nextPage);
      const articlesRes = await fetchFromStrapi(`/api/articles?populate=*&${queryParams.toString()}`);
      const newFetchedArticles = mapArticles(articlesRes.data);

      const existingArticleIds = new Set(articles.map((article) => article.id));
      const uniqueNewArticles = newFetchedArticles.filter((article) => !existingArticleIds.has(article.id));

      setArticles((prevArticles) => [...prevArticles, ...uniqueNewArticles]);
      setPage(nextPage);
      setHasMore(nextPage * articlesRes.meta.pagination.pageSize < articlesRes.meta.pagination.total);
      setTotalArticles(articlesRes.meta.pagination.total);
    } catch (error) {
      console.error('Error fetching more articles:', error);
    }
  };

  if (loading) {
    return <LoaderNews />;
  }

  if (error) {
    return (
      <Center style={{ height: '200px' }}>
        <Text size="lg" c="dimmed">
          {error}
        </Text>
      </Center>
    );
  }

  return (
    <>
      <Card my="lg" shadow="sm" padding="lg" radius="md" withBorder>
        <Title order={3} mb="md">
          Filter Articles
        </Title>
        <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="md">
          <Select
            label="Filter by Category"
            placeholder="Select a category"
            data={availableCategories.map((cat) => ({ value: cat, label: cat }))}
            value={selectedCategory}
            onChange={(value) => setSelectedCategory(value || '')}
            clearable
          />
          <Select
            label="Filter by Author"
            placeholder="Select an author"
            data={availableAuthors.map((author) => ({ value: author, label: author }))}
            value={selectedAuthor}
            onChange={(value) => setSelectedAuthor(value || '')}
            clearable
          />
          <DatePickerInput
            label="Published After"
            placeholder="Pick date"
            value={startDate}
            onChange={setStartDate}
            clearable
          />
          <DatePickerInput
            label="Published Before"
            placeholder="Pick date"
            value={endDate}
            onChange={setEndDate}
            clearable
          />
        </SimpleGrid>
        <TextInput
          label="Search by Title or Description"
          placeholder="Enter keywords"
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.currentTarget.value)}
          mt="md"
        />
        <Group mt="md">
          <Button
            onClick={() => {
              setSelectedCategory('');
              setSelectedAuthor('');
              setSearchQuery('');
              setStartDate(null);
              setEndDate(null);
            }}
            variant="light"
            rightSection={<IconRestore size={14} />}
            fullWidth
          >
            Clear Filters
          </Button>
        </Group>
      </Card>

      {articles.length === 0 ? (
        <Center style={{ height: '200px' }}>
          <Text size="lg" c="dimmed">
            No articles found.
          </Text>
        </Center>
      ) : (
        <InfiniteScroll
          dataLength={articles.length}
          next={fetchMoreData}
          hasMore={hasMore}
          loader={
            <Center my="xl">
              <LoaderNews />
            </Center>
          }
          endMessage={
            <Center my="xl">
              <Text c="dimmed">
                <b>You Reach End of Page</b>
              </Text>
            </Center>
          }
        >
          <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="lg" verticalSpacing="xl">
            {articles
              .sort((a, b) => new Date(b.publishedAt!).getTime() - new Date(a.publishedAt!).getTime())
              .map((article) => (
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
                      className="rounded-md h-56 w-full object-cover"
                    />
                  </Card.Section>
                  <Group justify="space-between" mt="md" mb="xs">
                    <Badge color="#007BFF" variant="light" radius="sm">
                      {article.publishedAt
                        ? new Date(article.publishedAt).toLocaleDateString('id-ID')
                        : 'N/A'}
                    </Badge>
                    <Text fw={500} truncate="end">
                      {article.title}
                    </Text>
                  </Group>
                  <Text size="sm" c="dimmed" truncate="end">
                    {article.description}
                  </Text>
                  <Button variant="transparent" color="blue" fullWidth mt="md" radius="md">
                    Baca Selengkapnya
                  </Button>
                </Card>
              ))}
          </SimpleGrid>
        </InfiniteScroll>
      )}
    </>
  );
}