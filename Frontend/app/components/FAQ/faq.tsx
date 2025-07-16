'use client';

import { Accordion, Container, Grid, Image, Title } from '@mantine/core';
import classes from './faq.module.css';
import { fetchFromStrapi } from '@/lib/api';
import { useEffect, useState } from 'react';

interface FaqItem {
  id: number;
  documentId: string;
  Question: string;
  Answer: string;
}

export default function Faq() {
  const [faqItems, setFaqItems] = useState<FaqItem[]>([]);

  useEffect(() => {
    const fetchFaq = async () => {
      try {
        const res = await fetchFromStrapi('/api/faqs');
        setFaqItems(res.data); // ambil array dari response
      } catch (error) {
        console.error('Failed to fetch FAQ:', error);
      }
    };

    fetchFaq();
  }, []);

  return (
    <Container size="lg" className="heroContainerFourth">
      <div className="faqContent">
        <Title className="text-center">Frequently Asked Questions</Title>
        <div className={classes.wrapper}>
          <Container size="lg">
            <Grid id="faq-grid" gutter={50}>
              <Grid.Col span={{ base: 12, md: 6 }}>
                <Image
                  src="/assets/img/faq.png"
                  w="auto"
                  height="full"
                  loading="lazy"
                  alt="Frequently Asked Questions"
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 6 }}>
                {faqItems.length > 0 && (
                  <Accordion
                    key={faqItems[0].documentId}
                    chevronPosition="right"
                    variant="separated"
                    defaultValue={faqItems[0].documentId}
                  >
                    {faqItems.map((item) => (
                      <Accordion.Item
                        className={classes.item}
                        key={item.documentId}
                        value={item.documentId}
                      >
                        <Accordion.Control>{item.Question}</Accordion.Control>
                        <Accordion.Panel>{item.Answer}</Accordion.Panel>
                      </Accordion.Item>
                    ))}
                  </Accordion>
                )}
              </Grid.Col>
            </Grid>
          </Container>
        </div>
      </div>
    </Container>
  );
}
