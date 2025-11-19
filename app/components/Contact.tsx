'use client';

import { Text, Card, Button } from './theam';

const Contact = () => {
  const contactInfo = [
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      title: 'Email',
      value: 'azmainanik@gmail.com',
      description: 'Send me an email anytime',
      action: 'mailto:azmainanik@gmail.com'
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      ),
      title: 'Phone',
      value: '+8801795382975',
      description: 'Call me for urgent matters',
      action: 'tel:+8801795382975'
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      title: 'Location',
      value: 'Dhaka, Bangladesh',
      description: 'Available for remote work',
      action: null
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: 'Response Time',
      value: 'Within 24 hours',
      description: 'I typically respond quickly',
      action: null
    }
  ];

  const socialLinks = [
    { platform: 'github', href: 'https://github.com/johndoe' },
    { platform: 'linkedin', href: 'https://linkedin.com/in/johndoe' },
    { platform: 'twitter', href: 'https://twitter.com/johndoe' },
    { platform: 'instagram', href: 'https://instagram.com/johndoe' }
  ];

  return (
    <section id="contact" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div id="contact-header" className="text-center mb-20">
          <Text 
            variant="h2" 
            size="3xl" 
            fontFamily="rajdhani" 
            color="black" 
            weight="extrabold"
            align="center"
            className="md:text-4xl mb-4"
          >
            Get In Touch
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
            Ready to start your next project? I'd love to hear from you. 
            Let's discuss how we can work together to bring your ideas to life.
          </Text>
        </div>

        <div id="contact-content" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {contactInfo.map((info, index) => (
            <Card
              key={index}
              variant="elevated"
              hover="lift"
              shadow="xl"
              className="group text-center contact-card hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-blue-200 bg-white/80 backdrop-blur-sm"
              padding="lg"
            >
              <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg">
                {info.icon}
              </div>
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
              <Text 
                variant="small" 
                fontFamily="poppins" 
                color="gray" 
                align="center"
              >
                {info.description}
              </Text>
              {info.action && (
                <div className="mt-6">
                  <Button
                    onClick={() => window.open(info.action, '_self')}
                    variant="emerald"
                    size="sm"
                    className="w-full hover:scale-105 transition-transform duration-300"
                  >
                    {info.title === 'Email' ? 'Send Email' : 'Call Now'}
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </Button>
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Contact;