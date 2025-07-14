module.exports = [
  'strapi::errors',
  {
    name: 'strapi::cors',
    config: {
      origin: [process.env.NEXT_PUBLIC_FRONTEND_URL],
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
    },
  },
  'strapi::logger',
  'strapi::security',
  'strapi::poweredBy',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];

module.exports = [
  'strapi::errors',
  {
    name: 'strapi::cors',
    config: {
      origin: [process.env.NEXT_PUBLIC_FRONTEND_URL],
      credentials: true,
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
