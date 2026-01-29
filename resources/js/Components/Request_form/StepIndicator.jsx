import React from "react";
import { Check, FileText, MapPin, Home } from "lucide-react";

export function StepIndicator({ currentStep, completedSteps }) {
    const steps = [
        { number: 1, title: "Applicant Info", icon: FileText },
        { number: 2, title: "Project Details", icon: MapPin },
        { number: 3, title: "Land Use", icon: Home },
    ];

    return (
        <div className="mb-8">
            <div className="flex items-center justify-between relative">
                {/* Progress Line */}
                <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200 -z-10">
                    <div
                        className="h-full bg-blue-600 transition-all duration-500"
                        style={{
                            width: `${((completedSteps.length) / (steps.length - 1)) * 100}%`,
                        }}
                    />
                </div>

                {steps.map((step, index) => {
                    const isCompleted = completedSteps.includes(step.number);
                    const isCurrent = currentStep === step.number;
                    const Icon = step.icon;

                    return (
                        <div key={step.number} className="flex flex-col items-center flex-1">
                            <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                                    isCompleted
                                        ? "bg-green-600 text-white"
                                        : isCurrent
                                        ? "bg-blue-600 text-white ring-4 ring-blue-100"
                                        : "bg-gray-200 text-gray-500"
                                }`}
                            >
                                {isCompleted ? (
                                    <Check className="h-5 w-5" />
                                ) : (
                                    <Icon className="h-5 w-5" />
                                )}
                            </div>
                            <div className="mt-2 text-center">
                                <p
                                    className={`text-sm font-medium ${
                                        isCurrent
                                            ? "text-blue-600"
                                            : isCompleted
                                            ? "text-green-600"
                                            : "text-gray-500"
                                    }`}
                                >
                                    {step.title}
                                </p>
                                <p className="text-xs text-gray-400">Step {step.number}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
