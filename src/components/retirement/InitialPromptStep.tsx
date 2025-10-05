"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RetirementProfile } from "@/lib/retirementTypes";
import sampleProfile from "@/data/sample_profile.json";

interface InitialPromptStepProps {
    onSubmit: (profile: RetirementProfile) => void;
}

export default function InitialPromptStep({ onSubmit }: InitialPromptStepProps) {
    const [prompt, setPrompt] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async () => {
        if (!prompt.trim()) {
            setError("Please describe your retirement expectations");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const response = await fetch("http://localhost:8000/api/generate-profile", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt }),
            });

            if (!response.ok) throw new Error("Failed to generate profile");

            const data = await response.json();
            onSubmit(data.profile as RetirementProfile);
        } catch (err) {
            console.error(err);
            setError("Failed to generate profile. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleUseSample = () => {
        onSubmit(sampleProfile as RetirementProfile);
    };

    const examplePrompts = [
        "I'm 30 years old, earning 8000 PLN monthly. I want to retire at 65 with comfortable lifestyle.",
        "I'm 45, self-employed, earning 12000 PLN monthly. Planning to retire at 67.",
        "I'm 35 with employment contract, 10000 PLN monthly. I want to retire early at 60.",
    ];

    return (
        <div className="max-w-3xl mx-auto animate-fade-in">
            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold mb-4">
                    Plan Your Retirement Journey
                </h1>
                <p className="text-muted-foreground text-lg">
                    Describe your current situation and retirement goals. Our AI will help create a personalized plan.
                </p>
            </div>

            <div className="bg-card border rounded-lg p-6 shadow-lg">
                <label className="block text-sm font-medium mb-2">
                    Describe Your Retirement Expectations
                </label>
                <Textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Example: I'm 35 years old, currently earning 10,000 PLN per month on an employment contract. I want to retire at age 65 and maintain a comfortable lifestyle..."
                    rows={8}
                    className="mb-4"
                />

                {error && (
                    <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-md mb-4">
                        {error}
                    </div>
                )}

                <div className="mb-6">
                    <p className="text-sm text-muted-foreground mb-2">Example prompts:</p>
                    <div className="space-y-2">
                        {examplePrompts.map((example, idx) => (
                            <button
                                key={idx}
                                onClick={() => setPrompt(example)}
                                className="block w-full text-left text-sm bg-muted hover:bg-muted/80 px-3 py-2 rounded transition-colors"
                            >
                                {example}
                            </button>
                        ))}
                    </div>
                </div>

                <Button
                    onClick={handleSubmit}
                    disabled={loading || !prompt.trim()}
                    className="w-full"
                    size="lg"
                >
                    {loading ? "Generating Profile..." : "Generate My Retirement Profile"}
                </Button>

                <div className="mt-4 text-center">
                    <Button
                        onClick={handleUseSample}
                        variant="outline"
                        className="w-full"
                    >
                        Use Sample Profile (Dev Mode)
                    </Button>
                </div>
            </div>
        </div>
    );
}
