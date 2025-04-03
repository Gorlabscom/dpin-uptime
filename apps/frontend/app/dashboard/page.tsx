"use client";
import React, { useState, useMemo } from "react";
import { ChevronDown, ChevronUp, Globe, Moon, Sun, Plus } from "lucide-react";
import { useWebsites } from "@/hooks/useWebsites";
import { parseISO, subMinutes } from "date-fns";
import axios from "axios";
import { API_BACKEND_URL } from "@/config";
import { useAuth } from "@clerk/nextjs";

function StatusDot({ status }: { status: string }) {
  console.log("status: ", status);
  return (
    <div
      className={`w-3 h-3 rounded-full ${status === "up" ? "bg-green-500" : status === "down" ? "bg-red-500" : "bg-gray-500"}`}
    />
  );
}

function UptimeHistory({
  ticks,
}: {
  ticks?: { status: string; createAt: string }[];
}) {
  // Group ticks into 30-minute windows
  const aggregatedTicks = useMemo(() => {
    if (!ticks) return Array(10).fill("unknown");
    const now = new Date();
    const windows: string[] = [];

    // Create 10 windows of 30 minutes each
    for (let i = 0; i < 10; i++) {
      const windowEnd = subMinutes(now, i * 30);
      const windowStart = subMinutes(windowEnd, 30);

      const windowTicks = (ticks ?? []).filter((tick) => {
        console.log("ticks: ", tick)
        const tickDate = parseISO(tick.createAt);
        return tickDate >= windowStart && tickDate < windowEnd;
      });

      // If no ticks in window, mark as unknown
      if (windowTicks.length === 0) {
        windows.unshift("unknown");
        continue;
      }

      // Get the status based on actual tick statuses
      const hasDownStatus = windowTicks.some((tick) => tick.status === "down");
      windows.unshift(hasDownStatus ? "down" : "up");
    }

    return windows;
  }, [ticks]);

  return (
    <div className="flex gap-1 mt-2">
      {aggregatedTicks.map((status, index) => (
        <div
          key={index}
          className={`w-8 h-2 rounded ${
            status === "up"
              ? "bg-green-500"
              : status === "down"
              ? "bg-red-500"
              : "bg-gray-500"
          }`}
          title={`Window ${index + 1}: ${status.toUpperCase()}`}
        />
      ))}
    </div>
  );
}

function WebsiteCard({
  website,
}: {
  website: {
    id: string;
    url: string;
    userId: string; //added userId
    ticks?: {
      id: string;
      createAt: string;
      status: string;
      latency: number;
    }[];
  };
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  console.log("website: ", website);

  const status =
    website.ticks && website.ticks.length > 0
      ? website.ticks[0].status
      : "unknown";

  // const status = if ( website.ticks && website.ticks.length > 0 ) website.ticks[0].status

  const uptime = useMemo(() => {
    if (!website.ticks || website.ticks.length === 0) return "0%";
    const upTicks = website.ticks.filter((tick) => tick.status === "up").length;
    return `${((upTicks / website.ticks.length) * 100).toFixed(1)}%`;
  }, [website.ticks]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-colors duration-200">
      <div
        className="p-4 cursor-pointer flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center space-x-4">
          <StatusDot status={status} />
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">
              {website.url}
            </h3>
            {/* <p className="text-sm text-gray-500 dark:text-gray-400">
              Last check:{" "}
              {website.ticks && website.ticks?.length > 0
                ? format(
                    parseISO(website.ticks[0].createdAt),
                    "MMM d, HH:mm:ss",
                  )
                : "No data"}
            </p> */}
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <span
            className={`font-medium ${status === "up" ? "text-green-600 dark:text-green-400" : status === "down" ? "text-red-600 dark:text-red-400" : "bg-gray-500"}`}
          >
            {uptime}
          </span>
          {isExpanded ? (
            <ChevronUp size={20} className="text-gray-500 dark:text-gray-400" />
          ) : (
            <ChevronDown
              size={20}
              className="text-gray-500 dark:text-gray-400"
            />
          )}
        </div>
      </div>

      {isExpanded && (
        <div className="px-4 pb-4 border-t border-gray-100 dark:border-gray-700">
          <div className="mt-3">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Last 30 minutes (3-minute windows)
            </h4>
            <UptimeHistory ticks={website.ticks} />
          </div>
        </div>
      )}
    </div>
  );
}

// import { websites, refreshWebsites } from "@/hooks/useWebsites";

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { websites, refreshWebsites } = useWebsites();
  const [url, setUrl] = useState("");
  const { getToken } = useAuth();

  console.log("websites: ", websites);

  // Remove console.log for production
  React.useEffect(() => {
    if (!websites) return;
    refreshWebsites();
  }, []);

  // Toggle dark mode
  React.useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-2">
            <Globe className="text-blue-600 dark:text-blue-400" size={24} />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Uptime Monitor
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-lg bg-white dark:bg-gray-800 shadow-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              {darkMode ? (
                <Sun className="text-gray-600 dark:text-gray-300" size={20} />
              ) : (
                <Moon className="text-gray-600 dark:text-gray-300" size={20} />
              )}
            </button>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md transition-colors duration-200"
            >
              <Plus size={20} />
              <span>Add Website</span>
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {websites ? (
            Array.isArray(websites) ? (
              websites.map((website) => (
                <WebsiteCard key={website.id} website={website} />
              ))
            ) : (
              <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                No websites found
              </div>
            )
          ) : (
            <div className="text-center text-gray-500 dark:text-gray-400 py-8">
              Loading...
            </div>
          )}
        </div>

        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-md w-full">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Add New Website
              </h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  URL
                </label>
                <input
                  type="url"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="https://example.com"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                />
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  onClick={async () => {
                    try {
                      const token = await getToken();
                      await axios.post(
                        `${API_BACKEND_URL}/api/v1/website`,
                        { url },
                        {
                          headers: {
                            Authorization: `Bearer ${token}`,
                          },
                        },
                      );
                      await refreshWebsites();
                      setShowCreateModal(false);
                      setUrl("");
                    } catch (error) {
                      console.error("Failed to add website:", error);
                      // You might want to add error handling UI here
                    }
                  }}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-sm transition-colors duration-200"
                >
                  Add Website
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
