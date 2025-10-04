import { calculateContributedAmount } from './retirementCalculator';

describe('calculateContributedAmount (simple)', () => {
    it('returns 0 for empty contribution periods', () => {
        const profile = {
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
        expect(calculateContributedAmount(profile)).toEqual({ raw: 0, valorized: 0 });
    });

    it('calculates correct raw and valorized for multiple periods and types', () => {
        // Assume test data in zus_contribution_rates.json and year_zus_data.json:
        // employment_contract: 0.2, self_employed: 0.15
        // 2015: v_idx: 1.1, 2016: v_idx: 1.2
        const profile = {
            profile: {
                date_of_birth: 1980,
                gender: 'male',
                employment_start_date: 2000,
                actual_retirement_age: 65
            },
            retirement_goals: {
                initial_prompt: '',
                expected_retirement_age: 65,
                expected_life_status: 1.0
            },
            contribution_periods: [
                {
                    start_date: 2015,
                    end_date: 2016,
                    gross_income: 100000,
                    employment_type: 'employment_contract'
                },
                {
                    start_date: 2016,
                    end_date: 2017,
                    gross_income: 80000,
                    employment_type: 'self_employed'
                }
            ]
        };
        const raw_expected = 100000 * 0.1952 + 80000 * 0.1952;
        const valorized_expected = ((100000 * 0.1952 * 1.0537) + (80000 * 0.1952)) * 1.0637;

        expect(calculateContributedAmount(profile)).toEqual({ raw: raw_expected, valorized: valorized_expected });
    });
});
