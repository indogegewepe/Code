import dynamic from 'next/dynamic';
import { fetchFromStrapi } from '@/lib/api';
import { notFound } from 'next/navigation';
import { Image, Text, Title, Container, Badge } from '@mantine/core';
import React from 'react';
import Markdown from 'react-markdown';

const Header = dynamic(() => import('@/app/components/Header/Header'));
const Footer = dynamic(() => import('@/app/components/Footer/Footer'));
const WhatsappButton = dynamic(() => import('@/app/components/Whatsapp/whatsapp'));

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

export default async function ProjectDetailPage({ params }: { params: { slug: string } }) {
  const STRAPI_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  const { slug } = params;

  let article: ArticleData | null = null;
  let error: string | null = null;

  try {
    const response = await fetchFromStrapi(`/api/articles?filters[slug][$eq]=${slug}&populate=*`);

    if (response && Array.isArray(response.data) && response.data.length > 0) {
      article = response.data[0];
    } else {
      notFound();
    }
  } catch (err: any) {
    console.error('Error fetching article by slug:', err);
    error = `Failed to load article: ${err.message || 'Unknown error'}`;
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
      <Container size="md" py="xl">
        <Title order={1} className="text-center">Article not found</Title>
      </Container>
    );
  }

  // FIX 3: Ensure template literal for coverUrl is fully enclosed in backticks
  const coverUrl = article.cover?.url
    ? `${STRAPI_BASE_URL}${article.cover.url}`
    : '/assets/img/placeholder.webp';

  const publishedDate = new Date(article.publishedAt).toLocaleDateString('en-US', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

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
          {article.categories && <span> 
          {article.categories && article.categories.length > 0 ? (
            <span>
              in{' '}
              {article.categories.map((cat, index) => (
                <span key={cat.name}>
                  {cat.name}
                  {index < article.categories.length - 1 ? ', ' : ''}
                </span>
              ))}
            </span>
          ) : (
            <span>Tidak ada kategori</span>
          )}</span>}
        </Text>
        <Text mb="lg">{article.description}</Text>
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
              <img className="rounded my-4 max-w-full h-auto" {...props} />
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