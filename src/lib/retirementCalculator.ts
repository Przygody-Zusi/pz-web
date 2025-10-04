import zusContributionRates from '../data/zus_contribution_rates.json';

/**
 * Calculates the total contributed amount (raw and valorized) for a given profile.
 * @param profile RetirementProfile
 * @returns { raw: number, valorized: number }
 */
export function calculateContributedAmount(profile: RetirementProfile): { raw: number, valorized: number } {
    let raw = 0;
    let valorized = 0;
    const retirementYear = profile.profile.date_of_birth + profile.profile.actual_retirement_age;
    for (const period of profile.contribution_periods) {
        const periodEnd = Math.min(period.end_date, retirementYear);
        for (let year = period.start_date; year < periodEnd; year++) {
            const yearData = getYearData(year);
            const valorization = yearData['v_idx'] || 1.0;
            const yearlyContribution = calculateYearlyContribution(period.employment_type, period.gross_income, yearData);
            raw += yearlyContribution;
            valorized = (valorized + yearlyContribution) * valorization;
            // console.log(`Year: ${year}, Type: ${period.employment_type}, Gross: ${period.gross_income}, Yearly Contribution: ${yearlyContribution.toFixed(2)}, Raw Total: ${raw.toFixed(2)}, Valorized Total: ${valorized.toFixed(2)}`);
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

/**
 * Returns the ZUS contribution amount for a given employment type, year, gross_income, and yearData.
 * For 'employment_contract' and 'maternity_leave': gross_income * 0.1952.
 * For 'self_employed' and 'parental_leave': avg_salary * 0.6 * 0.1952.
 * For others: gross_income * zusContributionRates[type].
 */
function calculateYearlyContribution(employment_type: string, gross_income: number, yearData: YearZusDataEntry): number {
    if (employment_type === 'employment_contract' || employment_type === 'maternity_leave') {
        return gross_income * 0.1952;
    }
    if (employment_type === 'self_employed' || employment_type === 'parental_leave') {
        if (yearData && yearData.avg_salary) {
            return yearData.avg_salary * 12 * 0.6 * 0.1952;
        }
        return getYearData(2100).avg_salary * 12 * 0.6 * 0.1952; // Fallback to a future year with data
    }
    // fallback to static rates if present
    const rate = (zusContributionRates as Record<string, number>)[employment_type] || 0;
    return gross_income * rate;
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

/**
 * Calculates the expected monthly retirement amount at the year of actual_retirement_age.
 * Uses compound valorized contributions and expected lifetime months for that year.
 * @param profile RetirementProfile
 * @returns number (monthly retirement amount)
 */
export function calculateMonthlyRetirementAmount(profile: RetirementProfile): number {
    // Use the existing function for valorized (compounded) amount
    const { valorized } = calculateContributedAmount(profile);
    // Determine retirement year
    const dob = profile.profile.date_of_birth;
    const retirementAge = profile.profile.actual_retirement_age;
    const retirementYear = dob + retirementAge;
    const retirementYearData = getYearData(retirementYear);
    const expectedMonths60 = retirementYearData['e_60'] || 240;
    const expectedMonths = expectedMonths60 - (retirementAge - 60) * 12
    return valorized / expectedMonths;
}

/**
 * Returns a summary of retirement calculation results for a given profile.
 * Includes: raw, valorized, monthlyRetirement, replacementRate, avgMonthlySalary (on retirement year)
 */
export function getRetirementSummary(profile: RetirementProfile) {
    // Use the existing function for valorized (compounded) amount
    const { raw, valorized } = calculateContributedAmount(profile);
    // Determine retirement year
    const dob = profile.profile.date_of_birth;
    const retirementAge = profile.profile.actual_retirement_age;
    const retirementYear = dob + retirementAge;
    const retirementYearData = getYearData(retirementYear);
    const expectedMonths60 = retirementYearData['e_60'] || 240;
    const expectedMonths = expectedMonths60 - (retirementAge - 60) * 12
    const monthlyRetirement = expectedMonths > 0 ? valorized / expectedMonths : 0;
    // Find the last period (by end_date, then by order)
    const lastPeriod = profile.contribution_periods.length > 0 ? profile.contribution_periods[profile.contribution_periods.length - 1] : null;
    const lastSalary = lastPeriod ? lastPeriod.gross_income / 12 : 0;
    const replacementRate = lastSalary > 0 ? monthlyRetirement / lastSalary : 0;
    const avgMonthlySalary = retirementYearData.avg_salary || 0;
    return {
        raw,
        valorized,
        monthlyRetirement,
        replacementRate,
        avgMonthlySalary
    };
}