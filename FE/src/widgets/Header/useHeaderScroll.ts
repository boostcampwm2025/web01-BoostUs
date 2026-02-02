import { useEffect, useState } from 'react';

const UseHeaderScroll = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const nextIsScrolled = window.scrollY > 0;
          setIsScrolled((prev) => {
            return prev !== nextIsScrolled ? nextIsScrolled : prev;
          });

          ticking = false;
        });

        ticking = true;
      }
    };

    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return { isScrolled, setIsScrolled };
};

export default UseHeaderScroll;
