'use client';

import { useState, useEffect } from 'react';
import { Text, Badge, Card } from './theam';

type AboutData = {
  title: string;
  slogan: string;
  heading: string;
  description: string[];
  image: string;
  badges: Array<{ text: string; variant: string }>;
};

type Skill = {
  name: string;
  level: number;
};

const About = () => {
  const [aboutData, setAboutData] = useState<AboutData | null>(null);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [aboutRes, skillsRes] = await Promise.all([
          fetch("/api/content/about", { cache: "no-store" }),
          fetch("/api/content/skills", { cache: "no-store" })
        ]);

        const aboutData = await aboutRes.json();
        const skillsData = await skillsRes.json();

        if (aboutData.success && aboutData.about) {
          setAboutData(aboutData.about);
        }
        if (skillsData.success && skillsData.skills) {
          setSkills(skillsData.skills);
        }
      } catch (err) {
        console.error("Failed to fetch about/skills data:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <section id="about" className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="animate-pulse space-y-8">

            {/* Title */}
            <div className="h-8 w-56 bg-gray-200 rounded-full mx-auto" />
            <div className="h-4 w-40 bg-gray-200 rounded-full mx-auto" />

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mt-10 items-start">

              {/* Left Image / Banner */}
              <div className="h-[500px] bg-gray-200 rounded-2xl w-full" />

              {/* Right Content */}
              <div className="space-y-5">

                <div className="h-6 bg-gray-200 rounded-full w-3/4" />
                <div className="h-4 bg-gray-200 rounded-full w-full" />
                <div className="h-4 bg-gray-200 rounded-full w-5/6" />

                <div className="space-y-3 pt-3">
                  <div className="h-4 bg-gray-200 rounded-full w-4/5" />
                  <div className="h-4 bg-gray-200 rounded-full w-4/5" />
                  <div className="h-4 bg-gray-200 rounded-full w-4/5" />
                </div>

                <div className="space-y-3 pt-3">
                  <div className="h-4 bg-gray-200 rounded-full w-5/6" />
                  <div className="h-4 bg-gray-200 rounded-full w-5/6" />
                </div>

                <div className="space-y-3 pt-3">
                  <div className="h-4 bg-gray-200 rounded-full w-4/6" />
                  <div className="h-4 bg-gray-200 rounded-full w-4/6" />
                </div>

                <div className="flex items-center gap-4 pt-4">
                  <div className="h-10 w-32 bg-gray-200 rounded-full" />
                  <div className="h-10 w-32 bg-gray-200 rounded-full" />
                </div>

              </div>


            </div>

          </div>
        </div>
        {/* technical skills  */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="animate-pulse space-y-8">

            {/* Title */}
            <div className="h-8 w-56 bg-gray-200 rounded-full mx-auto" />
            <div className="h-4 w-40 bg-gray-200 rounded-full mx-auto" />

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mt-10 items-start">
              <div className="h-[100px] bg-gray-200 rounded-2xl w-full" />
              <div className="h-[100px] bg-gray-200 rounded-2xl w-full" />
              <div className="h-[100px] bg-gray-200 rounded-2xl w-full" />
              <div className="h-[100px] bg-gray-200 rounded-2xl w-full" />
              <div className="h-[100px] bg-gray-200 rounded-2xl w-full" />
              <div className="h-[100px] bg-gray-200 rounded-2xl w-full" />
            </div>

          </div>
        </div>
      </section >
    );
  }

  if (!aboutData && skills.length === 0) {
    return null;
  }

  return (
    <section id="about" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div id="about-header" className="text-center mb-20">
          <Text
            variant="h1"
            size="4xl"
            weight="extrabold"
            fontFamily="rajdhani"
            color="black"
            align="center"
            className="mb-4"
          >
            {aboutData?.title || "About Me"}
          </Text>
          <div className="w-24 h-1.5 bg-gradient-to-r from-teal-300 via-emerald-400 to-green-500 mx-auto rounded-full mb-4"></div>
          {aboutData?.slogan && (
            <Text
              variant="body"
              size="lg"
              fontFamily="poppins"
              color="gray"
              align="center"
              className="max-w-2xl mx-auto"
            >
              {aboutData.slogan}
            </Text>
          )}
        </div>

        {/* Image and Content Side by Side */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-8  items-center mb-24">
          {/* Left Column - Image */}
          <div className="relative group">
            <div className="absolute  rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
            <div className="relative">
              {aboutData?.image ? (
                <img
                  className=" w-full mx-auto max-h-[500px] object-contain object-center rounded-2xl shadow-2xl   transition-transform duration-500"
                  src={aboutData.image}
                  alt="Developer Profile"
                />
              ) : (
                <div className="max-h-[500px] flex items-center justify-center rounded-2xl shadow-2xl bg-gradient-to-br from-gray-50 to-white border-2 border-dashed border-gray-300">
                  <div className="text-center text-gray-400">
                    <svg className="w-24 h-24 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p>Add image in admin</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Content */}
          <div className="space-y-6">
            {aboutData?.heading && (
              <Text
                variant="h3"
                size="3xl"
                fontFamily="rajdhani"
                color="black"
                weight="bold"
                className="mb-6 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent"
              >
                {aboutData.heading}
              </Text>
            )}
            {aboutData?.description && aboutData.description.length > 0 ? (
              aboutData.description.map((paragraph, index) => (
                <Text
                  key={index}
                  variant="body"
                  size="lg"
                  fontFamily="poppins"
                  color="gray"
                  className="mb-6 leading-relaxed"
                >
                  {paragraph}
                </Text>
              ))
            ) : (
              <Text
                variant="body"
                size="lg"
                fontFamily="poppins"
                color="gray"
                className="mb-6 leading-relaxed italic"
              >
                Add your description in the admin dashboard
              </Text>
            )}
            {aboutData?.badges && aboutData.badges.length > 0 && (
              <div className="flex flex-wrap gap-4 mt-8">
                {aboutData.badges.map((badge, index) => (
                  <Badge
                    key={index}
                    variant={badge.variant as 'emerald' | 'outline' | 'cyanblue' | 'lime' | 'sunset' | 'dark' | 'elegant' | 'fuchsia' | 'sky' | 'ocean' | 'rose' | 'amethyst' | 'arctic' | 'skyblue' | 'turquoise' | 'neoncyan' | 'neonorange' | 'electriclime' | 'seafoam' | 'mintice' | 'watermelon' | 'plum' | 'magenta' | 'lavender' | 'violet'}
                    size="lg"
                    className="hover:scale-105 transition-transform cursor-pointer"
                  >
                    {badge.text}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Technical Skills Section - Full Width Below */}
        {skills && skills.length > 0 && (
          <div className="w-full">
            <div className="text-center mb-12 ">
              <Text
                variant="h3"
                size="3xl"
                fontFamily="rajdhani"
                color="black"
                weight="bold"
                className="mb-4 !text-center"
              >
                Technical Skills
              </Text>
              <div className="w-24 h-1.5 bg-gradient-to-r from-teal-300 via-emerald-400 to-green-500 mx-auto rounded-full mb-4"></div>
            </div>
            <div id="technical-skills" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {skills.map((skill, index) => (
                <Card
                  key={index}
                  variant="elevated"
                  hover="lift"
                  shadow="lg"
                  className="group hover:shadow-2xl transition-all duration-300 border border-gray-100"
                >
                  <div className="flex justify-between items-center mb-4">
                    <Text variant="body" fontFamily="poppins" weight="semibold" color="black">
                      {skill.name}
                    </Text>
                    <Text variant="small" fontFamily="poppins" weight="bold" color="black" className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      {skill.level}%
                    </Text>
                  </div>
                  <div className="w-full bg-gradient-to-r from-gray-100 to-gray-200 rounded-full h-3 overflow-hidden">
                    <div
                      className="w-full h-3 bg-gradient-to-r from-teal-300 via-emerald-400 to-green-500 rounded-full mb-4"
                      style={{ width: `${skill.level}%` }}
                    ></div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default About;
