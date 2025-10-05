"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import ChoicePanel from "./ChoicePanel"
import CarouselArea from "./CarouselArea"
import BasicForm from "../_components/BasicForm"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useRetirementStore } from "@/store/useRetirement"

export default function MainViewCard() {
    const [showPanel, setShowPanel] = useState(false)
    const [buttons, setButtons] = useState<{ label: string, disabled: boolean }[]>(Array.from({ length: 1 }, (_, i) => ({ label: `Wybór ${i + 1}`, disabled: false })))

    const { retirementProfile, setRetirementProfile, isLoading, setIsLoading } = useRetirementStore()

    const addButton = (label: string) => {
        setButtons((prev) => [...prev, { label, disabled: false }])
        setShowPanel(false)
    }

    useEffect(() => {
        const callBackend = async () => {
            try {
                const res = await fetch("http://localhost:8000/api/LLM/generate", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ prompt: "Jestem informatykiem lat 25, ukończyłem studia inżynierskie." }),
                })

                if (!res.ok) throw new Error("Backend error")
                const data = await res.json()

                const profile = {
                    contribution_periods: data.contribution_periods,
                    profile: data.profile,
                    retirement_goals: data.retirement_goals,
                }

                console.log("Constructed profile:", profile)
                setRetirementProfile(profile)
                setIsLoading(false)
            } catch (err) {
                console.error(err)
                setIsLoading(false)
            }
        }

        if (!retirementProfile) callBackend()
    }, [retirementProfile, setRetirementProfile, setIsLoading])

    return (
        <ScrollArea className="h-[90vh] w-full rounded-lg">
            <Card className="h-full shadow-lg flex flex-col">
                <CardContent className="flex flex-col h-full">
                    <BasicForm />
                    
                    <CarouselArea setShowPanel={setShowPanel} buttons={buttons} />
                    {showPanel && (
                        <ChoicePanel
                            setShowPanel={setShowPanel}
                            addButton={addButton}
                            nextId={buttons.length + 1}
                            isLoading={isLoading}
                            retirementProfile={retirementProfile}
                        />
                    )}
                </CardContent>
            </Card>
        </ScrollArea>
    )
}
