import { calculateContributedAmountInflated, getRetirementSummary } from './retirementCalculator';
import { RetirementProfile } from './retirementTypes';


describe('getRetirementSummary', () => {
    it('returns all summary fields for a simple case', () => {
        // employment_contract: 0.2, 2015: v_idx: 1.1, e_60: 250, avg_salary: 4000
        // 2015: 100000 * 0.2 = 20000, valorized: (0+20000)*1.1 = 22000
        // monthly = 22000 / 250 = 88
        // replacementRate = 88 / 4000 = 0.022
        const profile: RetirementProfile = {
            profile: {
                date_of_birth: 2000,
                gender: 'male',
                employment_start_date: 2020,
                actual_retirement_age: 65
            },
            retirement_goals: {
                initial_prompt: '',
                expected_retirement_age: 65,
                expected_life_status: 1.0
            },
            contribution_periods: [
                {
                    start_date: 2021,
                    end_date: 2022,
                    gross_income: 0,
                    employment_type: 'non_working'
                },
                {
                    start_date: 2022,
                    end_date: 2065,
                    gross_income: 100000,
                    employment_type: 'employment_contract'
                }
            ]
        };
        const { raw, valorized } = calculateContributedAmountInflated(profile);

        const expectedMonths = 333.2 - (65 - 60) * 12;
        const expectedMonthly = valorized / expectedMonths;
        const replacementRate = expectedMonthly / (100000 / 12);


        const summary = getRetirementSummary(profile);

        console.log(`Expected Raw: ${raw.toFixed(2)}, Expected Valorized: ${valorized.toFixed(2)}, Expected Monthly: ${expectedMonthly.toFixed(2)}, Expected Replacement Rate: ${replacementRate.toFixed(3)}`);
        expect(summary.raw).toBe(raw);
        expect(summary.valorized).toBe(valorized);
        expect(summary.monthlyRetirement).toBeCloseTo(expectedMonthly, 2);
        expect(summary.avgMonthlySalary).toBe(53098.18);
        expect(summary.replacementRate).toBeCloseTo(replacementRate, 3);
    });

    it('returns zeros for empty periods', () => {
        const profile: RetirementProfile = {
            profile: {
                date_of_birth: 2000,
                gender: 'female',
                employment_start_date: 2020,
                actual_retirement_age: 60
            },
            retirement_goals: {
                initial_prompt: '',
                expected_retirement_age: 60,
                expected_life_status: 1.0
            },
            contribution_periods: []
        };
        const summary = getRetirementSummary(profile);
        expect(summary.raw).toBe(0);
        expect(summary.valorized).toBe(0);
        expect(summary.monthlyRetirement).toBe(0);
        expect(summary.avgMonthlySalary).toBe(43499.92);
        expect(summary.replacementRate).toBe(0);
    });
});
