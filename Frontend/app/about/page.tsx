"use client";

import dynamic from 'next/dynamic';
import React, { useEffect, useState } from 'react';
import { fetchFromStrapi } from '@/lib/api';
import Loader from './loader';
import { Container, Title, Image, Text, Center, Alert, Flex, Box } from '@mantine/core';
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
    const YearNow = new Date().getFullYear();

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
                    className="p-6 myCard rounded-xl"
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
                        <Title order={1} my="sm" c="#007BFF">Tentang Kami</Title>
                        <Title order={3} my="sm">{aboutItem.Title}</Title>
                        <Text my="md" lineClamp={3}>{aboutItem.Description}</Text>
                    </div>
                </Flex>
            </Container>

            <Container size="lg" py={24}>
                <Flex
                    gap="md"
                    justify="center"
                    align="center"
                    direction={{ base: 'column', md: 'row' }}
                    className="p-6 myCard rounded-xl"
                >
                    <div className='lg:w-1/2'>
                        <Title order={1} my="sm" c="#007BFF">Siapa Kami?</Title>
                        <Title order={3} my="sm">{aboutItem.Title}</Title>
                        <Text my="md">{aboutItem.DescriptionUs}</Text>
                    </div>
                    <Center className='lg:w-1/2 gap-4 w-full flex flex-col'>
                        <Flex
                            justify="center"
                            align="center"
                            direction="row"
                            className="w-full"
                            gap="md"
                        >
                            <Flex
                                justify="center"
                                align="center"
                                direction="column"
                            >
                                <Title order={3} my="sm" c="#007BFF">{aboutItem.Sejak}</Title>
                                <Text size="sm" c="dimmed">Didirikan</Text>
                            </Flex>
                            <Box
                                w="50%"
                                h={4}
                                bg="#007BFF"
                                style={{ borderRadius: "100px" }}
                            />
                            <Flex
                                justify="center"
                                align="center"
                                direction="column"
                            >
                                <Title order={3} my="sm" c="#007BFF">{YearNow}</Title>
                                <Text size="sm" c="dimmed" style={{ whiteSpace: 'nowrap' }}>{aboutItem.TotalProyek}+ Proyek</Text>
                            </Flex>
                        </Flex>
                        <div>
                            <Flex
                                justify="center"
                                align="center"
                                direction="row"
                                gap="md"
                            >
                                <DynamicsIcon iconName="IconWorldStar"/>
                                <Text size="sm">Menjadi mitra berbagai institusi & bisnis nasional</Text>
                            </Flex>
                        </div>
                    </Center>
                </Flex>
            </Container>

            {/* <div className="mt-8">
                <Title order={4}>Misi Kami</Title>
                {aboutItem.misis.map((misi) => (
                    <div key={misi.id}>
                        <DynamicsIcon iconName={misi.Icon as any} />
                        <Text>{misi.Description}</Text>
                    </div>
                ))}
            </div> */}

            <Footer />
            <WhatsappButton />
        </>
    )
}