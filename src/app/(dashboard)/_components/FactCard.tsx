"use client"

import Image from "next/image"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import VisualNovelDialogue from '@/components/ui/zusia_dialogue';


export default function FactCard() {
    return (
        <div className="h-1/2 p-4">
            <Card className="h-full shadow-md bg-white">
                    <VisualNovelDialogue
                    backgroundImage="/zusia/zusia2.png"
                    dialogueText="Wiek emerytalny w Polsce zarządzany przez ZUS został kontrowersyjnie obniżony w 2017 roku do 60 lat dla kobiet i 65 lat dla mężczyzn."/>
            </Card>
        </div>
    );
}