"use client";

import dynamic from 'next/dynamic';
import React, { useEffect, useState } from 'react';
import { fetchFromStrapi } from '@/lib/api';
import Loader from './loader';
import { Container, Title, Image, Text, Center, Alert, Flex } from '@mantine/core';
import DynamicsIcon from '@/app/components/DynamicsTablerIcon/DynamicsIcon';

const Header = dynamic(() => import('@/app/components/NavProject/Header'));
const Footer = dynamic(() => import('@/app/components/NavProject/Footer'));
const WhatsappButton = dynamic(() => import('@/app/components/Whatsapp/whatsapp'));

type AboutData = {
  id: number;
  Title: string;
  Description: string;
  DescriptionUs: string;
  Sejak: number;
  TotalProyek: number;
  Jangkauan: number;
  Kepuasan: number;
  misis: {
    id: number;
    Icon: string;
    Description: string;
  }[];
  our_teams: {
    id: number;
    Name: string;
    Jobdesk: string;
    Motto: string;
  }[];
  why_uses: {
    id: number;
    Icon: string;
    Description: string;
  }[];
  Logo: {
    url: string;
    formats: {
      thumbnail: { url: string };
      small: { url: string };
      medium: { url: string };
      large: { url: string };
    };
  };
};

type AboutResponse = {
  data: AboutData;
  meta: any;
};

export default function About() {
    const [aboutItem, setAboutItem] = useState<AboutResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res: AboutResponse = await fetchFromStrapi('/api/about?populate=*');
                const about = res.data;

                if (!res || !res.data || Object.keys(res.data).length === 0) {
                    throw new Error('Data "about" tidak ditemukan atau kosong.');
                }
                const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '';
                setAboutItem(about);

            } catch (err: any) {
                setError(err.message || 'Terjadi kesalahan saat mengambil data.');
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
                <Alert icon={<DynamicsIcon iconName="IconError404" />} title="Error!" color="red">
                    {error}
                </Alert>
            </Container>
        );
    }

    if (!aboutItem) {
      return (
        <Container size="lg" py="xl">
          <Alert icon={<DynamicsIcon iconName="IconInfoCircleFilled" />} title="Info" color="blue">
            Data tentang kami belum tersedia.
          </Alert>
        </Container>
      );
    }

    return(
        <>
            <nav className="header">
                <Header />
            </nav>

            <Container size="lg" className='pt-20'>
                <Flex
                    gap="md"
                    justify="center"
                    align="center"
                    direction={{ base: 'column', md: 'row-reverse' }}
                    className="p-6 myCard rounded-xl border border-neutral-200 hover:shadow-xl dark:border-white/[0.2]"
                >
                    {aboutItem.Logo && aboutItem.Logo.url ? (
                        <Image
                            src={`${process.env.NEXT_PUBLIC_API_BASE_URL}${aboutItem.Logo.url}`}
                            alt={aboutItem.Logo.alternativeText || aboutItem.Title}
                            radius="md"
                            h='auto'
                            w={400}
                            fit="contain"
                            style={{ filter: 'saturate(1.5) brightness(1.5)' }}
                        />
                    ) : (
                        <Center style={{ height: 200, width: '100%', border: '1px dashed #ccc', borderRadius: '8px' }}>
                            <Text size="sm" c="dimmed">No image available</Text>
                        </Center>
                    )}
                    <div>
                        <Title order={1} my="sm" c="blue">Tentang Kami</Title>
                        <Title order={3} my="sm">{aboutItem.Title}</Title>
                        <Text my="md" lineClamp={3}>{aboutItem.Description}</Text>
                    </div>
                </Flex>
                <div className="mt-8">
                    <Title order={4}>Misi Kami</Title>
                    {aboutItem.misis.map((misi) => (
                        <div key={misi.id}>
                            <DynamicsIcon iconName={misi.Icon as any} />
                            <Text>{misi.Description}</Text>
                        </div>
                    ))}
                </div>
            </Container>

            <Footer />
            <WhatsappButton />
        </>
    )
}