'use client';

import { useState, useEffect, useRef } from 'react';

interface Slide {
  id: number;
  headline: string;
  subtext: string;
  image: string;
  gradient: string;
}

const slides: Slide[] = [
  {
    id: 1,
    headline: 'Replace your marketing team with AI',
    subtext: 'Generate ads, SEO, and content instantly',
    image: '/images/hero-marketing.svg',
    gradient: 'from-blue-600 via-purple-600 to-pink-600',
  },
  {
    id: 2,
    headline: 'Build faster with AI developer tools',
    subtext: 'Automate code, APIs, and workflows',
    image: '/images/hero-developer.svg',
    gradient: 'from-purple-600 via-indigo-600 to-blue-600',
  },
  {
    id: 3,
    headline: 'Create high-converting product images',
    subtext: 'Remove backgrounds, upscale, and optimize',
    image: '/images/hero-images.svg',
    gradient: 'from-pink-600 via-rose-600 to-orange-600',
  },
  {
    id: 4,
    headline: 'Grow your SEO traffic effortlessly',
    subtext: 'Analyze, optimize, and rank faster',
    image: '/images/hero-seo.svg',
    gradient: 'from-orange-600 via-amber-600 to-yellow-600',
  },
];

export default function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [isAnimating, setIsAnimating] = useState(true);

  const slide = slides[currentSlide];

  useEffect(() => {
    if (isHovered || !isAnimating) return;

    intervalRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isHovered, isAnimating]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const handlePrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  return (
    <section
      className="relative w-full min-h-screen overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Animated Background */}
      <div className="absolute inset-0 z-0">
        <div
          className={`absolute inset-0 bg-gradient-to-br ${slide.gradient} transition-all duration-1000 ease-out`}
        />
        <div className="absolute inset-0 backdrop-blur-3xl opacity-40" />
        
        {/* Glow effects */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl opacity-20 -mr-48 -mt-48 animate-pulse" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl opacity-20 -ml-48 -mb-48 animate-pulse" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 h-screen flex items-center justify-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: Text Content */}
            <div className="flex flex-col justify-center space-y-8 animation-fade-in">
              {/* Headline */}
              <div className="space-y-4">
                <h1
                  key={`headline-${currentSlide}`}
                  className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight
                    animate-in fade-in slide-in-from-left-12 duration-1000 ease-out"
                >
                  {slide.headline}
                </h1>
              </div>

              {/* Subtext */}
              <p
                key={`subtext-${currentSlide}`}
                className="text-lg md:text-xl text-white/80 max-w-xl font-light
                  animate-in fade-in slide-in-from-left-12 duration-1000 ease-out delay-200"
              >
                {slide.subtext}
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4 animate-in fade-in slide-in-from-left-12 duration-1000 ease-out delay-300">
                <button
                  className="px-8 py-4 rounded-lg font-semibold text-lg
                    bg-white text-gray-900 hover:bg-white/90
                    transition-all duration-300 ease-out
                    hover:shadow-2xl hover:shadow-white/25"
                >
                  Get Started Free
                </button>
                <button
                  className="px-8 py-4 rounded-lg font-semibold text-lg
                    border-2 border-white text-white hover:bg-white/10
                    transition-all duration-300 ease-out
                    hover:shadow-2xl hover:shadow-white/10"
                >
                  Watch Demo
                </button>
              </div>
            </div>

            {/* Right: Image / Mockup */}
            <div className="relative h-96 lg:h-full min-h-96 flex items-center justify-center overflow-hidden">
              {/* Slide Images with Fade Animation */}
              {slides.map((s, index) => (
                <div
                  key={s.id}
                  className={`absolute inset-0 transition-opacity duration-1000 ease-out
                    ${index === currentSlide ? 'opacity-100' : 'opacity-0'}
                    `}
                >
                  {/* Placeholder with gradient */}
                  <div
                    className="w-full h-full rounded-2xl border border-white/20 backdrop-blur-sm
                      bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center
                      overflow-hidden relative group"
                  >
                    {/* Image Loading */}
                    <img
                      src={s.image}
                      alt={s.headline}
                      className="w-full h-full object-cover opacity-80 group-hover:opacity-100
                        transition-opacity duration-500"
                      loading="lazy"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.opacity = '0';
                      }}
                    />
                    {/* Fallback Icon */}
                    <div className="absolute inset-0 flex items-center justify-center bg-white/5">
                      <svg
                        className="w-32 h-32 text-white/20"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={0.5}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>

                    {/* Glow Border */}
                    <div className="absolute inset-0 rounded-2xl pointer-events-none
                      group-hover:shadow-2xl group-hover:shadow-white/20 transition-shadow duration-300" />
                  </div>
                </div>
              ))}

              {/* Floating Elements */}
              <div
                className="absolute top-8 right-8 w-32 h-32 rounded-full bg-white/10 backdrop-blur-md
                  border border-white/20 flex items-center justify-center
                  animate-pulse shadow-2xl shadow-white/10"
              >
                <span className="text-white/60 text-sm font-semibold">AI Powered</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Dots */}
      <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 z-50 flex gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-3 rounded-full transition-all duration-300 ease-out
              ${
                index === currentSlide
                  ? 'w-8 bg-white'
                  : 'w-3 bg-white/40 hover:bg-white/60'
              }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Slide Counter */}
      <div className="absolute bottom-12 right-8 z-50 text-white/60 text-sm font-medium">
        {String(currentSlide + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
      </div>

      {/* Styles */}
      <style jsx>{`
        @keyframes slideInFromLeft {
          from {
            opacity: 0;
            transform: translateX(-2rem);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .animation-fade-in {
          animation: fadeIn 0.8s ease-out;
        }
      `}</style>
    </section>
  );
}
