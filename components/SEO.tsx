
import React, { useEffect } from 'react';

interface SEOProps {
  title: string;
  description?: string;
  schema?: object;
}

const SEO: React.FC<SEOProps> = ({ title, description, schema }) => {
  useEffect(() => {
    // Update Title
    const baseTitle = 'AEVO';
    document.title = title.includes(baseTitle) ? title : `${baseTitle} | ${title}`;

    // Update Description
    if (description) {
      let metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', description);
      } else {
        metaDescription = document.createElement('meta');
        metaDescription.setAttribute('name', 'description');
        metaDescription.setAttribute('content', description);
        document.head.appendChild(metaDescription);
      }
    }

    // Inject JSON-LD Schema
    if (schema) {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.text = JSON.stringify(schema);
      script.id = 'json-ld-schema';
      document.head.appendChild(script);

      return () => {
        const existingScript = document.getElementById('json-ld-schema');
        if (existingScript) {
          document.head.removeChild(existingScript);
        }
      };
    }
  }, [title, description, schema]);

  return null;
};

export default SEO;
