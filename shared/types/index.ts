export type PageFor =
    | "myself"
    | "family"
    | "friend"
    | "someone_else";

export interface UpcomingEvent {
    type: string;
    date: string;
    description?: string;
}

export interface Patient {
    name: string;
    dateOfBirth: string;
    location: string;
    diagnosis: string;
    description: string;
}

export interface CareInformation {
    nextSteps: string;
    upcomingEvents: UpcomingEvent[];
}

export interface Caregiver {
    name: string;
    relationship: string;
    email: string;
    phone: string;
}

export interface SupportNeeds {
    meals: boolean;
    rides: boolean;
    childcare: boolean;
    petCare: boolean;
    householdHelp: boolean;
    visits: boolean;
    flowers: boolean;
    gifts: boolean;
    thoughtsPrayers: boolean;
    fundraising: boolean;
    phoneCalls: boolean;
    other: string;
}

export interface OnboardingData {
    pageFor: PageFor | null;
    patient: Patient;
    care: CareInformation;
    caregiver: Caregiver;
    support: SupportNeeds;
}

export type DraftTone =
    | "warm-personal"
    | "clear-informative"
    | "community-focused";

export interface Draft {
    id: string;
    tone: DraftTone;
    title: string;
    body: string;
    coveredTopics: string[];
}