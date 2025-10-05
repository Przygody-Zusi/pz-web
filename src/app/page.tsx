"use client";

import { useState, useMemo } from "react";
import { RetirementProfile } from "@/lib/retirementTypes";
import InitialPromptStep from "@/components/retirement/InitialPromptStep";
import ProfileFormStep from "@/components/retirement/ProfileFormStep";
import SummaryStep from "@/components/retirement/SummaryStep";
import Image from "next/image";

// ZUS Trivia - ciekawostki o ZUS
const zusTrivia: string[] = [
    "ZUS (Zakład Ubezpieczeń Społecznych) został założony w 1934 roku podczas II Rzeczypospolitej.",
    "ZUS to polska instytucja ubezpieczeń społecznych, zarządzająca emeryturami, rentami i ubezpieczeniem chorobowym.",
    "Instytucja obejmuje ponad 16 milionów ubezpieczonych w Polsce.",
    "ZUS prowadzi jeden z największych systemów emerytalnych w Europie Środkowo-Wschodniej.",
    "Każda zatrudniona osoba w Polsce musi być zarejestrowana w ZUS i opłacać miesięczne składki.",
    "Składki ZUS są dzielone między pracodawcę (około 19,5%) i pracownika (około 13,7%).",
    "Instytucja posiada ponad 400 oddziałów na terenie całej Polski.",
    "ZUS zarządza również polskim systemem elektronicznych zwolnień lekarskich (e-ZLA).",
    "Osoby samozatrudnione w Polsce również muszą płacić składki ZUS, co często stanowi znaczący koszt prowadzenia działalności.",
    "ZUS przetrwał zarówno II wojnę światową, jak i erę komunizmu, dostosowując się do różnych systemów politycznych.",
    "Wiek emerytalny w Polsce zarządzany przez ZUS został kontrowersyjnie obniżony w 2017 roku do 60 lat dla kobiet i 65 lat dla mężczyzn.",
    "ZUS przetwarza miliony wypłat emerytur każdego miesiąca, co czyni go jedną z największych instytucji finansowych w Polsce."
];

// Zusia avatar component
function ZusiaAvatar({ step }: { step: 1 | 2 | 3 }) {
    // Losuj ciekawostkę tylko raz przy każdej zmianie kroku
    const randomTrivia = useMemo(() => {
        return zusTrivia[Math.floor(Math.random() * zusTrivia.length)];
    }, [step]);

    const zusiaData = {
        1: {
            image: "/zusia/zusia_welcome.png",
            message: "Cześć! Jestem Zusia 👋 Pomogę Ci zaplanować Twoją emeryturę! Opisz swoją obecną sytuację i cele emerytalne. Nasza AI pomoże stworzyć spersonalizowany plan.",
            showTrivia: false,
        },
        2: {
            image: "/zusia/zusia_serious.png",
            message: "Sprawdź i dostosuj swoje dane, aby symulacja była jak najbardziej dokładna!",
            showTrivia: true,
        },
        3: {
            image: "/zusia/zusia_happy.png",
            message: "Świetnie! Oto Twoja prognoza emerytalna 🎉",
            showTrivia: true,
        },
    };

    const { image, message, showTrivia } = zusiaData[step];

    return (
        <div className="hidden lg:block fixed right-8 top-32 z-40 animate-fade-in">
            <div className="relative">
                {/* Speech bubble */}
                <div className="absolute -left-80 top-8 w-72 bg-white/95 backdrop-blur-sm border-2 border-accent/30 rounded-2xl p-4 shadow-xl">
                    <div className="relative">
                        <p className="text-sm text-foreground font-medium leading-relaxed mb-3">
                            {message}
                        </p>

                        {/* ZUS Trivia - wyświetlaj na krokach 2 i 3 */}
                        {showTrivia && (
                            <div className="mt-3 pt-3 border-t-2 border-accent/20">
                                <p className="text-xs text-primary/80 font-semibold mb-1">💡 Czy wiesz, że...</p>
                                <p className="text-xs text-foreground/70 leading-relaxed italic">
                                    {randomTrivia}
                                </p>
                            </div>
                        )}

                        {/* Arrow pointing to Zusia */}
                        <div className="absolute -right-8 top-1/2 -translate-y-1/2 w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-l-8 border-l-white/95" />
                    </div>
                </div>

                {/* Zusia character */}
                <div className="relative w-64 h-64 drop-shadow-2xl">
                    <Image
                        src={image}
                        alt="Zusia - Maskotka ZUS"
                        fill
                        className="object-contain"
                        priority
                    />
                </div>
            </div>
        </div>
    );
}

export default function RetirementPage() {
    const [step, setStep] = useState<1 | 2 | 3>(1);
    const [profile, setProfile] = useState<RetirementProfile | null>(null);

    const handlePromptSubmit = (generatedProfile: RetirementProfile) => {
        setProfile(generatedProfile);
        setStep(2);
    };

    const handleProfileUpdate = (updatedProfile: RetirementProfile) => {
        setProfile(updatedProfile);
    };

    const handleViewSummary = () => {
        setStep(3);
    };

    const handleEditProfile = () => {
        setStep(2);
    };

    const handleStartOver = () => {
        setProfile(null);
        setStep(1);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-muted/10 to-secondary/5">
            {/* Zusia Avatar - Maskotka */}
            <ZusiaAvatar step={step} />

            {/* Progress Indicator - Kolory ZUS */}
            <div className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b-2 border-primary/20 shadow-md">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between max-w-4xl mx-auto">
                        {[1, 2, 3].map((num) => (
                            <div key={num} className="flex items-center flex-1">
                                <button
                                    onClick={() => {
                                        // Allow going back to step 1 always
                                        if (num === 1) {
                                            setStep(1);
                                        }
                                        // Allow going to step 2 if profile exists
                                        else if (num === 2 && profile) {
                                            setStep(2);
                                        }
                                        // Allow going to step 3 if we're already at step 3
                                        else if (num === 3 && step === 3) {
                                            setStep(3);
                                        }
                                    }}
                                    disabled={num === 2 && !profile || num === 3 && step < 3}
                                    className={`flex items-center justify-center w-12 h-12 rounded-full font-bold transition-all shadow-md ${step >= num
                                        ? "bg-primary text-primary-foreground ring-4 ring-primary/20"
                                        : "bg-muted text-muted-foreground"
                                        } ${(num === 1 || (num === 2 && profile) || (num === 3 && step === 3))
                                            ? "cursor-pointer hover:scale-110 hover:ring-6 hover:ring-primary/30"
                                            : "cursor-not-allowed opacity-50"
                                        }`}
                                    aria-label={`Przejdź do kroku ${num}`}
                                >
                                    {num}
                                </button>
                                {num < 3 && (
                                    <div
                                        className={`flex-1 h-2 mx-3 rounded-full transition-all ${step > num ? "bg-primary" : "bg-muted"
                                            }`}
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between max-w-4xl mx-auto mt-3 text-sm">
                        <span className={`${step >= 1 ? "text-primary font-bold" : "text-muted-foreground"} transition-colors`}>
                            Opisz Cele
                        </span>
                        <span className={`${step >= 2 ? "text-primary font-bold" : "text-muted-foreground"} transition-colors`}>
                            Dostosuj Profil
                        </span>
                        <span className={`${step >= 3 ? "text-primary font-bold" : "text-muted-foreground"} transition-colors`}>
                            Zobacz Wyniki
                        </span>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 pt-32 pb-16">
                {step === 1 && <InitialPromptStep onSubmit={handlePromptSubmit} />}
                {step === 2 && profile && (
                    <ProfileFormStep
                        profile={profile}
                        onUpdate={handleProfileUpdate}
                        onViewSummary={handleViewSummary}
                        onBack={() => setStep(1)}
                    />
                )}
                {step === 3 && profile && (
                    <SummaryStep
                        profile={profile}
                        onEdit={handleEditProfile}
                        onStartOver={handleStartOver}
                    />
                )}
            </div>
        </div>
    );
}
