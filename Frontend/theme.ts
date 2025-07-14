// theme.ts
'use client';

import { Inter } from 'next/font/google';
import { createTheme } from '@mantine/core';

const inter = Inter({ subsets: ['latin'] });

export const theme = createTheme({
  fontFamily: inter.style.fontFamily,
});
