'use client';

import dynamic from 'next/dynamic';
import Loader from './loader';

const HomePage = dynamic(() => import('./HomePage'), {
  ssr: false,
  loading: () => <Loader />,
});

export default function HomePageWrapper() {
  return <HomePage />;
}
