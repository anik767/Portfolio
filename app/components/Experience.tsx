'use client';

import { useEffect, useState } from 'react';
import { Text, Card, Badge } from './theam';

type ExperienceItem = {
  company: string;
  position: string;
  duration: string;
  location: string;
  logo: string;
  description: string;
  technologies: string[];
  achievements: string[];
};

type ExperienceData = {
  heading: string;
  subheading: string;
  items: ExperienceItem[];
};

const Experience = () => {
  const [data, setData] = useState<ExperienceData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchExperience() {
      try {
        const res = await fetch('/api/content/experience', { cache: 'no-store' });
        const json = await res.json();
        if (json.success) {
          setData({
            heading: json.heading ?? 'Work Experience',
            subheading: json.subheading ?? '',
            items: Array.isArray(json.items) ? json.items : [],
          });
        }
      } catch (error) {
        console.error('Failed to fetch experience data:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchExperience();
  }, []);

  const renderSkeleton = () => (
    <section id="experience" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-20">
          <div className="h-6 w-44 mx-auto mb-4 bg-gray-200 rounded-full animate-pulse" />
          <div className="h-4 w-64 mx-auto bg-gray-200 rounded-full animate-pulse" />
        </div>
        <div className="space-y-8">
          {[0, 1].map((key) => (
            <div key={key} className="p-6 rounded-2xl border border-gray-100 bg-white/70 animate-pulse space-y-4">
              <div className="h-5 w-48 bg-gray-200 rounded-full" />
              <div className="h-4 w-32 bg-gray-200 rounded-full" />
              <div className="h-4 w-full bg-gray-100 rounded-full" />
              <div className="h-4 w-3/4 bg-gray-100 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );

  if (loading) {
    return renderSkeleton();
  }

  if (!data || !data.items || data.items.length === 0) {
    return null;
  }

  const experiences = data.items;

  return (
    <section id="experience" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div id="experience-header" className="text-center mb-20">
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

        <div id="experience-content" className="relative space-y-12">
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 via-purple-500 to-pink-500 hidden md:block"></div>
          
          {experiences.map((exp, index) => (
            <div className="relative" key={`${exp.company}-${index}`}>
              <div className="absolute left-[21px] top-8 w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full border-4 border-white shadow-lg z-10 hidden md:block"></div>
              
              <Card
                variant="elevated"
                hover="lift"
                shadow="xl"
                className="group experience-item ml-0 md:ml-20 hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-purple-200 bg-white"
                padding="lg"
              >
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-1">
                    <div className="flex items-center mb-4">
                      {exp.logo ? (
                        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mr-4 shadow-lg border border-gray-200 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 p-2">
                          <img 
                            src={exp.logo} 
                            alt={`${exp.company} logo`}
                            className="w-full h-full object-contain"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                              const parent = e.currentTarget.parentElement;
                              if (parent) {
                                parent.className = "w-16 h-16 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-white font-bold text-2xl mr-4 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300";
                                parent.innerHTML = exp.company?.charAt(0) ?? '?';
                              }
                            }}
                          />
                        </div>
                      ) : (
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-white font-bold text-2xl mr-4 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                          {exp.company?.charAt(0) ?? '?'}
                        </div>
                      )}
                      <div>
                        {exp.company && (
                          <Text 
                            variant="h3" 
                            size="xl" 
                            fontFamily="rajdhani" 
                            color="black" 
                            weight="bold"
                            className="mb-1"
                          >
                            {exp.company}
                          </Text>
                        )}
                        {exp.location && (
                          <Text 
                            variant="body" 
                            fontFamily="poppins" 
                            color="gray" 
                            size="sm"
                          >
                            {exp.location}
                          </Text>
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      {exp.duration && (
                        <Badge variant="emerald" size="md" className="hover:scale-105 transition-transform">
                          {exp.duration}
                        </Badge>
                      )}
                      {exp.position && (
                        <Text 
                          variant="body" 
                          fontFamily="poppins" 
                          color="black" 
                          weight="bold"
                          className="text-lg bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent"
                        >
                          {exp.position}
                        </Text>
                      )}
                    </div>
                  </div>

                  <div className="lg:col-span-2">
                    {exp.description && (
                      <Text 
                        variant="body" 
                        fontFamily="poppins" 
                        color="gray" 
                        className="mb-4 leading-relaxed"
                      >
                        {exp.description}
                      </Text>
                    )}

                    {exp.technologies && exp.technologies.length > 0 && (
                      <div className="mb-4">
                        <Text 
                          variant="small" 
                          fontFamily="poppins" 
                          color="black" 
                          weight="semibold"
                          className="mb-2"
                        >
                          Technologies Used:
                        </Text>
                        <div className="flex flex-wrap gap-2">
                          {exp.technologies.map((tech, techIndex) => (
                            <Badge key={`${tech}-${techIndex}`} variant="elegant" size="sm" className="hover:scale-105 transition-transform cursor-pointer">
                              {tech}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {exp.achievements && exp.achievements.length > 0 && (
                      <div>
                        <Text 
                          variant="small" 
                          fontFamily="poppins" 
                          color="black" 
                          weight="semibold"
                          className="mb-2"
                        >
                          Key Achievements:
                        </Text>
                        <ul className="space-y-1">
                          {exp.achievements.map((achievement, achIndex) => (
                            <li key={`${achievement}-${achIndex}`} className="flex items-start">
                              <svg className="w-4 h-4 text-green-500 mr-2 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                              <Text variant="small" fontFamily="poppins" color="gray">
                                {achievement}
                              </Text>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;