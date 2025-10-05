"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RetirementProfile } from "@/lib/retirementTypes";

interface ProfileFormStepProps {
    profile: RetirementProfile;
    onUpdate: (profile: RetirementProfile) => void;
    onViewSummary: () => void;
    onBack: () => void;
}

export default function ProfileFormStep({
    profile: initialProfile,
    onUpdate,
    onViewSummary,
    onBack,
}: ProfileFormStepProps) {
    const [profile, setProfile] = useState<RetirementProfile>(initialProfile);

    const updateProfile = (updates: Partial<RetirementProfile>) => {
        const newProfile = { ...profile, ...updates };
        setProfile(newProfile);
        onUpdate(newProfile);
    };

    const updatePersonalInfo = (field: keyof RetirementProfile["profile"], value: RetirementProfile["profile"][keyof RetirementProfile["profile"]]) => {
        updateProfile({
            profile: { ...profile.profile, [field]: value },
        });
    };

    // const updateRetirementGoals = (field: keyof RetirementProfile["retirement_goals"], value: RetirementProfile["retirement_goals"][keyof RetirementProfile["retirement_goals"]]) => {
    //     updateProfile({
    //         retirement_goals: { ...profile.retirement_goals, [field]: value },
    //     });
    // };

    const addContributionPeriod = () => {
        const newPeriod = {
            start_date: new Date().getFullYear(),
            end_date: new Date().getFullYear() + 1,
            gross_income: 0,
            employment_type: "employment_contract",
        };
        updateProfile({
            contribution_periods: [...profile.contribution_periods, newPeriod],
        });
    };

    const updateContributionPeriod = (index: number, updates: Partial<RetirementProfile["contribution_periods"][number]>) => {
        const newPeriods = [...profile.contribution_periods];
        newPeriods[index] = { ...newPeriods[index], ...updates };
        updateProfile({ contribution_periods: newPeriods });
    };

    const removeContributionPeriod = (index: number) => {
        updateProfile({
            contribution_periods: profile.contribution_periods.filter((_, i) => i !== index),
        });
    };

    return (
        <div className="max-w-5xl mx-auto animate-fade-in">
            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold mb-4">Dostosuj Swój Profil</h1>
                <p className="text-muted-foreground text-lg">
                    Doprecyzuj szczegóły, aby uzyskać najdokładniejszą prognozę emerytalną
                </p>
            </div>

            <div className="grid gap-6">
                {/* Personal Information */}
                <div className="bg-card border rounded-lg p-6 shadow-lg">
                    <h2 className="text-2xl font-semibold mb-4">Informacje Osobiste</h2>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">Rok Urodzenia</label>
                            <Input
                                type="number"
                                value={profile.profile.date_of_birth}
                                onChange={(e) => updatePersonalInfo("date_of_birth", parseInt(e.target.value))}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Płeć</label>
                            <select
                                value={profile.profile.gender}
                                onChange={(e) => updatePersonalInfo("gender", e.target.value)}
                                className="w-full px-3 py-2 border rounded-md bg-background"
                            >
                                <option value="male">Mężczyzna</option>
                                <option value="female">Kobieta</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Rok Rozpoczęcia Pracy</label>
                            <Input
                                type="number"
                                value={profile.profile.employment_start_date}
                                onChange={(e) =>
                                    updatePersonalInfo("employment_start_date", parseInt(e.target.value))
                                }
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Planowany Wiek Emerytalny</label>
                            <Input
                                type="number"
                                value={profile.profile.actual_retirement_age}
                                onChange={(e) =>
                                    updatePersonalInfo("actual_retirement_age", parseInt(e.target.value))
                                }
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Początkowa Kwota ZUS (PLN)</label>
                            <Input
                                type="number"
                                value={profile.profile.initial_amount || 0}
                                onChange={(e) =>
                                    updatePersonalInfo("initial_amount", parseFloat(e.target.value))
                                }
                            />
                        </div>
                    </div>
                </div>

                {/* Contribution Periods */}
                <div className="bg-card border rounded-lg p-6 shadow-lg">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-semibold">Historia Zatrudnienia</h2>
                        <Button onClick={addContributionPeriod} variant="outline">
                            + Dodaj Okres
                        </Button>
                    </div>
                    <div className="space-y-4">
                        {profile.contribution_periods.map((period, index) => (
                            <div key={index} className="border-2 border-primary/20 rounded-lg p-4 bg-muted/30 relative">
                                <Button
                                    onClick={() => removeContributionPeriod(index)}
                                    variant="destructive"
                                    size="sm"
                                    className="absolute top-3 right-3 h-9 w-9 p-0 z-10 flex items-center justify-center bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                                    title="Usuń okres składkowy"
                                    aria-label="Usuń okres składkowy"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="16"
                                        height="16"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="M3 6h18" />
                                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                                        <line x1="10" x2="10" y1="11" y2="17" />
                                        <line x1="14" x2="14" y1="11" y2="17" />
                                    </svg>
                                </Button>
                                <div className="grid md:grid-cols-4 gap-4 pr-12">
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Rok Rozpoczęcia</label>
                                        <Input
                                            type="number"
                                            value={period.start_date}
                                            onChange={(e) =>
                                                updateContributionPeriod(index, {
                                                    start_date: parseInt(e.target.value),
                                                })
                                            }
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Rok Zakończenia</label>
                                        <Input
                                            type="number"
                                            value={period.end_date}
                                            onChange={(e) =>
                                                updateContributionPeriod(index, {
                                                    end_date: parseInt(e.target.value),
                                                })
                                            }
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Roczny Dochód (PLN)</label>
                                        <Input
                                            type="number"
                                            value={period.gross_income}
                                            onChange={(e) =>
                                                updateContributionPeriod(index, {
                                                    gross_income: parseFloat(e.target.value),
                                                })
                                            }
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Typ Zatrudnienia</label>
                                        <select
                                            value={period.employment_type}
                                            onChange={(e) =>
                                                updateContributionPeriod(index, {
                                                    employment_type: e.target.value,
                                                })
                                            }
                                            className="w-full px-3 py-2 border rounded-md bg-background"
                                        >
                                            <option value="employment_contract">Umowa o Pracę</option>
                                            <option value="self_employed">Samozatrudnienie</option>
                                            <option value="maternity_leave">Urlop Macierzyński</option>
                                            <option value="parental_leave">Urlop Rodzicielski</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="flex gap-4 mt-8">
                <Button onClick={onBack} variant="outline" className="flex-1">
                    ← Wstecz
                </Button>
                <Button onClick={onViewSummary} className="flex-1" size="lg">
                    Zobacz Podsumowanie Emerytury →
                </Button>
            </div>
        </div>
    );
}
