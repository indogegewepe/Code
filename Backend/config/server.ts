export default ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  url: env('PUBLIC_URL', 'https://your-railway-app-url.railway.app'),
  app: {
    keys: env.array('APP_KEYS'),
  },
});
