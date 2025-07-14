'use client';

import { Accordion, Container, Grid, Image, Title } from '@mantine/core';
import classes from './faq.module.css';

const placeholder =
  'Ya, kami menawarkan layanan instalasi di berbagai lokasi. Silakan hubungi kami untuk informasi lebih lanjut.';
const placeholder2 =
  'Biasanya, proses instalasi dapat memakan waktu mulai dari beberapa jam hingga beberapa hari, tergantung pada tingkat kerumitan dan kebutuhan spesifik lokasi Anda.';
const placeholder3 =
  'Ya, kami menyediakan layanan maintenance untuk instalasi kami. Tim kami siap membantu jika ada masalah yang muncul setelah instalasi.';

export default function Faq() {
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
                <Accordion
                  chevronPosition="right"
                  defaultValue="reset-password"
                  variant="separated"
                >
                  <Accordion.Item className={classes.item} value="reset-password">
                    <Accordion.Control>
                      Apakah jasa instalasi bisa dilakukan di luar kota?
                    </Accordion.Control>
                    <Accordion.Panel>{placeholder}</Accordion.Panel>
                  </Accordion.Item>
                  <Accordion.Item className={classes.item} value="another-account">
                    <Accordion.Control>
                      Berapa lama proses instalasi jaringan fiber optic?
                    </Accordion.Control>
                    <Accordion.Panel>{placeholder2}</Accordion.Panel>
                  </Accordion.Item>
                  <Accordion.Item className={classes.item} value="newsletter">
                    <Accordion.Control>Apakah menyediakan layanan maintenance?</Accordion.Control>
                    <Accordion.Panel>{placeholder3}</Accordion.Panel>
                  </Accordion.Item>
                </Accordion>
              </Grid.Col>
            </Grid>
          </Container>
        </div>
      </div>
    </Container>
  );
}
