"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function ChoicePanel({
    setShowPanel,
    addButton,
}: {
    setShowPanel: (value: boolean) => void
    addButton: (label: string) => void
}) {
    const [newLabel, setNewLabel] = useState("")

    const handleConfirm = () => {
        if (newLabel.trim() !== "") {
            addButton(newLabel.trim())
            setNewLabel("")
        }
    }

    return (
        <div className="mt-auto border-t pt-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="flex justify-between items-start gap-6">
                {/* Kolumna inputów */}
                <div className="flex flex-col gap-3 w-1/2">
                    <Input
                        placeholder="Nazwa nowego przycisku"
                        value={newLabel}
                        onChange={(e) => setNewLabel(e.target.value)}
                    />
                </div>

                {/* Kolumna przykładowych przycisków */}
                <div className="flex flex-col gap-3 w-1/2">
                    <Button variant="outline" onClick={handleConfirm}>
                        Zatwierdź
                    </Button>
                    <Button variant="secondary" onClick={() => setNewLabel("")}>
                        Wyczyść
                    </Button>
                    <Button className="bg-red-600 hover:bg-red-700 text-white" onClick={() => setShowPanel(false)}>
                        Anuluj
                    </Button>
                </div>
            </div>

            {/* Przycisk ukrycia panelu */}
            <div className="mt-4 text-right">
                <Button variant="ghost" onClick={() => setShowPanel(false)}>
                    Schowaj panel
                </Button>
            </div>
        </div>
    )
}
