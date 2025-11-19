'use client';

import { Text, Card, Badge , Button } from './theam';

const Experience = () => {
  const experiences = [
    {
      company: 'Simec System Limited',
      position: 'Junior Full Stack Developer',
      duration: 'june 2022 – Present',
      location: 'House: 33, Road: 15 Sector: 12, Dhaka 1230',
      logo: '/images/ExperienceLogo/System-logo.png',
      description: 'Contributing to the design, development, and optimization of full-stack web applications, collaborating closely with cross-functional teams to deliver high-quality, scalable solutions.',
      technologies: [
        'Next.js',
        'React',
        'TypeScript',
        'Tailwind CSS',
        'Bootstrap',
        'Material UI',
        'Redux',
        'Node.js',
        'Express.js',
        'MySQL',
        'PostgreSQL'
      ],
      achievements: [
        'Optimized multiple React and Node.js applications, improving load times and performance by up to 40%',
        'Led a team of 5 developers to deliver several client-facing projects on schedule',
        'Implemented CI/CD pipelines using GitHub Actions, reducing deployment time by 60% and improving release consistency',
        'Collaborated on API design and database optimization, enhancing scalability and maintainability'
      ]
    }
    
    
    
  ];

  return (
    <section id="experience" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div id="experience-header" className="text-center mb-20">
          <Text 
            variant="h2" 
            size="3xl" 
            fontFamily="rajdhani" 
            color="black" 
            weight="extrabold"
            align="center"
            className="md:text-4xl mb-4"
          >
            Work Experience
          </Text>
          <div className="w-24 h-1.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 mx-auto mb-6 rounded-full"></div>
          <Text 
            variant="body" 
            size="lg" 
            fontFamily="poppins" 
            color="gray" 
            align="center"
            className="max-w-3xl mx-auto"
          >
            My professional journey in web development, from junior developer to senior full stack engineer.
          </Text>
        </div>

        <div id="experience-content" className="relative space-y-12">
          {/* Timeline Line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 via-purple-500 to-pink-500 hidden md:block"></div>
          
          {experiences.map((exp, index) => (
            <div className="relative" key={index}>
              {/* Timeline Dot */}
              <div className="absolute left-[21px] top-8 w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full border-4 border-white shadow-lg z-10 hidden md:block"></div>
              
              <Card
                variant="elevated"
                hover="lift"
                shadow="xl"
                className="group experience-item ml-0 md:ml-20 hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-purple-200 bg-white"
                padding="lg"
              >
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Company Info */}
                <div className="lg:col-span-1">
                  <div className="flex items-center mb-4">
                    {exp.logo ? (
                      <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mr-4 shadow-lg border border-gray-200 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 p-2">
                        <img 
                          src={exp.logo} 
                          alt={`${exp.company} logo`}
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            // Fallback to letter if image fails to load
                            e.currentTarget.style.display = 'none';
                            const parent = e.currentTarget.parentElement;
                            if (parent) {
                              parent.className = "w-16 h-16 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-white font-bold text-2xl mr-4 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300";
                              parent.innerHTML = exp.company.charAt(0);
                            }
                          }}
                        />
                      </div>
                    ) : (
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-white font-bold text-2xl mr-4 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                        {exp.company.charAt(0)}
                      </div>
                    )}
                    <div>
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
                      <Text 
                        variant="body" 
                        fontFamily="poppins" 
                        color="gray" 
                        size="sm"
                      >
                        {exp.location}
                      </Text>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <Badge variant="emerald" size="md" className="hover:scale-105 transition-transform">
                      {exp.duration}
                    </Badge>
                    <Text 
                      variant="body" 
                      fontFamily="poppins" 
                      color="black" 
                      weight="bold"
                      className="text-lg bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent"
                    >
                      {exp.position}
                    </Text>
                  </div>
                </div>

                {/* Right Column - Details */}
                <div className="lg:col-span-2">
                  <Text 
                    variant="body" 
                    fontFamily="poppins" 
                    color="gray" 
                    className="mb-4 leading-relaxed"
                  >
                    {exp.description}
                  </Text>

                  {/* Technologies */}
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
                        <Badge key={techIndex} variant="elegant" size="sm" className="hover:scale-105 transition-transform cursor-pointer">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Achievements */}
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