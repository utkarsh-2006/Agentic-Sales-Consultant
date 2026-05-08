import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Lead {
    monthlyBudget: string;
    name: string;
    businessName: string;
    email: string;
    message: string;
    timestamp: Time;
    phone: string;
}
export type Time = bigint;
export interface backendInterface {
    getAllLeads(): Promise<Array<Lead>>;
    getSubmissionCount(): Promise<bigint>;
    submitLead(lead: Lead): Promise<void>;
}
