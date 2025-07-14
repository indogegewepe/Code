const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;
const TOKEN = process.env.NEXT_PUBLIC_READ_ACCESS_TOKEN;

export async function fetchFromStrapi(endpoint: string, options = {}) {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      'Content-Type': 'application/json',
    },
    ...options,
  });

  if (!res.ok) {
    throw new Error(`Strapi API error: ${res.statusText}`);
  }

  return res.json();
}
