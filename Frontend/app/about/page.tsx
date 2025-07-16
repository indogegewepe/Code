"use client";

import dynamic from 'next/dynamic';
import React from 'react';
import { fetchFromStrapi } from '@/lib/api';
import { Loader } from './loader';
import { Container, Title, Image, Text, Center, Alert } from '@mantine/core';
import DynamicsIcon from '@/app/components/DynamicsTablerIcon/DynamicsIcon';

const Header = dynamic(() => import('@/app/components/NavProject/Header'));
const Footer = dynamic(() => import('@/app/components/NavProject/Footer'));
const WhatsappButton = dynamic(() => import('@/app/components/Whatsapp/whatsapp'));

export default async function About() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    if (loading) {
        return <Loader />;
    }

    if (error) {
        return (
            <Container size="lg" py="xl">
                <Alert icon={<DynamicsIcon iconName="IconError404" size="1rem" />} title="Error!" color="red">
                    {error}
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
                {proyekItems.map((proyek) => (
                    <div 
                        key={proyek.id} 
                        className="bg-blue-500 rounded-md p-6 text-white grid grid-flow-row md:grid-flow-col items-center gap-6"
                    >
                        <div>
                        <Title order={3} my="sm">{proyek.title}</Title>
                        <Text my="md" lineClamp={3}>{proyek.description}</Text>
                        </div>
                        {proyek.image.url ? ( 
                        <Image 
                            src={proyek.image.formats?.medium?.url || proyek.image.formats?.large?.url || proyek.image.url} 
                            alt={proyek.image.alternativeText || proyek.title}
                            radius="md"
                            h={200}
                            fit="cover"
                        />
                        ) : (
                        <Center style={{ height: 200, width: '100%', border: '1px dashed #ccc', borderRadius: '8px' }}>
                            <Text size="sm" c="dimmed">No image available</Text>
                        </Center>
                        )}
                    </div>
                    ))
                }
            </Container>
            
            <Footer />
            <WhatsappButton />
        </>
    )
}