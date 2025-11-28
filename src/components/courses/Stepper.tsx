import React from "react";

type StepperProps = {
  steps: { id: number; name: string }[];
  currentStep: number;
};

export const Stepper = ({ steps, currentStep }: StepperProps) => (
  <div className="flex justify-between items-center mb-8">
    {steps.map((step, index) => (
      <div
        key={step.id}
        className={`flex-1 text-center pb-2 border-b-4 transition-colors duration-300
        ${currentStep >= index + 1 ? "border-blue-500 text-blue-600 font-medium" : "border-gray-300 text-gray-400"}`}
      >
        {step.name}
      </div>
    ))}
  </div>
);
