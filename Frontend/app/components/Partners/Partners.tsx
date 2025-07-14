import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { Container, Image, Title } from '@mantine/core';
import { fetchFromStrapi } from '@/lib/api';

const PARTNER_ITEM_WIDTH = 'auto'; // Example width, adjust as per your CSS `w` prop or actual width

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
    // Duplicate enough times to create a smooth loop.
    // Three copies (original + two duplicates) is usually a safe bet.
    // Ensure you have at least enough items to fill the viewport more than once
    // to prevent seeing the "jump" point easily.
    const numDuplicates = 5; 
    let allPartners: PartnerItem[] = [];
    for (let i = 0; i < numDuplicates; i++) {
      allPartners = allPartners.concat(partners);
    }
    return allPartners;
  }, [partners]);

  // Step 3: Implement scroll logic
  const handleScroll = useCallback(() => {
    const scrollerElement = scrollerRef.current;
    if (!scrollerElement || partners.length === 0) return;

    // Calculate the total width of the *original* set of content
    const totalOriginalWidth = partners.length * (PARTNER_ITEM_WIDTH);

    // If scrolling forward past the first set of original content
    if (scrollerElement.scrollLeft >= totalOriginalWidth) {
      scrollerElement.style.scrollBehavior = 'auto'; // Temporarily disable smooth scroll
      scrollerElement.scrollLeft = scrollerElement.scrollLeft - totalOriginalWidth; // Jump back
      // Re-enable smooth scroll after the browser has a chance to apply the 'auto' jump
      requestAnimationFrame(() => {
        if (scrollerElement) {
          scrollerElement.style.scrollBehavior = 'smooth';
        }
      });
    }
    // If scrolling backward past the first copy of original content
    else if (scrollerElement.scrollLeft <= 0 && partners.length > 0) { // Added check for partners.length
      scrollerElement.style.scrollBehavior = 'auto'; // Temporarily disable smooth scroll
      scrollerElement.scrollLeft = scrollerElement.scrollLeft + totalOriginalWidth; // Jump forward
      // Re-enable smooth scroll
      requestAnimationFrame(() => {
        if (scrollerElement) {
          scrollerElement.style.scrollBehavior = 'smooth';
        }
      });
    }
  }, [partners]); // Dependencies: partners, PARTNER_ITEM_WIDTH, 

  // Step 4: Attach and clean up scroll event listener
  useEffect(() => {
    const scrollerElement = scrollerRef.current;
    if (scrollerElement) {
      scrollerElement.addEventListener('scroll', handleScroll);
      // Clean up the event listener when the component unmounts
      return () => {
        scrollerElement.removeEventListener('scroll', handleScroll);
      };
    }
  }, [handleScroll]);

  // If you want auto-scrolling
  useEffect(() => {
    let scrollInterval: NodeJS.Timeout;
    const scrollerElement = scrollerRef.current;

    if (scrollerElement && partners.length > 0) {
      scrollInterval = setInterval(() => {
        scrollerElement.scrollLeft += 1; // Adjust scroll speed here
      }, 20); // Adjust interval for smoother animation (lower value = faster check)

      // Pause on hover
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
  }, [partners]); // Re-run if partners change

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
            ref={scrollerRef} // Add this ref
            className="flex overflow-x-auto px-4 media-scroller" // Ensure media-scroller class for CSS
            style={{ scrollBehavior: 'smooth' }} // Apply smooth scroll here
          >
            <div className="media-scroller-content flex"> {/* Ensure flex is here */}
              {duplicatedPartners.map((partner, index) => (
                <div
                  key={`${partner.id}-${index}`} // Use a combined key for uniqueness
                  className="flex-shrink-0 scroll-snap-start media-element justify-center items-center" // Add media-element for CSS
                  style={{ width: PARTNER_ITEM_WIDTH, justifyContent: "center" }}

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
  );
}