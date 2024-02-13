

export interface WorkType {
    id: number;
    name: string;
    given_sum: number;
    total_sum: number;
    status: "NotStarted" | "InProcess" | "Completed"
}

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

}

export interface RestorationType {
    id: number;
    name: string;
    image: string | null;
    description: string;
    given_sum: number;
    total_sum: number;
    works?: WorkType[];
    donaters?: RestorationDonationType[]
}

export interface DonationType {
    work_id: number;
    restore_id: number;
    restore_name: string;
    work: string;
    given_sum: number;
    total_sum: number;
    percent: number;
}


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
}


export interface RegroupedDonation {
    restore_id: number;
    restore_name: string;
    worksDonations: DonationType[]
}