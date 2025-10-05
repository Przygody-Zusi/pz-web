"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { renameEmploymentType } from "@/lib/rename_employment_type"
import { EmploymentType } from "@/types/employmentType"
import { RetirementProfile } from "@/lib/retirementTypes"
import { useRetirementStore } from "@/store/useRetirement"

export default function ChoicePanel({
    setShowPanel,
    addButton,
    nextId,
    isLoading,
    retirementProfile,
}: {
    setShowPanel: (value: boolean) => void
    addButton: (label: string) => void
    nextId: number
    isLoading: boolean
    retirementProfile: RetirementProfile | null
}) {
    const [startDate, setStartDate] = useState("")
    const [endDate, setEndDate] = useState("")
    const [grossIncome, setGrossIncome] = useState("")
    const [employmentType, setEmploymentType] = useState<EmploymentType>("employment_contract")
    const [isSubmitted, setIsSubmitted] = useState(false)

    const { setRetirementProfile } = useRetirementStore()

    const handleConfirm = () => {
        if (retirementProfile) {
            const updatedProfile = {
                ...retirementProfile,
                contribution_periods: [
                    ...retirementProfile.contribution_periods,
                    {
                        start_date: Number(startDate),
                        end_date: Number(endDate),
                        gross_income: Number(grossIncome),
                        employment_type: employmentType,
                    },
                ],
            }

            setRetirementProfile(updatedProfile)
        }

        addButton(`Wybór ${nextId}`)
    }

    return (
        <div className="mt-auto border-t pt-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="flex justify-between items-start gap-6">
                <div className="flex flex-col gap-3 w-1/2">
                    <Input
                        placeholder="Rok rozpoczęcia"
                        value={startDate}
                        onChange={(e) => {
                            const year = e.target.value.replace(/\D/g, "")
                            if (year.length <= 4) setStartDate(year)
                        }}
                        type="text"
                        disabled={isSubmitted}
                    />
                    <Input
                        placeholder="Rok zakończenia"
                        value={endDate}
                        onChange={(e) => {
                            const year = e.target.value.replace(/\D/g, "")
                            if (year.length <= 4) setEndDate(year)
                        }}
                        type="text"
                        disabled={isSubmitted}
                    />
                    <Input
                        placeholder="Przychód brutto"
                        value={grossIncome}
                        onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, "")
                            setGrossIncome(value)
                        }}
                        type="text"
                        disabled={isSubmitted}
                    />
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline">{renameEmploymentType(employmentType)}</Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56">
                            <DropdownMenuRadioGroup
                                value={employmentType}
                                onValueChange={(value) => setEmploymentType(value as EmploymentType)}
                            >
                                <DropdownMenuRadioItem value="employment_contract">Umowa o pracę</DropdownMenuRadioItem>
                                <DropdownMenuRadioItem value="self_employed">B2B</DropdownMenuRadioItem>
                                <DropdownMenuRadioItem value="mandate_contract">Umowa zlecenie</DropdownMenuRadioItem>
                                <DropdownMenuRadioItem value="maternity_leave">Urlop macierzyński</DropdownMenuRadioItem>
                                <DropdownMenuRadioItem value="parental_leave">Urlop rodzicielski</DropdownMenuRadioItem>
                                <DropdownMenuRadioItem value="no_employment">Brak zatrudnienia</DropdownMenuRadioItem>
                            </DropdownMenuRadioGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                <div className="flex flex-col gap-3 w-1/2">
                    {!isLoading && retirementProfile?.contribution_periods ? (
                        retirementProfile.contribution_periods.map((period, index) => (
                            <Button key={index} className="py-12 px-14 text-lg font-medium" disabled>
                                {`Okres ${index + 1}: ${period.start_date} - ${period.end_date}, ${period.gross_income} PLN, ${renameEmploymentType(
                                    period.employment_type as EmploymentType
                                )}`}
                            </Button>
                        ))
                    ) : isLoading ? (
                        <div className="flex items-center justify-center h-[6rem] flex-col gap-2">
                            <Spinner className="size-6" />
                            <p className="text-sm text-muted-foreground text-center">Ładowanie danych z serwera...</p>
                        </div>
                    ) : (
                        <p className="text-sm text-muted-foreground text-center">Brak danych do wyświetlenia</p>
                    )}

                    <Button
                        className="bg-red-600 hover:bg-red-700 text-white"
                        onClick={handleConfirm}
                        disabled={!startDate || !endDate || !grossIncome || isSubmitted}
                    >
                        Zatwierdź i zamknij
                    </Button>
                </div>
            </div>

            <div className="mt-4 text-right">
                <Button variant="ghost" onClick={() => setShowPanel(false)}>
                    Schowaj panel
                </Button>
            </div>
        </div>
    )
}
