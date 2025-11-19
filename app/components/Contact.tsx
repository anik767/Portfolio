'use client';

import React, { useEffect, useState } from 'react';
import { Text, Card, Button } from './theam';

type ContactCard = {
  title: string;
  value: string;
  description: string;
  icon: string;
  actionType: 'email' | 'phone' | 'link' | 'none';
  actionTarget: string;
};

type ContactData = {
  heading: string;
  subheading: string;
  cards: ContactCard[];
};

const iconMap: Record<string, React.ReactElement> = {
  mail: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
  phone: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
  ),
  location: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  clock: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
};

const Contact = () => {
  const [data, setData] = useState<ContactData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchContact() {
      try {
        const res = await fetch('/api/content/contact', { cache: 'no-store' });
        const json = await res.json();
        if (json.success) {
          const cards = Array.isArray(json.cards)
            ? json.cards.filter(
                (card: ContactCard) =>
                  (card?.title && card.title.trim()) ||
                  (card?.value && card.value.trim()) ||
                  (card?.description && card.description.trim())
              )
            : [];

          setData({
            heading: json.heading ?? 'Get In Touch',
            subheading:
              json.subheading ??
              "Ready to start your next project? I'd love to hear from you.",
            cards,
          });
        }
      } catch (error) {
        console.error('Failed to fetch contact data:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchContact();
  }, []);

  const buildActionLink = (card: ContactCard) => {
    if (card.actionType === 'email') {
      const target = card.actionTarget || card.value;
      return target ? `mailto:${target}` : '';
    }
    if (card.actionType === 'phone') {
      const target = card.actionTarget || card.value;
      return target ? `tel:${target}` : '';
    }
    if (card.actionType === 'link') {
      return card.actionTarget || card.value;
    }
    return '';
  };

  const renderSkeleton = () => (
    <section id="contact" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-20">
          <div className="h-6 w-48 mx-auto mb-4 bg-gray-200 rounded-full animate-pulse" />
          <div className="h-4 w-64 mx-auto bg-gray-200 rounded-full animate-pulse" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[0, 1, 2, 3].map((key) => (
            <div key={key} className="p-6 rounded-2xl border border-gray-100 bg-white/70 animate-pulse space-y-4">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-gray-200" />
              <div className="h-5 w-32 mx-auto bg-gray-200 rounded-full" />
              <div className="h-4 w-full bg-gray-100 rounded-full" />
              <div className="h-4 w-3/4 mx-auto bg-gray-100 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );

  if (loading) {
    return renderSkeleton();
  }

  if (!data || !data.cards || data.cards.length === 0) {
    return null;
  }

  const contactInfo = data.cards;

  return (
    <section id="contact" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div id="contact-header" className="text-center mb-20">
          {data.heading && (
            <Text 
              variant="h2" 
              size="3xl" 
              fontFamily="rajdhani" 
              color="black" 
              weight="extrabold"
              align="center"
              className="md:text-4xl mb-4"
            >
              {data.heading}
            </Text>
          )}
          <div className="w-24 h-1.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 mx-auto mb-6 rounded-full"></div>
          {data.subheading && (
            <Text 
              variant="body" 
              size="lg" 
              fontFamily="poppins" 
              color="gray" 
              align="center"
              className="max-w-3xl mx-auto"
            >
              {data.subheading}
            </Text>
          )}
        </div>

        <div id="contact-content" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {contactInfo.map((info, index) => {
            const actionLink = buildActionLink(info);
            const icon = iconMap[info.icon] || iconMap.mail;
            return (
              <Card
                key={`${info.title}-${index}`}
                variant="elevated"
                hover="lift"
                shadow="xl"
                className="group text-center contact-card hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-blue-200 bg-white/80 backdrop-blur-sm"
                padding="lg"
              >
                <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg">
                  {icon}
                </div>
                {info.title && (
                  <Text 
                    variant="h4" 
                    size="lg" 
                    fontFamily="rajdhani" 
                    color="black" 
                    weight="bold"
                    align="center"
                    className="mb-2"
                  >
                    {info.title}
                  </Text>
                )}
                {info.value && (
                  <Text 
                    variant="body" 
                    fontFamily="poppins" 
                    color="black" 
                    weight="medium"
                    align="center"
                    className="mb-2"
                  >
                    {info.value}
                  </Text>
                )}
                {info.description && (
                  <Text 
                    variant="small" 
                    fontFamily="poppins" 
                    color="gray" 
                    align="center"
                  >
                    {info.description}
                  </Text>
                )}
                {actionLink && (
                  <div className="mt-6">
                    <Button
                      onClick={() => window.open(actionLink, info.actionType === 'link' ? '_blank' : '_self')}
                      variant="emerald"
                      size="sm"
                      className="w-full hover:scale-105 transition-transform duration-300"
                    >
                      {info.actionType === 'email'
                        ? 'Send Email'
                        : info.actionType === 'phone'
                        ? 'Call Now'
                        : 'Open Link'}
                      <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </Button>
                  </div>
                )}
              </Card>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default Contact;