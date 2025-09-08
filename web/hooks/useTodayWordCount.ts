"use client";

import { fetchTodayCount } from "@/utils/api";
import { useCallback, useEffect, useRef, useState } from "react";

/** Hook to fetch today's word count */
export default function useTodayWordCount() {
  const [todayWordCount, setTodayWordCount] = useState<number>(0);
  const [isLoadingCount, setIsLoadingCount] = useState<boolean>(false);
  const hasInitialized = useRef(false);

  const fetchCount = useCallback(async () => {
    setIsLoadingCount(true);
    try {
      const count = await fetchTodayCount();
      setTodayWordCount(count);
    } catch (error) {
      console.error("Failed to fetch today's word count:", error);
      setTodayWordCount(0);
    } finally {
      setIsLoadingCount(false);
    }
  }, []);

  useEffect(() => {
    if (!hasInitialized.current) {
      hasInitialized.current = true;
      fetchCount();
    }
  }, [fetchCount]);

  return { todayWordCount, isLoadingCount, refetchCount: fetchCount };
}
