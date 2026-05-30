'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './Hero.module.css';

const slides = [
  {
    id: 'rally',
    src: '/images/court3.png',
    alt: 'Players moving across a bright badminton court',
    eyebrow: 'At the court',
    quote: 'The shuttle only listens to preparation.',
    caption: 'Find a frame that keeps up with your rallies, your tempo, and your next level.',
    cta: 'Find your frame',
    href: '#finder',
  },
  {
    id: 'outdoor',
    src: 'https://images.pexels.com/photos/8795115/pexels-photo-8795115.jpeg?auto=compress&cs=tinysrgb&w=1400&h=820&fit=crop',
    alt: 'Friends playing badminton outdoors',
    eyebrow: 'For every player',
    quote: 'Great footwork starts before the first step.',
    caption: 'From relaxed weekend games to competitive training, choose gear that feels natural fast.',
    cta: 'Shop rackets',
    href: '/shop',
  },
  {
    id: 'competition',
    src: '/images/court1.png',
    alt: 'Competition badminton courts in a modern indoor venue',
    eyebrow: 'Ready to play',
    quote: 'Control the pace, then finish the point.',
    caption: 'Balanced, powerful, or lightning quick: match the racket to the way you win.',
    cta: 'Explore styles',
    href: '#play-style',
  },
  {
    id: 'practice',
    src: '/images/court2.png',
    alt: 'A badminton court prepared for practice and match play',
    eyebrow: 'Built for feel',
    quote: 'Small adjustments become match-winning margins.',
    caption: 'Fine tune your setup with the right weight, balance, strings, and tension.',
    cta: 'Start fitting',
    href: '#finder',
  },
];

export default function Hero() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, 6500);

    return () => clearInterval(timer);
  }, []);

  const goToSlide = (index) => {
    setActiveIndex(index);
  };

  const showPrevious = () => {
    setActiveIndex((current) => (current - 1 + slides.length) % slides.length);
  };

  const showNext = () => {
    setActiveIndex((current) => (current + 1) % slides.length);
  };

  return (
    <section className={styles.hero}>
      <div className={styles.banner} aria-label="OfCourt badminton image and quote carousel">
        <div className={styles.slides}>
          {slides.map((slide, index) => (
            <article
              key={slide.id}
              className={`${styles.slide} ${index === activeIndex ? styles.activeSlide : ''}`}
              aria-hidden={index !== activeIndex}
            >
              <Image
                src={slide.src}
                alt={slide.alt}
                fill
                sizes="100vw"
                className={styles.image}
                priority={index === 0}
              />
              <div className={styles.shade} aria-hidden="true" />
              <div className={styles.copy}>
                <p className={styles.eyebrow}>{slide.eyebrow}</p>
                <h1 className={styles.title}>{slide.quote}</h1>
                <p className={styles.caption}>{slide.caption}</p>
                <Link href={slide.href} className={styles.findButton} tabIndex={index === activeIndex ? 0 : -1}>
                  {slide.cta}
                </Link>
              </div>
            </article>
          ))}
        </div>

        <button
          type="button"
          className={`${styles.navButton} ${styles.previous}`}
          onClick={showPrevious}
          aria-label="Show previous hero slide"
        >
          <span aria-hidden="true">&lsaquo;</span>
        </button>
        <button
          type="button"
          className={`${styles.navButton} ${styles.next}`}
          onClick={showNext}
          aria-label="Show next hero slide"
        >
          <span aria-hidden="true">&rsaquo;</span>
        </button>

        <div className={styles.controls} aria-label="Hero carousel slides">
          {slides.map((slide, index) => (
            <button
              key={slide.id}
              type="button"
              className={`${styles.dot} ${index === activeIndex ? styles.activeDot : ''}`}
              onClick={() => goToSlide(index)}
              aria-label={`Show slide ${index + 1}: ${slide.eyebrow}`}
              aria-pressed={index === activeIndex}
            />
          ))}
        </div>
      </div>

      <div className={styles.previewStrip} aria-label="Hero slide previews">
        {slides.map((slide, index) => (
          <button
            key={slide.id}
            type="button"
            className={`${styles.preview} ${index === activeIndex ? styles.activePreview : ''}`}
            onClick={() => goToSlide(index)}
            aria-label={`Preview slide ${index + 1}: ${slide.eyebrow}`}
          >
            <Image src={slide.src} alt="" fill sizes="25vw" className={styles.previewImage} />
            <span>{slide.eyebrow}</span>
          </button>
        ))}
      </div>
      <div className={styles.colorBar} aria-hidden="true" />
    </section>
  );
}
