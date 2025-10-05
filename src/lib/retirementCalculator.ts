import {
    ContributionPeriod,
    RetirementProfile,
    YearZusDataEntry,
    YearZusData
} from './retirementTypes';
import zusContributionRates from '../data/zus_contribution_rates.json';
import yearZusDataRaw from '../data/year_zus_data.json';

// Extends YearZusDataEntry with accumulated factors for type safety
interface YearZusDataEntryExtended extends YearZusDataEntry {
    accumulatedSalaryIncrease: number;
    accumulatedInflation: number;
}


/**
 * Precompute accumulated salaryIncrease and inflation rates for each year in year_zus_data.json, relative to the current year.
 */
const currentYear = new Date().getFullYear();
const yearZusData: Record<string, YearZusDataEntryExtended> = {};
{
    // Prepare sorted years as numbers
    const years = Object.keys(yearZusDataRaw).map(Number).sort((a, b) => a - b);
    const rawData: Record<string, YearZusDataEntry> = yearZusDataRaw as Record<string, YearZusDataEntry>;
    for (const year of years) {
        let accSalaryIncrease = 1;
        let accInflation = 1;
        if (year > currentYear) {
            // Accumulate from currentYear+1 up to and including year
            const factors = [];
            const inflations = [];
            for (let y = currentYear + 1; y <= year; y++) {
                const yData = rawData[y.toString()];
                if (yData) {
                    factors.push(yData.salary_increase || 1);
                    inflations.push(yData.inflation || 1);
                }
            }
            accSalaryIncrease = factors.reduce((acc, v) => acc * v, 1);
            accInflation = inflations.reduce((acc, v) => acc * v, 1);
        }
        yearZusData[year.toString()] = {
            ...rawData[year.toString()],
            accumulatedSalaryIncrease: accSalaryIncrease,
            accumulatedInflation: accInflation,
        };
    }
}

/**
 * Calculates the total contributed amount (raw and valorized) for a given profile, adjusting gross_income for salaryIncrease to present value.
 * @param profile RetirementProfile
 * @returns { raw: number, valorized: number }
 */
export function calculateContributedAmountInflated(profile: RetirementProfile): { raw: number, valorized: number } {
    const initialAmount = profile.profile.initial_amount || 0;
    let raw = initialAmount;
    let valorized = initialAmount;
    const retirementYear = profile.profile.date_of_birth + profile.profile.actual_retirement_age;
    for (const period of profile.contribution_periods) {
        const periodEnd = Math.min(period.end_date, retirementYear);
        for (let year = period.start_date; year < periodEnd; year++) {
            const yearData = getYearData(year);
            const salaryIncreaseFactor = yearData.accumulatedSalaryIncrease || 1;
            const adjustedGrossIncome = period.gross_income * salaryIncreaseFactor;
            const yearlyContribution = calculateYearlyContribution(period.employment_type, adjustedGrossIncome, yearData);
            const valorization = yearData['v_idx'] || 1.0;
            raw += yearlyContribution;
            valorized = (valorized + yearlyContribution) * valorization;
        }
    }
    return { raw, valorized };
}


/**
 * Retrieves the YearZusDataEntry for a given year.
 * Falls back to the last available year if the requested year is not found.
 * @param year number
 * @returns YearZusDataEntry
 */
function getYearData(year: number): YearZusDataEntryExtended {
    // If year exists, return it
    if (yearZusData[year.toString()]) {
        return yearZusData[year.toString()];
    }

    // Find the last available year in the data
    const years = Object.keys(yearZusData).map(Number).sort((a, b) => a - b);
    const lastYear = years[years.length - 1];

    // If requested year is beyond our data, return the last year's data
    if (year > lastYear) {
        return yearZusData[lastYear.toString()];
    }

    // If requested year is before our data, return the first year's data
    const firstYear = years[0];
    return yearZusData[firstYear.toString()];
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



/**
 * Returns a summary of retirement calculation results for a given profile.
 * Includes: raw, valorized, monthlyRetirement, replacementRate, avgMonthlySalary (on retirement year)
 */
export function getRetirementSummary(profile: RetirementProfile) {
    // Use the existing function for valorized (compounded) amount
    const { raw, valorized } = calculateContributedAmountInflated(profile);
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
    const salaryIncrease = lastPeriod ? (yearZusData[retirementYear.toString()]?.accumulatedSalaryIncrease || 1) : 1;
    const lastSalary = lastPeriod ? lastPeriod.gross_income * salaryIncrease / 12 : 0;
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

export function getInflatedAmount(amount: number, toYear: number): number {
    const inflationRate = yearZusData[toYear]?.accumulatedInflation;
    return amount * (inflationRate || 1);
}

/**
 * Returns the original (deflated) amount from a future inflated value, using accumulatedInflation for the given year.
 * @param inflatedAmount The amount in future (inflated) value
 * @param toYear The year to deflate to present value
 * @returns The deflated (present value) amount
 */
export function getDeflatedAmount(inflatedAmount: number, fromYear: number): number {
    const inflationRate = yearZusData[fromYear]?.accumulatedInflation;
    if (!inflationRate || inflationRate === 0) return inflatedAmount;
    return inflatedAmount / inflationRate;
}

/**
 * Simulates postponing retirement for up to 15 years, extending the last employment period,
 * and returns an array of raw and valorized amounts for each year.
 * @param profile RetirementProfile
 * @param raw number (initial raw amount)
 * @param valorized number (initial valorized amount)
 * @returns Array<{ year: number, raw: number, valorized: number }>
 */
export function retireExtended(profile: RetirementProfile, initialRaw: number, initialValorized: number): Array<{ year: number, raw: number, valorized: number }> {
    const results = [];
    const lastPeriod = profile.contribution_periods.length > 0 ? profile.contribution_periods[profile.contribution_periods.length - 1] : null;
    if (!lastPeriod) return [];

    let raw = initialRaw;
    let valorized = initialValorized;

    const dob = profile.profile.date_of_birth;
    const startRetirementAge = profile.profile.actual_retirement_age;
    const retirementYear = dob + startRetirementAge;

    for (let year = retirementYear, i = 0; i < 15; year++, i++) {
        const yearData = getYearData(year);
        const salaryIncreaseFactor = yearData.accumulatedSalaryIncrease || 1;
        const adjustedGrossIncome = lastPeriod.gross_income * salaryIncreaseFactor;
        const yearlyContribution = calculateYearlyContribution(lastPeriod.employment_type, adjustedGrossIncome, yearData);
        const valorization = yearData['v_idx'] || 1.0;
        raw += yearlyContribution;
        valorized = (valorized + yearlyContribution) * valorization;

        // Calculate monthlyRetirement, replacementRate, avgMonthlySalary
        const expectedMonths60 = yearData['e_60'] || 240;
        const retirementAge = startRetirementAge + i + 1;
        const expectedMonths = expectedMonths60 - (retirementAge - 60) * 12;
        const monthlyRetirement = expectedMonths > 0 ? valorized / expectedMonths : 0;
        const salaryIncrease = lastPeriod ? (yearZusData[year.toString()]?.accumulatedSalaryIncrease || 1) : 1;
        const lastSalary = lastPeriod.gross_income * salaryIncrease / 12;
        const replacementRate = lastSalary > 0 ? monthlyRetirement / lastSalary : 0;
        const avgMonthlySalary = yearData.avg_salary || 0;

        results.push({
            year,
            raw,
            valorized,
            monthlyRetirement,
            replacementRate,
            avgMonthlySalary
        });
    }
    return results;
}