import { useState, useEffect } from 'react';

interface UseLoadingOptions {
  initialLoading?: boolean;
  minLoadingTime?: number; // Minimum loading time in milliseconds
}

export const useLoading = (options: UseLoadingOptions = {}) => {
  const { initialLoading = false, minLoadingTime = 800 } = options;
  const [isLoading, setIsLoading] = useState(initialLoading);
  const [startTime, setStartTime] = useState<number | null>(null);

  const startLoading = () => {
    setStartTime(Date.now());
    setIsLoading(true);
  };

  const stopLoading = async () => {
    if (startTime) {
      const elapsed = Date.now() - startTime;
      const remaining = minLoadingTime - elapsed;
      
      if (remaining > 0) {
        // Wait for the minimum loading time
        await new Promise(resolve => setTimeout(resolve, remaining));
      }
    }
    
    setIsLoading(false);
    setStartTime(null);
  };

  return {
    isLoading,
    startLoading,
    stopLoading,
  };
};

// Hook for simulating data fetching with loading
export const useAsyncOperation = <T>(
  asyncFn: () => Promise<T>,
  dependencies: React.DependencyList = []
) => {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const { isLoading, startLoading, stopLoading } = useLoading();

  const execute = async () => {
    try {
      startLoading();
      setError(null);
      const result = await asyncFn();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An error occurred'));
    } finally {
      await stopLoading();
    }
  };

  useEffect(() => {
    execute();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);

  return {
    data,
    error,
    isLoading,
    refetch: execute,
  };
};
