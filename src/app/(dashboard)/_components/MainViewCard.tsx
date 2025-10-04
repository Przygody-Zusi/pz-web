"use client"

import { useState, useEffect } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import ChoicePanel from "./ChoicePanel"
import CarouselArea from "./CarouselArea"
import { RetirementProfile } from "@/lib/retirementCalculator"
import BasicForm from "../_components/BasicForm"

export default function MainViewCard() {
    const [showPanel, setShowPanel] = useState(false)
    const [buttons, setButtons] = useState<string[]>(Array.from({ length: 1 }, (_, i) => `Wybór ${i + 1}`))
    const [isLoading, setIsLoading] = useState(true)
    const [retirementProfile, setRetirementProfile] = useState<RetirementProfile | null>(null);

    const addButton = (label: string) => {
        setButtons((prev) => [...prev, label])
        setShowPanel(false)
    }

    useEffect(() => {
        const callBackend = async () => {
            try {
                const res = await fetch("http://localhost:8000/api/LLM/generate", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ prompt: "Jestem informatykiem lat 25, ukończyłem studia inżynierskie." }),
                });

                if (!res.ok) throw new Error("Backend error");
                const data: RetirementProfile = await res.json();
                const profile: RetirementProfile = {
                    contribution_periods: data.contribution_periods,
                    profile: data.profile,
                    retirement_goals: data.retirement_goals,
                };
                console.log("Constructed profile:", profile);
                localStorage.setItem("dashboardData", JSON.stringify(profile));
                setRetirementProfile(profile);
                setIsLoading(false);
            } catch (err) {
                console.error(err);
            }
        };

        callBackend();
    });

    return (
        <Card className="h-full shadow-lg flex flex-col">
            <CardHeader>
                <CardTitle className="text-xl font-semibold">Główny widok</CardTitle>
            </CardHeader>

            <CardContent className="flex flex-col h-full">
                <BasicForm/>
                <CarouselArea setShowPanel={setShowPanel} buttons={buttons} />
                {showPanel && <ChoicePanel setShowPanel={setShowPanel} addButton={addButton} nextId={buttons.length + 1} isLoading={isLoading} retirementProfile={retirementProfile} />}
            </CardContent>
        </Card>
    )
}