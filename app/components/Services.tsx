'use client';

import { useState, useEffect } from 'react';
import React from 'react';
import { Text, Card } from './theam';

type Service = {
  title: string;
  description: string;
  features: string[];
  icon?: string;
};

type ServicesMeta = {
  heading: string;
  subheading: string;
  ctaHeading: string;
  ctaDescription: string;
  ctaButtonLabel: string;
};

const Services = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [meta, setMeta] = useState<ServicesMeta | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchServices() {
      try {
        const res = await fetch("/api/content/services", { cache: "no-store" });
        const data = await res.json();
        if (data.success) {
          if (Array.isArray(data.services)) {
            setServices(data.services);
          }
          if (data.meta) {
            setMeta({
              heading: data.meta.heading ?? "My Services",
              subheading: data.meta.subheading ?? "",
              ctaHeading: data.meta.ctaHeading ?? "Ready to Start Your Project?",
              ctaDescription: data.meta.ctaDescription ?? "",
              ctaButtonLabel: data.meta.ctaButtonLabel ?? "Get Started Today",
            });
          }
        }
      } catch (err) {
        console.error("Failed to fetch services:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchServices();
  }, []);

  const getIcon = (iconName: string) => {
    const icons: Record<string, React.ReactElement> = {
      code: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      ),
      shield: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      heart: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
      lightning: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      database: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
        </svg>
      )
    };
    return icons[iconName] || icons.code;
  };

  const renderIconVisual = (iconValue?: string) => {
    if (iconValue && /^https?:\/\//i.test(iconValue)) {
      return (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={iconValue}
            alt="Service icon"
            className="w-16 h-16 rounded-2xl object-cover"
          />
        </>
      );
    }
    return getIcon(iconValue || "code");
  };

  const renderSkeleton = () => (
    <section id="services" className="pb-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-20">
          <div className="h-6 w-40 mx-auto mb-4 bg-gray-200 rounded-full animate-pulse" />
          <div className="h-4 w-64 mx-auto bg-gray-200 rounded-full animate-pulse" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[0, 1, 2].map((key) => (
            <div key={key} className="p-6 rounded-2xl border border-gray-100 bg-white/70 animate-pulse space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-gray-200" />
              <div className="h-5 w-40 bg-gray-200 rounded-full" />
              <div className="h-4 w-full bg-gray-100 rounded-full" />
              <div className="h-4 w-3/4 bg-gray-100 rounded-full" />
              <div className="space-y-2">
                <div className="h-3 w-2/3 bg-gray-100 rounded-full" />
                <div className="h-3 w-1/2 bg-gray-100 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );

  if (loading) {
    return renderSkeleton();
  }

  if (!services || services.length === 0) {
    return null;
  }

  return (
    <section id="services" className="pb-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div id="services-header" className="text-center mb-20">
          {meta?.heading && (
            <Text 
              variant="h2" 
              size="3xl" 
              fontFamily="rajdhani" 
              color="black" 
              weight="extrabold"
              align="center"
              className="md:text-4xl mb-4"
            >
              {meta.heading}
            </Text>
          )}
          <div className="w-24 h-1.5 bg-gradient-to-r from-teal-300 via-emerald-400 to-green-500 mx-auto rounded-full mb-4"></div>
          {meta?.subheading && (
            <Text 
              variant="body" 
              size="lg" 
              fontFamily="poppins" 
              color="gray" 
              align="center"
              className="max-w-3xl mx-auto"
            >
              {meta.subheading}
            </Text>
          )}
        </div>

        {services && services.length > 0 ? (
          <div id="services-content" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
            <Card
              key={index}
              variant="elevated"
              hover="lift"
              shadow="xl"
              className="group service-card hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-blue-200 bg-white/80 backdrop-blur-sm"
              padding="lg"
            >
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg overflow-hidden">
                {renderIconVisual(service.icon)}
              </div>
              <Text 
                variant="h3" 
                size="xl" 
                fontFamily="rajdhani" 
                color="black" 
                weight="bold"
                className="mb-3"
              >
                {service.title}
              </Text>
              <Text 
                variant="body" 
                fontFamily="poppins" 
                color="gray" 
                className="mb-4 leading-relaxed"
              >
                {service.description}
              </Text>
              <ul className="space-y-2">
                {service.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center">
                    <svg className="w-4 h-4 text-green-500 mr-2 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <Text variant="small" fontFamily="poppins" color="gray">
                      {feature}
                    </Text>
                  </li>
                ))}
              </ul>
            </Card>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
};

export default Services;
