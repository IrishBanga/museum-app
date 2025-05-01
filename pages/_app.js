import Layout from '@/src/components/Layout';
import RouteGuard from '@/src/components/RouteGuard';
import { SWRConfig } from 'swr';

import 'bootstrap/dist/css/bootstrap.min.css';

const fetcher = async (url) => {
  const response = await fetch(url);
  if (!response.ok) {
    const error = new Error('An error occurred while fetching the data.');
    error.info = await response.json();
    error.status = response.status;
    throw error;
  }
  return response.json();
};

export default function App({ Component, pageProps }) {
  return (
    <SWRConfig value={{ fetcher }}>
      <RouteGuard>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </RouteGuard>
    </SWRConfig>
  );
}
