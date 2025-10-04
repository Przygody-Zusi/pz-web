"use client"

import { useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import ChoicePanel from "./ChoicePanel"
import CarouselArea from "./CarouselArea"
import BasicForm from "../_components/BasicForm"


export default function MainViewCard() {
    const [showPanel, setShowPanel] = useState(false)
    const [buttons, setButtons] = useState<string[]>(Array.from({ length: 1 }, (_, i) => `Button ${i + 1}`))

    const addButton = (label: string) => {
        setButtons((prev) => [...prev, label])
        setShowPanel(false)
    }

    return (
        <Card className="h-full shadow-lg flex flex-col">
            <CardHeader>
                <CardTitle className="text-xl font-semibold">Główny widok</CardTitle>
            </CardHeader>

            <CardContent className="flex flex-col h-full">
                <BasicForm/>
                <CarouselArea setShowPanel={setShowPanel} buttons={buttons} />
                {showPanel && <ChoicePanel setShowPanel={setShowPanel} addButton={addButton} />}
            </CardContent>
        </Card>
    )
}