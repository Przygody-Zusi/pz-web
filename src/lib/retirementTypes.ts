// Basic interfaces for retirement calculations

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
        initial_amount?: number;
    };
    retirement_goals: {
        initial_prompt: string;
        expected_retirement_age: number;
        expected_life_status: number;
    };
    contribution_periods: ContributionPeriod[];
}

export interface YearZusDataEntry {
    inflation: number;
    salary_increase: number;
    avg_salary: number;
    v_idx: number; // valorization index
    e_60: number;  // expected lifetime in months for 60-year-old
}

export interface YearZusData {
    [year: string]: YearZusDataEntry;
}
