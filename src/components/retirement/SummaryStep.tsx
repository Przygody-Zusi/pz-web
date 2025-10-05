"use client";

import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { RetirementProfile } from "@/lib/retirementTypes";
import { getRetirementSummary, retireExtended, getInflatedAmount, getDeflatedAmount } from "@/lib/retirementCalculator";

interface SummaryStepProps {
    profile: RetirementProfile;
    onEdit: () => void;
    onStartOver: () => void;
}

// Pula szablonów ciekawostek
const FUN_FACT_TEMPLATES = [
    {
        title: "☕ Kawa na Emeryturze",
        calculate: (monthlyAmount: number) => {
            const coffeePrice = 15; // PLN za kawę
            const coffees = Math.floor(monthlyAmount / coffeePrice);
            return `Będziesz mógł kupić **${coffees.toLocaleString("pl-PL")} kaw** miesięcznie (w dzisiejszych cenach przy 15 PLN za kawę)`;
        }
    },
    {
        title: "🎬 Bilety do Kina",
        calculate: (monthlyAmount: number) => {
            const ticketPrice = 35; // PLN za bilet
            const tickets = Math.floor(monthlyAmount / ticketPrice);
            return `To wystarczy na **${tickets.toLocaleString("pl-PL")} biletów do kina** miesięcznie (w dzisiejszych cenach przy 35 PLN za bilet)`;
        }
    },
    {
        title: "🍕 Pizza Parties",
        calculate: (monthlyAmount: number) => {
            const pizzaPrice = 40; // PLN za pizzę
            const pizzas = Math.floor(monthlyAmount / pizzaPrice);
            return `Możesz zamówić **${pizzas.toLocaleString("pl-PL")} pizz** miesięcznie (w dzisiejszych cenach przy 40 PLN za pizzę)`;
        }
    },
    {
        title: "📚 Książki",
        calculate: (monthlyAmount: number) => {
            const bookPrice = 50; // PLN za książkę
            const books = Math.floor(monthlyAmount / bookPrice);
            return `Możesz kupić **${books.toLocaleString("pl-PL")} książek** miesięcznie (w dzisiejszych cenach przy 50 PLN za książkę)`;
        }
    },
    {
        title: "🚇 Bilety Miesięczne ZTM",
        calculate: (monthlyAmount: number) => {
            const monthlyTicket = 110; // PLN bilet miesięczny
            const tickets = Math.floor(monthlyAmount / monthlyTicket);
            return `To **${tickets.toLocaleString("pl-PL")} biletów miesięcznych** w komunikacji miejskiej (w dzisiejszych cenach przy 110 PLN za bilet)`;
        }
    },
    {
        title: "🎮 Gry na Steam",
        calculate: (monthlyAmount: number) => {
            const gamePrice = 150; // PLN za grę AAA
            const games = Math.floor(monthlyAmount / gamePrice);
            return `Możesz kupić **${games.toLocaleString("pl-PL")} gier AAA** miesięcznie (w dzisiejszych cenach przy 150 PLN za grę)`;
        }
    },
    {
        title: "🍔 Obiady w Restauracji",
        calculate: (monthlyAmount: number) => {
            const mealPrice = 45; // PLN za obiad
            const meals = Math.floor(monthlyAmount / mealPrice);
            return `To **${meals.toLocaleString("pl-PL")} obiadów w restauracji** miesięcznie (w dzisiejszych cenach przy 45 PLN za obiad)`;
        }
    },
    {
        title: "🏋️ Karnet na Siłownię",
        calculate: (monthlyAmount: number) => {
            const gymPrice = 150; // PLN za karnet
            const karnets = Math.floor(monthlyAmount / gymPrice);
            const months = karnets;
            return `Możesz opłacić **${months} ${months === 1 ? 'miesiąc' : months < 5 ? 'miesiące' : 'miesięcy'}** siłowni (w dzisiejszych cenach przy 150 PLN za karnet)`;
        }
    },
    {
        title: "🌍 Tankowania Samochodu",
        calculate: (monthlyAmount: number) => {
            const tankPrice = 300; // PLN za pełny bak
            const tanks = Math.floor(monthlyAmount / tankPrice);
            return `To **${tanks.toLocaleString("pl-PL")} pełnych tankowań** miesięcznie (w dzisiejszych cenach przy 300 PLN za bak)`;
        }
    },
    {
        title: "🎵 Subskrypcje Spotify",
        calculate: (monthlyAmount: number) => {
            const spotifyPrice = 20; // PLN za Spotify Premium
            const subscriptions = Math.floor(monthlyAmount / spotifyPrice);
            return `Możesz opłacić **${subscriptions.toLocaleString("pl-PL")} subskrypcji Spotify Premium** miesięcznie (w dzisiejszych cenach przy 20 PLN)`;
        }
    }
];

interface FunFactsProps {
    monthlyRetirement: number; // w dzisiejszej wartości
    retirementYear: number;
}

function FunFacts({ monthlyRetirement, retirementYear }: FunFactsProps) {
    // Losuj 3 unikalne ciekawostki
    const selectedFacts = useMemo(() => {
        const shuffled = [...FUN_FACT_TEMPLATES].sort(() => Math.random() - 0.5);
        return shuffled.slice(0, 3);
    }, []);

    return (
        <div className="bg-gradient-to-br from-highlight/10 via-background to-highlight/5 border-2 border-highlight/30 rounded-2xl p-8 mb-8 shadow-xl">
            <h2 className="text-3xl font-bold mb-2 text-center text-primary">💡 Ciekawostki</h2>
            <p className="text-center text-foreground/70 mb-6">
                Ile warta jest Twoja emerytura w dzisiejszych pieniądzach?
            </p>
            <div className="grid md:grid-cols-3 gap-6">
                {selectedFacts.map((fact, index) => (
                    <div
                        key={index}
                        className="bg-card backdrop-blur rounded-xl p-6 border-2 border-highlight/40 shadow-lg hover:shadow-xl hover:scale-105 transition-all"
                    >
                        <h3 className="text-xl font-bold mb-3 text-highlight">
                            {fact.title}
                        </h3>
                        <p
                            className="text-foreground/80 leading-relaxed"
                            dangerouslySetInnerHTML={{
                                __html: fact.calculate(monthlyRetirement).replace(/\*\*(.*?)\*\*/g, '<strong class="text-primary font-bold">$1</strong>')
                            }}
                        />
                    </div>
                ))}
            </div>
            <div className="mt-6 text-center">
                <p className="text-sm text-foreground/60">
                    💰 Wszystkie wartości przeliczone na dzisiejszą wartość pieniądza ({new Date().getFullYear()})
                </p>
            </div>
        </div>
    );
}

export default function SummaryStep({ profile, onEdit, onStartOver }: SummaryStepProps) {
    const summary = useMemo(() => getRetirementSummary(profile), [profile]);
    const extendedData = useMemo(
        () => retireExtended(profile, summary.raw, summary.valorized),
        [profile, summary]
    );

    const currentYear = new Date().getFullYear();
    const retirementYear = profile.profile.date_of_birth + profile.profile.actual_retirement_age;
    const deflatedMonthlyRetirement = getDeflatedAmount(summary.monthlyRetirement, retirementYear);

    return (
        <div className="max-w-6xl mx-auto animate-fade-in">
            {/* Hero Card - Kolory ZUS */}
            <div className="bg-gradient-to-br from-primary/10 via-background to-secondary/5 border-2 border-primary/30 rounded-2xl p-8 mb-8 text-center shadow-2xl">
                <h1 className="text-5xl font-bold mb-4 text-primary">Twój Plan Emerytalny</h1>
                <p className="text-xl text-foreground/70 mb-8">
                    Na podstawie Twojego profilu, oto czego możesz się spodziewać
                </p>
                <div className="grid md:grid-cols-3 gap-6">
                    <div className="bg-card backdrop-blur rounded-lg p-6 border-2 border-primary/20 shadow-lg">
                        <div className="text-4xl font-bold text-primary mb-2">
                            {summary.monthlyRetirement.toLocaleString("pl-PL", {
                                maximumFractionDigits: 0,
                            })} PLN
                        </div>
                        <div className="text-sm font-medium text-foreground/80">Miesięczna Emerytura (w {retirementYear})</div>
                        <div className="text-xs text-foreground/60 mt-1">
                            {deflatedMonthlyRetirement.toLocaleString("pl-PL", {
                                maximumFractionDigits: 0,
                            })} PLN w dzisiejszej wartości
                        </div>
                    </div>
                    <div className="bg-card backdrop-blur rounded-lg p-6 border-2 border-accent/20 shadow-lg">
                        <div className="text-4xl font-bold text-accent mb-2">
                            {(summary.replacementRate * 100).toFixed(1)}%
                        </div>
                        <div className="text-sm font-medium text-foreground/80">Stopa Zastąpienia</div>
                    </div>
                    <div className="bg-card backdrop-blur rounded-lg p-6 border-2 border-secondary/20 shadow-lg">
                        <div className="text-4xl font-bold text-secondary mb-2">
                            {retirementYear}
                        </div>
                        <div className="text-sm font-medium text-foreground/80">Rok Emerytury</div>
                    </div>
                </div>
            </div>

            {/* Contribution Summary */}
            <div className="bg-card border-2 border-primary/20 rounded-lg p-6 mb-8 shadow-lg">
                <h2 className="text-2xl font-semibold mb-4 text-primary">Twoje Składki</h2>
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-muted/30 rounded-lg p-4 border border-muted">
                        <div className="text-sm font-medium text-foreground/70 mb-1">Łącznie Wpłacono</div>
                        <div className="text-3xl font-bold text-foreground">
                            {summary.raw.toLocaleString("pl-PL", { maximumFractionDigits: 0 })} PLN
                        </div>
                    </div>
                    <div className="bg-accent/10 rounded-lg p-4 border border-accent/30">
                        <div className="text-sm font-medium text-foreground/70 mb-1">Kwota Zwaloryzowana</div>
                        <div className="text-3xl font-bold text-accent">
                            {summary.valorized.toLocaleString("pl-PL", { maximumFractionDigits: 0 })} PLN
                        </div>
                    </div>
                </div>
            </div>

            {/* Extended Retirement Scenarios */}
            <div className="bg-card border-2 border-secondary/20 rounded-lg p-6 mb-8 shadow-lg">
                <h2 className="text-2xl font-semibold mb-4 text-secondary">Co jeśli Będziesz Pracować Dłużej?</h2>
                <p className="text-foreground/70 mb-4">
                    Zobacz jak odroczenie emerytury wpłynie na Twoją miesięczną emeryturę
                </p>
                <div className="grid md:grid-cols-3 gap-4">
                    {extendedData.slice(0, 15).filter((_, i) => i % 3 === 0).map((data) => {
                        const additionalYears = data.year - retirementYear;
                        const deflatedMonthly = getDeflatedAmount(data.monthlyRetirement, data.year);
                        return (
                            <div key={data.year} className="bg-gradient-to-br from-highlight/10 to-highlight/5 rounded-lg p-4 border-2 border-highlight/30 shadow-md hover:shadow-lg transition-shadow">
                                <div className="text-lg font-semibold mb-2 text-primary">
                                    +{additionalYears} {additionalYears === 1 ? "rok" : additionalYears < 5 ? "lata" : "lat"}
                                </div>
                                <div className="text-2xl font-bold text-accent mb-1">
                                    {deflatedMonthly.toLocaleString("pl-PL", { maximumFractionDigits: 0 })} PLN
                                </div>
                                <div className="text-xs text-foreground/60">miesięcznie w {data.year}</div>
                                <div className="text-sm text-foreground/70 mt-2 font-medium">
                                    {(data.replacementRate * 100).toFixed(1)}% stopa zastąpienia
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Comparison to Average */}
            <div className="bg-card border-2 border-accent/20 rounded-lg p-6 mb-8 shadow-lg">
                <h2 className="text-2xl font-semibold mb-4 text-accent">Jak Się Prezentujesz</h2>
                <div className="space-y-4">
                    <div>
                        <div className="flex justify-between mb-2">
                            <span className="text-sm font-medium text-foreground">Twoja Emerytura vs. Średnia Krajowa</span>
                            <span className="text-sm font-bold text-primary">
                                {((deflatedMonthlyRetirement / summary.avgMonthlySalary) * 100).toFixed(1)}%
                            </span>
                        </div>
                        <div className="h-6 bg-muted/50 rounded-full overflow-hidden border-2 border-muted">
                            <div
                                className="h-full bg-gradient-to-r from-accent to-accent/80 transition-all duration-500 flex items-center justify-end pr-2"
                                style={{
                                    width: `${Math.min((deflatedMonthlyRetirement / summary.avgMonthlySalary) * 100, 100)}%`,
                                }}
                            >
                                <span className="text-xs font-bold text-white">
                                    {Math.min((deflatedMonthlyRetirement / summary.avgMonthlySalary) * 100, 100).toFixed(0)}%
                                </span>
                            </div>
                        </div>
                    </div>
                    <p className="text-sm text-foreground/70 font-medium">
                        Średnie miesięczne wynagrodzenie w {retirementYear}: <span className="font-bold text-primary">{summary.avgMonthlySalary.toLocaleString("pl-PL")} PLN</span>
                    </p>
                </div>
            </div>

            {/* Fun Facts - Ciekawostki */}
            <FunFacts
                monthlyRetirement={deflatedMonthlyRetirement}
                retirementYear={retirementYear}
            />

            {/* Action Buttons */}
            <div className="flex gap-4">
                <Button onClick={onEdit} variant="outline" className="flex-1" size="lg">
                    ← Edytuj Profil
                </Button>
                <Button onClick={onStartOver} variant="outline" className="flex-1" size="lg">
                    Zacznij Od Nowa
                </Button>
            </div>
        </div>
    );
}
