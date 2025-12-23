import Head from 'next/head';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
}

export default function SEO({ title, description, image, url }: SEOProps) {
  return (
    <Head>
      <title>{title || 'Buddy Finder'}</title>
      <meta name="description" content={description || 'Connect through shared interests and quality content.'} />
      <meta property="og:title" content={title || 'Buddy Finder'} />
      <meta property="og:description" content={description || 'Connect through shared interests and quality content.'} />
      {image && <meta property="og:image" content={image} />}
      {url && <meta property="og:url" content={url} />}
      <meta name="twitter:card" content="summary_large_image" />
    </Head>
  );
}
