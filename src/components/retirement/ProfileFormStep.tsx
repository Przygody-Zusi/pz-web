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

    const updatePersonalInfo = (field: string, value: any) => {
        updateProfile({
            profile: { ...profile.profile, [field]: value },
        });
    };

    const updateRetirementGoals = (field: string, value: any) => {
        updateProfile({
            retirement_goals: { ...profile.retirement_goals, [field]: value },
        });
    };

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

    const updateContributionPeriod = (index: number, updates: any) => {
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
                <h1 className="text-4xl font-bold mb-4">Adjust Your Profile</h1>
                <p className="text-muted-foreground text-lg">
                    Fine-tune the details to get the most accurate retirement projection
                </p>
            </div>

            <div className="grid gap-6">
                {/* Personal Information */}
                <div className="bg-card border rounded-lg p-6 shadow-lg">
                    <h2 className="text-2xl font-semibold mb-4">Personal Information</h2>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">Birth Year</label>
                            <Input
                                type="number"
                                value={profile.profile.date_of_birth}
                                onChange={(e) => updatePersonalInfo("date_of_birth", parseInt(e.target.value))}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Gender</label>
                            <select
                                value={profile.profile.gender}
                                onChange={(e) => updatePersonalInfo("gender", e.target.value)}
                                className="w-full px-3 py-2 border rounded-md bg-background"
                            >
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Employment Start Year</label>
                            <Input
                                type="number"
                                value={profile.profile.employment_start_date}
                                onChange={(e) =>
                                    updatePersonalInfo("employment_start_date", parseInt(e.target.value))
                                }
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Planned Retirement Age</label>
                            <Input
                                type="number"
                                value={profile.profile.actual_retirement_age}
                                onChange={(e) =>
                                    updatePersonalInfo("actual_retirement_age", parseInt(e.target.value))
                                }
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Initial ZUS Amount (PLN)</label>
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
                        <h2 className="text-2xl font-semibold">Employment History</h2>
                        <Button onClick={addContributionPeriod} variant="outline">
                            + Add Period
                        </Button>
                    </div>
                    <div className="space-y-4">
                        {profile.contribution_periods.map((period, index) => (
                            <div key={index} className="border rounded-lg p-4 bg-muted/30">
                                <div className="grid md:grid-cols-4 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Start Year</label>
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
                                        <label className="block text-sm font-medium mb-2">End Year</label>
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
                                        <label className="block text-sm font-medium mb-2">Annual Income (PLN)</label>
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
                                        <label className="block text-sm font-medium mb-2">Employment Type</label>
                                        <select
                                            value={period.employment_type}
                                            onChange={(e) =>
                                                updateContributionPeriod(index, {
                                                    employment_type: e.target.value,
                                                })
                                            }
                                            className="w-full px-3 py-2 border rounded-md bg-background"
                                        >
                                            <option value="employment_contract">Employment Contract</option>
                                            <option value="self_employed">Self Employed</option>
                                            <option value="maternity_leave">Maternity Leave</option>
                                            <option value="parental_leave">Parental Leave</option>
                                        </select>
                                    </div>
                                </div>
                                <Button
                                    onClick={() => removeContributionPeriod(index)}
                                    variant="destructive"
                                    size="sm"
                                    className="mt-2"
                                >
                                    Remove Period
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="flex gap-4 mt-8">
                <Button onClick={onBack} variant="outline" className="flex-1">
                    ← Back
                </Button>
                <Button onClick={onViewSummary} className="flex-1" size="lg">
                    View Retirement Summary →
                </Button>
            </div>
        </div>
    );
}
