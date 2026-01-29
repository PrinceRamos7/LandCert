import React from "react";
import { Button } from "@/Components/ui/button";
import { ChevronLeft, ChevronRight, Send } from "lucide-react";

export function FormNavigation({
    currentStep,
    totalSteps,
    processing,
    onPrevious,
    onNext,
    onSubmit,
}) {
    return (
        <div className="flex justify-between items-center pt-6 border-t">
            <Button
                type="button"
                variant="outline"
                onClick={onPrevious}
                disabled={currentStep === 1 || processing}
                className="gap-2"
            >
                <ChevronLeft className="h-4 w-4" />
                Previous
            </Button>

            <div className="text-sm text-gray-500">
                Step {currentStep} of {totalSteps}
            </div>

            {currentStep < totalSteps ? (
                <Button
                    type="button"
                    onClick={onNext}
                    disabled={processing}
                    className="gap-2"
                >
                    Next
                    <ChevronRight className="h-4 w-4" />
                </Button>
            ) : (
                <Button
                    type="button"
                    onClick={onSubmit}
                    disabled={processing}
                    className="gap-2 bg-green-600 hover:bg-green-700"
                >
                    {processing ? (
                        <>
                            <span className="animate-spin">⏳</span>
                            Submitting...
                        </>
                    ) : (
                        <>
                            <Send className="h-4 w-4" />
                            Submit Application
                        </>
                    )}
                </Button>
            )}
        </div>
    );
}
