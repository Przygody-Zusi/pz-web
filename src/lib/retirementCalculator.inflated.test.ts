import { calculateContributedAmountInflated, getInflatedAmount, getDeflatedAmount } from './retirementCalculator';

import yearZusDataRaw from '../data/year_zus_data.json';
import { RetirementProfile } from './retirementTypes';


describe('calculateContributedAmountInflated', () => {
    const baseProfile: RetirementProfile = {
        profile: {
            date_of_birth: 2000,
            gender: 'male',
            employment_start_date: 2020,
            actual_retirement_age: 65,
        },
        retirement_goals: {
            initial_prompt: '',
            expected_retirement_age: 65,
            expected_life_status: 80,
        },
        contribution_periods: [
            {
                start_date: 2030,
                end_date: 2032,
                gross_income: 60000, // annual gross income in today's value
                employment_type: 'employment_contract',
            },
            {
                start_date: 2032,
                end_date: 2034,
                gross_income: 70000,
                employment_type: 'employment_contract',
            },
        ],
    };


    describe('getInflatedAmount', () => {
        it('should return the same amount if inflation is 1', () => {
            // Use a year where inflation is 1 (or not defined)
            const result = getInflatedAmount(1000, 2020);
            expect(result).toBe(1000);
        });
    });

    describe('getDeflatedAmount', () => {
        it('should return the same amount if inflation is 1', () => {
            // Use a year where inflation is 1 (or not defined)
            const result = getDeflatedAmount(1000, 2020);
            expect(result).toBe(1000);
        });

        it('should invert getInflatedAmount for a future year', () => {
            const base = 1234.56;
            const year = 2030;
            const inflated = getInflatedAmount(base, year);
            const deflated = getDeflatedAmount(inflated, year);
            expect(deflated).toBeCloseTo(base, 6);
        });

        it('should return inflatedAmount if inflationRate is 0 or undefined', () => {
            // Use a year that is not in yearZusDataRaw
            const result = getDeflatedAmount(1000, 1800);
            expect(result).toBe(1000);
        });
    });


    it('should apply accumulatedInflation for a future year', () => {
        const result = getInflatedAmount(1000, 2030);
        const expectedInflation = yearZusDataRaw['2026'].inflation * yearZusDataRaw['2027'].inflation * yearZusDataRaw['2028'].inflation * yearZusDataRaw['2029'].inflation * yearZusDataRaw['2030'].inflation;
        expect(result).toBeCloseTo(1000 * expectedInflation, 2);
    });


    it('should calculate correct raw and valorized amounts for baseProfile', () => {

        const salaryIncrease2030 = yearZusDataRaw['2026'].salary_increase * yearZusDataRaw['2027'].salary_increase * yearZusDataRaw['2028'].salary_increase * yearZusDataRaw['2029'].salary_increase * yearZusDataRaw['2030'].salary_increase;
        const salaryIncrease2031 = salaryIncrease2030 * yearZusDataRaw['2031'].salary_increase;
        const salaryIncrease2032 = salaryIncrease2031 * yearZusDataRaw['2032'].salary_increase;
        const salaryIncrease2033 = salaryIncrease2032 * yearZusDataRaw['2033'].salary_increase;

        const rawExpected = (60000 * 0.1952 * salaryIncrease2030) + (60000 * 0.1952 * salaryIncrease2031) + (70000 * 0.1952 * salaryIncrease2032) + (70000 * 0.1952 * salaryIncrease2033);
        const result = calculateContributedAmountInflated(baseProfile);
        expect(result.raw).toBeCloseTo(rawExpected, 0);
    });

    it('should handle empty contribution periods', () => {
        const profile = { ...baseProfile, contribution_periods: [] };
        const result = calculateContributedAmountInflated(profile);
        expect(result.raw).toBe(0);
        expect(result.valorized).toBe(0);
    });

    it('should not throw for years outside data range', () => {
        const profile = {
            ...baseProfile,
            contribution_periods: [
                { start_date: 2120, end_date: 2130, gross_income: 100000, employment_type: 'employment_contract' },
            ],
        };
        expect(() => calculateContributedAmountInflated(profile)).not.toThrow();
    });
});
