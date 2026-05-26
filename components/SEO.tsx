
import React, { useEffect } from 'react';

interface SEOProps {
  title: string;
  description?: string;
  schema?: object;
}

const SEO: React.FC<SEOProps> = ({ title, description, schema }) => {
  const schemaString = schema ? JSON.stringify(schema) : '';

  useEffect(() => {
    const baseTitle = 'AEVO';
    const formattedTitle = title.includes(baseTitle) ? title : `${title} | ${baseTitle}`;
    
    // 1. Update title
    document.title = formattedTitle;

    // 2. Update Primary and social title tags
    const updateTitleMeta = (selector: string, attr: string) => {
      const el = document.querySelector(selector);
      if (el) el.setAttribute(attr, formattedTitle);
    };
    updateTitleMeta('meta[name="title"]', 'content');
    updateTitleMeta('meta[property="og:title"]', 'content');
    updateTitleMeta('meta[property="twitter:title"]', 'content');

    // 3. Update Meta Description and social descriptions
    if (description) {
      const updateDescriptionMeta = (selector: string, attr: string) => {
        let el = document.querySelector(selector);
        if (!el) {
          el = document.createElement('meta');
          if (selector.startsWith('meta[name=')) {
            const name = selector.split('"')[1];
            el.setAttribute('name', name);
          } else if (selector.startsWith('meta[property=')) {
            const property = selector.split('"')[1];
            el.setAttribute('property', property);
          }
          document.head.appendChild(el);
        }
        el.setAttribute(attr, description);
      };

      updateDescriptionMeta('meta[name="description"]', 'content');
      updateDescriptionMeta('meta[property="og:description"]', 'content');
      updateDescriptionMeta('meta[property="twitter:description"]', 'content');
    }

    // 4. Update Canonical Link
    const cleanPath = window.location.hash 
      ? window.location.hash.replace('#', '') 
      : window.location.pathname;
    const formattedPath = cleanPath.startsWith('/') ? cleanPath : `/${cleanPath}`;
    const canonicalUrl = `https://aevodesigns.in${formattedPath}`;

    let canonicalEl = document.querySelector('link[rel="canonical"]');
    if (canonicalEl) {
      canonicalEl.setAttribute('href', canonicalUrl);
    } else {
      canonicalEl = document.createElement('link');
      canonicalEl.setAttribute('rel', 'canonical');
      canonicalEl.setAttribute('href', canonicalUrl);
      document.head.appendChild(canonicalEl);
    }

    // 5. Inject Dynamic JSON-LD Schema
    if (schemaString) {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.text = schemaString;
      script.id = 'dynamic-json-ld';
      document.head.appendChild(script);

      return () => {
        const existingScript = document.getElementById('dynamic-json-ld');
        if (existingScript) {
          document.head.removeChild(existingScript);
        }
      };
    }
  }, [title, description, schemaString]);

  return null;
};

export default SEO;
