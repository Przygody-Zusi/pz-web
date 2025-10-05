"use client";

import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { RetirementProfile } from "@/lib/retirementTypes";
import { getRetirementSummary, retireExtended, getInflatedAmount } from "@/lib/retirementCalculator";

interface SummaryStepProps {
    profile: RetirementProfile;
    onEdit: () => void;
    onStartOver: () => void;
}

export default function SummaryStep({ profile, onEdit, onStartOver }: SummaryStepProps) {
    const summary = useMemo(() => getRetirementSummary(profile), [profile]);
    const extendedData = useMemo(
        () => retireExtended(profile, summary.raw, summary.valorized),
        [profile, summary]
    );

    const currentYear = new Date().getFullYear();
    const retirementYear = profile.profile.date_of_birth + profile.profile.actual_retirement_age;
    const inflatedMonthlyRetirement = getInflatedAmount(summary.monthlyRetirement, retirementYear);

    return (
        <div className="max-w-6xl mx-auto animate-fade-in">
            {/* Hero Card */}
            <div className="bg-gradient-to-br from-primary/20 via-primary/10 to-background border-2 border-primary/20 rounded-2xl p-8 mb-8 text-center shadow-2xl">
                <h1 className="text-5xl font-bold mb-4">Your Retirement Plan</h1>
                <p className="text-xl text-muted-foreground mb-8">
                    Based on your profile, here's what you can expect
                </p>
                <div className="grid md:grid-cols-3 gap-6">
                    <div className="bg-card/80 backdrop-blur rounded-lg p-6 border">
                        <div className="text-4xl font-bold text-primary mb-2">
                            {inflatedMonthlyRetirement.toLocaleString("pl-PL", {
                                maximumFractionDigits: 0,
                            })} PLN
                        </div>
                        <div className="text-sm text-muted-foreground">Monthly Retirement (in {retirementYear})</div>
                        <div className="text-xs text-muted-foreground mt-1">
                            {summary.monthlyRetirement.toLocaleString("pl-PL", {
                                maximumFractionDigits: 0,
                            })} PLN in today's value
                        </div>
                    </div>
                    <div className="bg-card/80 backdrop-blur rounded-lg p-6 border">
                        <div className="text-4xl font-bold text-primary mb-2">
                            {(summary.replacementRate * 100).toFixed(1)}%
                        </div>
                        <div className="text-sm text-muted-foreground">Replacement Rate</div>
                    </div>
                    <div className="bg-card/80 backdrop-blur rounded-lg p-6 border">
                        <div className="text-4xl font-bold text-primary mb-2">
                            {retirementYear}
                        </div>
                        <div className="text-sm text-muted-foreground">Retirement Year</div>
                    </div>
                </div>
            </div>

            {/* Contribution Summary */}
            <div className="bg-card border rounded-lg p-6 mb-8 shadow-lg">
                <h2 className="text-2xl font-semibold mb-4">Your Contributions</h2>
                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <div className="text-sm text-muted-foreground mb-1">Total Contributed</div>
                        <div className="text-3xl font-bold">
                            {summary.raw.toLocaleString("pl-PL", { maximumFractionDigits: 0 })} PLN
                        </div>
                    </div>
                    <div>
                        <div className="text-sm text-muted-foreground mb-1">Valorized Amount</div>
                        <div className="text-3xl font-bold text-primary">
                            {summary.valorized.toLocaleString("pl-PL", { maximumFractionDigits: 0 })} PLN
                        </div>
                    </div>
                </div>
            </div>

            {/* Extended Retirement Scenarios */}
            <div className="bg-card border rounded-lg p-6 mb-8 shadow-lg">
                <h2 className="text-2xl font-semibold mb-4">What if You Work Longer?</h2>
                <p className="text-muted-foreground mb-4">
                    See how postponing retirement affects your monthly pension
                </p>
                <div className="grid md:grid-cols-3 gap-4">
                    {extendedData.slice(0, 15).filter((_, i) => i % 3 === 0).map((data) => {
                        const additionalYears = data.year - retirementYear;
                        const inflatedMonthly = getInflatedAmount(data.monthlyRetirement, data.year);
                        return (
                            <div key={data.year} className="bg-muted/50 rounded-lg p-4 border">
                                <div className="text-lg font-semibold mb-2">
                                    +{additionalYears} {additionalYears === 1 ? "year" : "years"}
                                </div>
                                <div className="text-2xl font-bold text-primary mb-1">
                                    {inflatedMonthly.toLocaleString("pl-PL", { maximumFractionDigits: 0 })} PLN
                                </div>
                                <div className="text-xs text-muted-foreground">monthly in {data.year}</div>
                                <div className="text-sm text-muted-foreground mt-2">
                                    {(data.replacementRate * 100).toFixed(1)}% replacement rate
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Comparison to Average */}
            <div className="bg-card border rounded-lg p-6 mb-8 shadow-lg">
                <h2 className="text-2xl font-semibold mb-4">How You Compare</h2>
                <div className="space-y-4">
                    <div>
                        <div className="flex justify-between mb-2">
                            <span className="text-sm">Your Retirement vs. Average Salary</span>
                            <span className="text-sm font-semibold">
                                {((inflatedMonthlyRetirement / summary.avgMonthlySalary) * 100).toFixed(1)}%
                            </span>
                        </div>
                        <div className="h-4 bg-muted rounded-full overflow-hidden">
                            <div
                                className="h-full bg-primary transition-all"
                                style={{
                                    width: `${Math.min((inflatedMonthlyRetirement / summary.avgMonthlySalary) * 100, 100)}%`,
                                }}
                            />
                        </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        Average monthly salary in {retirementYear}: {summary.avgMonthlySalary.toLocaleString("pl-PL")} PLN
                    </p>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
                <Button onClick={onEdit} variant="outline" className="flex-1" size="lg">
                    ← Edit Profile
                </Button>
                <Button onClick={onStartOver} variant="outline" className="flex-1" size="lg">
                    Start Over
                </Button>
            </div>
        </div>
    );
}
