'use client';

import { useEffect, useState } from 'react';
import { Text, Card, Badge } from './theam';

type EducationItem = {
  institution: string;
  degree: string;
  duration: string;
  location: string;
  logo: string;
  gpa?: string;
  description: string;
  courses: string[];
  achievements: string[];
};

type CertificationItem = {
  name: string;
  issuer: string;
  date: string;
  credentialId: string;
  logo: string;
  description: string;
  skills: string[];
};

type EducationData = {
  heading: string;
  subheading: string;
  educationHeading: string;
  certificationsHeading: string;
  education: EducationItem[];
  certifications: CertificationItem[];
};

const Education = () => {
  const [data, setData] = useState<EducationData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEducation() {
      try {
        const res = await fetch('/api/content/education', { cache: 'no-store' });
        const json = await res.json();
        if (json.success) {
          setData({
            heading: json.heading ?? 'Education & Certifications',
            subheading:
              json.subheading ??
              'My educational background and professional certifications that validate my expertise.',
            educationHeading: json.educationHeading ?? 'Education',
            certificationsHeading: json.certificationsHeading ?? 'Professional Certifications',
            education: Array.isArray(json.education) ? json.education : [],
            certifications: Array.isArray(json.certifications) ? json.certifications : [],
          });
        }
      } catch (error) {
        console.error('Failed to fetch education data:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchEducation();
  }, []);

  const renderSkeleton = () => (
    <section id="education" className="pb-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-20">
          <div className="h-6 w-52 mx-auto mb-4 bg-gray-200 rounded-full animate-pulse" />
          <div className="h-4 w-64 mx-auto bg-gray-200 rounded-full animate-pulse" />
        </div>
        <div className="space-y-6">
          {[0, 1].map((key) => (
            <div key={key} className="p-6 rounded-2xl border border-gray-100 bg-white/70 animate-pulse space-y-4">
              <div className="h-5 w-48 bg-gray-200 rounded-full" />
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

  if (
    !data ||
    ((!data.education || data.education.length === 0) &&
      (!data.certifications || data.certifications.length === 0))
  ) {
    return null;
  }

  const education = data.education ?? [];
  const certifications = data.certifications ?? [];

  return (
    <section id="education" className="pb-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div id="education-header" className="text-center mb-20">
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
          <div className="w-24 h-1.5 bg-gradient-to-r from-teal-300 via-emerald-400 to-green-500 mx-auto rounded-full mb-4"></div>
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

        {education.length > 0 && (
        <div id="education-content" className="mb-20">
          <div className="text-center mb-12">
            {data.educationHeading && (
              <Text 
                variant="h3" 
                size="2xl" 
                fontFamily="rajdhani" 
                color="black" 
                weight="bold"
                align="center"
                className="mb-4"
              >
                {data.educationHeading}
              </Text>
            )}
            <div className="w-24 h-1.5 bg-gradient-to-r from-teal-300 via-emerald-400 to-green-500 mx-auto rounded-full mb-4"></div>
          </div>
          <div className="space-y-8">
            {education.map((edu, index) => (
              <Card
                key={index}
                variant="elevated"
                hover="lift"
                shadow="xl"
                className="group education-item hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-indigo-200 bg-white/80 backdrop-blur-sm"
                padding="lg"
              >
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left Column - Institution Info */}
                  <div className="lg:col-span-1">
                    <div className="flex items-center mb-4">
                      {edu.logo ? (
                        <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mr-4 shadow-lg border border-gray-200 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 p-2">
                          <img 
                            src={edu.logo} 
                            alt={`${edu.institution} logo`}
                            className="w-full h-full object-contain"
                            onError={(e) => {
                              // Fallback to letters if image fails to load
                              e.currentTarget.style.display = 'none';
                              const parent = e.currentTarget.parentElement;
                              if (parent) {
                                parent.className = "w-20 h-20 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-white font-bold text-2xl mr-4 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300";
                                parent.innerHTML = edu.institution.split(' ').map(word => word.charAt(0)).join('');
                              }
                            }}
                          />
                        </div>
                      ) : (
                        <div className="w-20 h-20 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-white font-bold text-2xl mr-4 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                          {edu.institution.split(' ').map(word => word.charAt(0)).join('')}
                        </div>
                      )}
                      <div>
                        <Text 
                          variant="h3" 
                          size="lg" 
                          fontFamily="rajdhani" 
                          color="black" 
                          weight="bold"
                          className="mb-1"
                        >
                          {edu.institution}
                        </Text>
                        <Text 
                          variant="body" 
                          fontFamily="poppins" 
                          color="gray" 
                          size="sm"
                        >
                          {edu.location}
                        </Text>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {edu.duration && (
                        <Badge variant="emerald" size="md" className="hover:scale-105 transition-transform">
                          {edu.duration}
                        </Badge>
                      )}
                      {edu.gpa && (
                        <Badge variant="elegant" size="md" className="hover:scale-105 transition-transform">
                          GPA: {edu.gpa}
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Right Column - Details */}
                  <div className="lg:col-span-2">
                    <Text 
                      variant="h4" 
                      size="xl" 
                      fontFamily="rajdhani" 
                      color="black" 
                      weight="bold"
                      className="mb-3"
                    >
                      {edu.degree}
                    </Text>
                    
                    <Text 
                      variant="body" 
                      fontFamily="poppins" 
                      color="gray" 
                      className="mb-4 leading-relaxed"
                    >
                      {edu.description}
                    </Text>

                    {/* Courses */}
                    {edu.courses && edu.courses.length > 0 && (
                      <div className="mb-4">
                        <Text 
                          variant="small" 
                          fontFamily="poppins" 
                          color="black" 
                          weight="semibold"
                          className="mb-2"
                        >
                          Key Courses:
                        </Text>
                        <div className="flex flex-wrap gap-2">
                          {edu.courses.map((course, courseIndex) => (
                            <Badge key={courseIndex} variant="elegant" size="sm" className="hover:scale-105 transition-transform cursor-pointer">
                              {course}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Achievements */}
                    {edu.achievements && edu.achievements.length > 0 && (
                      <div>
                        <Text 
                          variant="small" 
                          fontFamily="poppins" 
                          color="black" 
                          weight="semibold"
                          className="mb-2"
                        >
                          Achievements:
                        </Text>
                        <ul className="space-y-1">
                          {edu.achievements.map((achievement, achIndex) => (
                            <li key={achIndex} className="flex items-start">
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
            ))}
          </div>
        </div>
        )}

        {certifications.length > 0 && (
        <div>
          <div className="text-center mb-12">
            {data.certificationsHeading && (
              <Text 
                variant="h3" 
                size="2xl" 
                fontFamily="rajdhani" 
                color="black" 
                weight="bold"
                align="center"
                className="mb-4"
              >
                {data.certificationsHeading}
              </Text>
            )}
            <div className="w-24 h-1.5 bg-gradient-to-r from-teal-300 via-emerald-400 to-green-500 mx-auto rounded-full mb-4"></div>
          </div>
          <div id="certifications-content" className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {certifications.map((cert, index) => (
              <Card
                key={index}
                variant="elevated"
                hover="lift"
                shadow="xl"
                className="group certification-card hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-green-200 bg-white/80 backdrop-blur-sm"
                padding="lg"
              >
                <div className="flex items-start mb-4">
                  {cert.logo ? (
                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mr-4 shrink-0 shadow-lg border border-gray-200 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 p-2">
                      <img 
                        src={cert.logo} 
                        alt={`${cert.issuer} logo`}
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          // Fallback to letters if image fails to load
                          e.currentTarget.style.display = 'none';
                          const parent = e.currentTarget.parentElement;
                          if (parent) {
                            parent.className = "w-16 h-16 bg-gradient-to-br from-green-500 via-emerald-500 to-blue-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl mr-4 shrink-0 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300";
                            parent.innerHTML = cert.issuer.split(' ').map(word => word.charAt(0)).join('');
                          }
                        }}
                      />
                    </div>
                  ) : (
                    <div className="w-16 h-16 bg-gradient-to-br from-green-500 via-emerald-500 to-blue-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl mr-4 shrink-0 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                      {cert.issuer.split(' ').map(word => word.charAt(0)).join('')}
                    </div>
                  )}
                  <div className="flex-1">
                    {cert.name && (
                      <Text 
                        variant="h4" 
                        size="lg" 
                        fontFamily="rajdhani" 
                        color="black" 
                        weight="bold"
                        className="mb-1"
                      >
                        {cert.name}
                      </Text>
                    )}
                    {cert.issuer && (
                      <Text 
                        variant="body" 
                        fontFamily="poppins" 
                        color="gray" 
                        size="sm"
                        className="mb-2"
                      >
                        {cert.issuer}
                      </Text>
                    )}
                    <div className="flex items-center space-x-2">
                      {cert.date && (
                        <Badge variant="elegant" size="sm" className="hover:scale-105 transition-transform">
                          {cert.date}
                        </Badge>
                      )}
                      {cert.credentialId && (
                        <Text variant="small" fontFamily="poppins" color="gray" className="truncate">
                          ID: {cert.credentialId}
                        </Text>
                      )}
                    </div>
                  </div>
                </div>

                {cert.description && (
                  <Text 
                    variant="body" 
                    fontFamily="poppins" 
                    color="gray" 
                    className="mb-4 leading-relaxed"
                  >
                    {cert.description}
                  </Text>
                )}

                {cert.skills && cert.skills.length > 0 && (
                  <div>
                    <Text 
                      variant="small" 
                      fontFamily="poppins" 
                      color="black" 
                      weight="semibold"
                      className="mb-2"
                    >
                      Skills Validated:
                    </Text>
                    <div className="flex flex-wrap gap-2">
                      {cert.skills.map((skill, skillIndex) => (
                        <Badge key={skillIndex} variant="emerald" size="sm" className="hover:scale-105 transition-transform cursor-pointer">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
        )}
      </div>
    </section>
  );
};

export default Education;