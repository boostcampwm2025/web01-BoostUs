import { useState } from 'react';

const useImageError = (imageUrl?: string) => {
  const [isError, setIsError] = useState(false);
  const [prevUrl, setPrevUrl] = useState(imageUrl);

  if (imageUrl !== prevUrl) {
    setPrevUrl(imageUrl);
    setIsError(false);
  }

  return {
    isError,
    setIsError,
  };
};

export default useImageError;
