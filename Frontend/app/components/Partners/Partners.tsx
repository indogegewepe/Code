import React from 'react';
import { Container, Image, Title } from '@mantine/core';

export default function Partners() {
  return (
    <Container
      fluid
      className="HeroPartners pb-6 rounded-md"
      style={{ backgroundColor: '#171717' }}
    >
      <div className="heroContentPartners">
        <Title className="text-center text-white p-6">Our Partners</Title>
        <Container size="lg">
          <div className="flex flex-col items-center justify-center p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 justify-items-center">
              <Image
                src="/assets/img/krapyak-removebg-preview.webp"
                alt="Pesantren Krapyak"
                h={100}
                w="auto"
                radius="md"
                loading="lazy"
                className="md:grayscale hover:grayscale-0 transition-transform duration-300 ease-in-out hover:scale-135 hover:z-50"
              />
              <Image
                src="/assets/img/smait.webp"
                alt="SMAIT"
                h={100}
                w="auto"
                radius="md"
                loading="lazy"
                className="md:grayscale hover:grayscale-0 transition-transform duration-300 ease-in-out hover:scale-135 hover:z-50"
              />
              <Image
                src="/assets/img/ugm1.webp"
                alt="UGM"
                h={100}
                w="auto"
                radius="md"
                loading="lazy"
                className="md:grayscale hover:grayscale-0 transition-transform duration-300 ease-in-out hover:scale-135 hover:z-50"
              />
            </div>
          </div>
        </Container>
      </div>
    </Container>
  );
}
