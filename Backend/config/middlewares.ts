module.exports = [
  'strapi::errors',
  {
    name: 'strapi::cors',
    config: {
      enabled: true,
      origin: process.env.NEXT_PUBLIC_FRONTEND_URL ? process.env.NEXT_PUBLIC_FRONTEND_URL.split(',') : [],
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'],
      credentials: true,
      headers: '*',
    },
  },
  'strapi::security',
  'strapi::poweredBy',
  'strapi::logger',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];