import zusContributionRates from '../data/zus_contribution_rates.json';

/**
 * Calculates the total contributed amount (raw and valorized) for a given profile.
 * @param profile RetirementProfile
 * @returns { raw: number, valorized: number }
 */
export function calculateContributedAmount(profile: RetirementProfile): { raw: number, valorized: number } {
    let raw = 0;
    let valorized = 0;
    for (const period of profile.contribution_periods) {
        const rate = (zusContributionRates as Record<string, number>)[period.employment_type] || 0;
        for (let year = period.start_date; year < period.end_date; year++) {
            const yearData = getYearData(year);
            const valorization = yearData['v_idx'] || 1.0;
            const yearlyContribution = period.gross_income * rate;
            raw += yearlyContribution;
            valorized = (valorized + yearlyContribution) * valorization;
        }
    }
    return { raw, valorized };
}
import yearZusData from '../data/year_zus_data.json';

/**
 * Retrieves the YearZusDataEntry for a given year.
 * @param year number
 * @returns YearZusDataEntry
 */
function getYearData(year: number): YearZusDataEntry {
    return (yearZusData as YearZusData)[year.toString()];
}

export interface ContributionPeriod {
    start_date: number; // e.g. 2015
    end_date: number;   // e.g. 2018
    gross_income: number;
    employment_type: string;
}

export interface RetirementProfile {
    profile: {
        date_of_birth: number; // e.g. 2000
        gender: string;
        employment_start_date: number; // e.g. 2000
        actual_retirement_age: number;
    };
    retirement_goals: {
        initial_prompt: string;
        expected_retirement_age: number;
        expected_life_status: number;
    };
    contribution_periods: ContributionPeriod[];
}

export interface YearZusDataEntry {
    avg_salary: number;
    v_idx: number; // valorization index
    e_60: number;  // expected lifetime in months for 60-year-old
}

export interface YearZusData {
    [year: string]: YearZusDataEntry;
}
