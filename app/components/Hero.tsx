'use client';

import { useState, useEffect } from 'react';
import TypingAnimation from './TypingAnimation';
import { Button, Badge, SocialLink, Text } from './theam';

type HeroData = {
  greeting: string;
  name: string;
  title: string;
  description: string[];
  bannerBackgroundImage: string;
  personImage: string;
  experience: string;
  socialLinks: {
    facebook: string;
    instagram: string;
    linkedin: string;
    twitter: string;
    github: string;
  };
  resumeUrl: string;
};

const Hero = () => {
  const [heroData, setHeroData] = useState<HeroData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchHeroData() {
      try {
        const res = await fetch("/api/content/hero", { cache: "no-store" });
        const data = await res.json();
        if (data.success && data.hero) {
          setHeroData(data.hero);
        }
      } catch (err) {
        console.error("Failed to fetch hero data:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchHeroData();
  }, []);

  if (loading) {
    return (
      <section id="home" className="min-h-screen flex items-center justify-center bg-[#F4F1EA]">
        <div className="text-center">Loading...</div>
      </section>
    );
  }

  return (
    <section id="home" className="min-h-screen flex items-center relative overflow-hidden bg-[#F4F1EA]">
      {/* Background Image */}
      {heroData?.bannerBackgroundImage && (
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('${heroData.bannerBackgroundImage}')`,
          }}
        />
      )}

      {/* Enhanced Overlays */}
      <div className="absolute inset-0 bg-linear-to-b from-gray-900/90 via-gray-800/80 to-gray-900 z-10"></div>
      <div className="absolute inset-0 bg-linear-to-r from-black/60 via-transparent to-black/40 z-20"></div>

      {/* Animated Background Elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-pink-500/10 rounded-full blur-3xl z-5"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl z-5"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full relative z-30">
        <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-16 items-center">
          {/* Left Section - Text Content */}
          <div id="hero-content" className="text-white space-y-7 relative z-40">
            {/* Small text with enhanced styling */}
            {heroData?.greeting && (
              <div id="hero-greeting" className="inline-block">
                <Badge variant="emerald" size="lg" className="tracking-[0.3em]">
                  {heroData.greeting}
                </Badge>
              </div>
            )}

            {/* Main heading with enhanced effects */}
            <div className="space-y-0.5 ">
              <Text id="hero-i-am" variant="h1" size="4xl" color="primary" fontFamily="rajdhani" className="md:text-5xl lg:text-6xl leading-[1.2] tracking-tight drop-shadow-2xl">
                I AM
              </Text>
              <Text id="hero-name" variant="h1" size="4xl" color="primary" fontFamily="rajdhani" className="md:text-5xl lg:text-6xl leading-[1.2] tracking-tight drop-shadow-2xl">
                {heroData?.name || "Your Name"}
              </Text>
              <Text
                id="hero-title"
                variant="h1"
                size="4xl"
                gradientDirection="to-r"
                fontFamily="rajdhani"
                className="md:text-5xl lg:text-7xl"
                stroke={true}
                strokeWidth=".8px"
                strokeColor="gray"
              >
                {heroData?.title || "Your Title"}
              </Text>
            </div>

            {/* Description with typing animation */}
            {heroData?.description && heroData.description.length > 0 ? (
              <TypingAnimation
                text={heroData.description}
                speed={20}
                backSpeed={10}
                backDelay={1500}
                loop={true}
                textColor="secondary"
                fontFamily="poppins"
                className="text-xl h-[80px] leading-relaxed font-light"
              />
            ) : (
              <div className="text-xl h-[80px] leading-relaxed font-light text-gray-400">
                Add your description in the admin dashboard
              </div>
            )}

            {/* Enhanced CTA Button */}
            <div id="hero-buttons" className="flex flex-col sm:flex-row gap-6">
              <Button
                scrollTo="projects"
                variant="emerald"
                size="lg"
              >
                View My Work
                <svg className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform duration-500 ease-out" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Button>

              <Button
                onClick={() => {
                  const link = document.createElement('a');
                  link.href = '/damo.pdf';
                  link.download = 'CV.pdf';
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}
                variant="outline"
                size="lg"
              >
                Download Resume
                <svg className="w-6 h-6 ml-3 group-hover:animate-bounce transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </Button>
            </div>

            {/* Social Links */}
            <div className="space-y-6">
              <Text variant="caption" color="muted" weight="medium" className="tracking-wide capitalize">
                Find on me:
              </Text>
              {heroData?.socialLinks && (
                <div id="hero-social-links" className="flex space-x-6">
                  {heroData.socialLinks.facebook && <SocialLink href={heroData.socialLinks.facebook} platform="facebook" className="hero-social-item" />}
                  {heroData.socialLinks.instagram && <SocialLink href={heroData.socialLinks.instagram} platform="instagram" className="hero-social-item" />}
                  {heroData.socialLinks.linkedin && <SocialLink href={heroData.socialLinks.linkedin} platform="linkedin" className="hero-social-item" />}
                  {heroData.socialLinks.twitter && <SocialLink href={heroData.socialLinks.twitter} platform="twitter" className="hero-social-item" />}
                  {heroData.socialLinks.github && <SocialLink href={heroData.socialLinks.github} platform="github" className="hero-social-item" />}
                </div>
              )}
            </div>
          </div>
          
          {/* Right Section - Enhanced Image and Overlay */}
          <div className="relative z-40">
            {/* Profile Image Container */}
            <div className="relative group">
              {/* Professional Image with enhanced styling */}
              <div className=" h-[600px] relative flex items-center justify-center rounded-3xl overflow-hidden shadow-2xl border border-white/10 group">
                {heroData?.personImage ? (
                  <img
                    src={heroData.personImage}
                    alt={`${heroData.name || 'Person'} - ${heroData.title || 'Title'}`}
                    className="w-full h-full object-contain object-center"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-800/50 text-gray-400">
                    <div className="text-center">
                      <svg className="w-24 h-24 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p>Add person image in admin</p>
                    </div>
                  </div>
                )}

                {/* Enhanced Gradient Overlays */}
                <div className="absolute inset-0 bg-linear-to-t from-black/20 via-transparent to-transparent"></div>
                <div className="gsap-parallax-bg absolute bottom-0 right-0 w-96 h-96 bg-linear-to-tl from-pink-500/40 to-pink-600/20 rounded-full opacity-70 transform translate-x-24 translate-y-24 blur-3xl"></div>
                <div className="gsap-parallax-bg absolute top-0 left-0 w-64 h-64 bg-linear-to-br from-blue-500/20 to-purple-500/20 rounded-full opacity-50 transform -translate-x-16 -translate-y-16 blur-2xl"></div>
              </div>

              {/* Enhanced Floating Elements */}
              <div className="absolute -top-6 -left-6 w-24 h-24 bg-pink-500/30 rounded-full blur-xl"></div>
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-pink-400/20 rounded-full blur-2xl"></div>
              <div className="absolute top-1/2 -right-8 w-16 h-16 bg-blue-500/20 rounded-full blur-lg transition-all duration-1000 ease-in-out"></div>

              {/* Experience Badge */}
              {heroData?.experience && (
                <div className="absolute -bottom-8 left-[50%] translate-x-[-50%] bg-white/95 backdrop-blur-md rounded-2xl p-6 shadow-2xl border border-pink-200/50">
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 bg-linear-to-r from-pink-500 to-pink-600 rounded-full"></div>
                    <span className="text-gray-900 font-bold text-sm">{heroData.experience}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
    </section>
  );
};

export default Hero;
