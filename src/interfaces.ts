
export interface WorkType {
    id: number;
    name: string;
    given_sum: number;
    total_sum: number;
    status: "NotStarted" | "InProcess" | "Completed"
};

export interface RestorationDonationType {
    id: number;
    name: string;
    works: {
        worl_id: number;
        work: string;
        given_sum: number;
        total_sum: number;
        percent: number;
    }[]
    given_sum: number;
    total_sum: number;
    percent: number;
};

// For detailed restoration view:
export interface RestorationType {
    id: number;
    name: string;
    image: string | null;
    description: string;
    given_sum: number;
    total_sum: number;
    status: string;
    works?: WorkType[];
    donaters?: RestorationDonationType[]
};



export interface DonationType {
    work_id: number;
    restore_id: number;
    restore_name: string;
    work: string;
    given_sum: number;
    total_sum: number;
    percent: number;
    restore_bank?: string; // Used in payments, not in restorations (only for parsing data)
};

// Fore detailed Payment:
export interface PaymentType {
    id: number;
    user: number;
    manager: number;

    code: string;
    given_sum: number;

    status: string;
    date_open: string;
    date_close: string;
    date_pay: string;

    donations: DonationType[] | number[];
};


// To display payment in Basket better:
export interface RegroupedDonation {
    restore_id: number;
    restore_name: string;
    restore_bank: string;
    worksDonations: DonationType[]
};


// To connect Works and Restoration API:
export interface StoredRestorationWorkType  extends Omit<WorkType, 'given_sum'> {
    description: string;
    restore?: number;
}

export interface StoredRestorationType extends Omit<RestorationType,
    'given_sum' | 'total_sum' | 'donaters' | 'works'> {
    works: StoredRestorationWorkType[];
}