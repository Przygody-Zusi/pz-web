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
            setError("Proszę opisać swoje oczekiwania emerytalne");
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
            setError("Nie udało się wygenerować profilu. Spróbuj ponownie.");
        } finally {
            setLoading(false);
        }
    };

    const handleUseSample = () => {
        onSubmit(sampleProfile as RetirementProfile);
    };

    const examplePrompts = [
        "Mam 30 lat, zarabiam 8000 PLN miesięcznie. Chcę przejść na emeryturę w wieku 65 lat z komfortowym stylem życia.",
        "Mam 45 lat, jestem samozatrudniony, zarabiam 12000 PLN miesięcznie. Planuję przejść na emeryturę w wieku 67 lat.",
        "Mam 35 lat, pracuję na umowę o pracę, zarabiam 10000 PLN miesięcznie. Chcę wcześniej przejść na emeryturę w wieku 60 lat.",
    ];

    return (
        <div className="max-w-3xl mx-auto animate-fade-in">
            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold mb-4">
                    Zaplanuj Swoją Emeryturę
                </h1>
                <p className="text-muted-foreground text-lg">
                    Opisz swoją obecną sytuację i cele emerytalne. Nasza AI pomoże stworzyć spersonalizowany plan.
                </p>
            </div>

            <div className="bg-card border rounded-lg p-6 shadow-lg">
                <label className="block text-sm font-medium mb-2">
                    Opisz Swoje Oczekiwania Emerytalne
                </label>
                <Textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Przykład: Mam 35 lat, obecnie zarabiam 10 000 PLN miesięcznie na umowie o pracę. Chcę przejść na emeryturę w wieku 65 lat i utrzymać komfortowy styl życia..."
                    rows={8}
                    className="mb-4"
                />

                {error && (
                    <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-md mb-4">
                        {error}
                    </div>
                )}

                <div className="mb-6">
                    <p className="text-sm text-muted-foreground mb-2">Przykładowe opisy:</p>
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
                    {loading ? "Generowanie profilu..." : "Wygeneruj Mój Profil Emerytalny"}
                </Button>

                <div className="mt-4 text-center">
                    <Button
                        onClick={handleUseSample}
                        variant="outline"
                        className="w-full"
                    >
                        Użyj Przykładowego Profilu (Tryb Deweloperski)
                    </Button>
                </div>
            </div>
        </div>
    );
}
