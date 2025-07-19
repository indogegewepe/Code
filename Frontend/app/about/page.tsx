"use client";

import dynamic from 'next/dynamic';
import React, { useEffect, useState } from 'react';
import { fetchFromStrapi } from '@/lib/api';
import Loader from './loader';
import Link from 'next/link';
import { Container, Title, Image, Text, Center, Alert, Flex, Box, SimpleGrid, Avatar, Button } from '@mantine/core';
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
  visi: string;
  misis: {
    id: number;
    Icon: string;
    Description: string;
  }[];
  why_uses: {
    id: number;
    Icon: string;
    Description: string;
  }[];
  Logo: {
    url: string;
    alternativeText: string;
    formats: {
      thumbnail: { url: string };
      small: { url: string };
      medium: { url: string };
      large: { url: string };
    };
  };
};

type TeamMember = {
  id: number;
  Name: string;
  Jobdesk: string;
  Motto: string;
  Profile: {
    url: string;
    formats?: {
      thumbnail?: {
        url: string;
      };
    };
  } | null;
};

export default function About() {
    const [aboutItem, setAboutItem] = useState<AboutData | null>(null);
    const [ourTeams, setOurTeams] = useState<TeamMember[]>([]);
    const [contact, setContact] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const YearNow = new Date().getFullYear();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [resAbout, resTeam, resContact] = await Promise.all([
                    fetchFromStrapi('/api/about?populate=Logo&populate=why_uses&populate=misis'),
                    fetchFromStrapi('/api/our-teams?populate=Profile'),
                    fetchFromStrapi('/api/contact'),
                ]);

                if (!resAbout || !resAbout.data || Object.keys(resAbout.data).length === 0) {
                    throw new Error('Data "about" tidak ditemukan atau kosong.');
                }

                setContact(resContact.data);
                setAboutItem(resAbout.data);
                setOurTeams(resTeam.data);
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
                                w="30%"
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
                                <DynamicsIcon iconName="IconWorldStar" style={{ color: '#007BFF' }}/>
                                <Text size="sm">Menjadi mitra berbagai institusi & bisnis nasional</Text>
                            </Flex>
                        </div>
                    </Center>
                </Flex>
            </Container>

            <Container size="lg" className='flex flex-col md:flex-row gap-6'>
                <Flex
                    justify="center"
                    align="flex-start"
                    direction="column"
                    className="p-6 myCard rounded-xl md:w-1/2"
                >
                    <Flex
                        direction="row"
                        justify="center"
                        gap='sm'
                        align="center"
                    >
                        <DynamicsIcon iconName='IconEye' style={{ color: '#007BFF' }}/>
                        <Title order={3} my="sm" c="#007BFF">Visi</Title>
                    </Flex>
                    <Text size="md">{aboutItem.visi}</Text>
                </Flex>
                <Flex
                    justify="center"
                    align="flex-start"
                    direction="column"
                    className="p-6 myCard rounded-xl md:w-1/2"
                >
                    <Flex
                        direction="row"
                        justify="center"
                        gap='sm'
                        align="center"
                    >
                        <DynamicsIcon iconName='IconTarget' style={{ color: '#007BFF' }}/>
                        <Title order={3} my="sm" c="#007BFF">Misi</Title>
                    </Flex>
                    {aboutItem.misis.map((misi) => (
                        <Flex 
                            key={misi.id} 
                            direction='row'
                            gap='sm'
                            my={5}
                        >
                            <DynamicsIcon iconName={misi.Icon as any} style={{ color: '#007BFF', width: '30px' }}/>
                            <Text size="md">{misi.Description}</Text>
                        </Flex>
                    ))}
                </Flex>
            </Container>

            <Container size="lg">
                <Center>
                    <Title order={1} my="sm" c="#007BFF" ta="center">Kenapa memilih kami?</Title>
                </Center>
                <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="xs" >
                {aboutItem.why_uses.map((why) => (
                    <Flex
                    key={why.id}
                    direction="column"
                    justify="center"
                    align="center"
                    gap="xs"
                    my={5}
                    className="p-6 myCard rounded-xl"
                    >
                    <DynamicsIcon
                        iconName={why.Icon as any}
                        style={{ color: '#007BFF', width: '30px', height: '30px' }}
                    />
                    <Text size="md" ta="center">{why.Description}</Text>
                    </Flex>
                ))}
                </SimpleGrid>
            </Container>

            <Container size="lg">
                <Center>
                    <Title order={1} my="sm" c="#007BFF">Tim Kami</Title>
                </Center>
                <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="xs">
                {ourTeams.map((teams) => {
                    const imageUrl =
                        teams.Profile?.formats?.thumbnail?.url ||
                        teams.Profile?.url ||
                        '';
                        return (
                    <Flex
                    key={teams.id}
                    direction="column"
                    justify="center"
                    align="center"
                    gap="xs"
                    my={5}
                    className="p-6 myCard rounded-xl"
                    >
                        <Avatar
                            radius="xl"
                            size="lg"
                            src={`${process.env.NEXT_PUBLIC_API_BASE_URL}${imageUrl}`}
                            alt={teams.Name}
                        />
                        <Text size="md" ta="center">{teams.Name}</Text>
                        <Text size="md" ta="center" c="#007BFF">{teams.Jobdesk}</Text>
                        <Text size="md" ta="center">{teams.Motto}</Text>
                    </Flex>
                )})}
                </SimpleGrid>
            </Container>

            <Container size="lg" pb={24}>
                <Center>
                    <Title order={1} my="sm" c="#007BFF" ta="center">Andita dalam Angka</Title>
                </Center>
                <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="xs" >
                    <Flex
                    direction="column"
                    justify="center"
                    align="center"
                    gap="xs"
                    my={5}
                    className="p-6 myCard rounded-xl"
                    >
                        <DynamicsIcon iconName="IconChecklist" style={{ color: '#007BFF', width: '50px', height: '50px' }}/>
                        <Title order={1} ta="center" c="#007BFF">{aboutItem.TotalProyek}+</Title>
                        <Text c="dimmed">Proyek selesai</Text>
                    </Flex>
                    <Flex
                    direction="column"
                    justify="center"
                    align="center"
                    gap="xs"
                    my={5}
                    className="p-6 myCard rounded-xl"
                    >
                        <DynamicsIcon iconName="IconMapPinFilled" style={{ color: '#007BFF', width: '50px', height: '50px' }}/>
                        <Title order={1} ta="center" c="#007BFF">{aboutItem.Jangkauan}+</Title>
                        <Text c="dimmed">Kota Dijangkau</Text>
                    </Flex>
                    <Flex
                    direction="column"
                    justify="center"
                    align="center"
                    gap="xs"
                    my={5}
                    className="p-6 myCard rounded-xl"
                    >
                        <DynamicsIcon iconName="IconStarFilled" style={{ color: '#007BFF', width: '50px', height: '50px' }}/>
                        <Title order={1} ta="center" c="#007BFF">{aboutItem.Kepuasan}%</Title>
                        <Text c="dimmed">Tingkat Kepuasan</Text>
                    </Flex>
                </SimpleGrid>
            </Container>

            <Container fluid bg="#007BFF">
                <Container size="lg">
                    <Flex 
                        justify="center"
                        align="center"
                        direction="column"
                        className="py-24"
                        gap="md"
                    >
                        <Title c="#fff" ta="center">Siap membangun bersama kami?</Title>
                        <Text c="#fff" ta="center">Hubungi tim kami dan rasakan perbedaan layanan profesional serta kualitas koneksi terbaik di Indonesia.</Text>
                        <Button
                            variant="white"
                            size="xl"
                            radius="xl"
                            color="#007BFF"
                            component={Link}
                            // Use optional chaining here
                            href={`tel:+62${contact?.Phone || ''}`}
                            >
                                Hubungi Kami
                        </Button>
                    </Flex>
                </Container>
            </Container>

            <Footer />
            <WhatsappButton />
        </>
    )
}