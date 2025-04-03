"use client";
import { useAuth } from "@clerk/nextjs";
import axios from "axios";
import { useEffect, useState } from "react";
import { API_BACKEND_URL } from "@/config";

interface Website {
  id: string;
  url: string;
  userId: string;
  ticks?: {
    id: string;
    createAt: string;
    status: string;
    latency: number;
  }[];
}

export function useWebsites() {
  const { getToken } = useAuth();
  const [websites, setWebsites] = useState<Website[] | null>(null);

  const refreshWebsites = async () => {
    try {
      const token = await getToken();
      const response = await axios.get(`${API_BACKEND_URL}/api/v1/website`, {
        headers: {
          Authorization: `Bearer ${token}`,
          // Authorization: `Bearer 1`,
        },
      });

      console.log("website form usewebsite: ", response);

      setWebsites(response.data);
    } catch (error) {
      console.error("Error fetching websites: ", error);
      setWebsites([]);
    }
  };

  useEffect(() => {
    refreshWebsites();
    const interval = setInterval(refreshWebsites, 1000 * 60 * 5);

    return () => clearInterval(interval);
  }, []);

  return { websites, refreshWebsites };
}
