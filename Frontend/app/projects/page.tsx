"use client";

import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import dynamic from 'next/dynamic';
import React, { useState, useEffect, useCallback } from 'react'; // Import useCallback
import { Container, SimpleGrid, Title, Card, Image, Text, Center, Alert, Group, Badge, Button, Select, TextInput } from '@mantine/core';
import { IconChevronRight, IconAlertCircle, IconRestore } from '@tabler/icons-react';
import { fetchFromStrapi } from '@/lib/api';
import { Loader, LoaderNews } from './loader';
import { DatePickerInput } from '@mantine/dates';
import InfiniteScroll from 'react-infinite-scroll-component';

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

  // State variables for filters
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedAuthor, setSelectedAuthor] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  // Lists for filter dropdowns
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);
  const [availableAuthors, setAvailableAuthors] = useState<string[]>([]);

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalArticles, setTotalArticles] = useState(0);

  // Function to build query parameters
  const buildQueryParams = useCallback((currentPage: number) => {
    const queryParams = new URLSearchParams();
    queryParams.append('pagination[page]', currentPage.toString());
    queryParams.append('pagination[pageSize]', '9'); // Assuming 9 items per page

    if (selectedCategory) {
      queryParams.append('filters[categories][slug][$eq]', selectedCategory);
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
      if (!isNaN(parsedStartDate.getTime())) {
        parsedStartDate.setDate(parsedStartDate.getDate() - 1);
        parsedStartDate.setUTCHours(17, 0, 0, 0); // Start of the day WIB
        queryParams.append('filters[publishedAt][$gte]', parsedStartDate.toISOString());
      }
    }
    if (endDate) {
      const parsedEndDate = new Date(endDate);
      if (!isNaN(parsedEndDate.getTime())) {
        parsedEndDate.setUTCHours(16, 59, 59, 999); // End of the day WIB
        queryParams.append('filters[publishedAt][$lte]', parsedEndDate.toISOString());
      }
    }
    return queryParams;
  }, [selectedCategory, selectedAuthor, searchQuery, startDate, endDate]);

  // Initial data fetch and filter changes handler
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      setArticles([]); // Reset articles when filters change or on initial load
      setPage(1); // Reset page to 1
      setHasMore(true); // Assume there's more data initially

      try {
        const queryParams = buildQueryParams(1);
        const articlesQuery = `/api/articles?populate=*&${queryParams.toString()}`;

        const [articlesRes, proyekRes] = await Promise.all([
          fetchFromStrapi(articlesQuery),
          fetchFromStrapi('/api/title-proyek?populate=images'),
        ]);

        const mappedArticles: ArticleItem[] = articlesRes.data.map((item: any) => {
          const coverAttributes = item.cover?.formats?.medium || item.cover;
          const coverUrl = process.env.NEXT_PUBLIC_API_BASE_URL + (coverAttributes?.url || '');

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

        // Collect available categories and authors (consider fetching these separately if the list is large or static)
        const categoriesSet = new Set<string>();
        const authorsSet = new Set<string>();
        articlesRes.data.forEach((item: any) => {
          item.categories?.forEach((cat: any) => categoriesSet.add(cat.slug));
          if (item.author?.name) {
            authorsSet.add(item.author.name);
          }
        });
        setAvailableCategories(Array.from(categoriesSet));
        setAvailableAuthors(Array.from(authorsSet));

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
        setTotalArticles(articlesRes.meta.pagination.total);
        setHasMore(articlesRes.meta.pagination.page * articlesRes.meta.pagination.pageSize < articlesRes.meta.pagination.total);

      } catch (err) {
        console.error('Failed to load initial content:', err);
        setError('Failed to load content. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedCategory, selectedAuthor, searchQuery, startDate, endDate, buildQueryParams]); // Add buildQueryParams to dependency array

  // Function to fetch more data for infinite scroll
  const fetchMoreData = async () => {
    if (!hasMore) return; // Prevent fetching if no more data

    try {
      const nextPage = page + 1;
      const queryParams = buildQueryParams(nextPage);
      const articlesRes = await fetchFromStrapi(`/api/articles?populate=*&${queryParams.toString()}`);
      
      const newFetchedArticles: ArticleItem[] = articlesRes.data.map((item: any) => {
        const coverAttributes = item.cover?.formats?.medium || item.cover;
        const coverUrl = process.env.NEXT_PUBLIC_API_BASE_URL + (coverAttributes?.url || '');
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

      // Filter out duplicates before adding to the state
      const existingArticleIds = new Set(articles.map(article => article.id));
      const uniqueNewArticles = newFetchedArticles.filter(article => !existingArticleIds.has(article.id));

      setArticles((prevArticles) => [...prevArticles, ...uniqueNewArticles]);
      setPage(nextPage);
      setHasMore(nextPage * articlesRes.meta.pagination.pageSize < articlesRes.meta.pagination.total);
      setTotalArticles(articlesRes.meta.pagination.total); // Update total if it might change

    } catch (error) {
      console.error('Error fetching more articles:', error);
      // Optionally set an error state or show a toast notification for infinite scroll failure
    }
  };

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

        <Card 
          my="lg"
          shadow="sm" 
          padding="lg" 
          radius="md" 
          withBorder 
          >
          <Title order={3} mb="md">Filter Articles</Title>
          <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="md">
            <Select
              label="Filter by Category"
              placeholder="Select a category"
              data={availableCategories.map(cat => ({ value: cat, label: cat }))}
              value={selectedCategory}
              onChange={(value) => setSelectedCategory(value || '')}
              clearable
            />
            <Select
              label="Filter by Author"
              placeholder="Select an author"
              data={availableAuthors.map(author => ({ value: author, label: author }))}
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
            <Button onClick={() => {
                setSelectedCategory('');
                setSelectedAuthor('');
                setSearchQuery('');
                setStartDate(null);
                setEndDate(null);
            }} variant="light" rightSection={<IconRestore size={14} />} fullWidth>
                Clear Filters
            </Button>
          </Group>
        </Card>
        {articles.length === 0 ? (
          <Center style={{ height: '200px' }}>
            <Text size="lg" c="dimmed">No articles found.</Text>
          </Center>
        ) : (
          <InfiniteScroll
            dataLength={articles.length}
            next={fetchMoreData}
            hasMore={hasMore}
            loader={<Center my="xl"><LoaderNews /></Center>}
            endMessage={
              <Center my="xl">
                <Text c="dimmed">
                  <b>You Reach End of Page</b>
                </Text>
              </Center>
            }
          >
              <SimpleGrid
                cols={{ base: 1, sm: 2, md: 3 }}
                spacing="lg"
                verticalSpacing="xl"
              >
                {articles.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()).map((article) => (
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
            </InfiniteScroll>
          )}
      </Container>

      <Footer />
      <WhatsappButton />
    </>
  );
}