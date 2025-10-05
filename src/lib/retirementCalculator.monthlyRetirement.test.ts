import { calculateContributedAmount, calculateMonthlyRetirementAmount } from './retirementCalculator';
import { RetirementProfile } from './retirementTypes';

describe('calculateMonthlyRetirementAmount', () => {
    it('returns 0 for empty contribution periods', () => {
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
        expect(calculateMonthlyRetirementAmount(profile)).toBe(0);
    });

    it('calculates correct monthly amount for a simple case', () => {
        // employment_contract: 0.2, 2015: v_idx: 1.1, e_60: 250
        // 2015: 100000 * 0.2 = 20000, valorized: (0+20000)*1.1 = 22000
        // monthly = 22000 / 250 = 88
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
                    start_date: 2022,
                    end_date: 2065,
                    gross_income: 100000,
                    employment_type: 'employment_contract'
                }
            ]
        };
        const { raw, valorized } = calculateContributedAmount(profile);
        console.log(`Raw: ${raw}, Valorized: ${valorized}`);
        const expectedMonths = 333.2 - (65 - 60) * 12;
        const expectedMonthly = valorized / expectedMonths;
        expect(calculateMonthlyRetirementAmount(profile)).toBeCloseTo(expectedMonthly, 2);
    });

});