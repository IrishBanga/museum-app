import { getToken } from '@/lib/authenticate';

let userAPI_URL = process.env.NEXT_PUBLIC_API_URL;

const fetcher = async (url, method, body) => {
  const token = getToken();
  const res = await fetch(url, {
    method,
    body: body ? JSON.stringify(body) : null,
    headers: {
      'content-type': 'application/json',
      Authorization: `JWT ${token}`,
    },
  });

  const data = await res.json();

  return res.status === 200 ? data : [];
};

export async function addToFavourites(id) {
  return fetcher(`${userAPI_URL}/favourites/${id}`, 'PUT', { id });
}

export async function removeFromFavourites(id) {
  return fetcher(`${userAPI_URL}/favourites/${id}`, 'DELETE');
}

export async function getFavourites() {
  return fetcher(`${userAPI_URL}/favourites`, 'GET');
}

export async function addToHistory(id) {
  return fetcher(`${userAPI_URL}/history/${id}`, 'PUT', { id });
}

export async function removeFromHistory(id) {
  return fetcher(`${userAPI_URL}/history/${id}`, 'DELETE');
}

export async function getHistory() {
  return fetcher(`${userAPI_URL}/history`, 'GET');
}
