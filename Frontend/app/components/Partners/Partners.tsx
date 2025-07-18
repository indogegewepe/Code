import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { Container, Image, Title } from '@mantine/core';
import { fetchFromStrapi } from '@/lib/api';

interface PartnerItem {
  id: number;
  documentId: string;
  Name: string;
  Pictures: {
    url: string;
    alternativeText?: string;
  };
}

export default function Partners() {
  const [partners, setPartners] = useState<PartnerItem[]>([]);
  const scrollerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetchFromStrapi('/api/partners?populate=Pictures');
      const items = response.data.map((item: any) => {
        const imageUrl =
          item.Pictures?.formats?.medium?.url || item.Pictures?.url || '';
        return {
          id: item.id,
          documentId: item.documentId,
          Name: item.Name,
          Pictures: {
            url: process.env.NEXT_PUBLIC_API_BASE_URL + imageUrl,
            alternativeText: item.Pictures?.alternativeText || item.Name,
          },
        };
      });
      setPartners(items);
    };

    fetchData();
  }, []);

  const duplicatedPartners = useMemo(() => {
    if (partners.length === 0) return [];
    const numDuplicates = 5; 
    let allPartners: PartnerItem[] = [];
    for (let i = 0; i < numDuplicates; i++) {
      allPartners = allPartners.concat(partners);
    }
    return allPartners;
  }, [partners]);

  const handleScroll = useCallback(() => {
    const scrollerElement = scrollerRef.current;
    if (!scrollerElement || partners.length === 0) return;

    const firstPartnerElement = scrollerElement.querySelector('.media-element');
    const itemWidth = firstPartnerElement instanceof HTMLElement ? firstPartnerElement.offsetWidth : 0;

    const totalOriginalWidth = partners.length * itemWidth;

    if (totalOriginalWidth === 0) return;

    if (scrollerElement.scrollLeft >= totalOriginalWidth) {
        scrollerElement.style.scrollBehavior = 'auto';
        scrollerElement.scrollLeft -= totalOriginalWidth;
        requestAnimationFrame(() => {
            if (scrollerElement) {
                scrollerElement.style.scrollBehavior = 'smooth';
            }
        });
    }
    else if (scrollerElement.scrollLeft <= 0) {
        scrollerElement.style.scrollBehavior = 'auto';
        scrollerElement.scrollLeft += totalOriginalWidth;
        requestAnimationFrame(() => {
            if (scrollerElement) {
                scrollerElement.style.scrollBehavior = 'smooth';
            }
        });
    }
}, [partners]);

  useEffect(() => {
    const scrollerElement = scrollerRef.current;
    if (scrollerElement) {
      scrollerElement.addEventListener('scroll', handleScroll);
      return () => {
        scrollerElement.removeEventListener('scroll', handleScroll);
      };
    }
  }, [handleScroll]);

  useEffect(() => {
    let scrollInterval: NodeJS.Timeout;
    const scrollerElement = scrollerRef.current;

    if (scrollerElement && partners.length > 0) {
      scrollInterval = setInterval(() => {
        scrollerElement.scrollLeft += 1; // Adjust scroll speed here
      }, 20);

      const pauseScroll = () => clearInterval(scrollInterval);
      const resumeScroll = () => {
        scrollInterval = setInterval(() => {
          scrollerElement.scrollLeft += 1;
        }, 20);
      };

      scrollerElement.addEventListener('mouseenter', pauseScroll);
      scrollerElement.addEventListener('mouseleave', resumeScroll);

      return () => {
        clearInterval(scrollInterval);
        scrollerElement.removeEventListener('mouseenter', pauseScroll);
        scrollerElement.removeEventListener('mouseleave', resumeScroll);
      };
    }
  }, [partners]);

  return (
    <Container
      fluid
      className="HeroPartners pb-6 rounded-md"
      style={{ backgroundColor: '#171717' }}
    >
      <div className="heroContentPartners">
        <Title className="text-center text-white p-6">Our Partners</Title>
        <Container size="lg" className='fade-in-container'>
          <div
            ref={scrollerRef}
            className="flex overflow-x-auto px-4 media-scroller"
            style={{ scrollBehavior: 'smooth' }}
          >
            <div className="media-scroller-content flex">
              {duplicatedPartners.map((partner, index) => (
                <div
                  key={`${partner.id}-${index}`}
                  className="flex-shrink-0 scroll-snap-start media-element justify-center items-center"
                  style={{ width: 'auto', justifyContent: "center" }}

                >
                  <Image
                    src={partner.Pictures.url}
                    alt={partner.Pictures.alternativeText}
                    h={100}
                    loading="lazy"
                    fit="contain"
                    className="md:grayscale hover:grayscale-0 transition-transform duration-300 ease-in-out hover:scale-135 hover:z-50 object-contain my-12 px-8"
                  />
                </div>
              ))}
            </div>
          </div>
        </Container>
      </div>
    </Container>
  )
}