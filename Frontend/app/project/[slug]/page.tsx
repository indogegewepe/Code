'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { Image, Text, Title, Container, Badge, Skeleton } from '@mantine/core';
import Markdown from 'react-markdown';
import { fetchFromStrapi } from '@/lib/api';
import { useParams } from 'next/navigation';

const Header = dynamic(() => import('@/app/components/NavProject/Header'), {
  ssr: false,
  loading: () => <Skeleton height={60} width="100%" />,
});
const Footer = dynamic(() => import('@/app/components/Footer/Footer'), {
  ssr: false,
  loading: () => <Skeleton height={200} width="100%" />,
});
const WhatsappButton = dynamic(() => import('@/app/components/Whatsapp/whatsapp'), {
  ssr: false,
});

type ArticleData = {
  id: number;
  documentId: string;
  title: string;
  description: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  content: string;
  cover?: {
    url: string;
  } | null;
  author?: {
    name: string;
  } | null;
  categories?: {
    name: string;
  }[] | null;
};

export default function ProjectDetailPage() {
  const params = useParams();
  const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug;
  
  const STRAPI_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const [article, setArticle] = useState<ArticleData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true);
        const response = await fetchFromStrapi(`/api/articles?filters[slug][$eq]=${slug}&populate=*`);

        if (response && Array.isArray(response.data) && response.data.length > 0) {
          setArticle(response.data[0]);
        } else {
          setError('Article not found');
        }
      } catch (err: any) {
        setError(`Failed to load article: ${err.message || 'Unknown error'}`);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchArticle();
    }
  }, [slug]);

  if (loading) {
    return (
      <Container size="lg" mt={70}>
        <Skeleton height={40} width="70%" mb="md" mx="auto" />
        <Skeleton height={300} mb="md" />
        <Skeleton height={20} width="30%" mb="sm" />
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} height={15} mt="md" width={i % 2 === 0 ? "90%" : "80%"} />
        ))}
      </Container>
    );
  }

  if (error) {
    return (
      <Container size="md" py="xl">
        <Title order={1} className="text-center" c="red">Error</Title>
        <Text className="text-center">{error}</Text>
      </Container>
    );
  }

  if (!article) {
    return (
      <Container h="100vh" fluid className='content-center'>
        <Title order={1} className="text-center" c='red'>404!</Title>
        <Title order={1} className="text-center">Article not found</Title>
      </Container>
    );
  }

  const coverUrl = article.cover?.url
    ? `${STRAPI_BASE_URL}${article.cover.url}`
    : '/assets/img/placeholder.webp';

  const publishedDate = new Date(article.publishedAt).toLocaleDateString('en-US', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  const renderCategories = () => {
    if (!article?.categories || article.categories.length === 0) {
      return <span>Tidak ada kategori</span>;
    }

    return article.categories.map((cat, index) => (
      <span key={cat.name}>
        {cat.name}
        {index < article.categories!.length - 1 ? ', ' : ''}
      </span>
    ));
  };

  return (
    <>
      <nav className="header">
        <Header />
      </nav>

      <Container size="lg" mt={70}>
        <Title order={1} mb="md" textWrap="balance" className='text-center'>{article.title}</Title>
        {article.cover && (
          <Image src={coverUrl} alt={article.title} radius="md" mb="md" h={300} />
        )}
        <Text size="sm" c="dimmed" mb="sm">
          Published: <Badge variant="light" radius="sm">{publishedDate}</Badge>
          {article.author && <span> by {article.author.name} </span>}
          {article.categories && (
            <span>
              in {renderCategories()}
            </span>
          )}
        </Text>
        <Markdown
          components={{
            h1: ({ node, ...props }) => <h1 className="text-4xl font-bold my-4 " {...props} />,
            h2: ({ node, ...props }) => <h2 className="text-3xl font-semibold my-3" {...props} />,
            h3: ({ node, ...props }) => <h3 className="text-2xl font-semibold my-2" {...props} />,
            p: ({ node, ...props }) => <p className="my-2 leading-relaxed" {...props} />,
            ul: ({ node, ...props }) => <ul className="list-disc ml-6 my-2" {...props} />,
            ol: ({ node, ...props }) => <ol className="list-decimal ml-6 my-2" {...props} />,
            li: ({ node, ...props }) => <li className="mb-1" {...props} />,
            strong: ({ node, ...props }) => <strong className="font-semibold" {...props} />,
            em: ({ node, ...props }) => <em className="italic" {...props} />,
            blockquote: ({ node, ...props }) => (
              <blockquote className="border-l-4 border-blue-500 bg-gray-600/50 pl-4 italic my-4 py-2 px-4 rounded" {...props} />
            ),
            a: ({ node, ...props }) => (
              <a className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer" {...props} />
            ),
            img: ({ node, ...props }) => (
              <img className="rounded my-4 max-w-full h-auto" alt={props.alt || ''} {...props} />
            ),
            code: ({ node, ...props }) => (
              <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded text-sm font-mono" {...props} />
            ),
            pre: ({ node, ...props }) => (
              <pre className="bg-gray-900 text-white p-4 rounded overflow-x-auto my-4" {...props} />
            ),
            hr: () => <hr className="my-6 border-t" />,
          }}
        >
          {article.content}
        </Markdown>
      </Container>

      <Footer />

      <WhatsappButton />
    </>
  );
}