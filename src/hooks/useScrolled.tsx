import { useState, useEffect } from "react";

type Params = { y: number };

export const useScrolled = ({ y }: Params) => {
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(window.scrollY > y);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [y]);

  return hasScrolled;
};
