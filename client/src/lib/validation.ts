import type { OnboardingData } from "../../../shared/types";

export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Loose on purpose: people type phone numbers many ways, so this only
// checks that there are enough digits to be a real number.
const MIN_PHONE_DIGITS = 7;
const MAX_PHONE_DIGITS = 15;

export type FieldErrors<Field extends string> = Partial<Record<Field, string>>;

export type PatientField = "name" | "diagnosis" | "description";

/**
 * The fields the draft prompt can't do without: who the update is about,
 * why they're in care, and what's happening.
 */
export function validatePatient(
    patient: OnboardingData["patient"]
): FieldErrors<PatientField> {
    const errors: FieldErrors<PatientField> = {};

    if (!patient.name.trim()) {
        errors.name = "Enter the patient's name.";
    }

    if (!patient.diagnosis.trim()) {
        errors.diagnosis = "Enter a diagnosis or reason for care.";
    }

    if (!patient.description.trim()) {
        errors.description =
            "Tell us a little about what's happening, even a sentence or two.";
    }

    return errors;
}

export type CaregiverField = "name" | "email" | "phone" | "contact";

export const hasCaregiver = (
    caregiver: OnboardingData["caregiver"]
): boolean =>
    [
        caregiver.name,
        caregiver.relationship,
        caregiver.email,
        caregiver.phone
    ].some((value) => value.trim() !== "");

const phoneDigits = (phone: string) => phone.replace(/\D/g, "").length;

/**
 * A caregiver is optional, but once one is started the update needs a
 * name to point people to and a way to reach them.
 */
export function validateCaregiver(
    caregiver: OnboardingData["caregiver"]
): FieldErrors<CaregiverField> {
    const errors: FieldErrors<CaregiverField> = {};

    if (!hasCaregiver(caregiver)) {
        return errors;
    }

    const email = caregiver.email.trim();
    const phone = caregiver.phone.trim();

    if (!caregiver.name.trim()) {
        errors.name = "Enter the caregiver's name.";
    }

    if (!email && !phone) {
        errors.contact = "Add an email or a phone number.";
    }

    if (email && !EMAIL_PATTERN.test(email)) {
        errors.email = "Enter an email like name@example.com.";
    }

    const digits = phoneDigits(phone);

    if (phone && (digits < MIN_PHONE_DIGITS || digits > MAX_PHONE_DIGITS)) {
        errors.phone = "Enter a full phone number.";
    }

    return errors;
}
