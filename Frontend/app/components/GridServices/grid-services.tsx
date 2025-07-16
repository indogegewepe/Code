'use client';

import DynamicsIcon from '@/app/components/DynamicsTablerIcon/DynamicsIcon';
import { Container, Title } from '@mantine/core';
import { GlowingEffect } from '@/app/components/ui/glowing-effect';
import { useEffect, useState } from 'react';
import { fetchFromStrapi } from '@/lib/api';

interface ServiceItem {
  id: number;
  Icon: string;
  Title: string;
  Description: string;
}

export default function GridServices() {
  const [serviceItems, setServiceItems] = useState<ServiceItem[]>([]);

  useEffect(() => {
    const fetchService = async () => {
      try {
        const res = await fetchFromStrapi('/api/services');
        setServiceItems(res.data);
      } catch (error) {
        console.error('Failed to fetch services:', error);
      }
    };

    fetchService();
  }, []);

  return (
    <Container fluid bg="#171717" className="rounded-md">
      <Container size="lg" className="heroContainerSec">
        <div id="services" className="heroContentSec py-24 scroll-mt-6">
          <Title className="text-center">Our Services</Title>
          <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 lg:gap-6">
            {serviceItems.map((item) => (
              <GridItem
                key={item.id}
                icon={<DynamicsIcon iconName={item.Icon} />}
                title={item.Title}
                description={item.Description}
              />
            ))}
          </ul>
        </div>
      </Container>
    </Container>
  );
}

interface GridItemProps {
  icon: React.ReactNode;
  title: string;
  description: React.ReactNode;
}

const GridItem = ({ icon, title, description }: GridItemProps) => {
  return (
    <li className="min-h-[14rem] list-none">
      <div className="relative h-full rounded-2xl border p-2 md:rounded-3xl md:p-3">
        <GlowingEffect spread={50} glow disabled={false} proximity={64} inactiveZone={0.01} />
        <div className="border-0.75 relative flex h-full flex-col justify-between gap-6 overflow-hidden rounded-xl p-6 md:p-6 dark:shadow-[0px_0px_27px_0px_#2D2D2D]">
          <div className="relative flex flex-1 flex-col justify-between gap-3">
            <div className="w-fit rounded-lg border border-gray-600 p-2">{icon}</div>
            <div className="space-y-3">
              <h3 className="-tracking-4 pt-0.5 font-sans text-xl/[1.375rem] font-semibold text-balance text-black md:text-2xl/[1.875rem] dark:text-white">
                {title}
              </h3>
              <h2 className="font-sans text-sm/[1.125rem] text-black md:text-base/[1.375rem] dark:text-neutral-400 [&_b]:md:font-semibold [&_strong]:md:font-semibold">
                {description}
              </h2>
            </div>
          </div>
        </div>
      </div>
    </li>
  );
};
