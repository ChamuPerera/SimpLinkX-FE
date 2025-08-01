import { healthTips } from "@/constants/health-tips";
import { useEffect, useState } from "react";

export function HealthTips() {
  const [currentTipIndex, setCurrentTipIndex] = useState(0);

  const nextTip = () => {
    setCurrentTipIndex((prev) => (prev + 1) % healthTips.length);
  };

  const prevTip = () => {
    setCurrentTipIndex(
      (prev) => (prev - 1 + healthTips.length) % healthTips.length,
    );
  };

  const goToTip = (index: number) => {
    setCurrentTipIndex(index);
  };

  // Auto-advance tips every 5 seconds
  useEffect(() => {
    const interval = setInterval(nextTip, 5000);
    return () => clearInterval(interval);
  }, []);

  const currentTip = healthTips[currentTipIndex];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "border-l-red-500 bg-red-50";
      case "medium":
        return "border-l-yellow-500 bg-yellow-50";
      default:
        return "border-l-green-500 bg-green-50";
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg px-4 py-8 md:p-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          Health & Wellness Tip
        </h2>
        <p className="text-gray-600">Daily health advice for better living</p>
      </div>

      <div className="max-w-2xl mx-auto">
        <div
          className={`border-l-4 rounded-lg p-8 shadow-md transition-all duration-500 ${getPriorityColor(currentTip.priority)}`}
        >
          <div className="flex items-center mb-6">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-3xl mr-4 shadow-sm">
              {currentTip.icon}
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-1">
                {currentTip.title}
              </h3>
              <div className="flex items-center space-x-3">
                <span className="text-sm text-blue-600 font-medium">
                  {currentTip.category}
                </span>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    currentTip.priority === "high"
                      ? "bg-red-100 text-red-800"
                      : currentTip.priority === "medium"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-green-100 text-green-800"
                  }`}
                >
                  {currentTip.priority.charAt(0).toUpperCase() +
                    currentTip.priority.slice(1)}{" "}
                  Priority
                </span>
              </div>
            </div>
          </div>
          <p className="text-gray-700 text-lg leading-relaxed">
            {currentTip.description}
          </p>
        </div>

        {/* Navigation Controls */}
        <div className="flex items-center justify-between mt-6">
          <button
            onClick={prevTip}
            className="flex items-center px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Previous
          </button>

          {/* Tip Indicators */}
          <div className="space-x-2 hidden sm:flex">
            {healthTips.map((_, index) => (
              <button
                key={index}
                onClick={() => goToTip(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentTipIndex
                    ? "bg-blue-600"
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
              />
            ))}
          </div>

          <button
            onClick={nextTip}
            className="flex items-center px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
          >
            Next
            <svg
              className="w-5 h-5 ml-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="flex justify-between text-sm text-gray-500 mb-2">
            <span>
              Tip {currentTipIndex + 1} of {healthTips.length}
            </span>
            <span>{currentTip.category}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-500"
              style={{
                width: `${((currentTipIndex + 1) / healthTips.length) * 100}%`,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
