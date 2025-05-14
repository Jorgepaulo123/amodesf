import React, { useState, useEffect } from 'react';

interface ImageCarouselProps {
  images: string[];
  alt: string;
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({ images, alt }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-rotate images every 5 seconds if there are multiple
  useEffect(() => {
    if (images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [images.length]);

  // Navigate to next image
  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  // Navigate to previous image
  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  // Go to specific image
  const goToImage = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex(index);
  };

  // If no images or only one image, render simple image
  if (images.length === 0) {
    return (
      <div className="rounded-lg shadow-lg w-full h-[300px] bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400">Sem imagem</p>
      </div>
    );
  }

  if (images.length === 1) {
    return (
      <img
        src={images[0]}
        alt={alt}
        className="rounded-lg shadow-lg w-full h-[300px] object-cover"
      />
    );
  }

  return (
    <div className="relative overflow-hidden rounded-lg shadow-lg">
      {/* Images */}
      <div className="relative h-[300px]">
        {images.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`${alt} - Imagem ${index + 1}`}
            className={`w-full h-full object-cover absolute top-0 left-0 transition-opacity duration-500 ${
              index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          />
        ))}
      </div>

      {/* Navigation arrows */}
      <button
        onClick={prevImage}
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full z-20"
        aria-label="Foto anterior"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
      </button>
      <button
        onClick={nextImage}
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full z-20"
        aria-label="Próxima foto"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
      </button>

      {/* Navigation dots */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-20">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={(e) => goToImage(index, e)}
            className={`w-2 h-2 rounded-full ${
              index === currentIndex ? 'bg-white' : 'bg-white/50'
            }`}
            aria-label={`Ver imagem ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageCarousel; 