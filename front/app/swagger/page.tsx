"use client";
import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';
import { useState, useEffect } from 'react';

export default function SwaggerPage() {
  const [swaggerUrl, setSwaggerUrl] = useState<string | null>(null);

  useEffect(() => {
    setSwaggerUrl('api/doc');
  }, []);

  if (!swaggerUrl) {
    return <p>Loading Swagger UI...</p>;
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-2xl font-bold mb-4">API Documentation</h1>
      <SwaggerUI url={swaggerUrl} />
    </main>
  );
}
