"use client";

import { useState } from "react";
import { RetirementProfile } from "@/lib/retirementTypes";
import InitialPromptStep from "@/components/retirement/InitialPromptStep";
import ProfileFormStep from "@/components/retirement/ProfileFormStep";
import SummaryStep from "@/components/retirement/SummaryStep";

export default function RetirementPage() {
    const [step, setStep] = useState<1 | 2 | 3>(1);
    const [profile, setProfile] = useState<RetirementProfile | null>(null);

    const handlePromptSubmit = (generatedProfile: RetirementProfile) => {
        setProfile(generatedProfile);
        setStep(2);
    };

    const handleProfileUpdate = (updatedProfile: RetirementProfile) => {
        setProfile(updatedProfile);
    };

    const handleViewSummary = () => {
        setStep(3);
    };

    const handleEditProfile = () => {
        setStep(2);
    };

    const handleStartOver = () => {
        setProfile(null);
        setStep(1);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
            {/* Progress Indicator */}
            <div className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between max-w-4xl mx-auto">
                        {[1, 2, 3].map((num) => (
                            <div key={num} className="flex items-center flex-1">
                                <div
                                    className={`flex items-center justify-center w-10 h-10 rounded-full transition-all ${step >= num
                                            ? "bg-primary text-primary-foreground"
                                            : "bg-muted text-muted-foreground"
                                        }`}
                                >
                                    {num}
                                </div>
                                {num < 3 && (
                                    <div
                                        className={`flex-1 h-1 mx-2 transition-all ${step > num ? "bg-primary" : "bg-muted"
                                            }`}
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between max-w-4xl mx-auto mt-2 text-sm">
                        <span className={step >= 1 ? "text-foreground font-medium" : "text-muted-foreground"}>
                            Describe Goals
                        </span>
                        <span className={step >= 2 ? "text-foreground font-medium" : "text-muted-foreground"}>
                            Adjust Profile
                        </span>
                        <span className={step >= 3 ? "text-foreground font-medium" : "text-muted-foreground"}>
                            View Results
                        </span>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 pt-32 pb-16">
                {step === 1 && <InitialPromptStep onSubmit={handlePromptSubmit} />}
                {step === 2 && profile && (
                    <ProfileFormStep
                        profile={profile}
                        onUpdate={handleProfileUpdate}
                        onViewSummary={handleViewSummary}
                        onBack={() => setStep(1)}
                    />
                )}
                {step === 3 && profile && (
                    <SummaryStep
                        profile={profile}
                        onEdit={handleEditProfile}
                        onStartOver={handleStartOver}
                    />
                )}
            </div>
        </div>
    );
}
