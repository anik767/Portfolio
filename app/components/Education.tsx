'use client';

import { Text, Card, Badge } from './theam';

const Education = () => {
  const education = [
    {
      institution: 'Daffodil International University',
      degree: 'Bachelor of Science in Computer Science and Engineering',
      duration: '2019 - 2023',
      location: 'Dhaka, Bangladesh',
      logo: '/images/EducationLogo/DaffodilsLogo.jpg',
      gpa: '3.8/4.0',
      description: 'Focused on software engineering, algorithms, and data structures. Completed capstone project on web application development.',
      courses: ['Data Structures', 'Algorithms', 'Database Systems', 'Software Engineering', 'Web Development', 'Machine Learning'],
      achievements: [
        'Dean\'s List for 6 consecutive semesters',
        'President of Computer Science Club',
        'Won 1st place in University Hackathon 2018'
      ]
    },
    {
      institution: 'SOS Hermann Gmeiner College',
      degree: 'Higher Secondary Certificate (HSC)',
      duration: '2017 - 2019',
      location: 'Dhaka, Bangladesh',
      logo: '/images/EducationLogo/Sos.jpg',
      gpa: '5.0/5.0',
      description: 'Completed Higher Secondary Certificate with focus on Science group, building strong foundation in Mathematics, Physics, Chemistry, and Computer Science.',
      courses: ['Physics', 'Chemistry', 'Mathematics', 'Biology', 'English', 'ICT'],
      achievements: [
        'Achieved GPA 5.0 in HSC examination',
        'Science group topper',
        'Active member of Science Club'
      ]
    },
    {
      institution: 'Bogura YMCA Public School & College',
      degree: 'Secondary School Certificate (SSC)',
      duration: '2015 - 2017',
      location: 'Dhaka, Bangladesh',
      logo: '/images/EducationLogo/BYMCA.png',
      gpa: '5.0/5.0',
      description: 'Completed Secondary School Certificate with excellent academic performance and strong foundation in core subjects.',
      courses: ['Mathematics', 'Science', 'English', 'Bangla', 'Social Science', 'Religion'],
      achievements: [
        'Achieved GPA 5.0 in SSC examination',
        'Class representative',
        'Participated in inter-school competitions'
      ]
    }
  ];

  const certifications = [
    {
      name: 'AWS Certified Solutions Architect',
      issuer: 'Amazon Web Services',
      date: '2023',
      credentialId: 'AWS-SAA-123456',
      logo: null,
      description: 'Validates expertise in designing distributed systems on AWS platform.',
      skills: ['Cloud Architecture', 'AWS Services', 'Security', 'Scalability']
    },
    {
      name: 'Google Cloud Professional Developer',
      issuer: 'Google Cloud',
      date: '2022',
      credentialId: 'GCP-PD-789012',
      logo: null,
      description: 'Demonstrates ability to build and deploy applications on Google Cloud Platform.',
      skills: ['GCP Services', 'Kubernetes', 'Docker', 'CI/CD']
    },
    {
      name: 'Certified Kubernetes Administrator (CKA)',
      issuer: 'Cloud Native Computing Foundation',
      date: '2022',
      credentialId: 'CKA-345678',
      logo: null,
      description: 'Validates skills in Kubernetes cluster administration and troubleshooting.',
      skills: ['Kubernetes', 'Container Orchestration', 'Cluster Management', 'Troubleshooting']
    },
    {
      name: 'Microsoft Azure Fundamentals',
      issuer: 'Microsoft',
      date: '2021',
      credentialId: 'AZ-900-901234',
      logo: null,
      description: 'Foundational knowledge of cloud concepts and Azure services.',
      skills: ['Azure Services', 'Cloud Concepts', 'Security', 'Compliance']
    }
  ];

  return (
    <section id="education" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div id="education-header" className="text-center mb-20">
          <Text 
            variant="h2" 
            size="3xl" 
            fontFamily="rajdhani" 
            color="black" 
            weight="extrabold"
            align="center"
            className="md:text-4xl mb-4"
          >
            Education & Certifications
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
            My educational background and professional certifications that validate my expertise.
          </Text>
        </div>

        {/* Education Section */}
        <div id="education-content" className="mb-20">
          <div className="text-center mb-12">
            <Text 
              variant="h3" 
              size="2xl" 
              fontFamily="rajdhani" 
              color="black" 
              weight="bold"
              align="center"
              className="mb-4"
            >
              Education
            </Text>
            <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
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
                      <Badge variant="emerald" size="md" className="hover:scale-105 transition-transform">
                        {edu.duration}
                      </Badge>
                      <Badge variant="elegant" size="md" className="hover:scale-105 transition-transform">
                        GPA: {edu.gpa}
                      </Badge>
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

                    {/* Achievements */}
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
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Certifications Section */}
        <div>
          <div className="text-center mb-12">
            <Text 
              variant="h3" 
              size="2xl" 
              fontFamily="rajdhani" 
              color="black" 
              weight="bold"
              align="center"
              className="mb-4"
            >
              Professional Certifications
            </Text>
            <div className="w-20 h-1 bg-gradient-to-r from-green-500 to-blue-500 mx-auto rounded-full"></div>
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
                    <Text 
                      variant="body" 
                      fontFamily="poppins" 
                      color="gray" 
                      size="sm"
                      className="mb-2"
                    >
                      {cert.issuer}
                    </Text>
                    <div className="flex items-center space-x-2">
                      <Badge variant="elegant" size="sm" className="hover:scale-105 transition-transform">
                        {cert.date}
                      </Badge>
                      <Text variant="small" fontFamily="poppins" color="gray" className="truncate">
                        ID: {cert.credentialId}
                      </Text>
                    </div>
                  </div>
                </div>

                <Text 
                  variant="body" 
                  fontFamily="poppins" 
                  color="gray" 
                  className="mb-4 leading-relaxed"
                >
                  {cert.description}
                </Text>

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
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Education;