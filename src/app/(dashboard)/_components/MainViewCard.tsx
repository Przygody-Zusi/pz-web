"use client"

import { useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import ChoicePanel from "./ChoicePanel"
import ChoiceArea from "./ChoiceArea"

export default function MainViewCard() {
    const [showPanel, setShowPanel] = useState(false)

    return (
        <Card className="h-full shadow-lg flex flex-col">
            <CardHeader>
                <CardTitle className="text-xl font-semibold">Główny widok</CardTitle>
            </CardHeader>

            <CardContent className="flex flex-col h-full">
                <ChoiceArea setShowPanel={setShowPanel} />

                {showPanel && (
                    <ChoicePanel setShowPanel={setShowPanel} />
                )}
            </CardContent>
        </Card>
    )
}
