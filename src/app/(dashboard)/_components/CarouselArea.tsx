"use client"

import { Button } from "@/components/ui/button"
import * as React from "react"

import { Card, CardContent } from "@/components/ui/card"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"

export default function CarouselArea({
    setShowPanel,
    buttons,
}: {
    setShowPanel: (value: boolean) => void
    buttons: { label: string, disabled: boolean }[],
}) {
    return (
        <Carousel
            opts={{
                align: "start",
            }}
            className="whitespace-nowrap h-2/5 mb-4 *:mx-10"
        >
            <CarouselContent>
                {buttons.map((button, index) => (
                    <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                        <div className="p-1">
                            <Card>
                                <CardContent className="flex aspect-square items-center justify-center p-6">
                                    <Button
                                        key={index}
                                        className="py-12 px-14 text-lg font-medium"
                                        onClick={() => setShowPanel(true)}
                                        disabled={button.disabled}
                                    >
                                        {button.label}
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </CarouselItem>
                ))}
            </CarouselContent>
            {/* <CarouselPrevious />
            <CarouselNext /> */}
        </Carousel>
    )
}
