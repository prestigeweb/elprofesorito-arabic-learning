import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect, useCallback, useMemo } from "react";

// Constants
const TESTIMONIAL_COUNT = 10;
const DEFAULT_RATING = 5;

// Custom hook for responsive cards per view
const useResponsiveCardsPerView = () => {
  const [cardsPerView, setCardsPerView] = useState(3);

  useEffect(() => {
    const updateCardsPerView = () => {
      if (window.innerWidth >= 1024) {
        setCardsPerView(4); // Desktop: 4 cards
      } else if (window.innerWidth >= 768) {
        setCardsPerView(3); // Large tablet: 3 cards
      } else if (window.innerWidth >= 640) {
        setCardsPerView(2); // Tablet: 2 cards
      } else {
        setCardsPerView(1); // Mobile: 1 card
      }
    };

    updateCardsPerView();
    window.addEventListener('resize', updateCardsPerView);
    return () => window.removeEventListener('resize', updateCardsPerView);
  }, []);

  return cardsPerView;
};

// Custom hook for carousel logic
const useCarousel = (itemsLength: number, itemsPerView: number) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const maxIndex = Math.max(0, itemsLength - itemsPerView);

  const goToPrevious = useCallback(() => {
    setCurrentIndex(prev => Math.max(0, prev - 1));
  }, []);

  const goToNext = useCallback(() => {
    setCurrentIndex(prev => Math.min(maxIndex, prev + 1));
  }, [maxIndex]);

  const canGoPrevious = currentIndex > 0;
  const canGoNext = currentIndex < maxIndex;

  const resetIndex = useCallback(() => {
    setCurrentIndex(0);
  }, []);

  return {
    currentIndex,
    setCurrentIndex,
    goToPrevious,
    goToNext,
    canGoPrevious,
    canGoNext,
    resetIndex,
    maxIndex
  };
};

const Testimonials = () => {
  const { t, language } = useLanguage();
  const cardsPerView = useResponsiveCardsPerView();

  // Memoized testimonials data to prevent re-creation on every render
  const testimonials = useMemo(() => {
    return Array.from({ length: TESTIMONIAL_COUNT }, (_, i) => ({
      name: t(`testimonials.reviews.${i}.name`) || `User ${i + 1}`,
      role: t(`testimonials.reviews.${i}.role`) || 'Role not available',
      content: t(`testimonials.reviews.${i}.content`) || 'Content not available',
      rating: DEFAULT_RATING,
      image: t(`testimonials.reviews.${i}.image`) || '👤'
    }));
  }, [t, language]);

  const carousel = useCarousel(testimonials.length, cardsPerView);

  // Reset to first slide when language changes
  useEffect(() => {
    carousel.resetIndex();
  }, [language, carousel.resetIndex]);

  // RTL support
  const isRTL = language === 'ar';
  
  // Keyboard navigation for accessibility
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        isRTL ? carousel.goToNext() : carousel.goToPrevious();
      }
      if (e.key === 'ArrowRight') {
        isRTL ? carousel.goToPrevious() : carousel.goToNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [carousel.goToPrevious, carousel.goToNext, isRTL]);

  // Calculate card width and transform based on cards per view with RTL support
  const cardWidth = 100 / cardsPerView;
  const direction = isRTL ? 1 : -1;
  const transformX = carousel.currentIndex * cardWidth;

  return (
    <section className="py-20 bg-gradient-card">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-spanish-red mb-6 font-display">
            {t('testimonials.title')}
          </h2>
          <div className="w-20 h-1 bg-spanish-yellow mx-auto mb-8"></div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {t('testimonials.subtitle')}
          </p>
        </div>

        <div className="max-w-7xl mx-auto relative">
          {/* Carousel Container */}
          <div className="relative overflow-hidden">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{
                transform: `translateX(${direction * transformX}%)`,
                width: `${(testimonials.length / cardsPerView) * 100}%`
              }}
            >
              {testimonials.map((testimonial, index) => (
                <div 
                  key={`${language}-${index}`} 
                  className="flex-shrink-0 px-1"
                  style={{ width: `${cardWidth}%` }}
                >
                  <Card className="h-full shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-xl border-0 bg-white/95 backdrop-blur-sm">
                    <CardContent className="p-6 h-full flex flex-col">
                      <div className="flex items-center justify-between mb-4">
                        <Quote className="h-8 w-8 text-spanish-yellow" />
                        <div className={`flex ${isRTL ? 'space-x-reverse' : ''} space-x-1`}>
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <Star key={i} className="h-4 w-4 fill-spanish-yellow text-spanish-yellow" />
                          ))}
                        </div>
                      </div>
                      
                      <p className="text-muted-foreground mb-6 leading-relaxed flex-1 text-sm sm:text-base">
                        "{testimonial.content}"
                      </p>
                      
                      <div className={`flex items-center ${isRTL ? 'space-x-reverse' : ''} space-x-4 pt-4 border-t border-gray-100`}>
                        <div className="text-2xl">
                          {testimonial.image}
                        </div>
                        <div>
                          <h4 className="font-bold text-spanish-navy text-sm sm:text-base">
                            {testimonial.name}
                          </h4>
                          <p className="text-xs sm:text-sm text-muted-foreground">
                            {testimonial.role}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Arrows - RTL aware */}
          <button
            onClick={isRTL ? carousel.goToNext : carousel.goToPrevious}
            disabled={isRTL ? !carousel.canGoNext : !carousel.canGoPrevious}
            className={`absolute left-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full shadow-lg transition-all duration-300 ${
              (isRTL ? carousel.canGoNext : carousel.canGoPrevious)
                ? 'bg-white hover:bg-gray-50 text-spanish-red hover:text-spanish-navy' 
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
            aria-label={isRTL ? t('testimonials.next') : t('testimonials.previous')}
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          <button
            onClick={isRTL ? carousel.goToPrevious : carousel.goToNext}
            disabled={isRTL ? true : !carousel.canGoNext}
            className={`absolute right-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full shadow-lg transition-all duration-300 ${
              (isRTL ? false : carousel.canGoNext)
                ? 'bg-white hover:bg-gray-50 text-spanish-red hover:text-spanish-navy' 
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
            aria-label={isRTL ? t('testimonials.previous') : t('testimonials.next')}
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          {/* Progress Indicators */}
          <div className="flex justify-center mt-8">
            <div className={`flex ${isRTL ? 'space-x-reverse' : ''} space-x-2`}>
              {Array.from({ length: carousel.maxIndex + 1 }).map((_, index) => (
                <button
                  key={index}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === carousel.currentIndex 
                      ? 'bg-spanish-red scale-110' 
                      : 'bg-spanish-yellow/30 hover:bg-spanish-yellow/50'
                  }`}
                  onClick={() => carousel.setCurrentIndex(index)}
                  aria-label={`${t('testimonials.goToSlide')} ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;