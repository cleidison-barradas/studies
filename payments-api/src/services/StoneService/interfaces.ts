import { GenericObject } from "@mypharma/api-core";

export interface OrderRequest{
    
}

export interface StoreRequest{
    name: string,
    email?: string,
    description?: string,
    document: string,
    type: "individual" | "company",
    code?: string,
    default_bank_account: {
        holder_name: string,
        holder_type: "individual" | "company",
        holder_document: string,
        bank: string,
        branch_number: string,
        branch_check_digit: string,
        account_number: string,
        account_check_digit: string,
        type: "checking" | "savings",
        metadata?: GenericObject
    },
    transfer_settings: {
        transfer_enabled: boolean,
        transfer_interval: "Daily",
        transfer_day?: number
    },
    automatic_anticipation_settings?:
        {
        enabled?: boolean,
        type?: "full" | "1025",
        volume_percentage?: string,
        delay?: null
    },
    metadata?: GenericObject
}
