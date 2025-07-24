import { Button, Input } from "@/components/ui";
import React, { useState } from "react";
import ReactSpeedometer from "react-d3-speedometer";
import { toast } from "sonner";

export const CalculateNCDRiskPage: React.FC = () => {
  const [formData, setFormData] = useState({
    weight: "",
    height: "",
    sugar: "",
    pressure: "",
    cholesterol: "",
  });
  const [risk, setRisk] = useState<number | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateInputs = () => {
    const requiredFields = [
      "weight",
      "height",
      "sugar",
      "pressure",
      "cholesterol",
    ];
    for (const field of requiredFields) {
      const key = field as keyof typeof formData;
      const value = parseFloat(formData[key]);
      if (!formData[key]) {
        toast.error(
          `${field.charAt(0).toUpperCase() + field.slice(1)} is required.`,
        );
        return false;
      }
      if (isNaN(value) || value <= 0) {
        toast.error(
          `${field.charAt(0).toUpperCase() + field.slice(1)} must be a positive number.`,
        );
        return false;
      }
    }
    return true;
  };

  const calculateRisk = () => {
    if (!validateInputs()) {
      setRisk(null);
      return;
    }

    const { weight, height, sugar, pressure, cholesterol } = formData;

    const w = parseFloat(weight);
    const h = parseFloat(height) / 100;
    const bmi = w / (h * h);
    const sugarLevel = parseFloat(sugar);
    const pressureLevel = parseFloat(pressure);
    const cholesterolLevel = parseFloat(cholesterol);

    let score = 0;

    if (bmi < 18.5) score += 5;
    else if (bmi <= 24.9) score += 0;
    else if (bmi <= 29.9) score += 15;
    else score += 25;

    if (sugarLevel < 100) score += 0;
    else if (sugarLevel < 126) score += 15;
    else score += 25;

    if (pressureLevel < 120) score += 0;
    else if (pressureLevel <= 129) score += 10;
    else if (pressureLevel <= 139) score += 15;
    else score += 25;

    if (cholesterolLevel < 200) score += 0;
    else if (cholesterolLevel <= 239) score += 15;
    else score += 25;

    setRisk(Math.min(score, 100));
  };

  const getRiskLevel = (score: number) => {
    if (score <= 20)
      return {
        level: "Low Risk",
        color: "text-green-600",
        tip: "You're doing great! Keep up your healthy lifestyle.",
      };
    if (score <= 50)
      return {
        level: "Moderate Risk",
        color: "text-yellow-600",
        tip: "Watch your habits. Exercise and regular checkups are recommended.",
      };
    if (score <= 80)
      return {
        level: "High Risk",
        color: "text-orange-600",
        tip: "Start making healthy changes now. Diet and activity are key.",
      };
    return {
      level: "Very High Risk",
      color: "text-red-600",
      tip: "Consult a medical professional as soon as possible.",
    };
  };

  return (
    <main>
      <div className="w-full bg-white p-6 sm:p-10 border border-blue-100 shadow-sm rounded-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-800 mb-4">
            Calculate NCD Risk
          </h1>
          <p className="text-gray-600 text-sm">
            Fill in your health information to assess your risk of
            Non-Communicable Diseases (NCDs)
          </p>
        </div>

        {/* Form Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10 px-4">
          {[
            { name: "weight", label: "Weight (kg)", placeholder: "e.g., 70" },
            { name: "height", label: "Height (cm)", placeholder: "e.g., 165" },
            {
              name: "sugar",
              label: "Sugar Level (mg/dL)",
              placeholder: "e.g., 110",
            },
            {
              name: "pressure",
              label: "Blood Pressure (systolic mmHg)",
              placeholder: "e.g., 130",
            },
            {
              name: "cholesterol",
              label: "Cholesterol Level (mg/dL)",
              placeholder: "e.g., 180",
            },
          ].map(({ name, label, placeholder }) => (
            <div
              key={name}
              className={name === "cholesterol" ? "sm:col-span-2" : ""}
            >
              <label className="block text-gray-700 font-medium mb-1">
                {label}
              </label>
              <Input
                name={name}
                type="number"
                value={formData[name as keyof typeof formData]}
                onChange={handleChange}
                placeholder={placeholder}
              />
            </div>
          ))}
        </div>

        {/* Calculate Button */}
        <div className="text-center mb-10">
          <Button
            onClick={calculateRisk}
            className="px-6 py-2 bg-blue-700 text-white rounded-md hover:bg-blue-800 transition font-medium"
          >
            Calculate Risk
          </Button>
        </div>

        {/* Speedometer & Results */}
        {risk !== null && (
          <div className="flex flex-col items-center gap-6 px-4">
            <ReactSpeedometer
              value={risk}
              minValue={0}
              maxValue={100}
              segments={5}
              segmentColors={[
                "#00e676",
                "#c6ff00",
                "#ffeb3b",
                "#ff9100",
                "#d50000",
              ]}
              needleColor="#37474f"
              textColor="#37474f"
              height={240}
              width={400}
              currentValueText={`Risk: ${risk}%`}
            />
            <div className="text-center">
              <h3
                className={`text-xl font-semibold ${getRiskLevel(risk).color}`}
              >
                {getRiskLevel(risk).level}
              </h3>
              <p className="text-gray-600">{getRiskLevel(risk).tip}</p>
            </div>
          </div>
        )}
      </div>
      <footer className="text-center text-xs text-gray-500 mt-2">
        &copy; 2025 SimpLinkX. All rights reserved. | A Government of Sri Lanka
        Initiative
      </footer>
    </main>
  );
};