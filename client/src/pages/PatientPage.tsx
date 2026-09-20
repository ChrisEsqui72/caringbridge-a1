import { PageHeader } from "../components/PageHeader";
import { TextInput } from "../components/TextInput";
import { TextArea } from "../components/TextArea";
import type { OnboardingData } from "../../../shared/types";
import { Button } from "../components/Button";

interface Props {
    data: OnboardingData;
    updatePatient: (
        values: Partial<OnboardingData["patient"]>
    ) => void;
    onBack: () => void;
    onNext: () => void;
}

export function PatientPage({
    data,
    updatePatient,
    onNext,
    onBack
}: Props) {
    return (
        <>
            <PageHeader
                eyebrow="About the patient"
                title={`Tell us about ${data.patient.name || "the patient"}.`}
                description="You don't need to find the perfect words. Just tell us what's happening."
            />

            <div className="mx-auto mt-8 w-full max-w-3xl">
                <div className="overflow-hidden rounded-2xl border border-[var(--cb-border)] bg-[var(--cb-bg)] shadow-sm">
                    {/* Form introduction */}
                    <div className="border-b border-[var(--cb-border)] bg-[var(--cb-green-50)] px-6 py-5 sm:px-8">
                        <h2 className="text-base font-semibold text-[var(--cb-text)]">
                            Patient information
                        </h2>

                        <p className="mt-1 text-sm leading-6 text-[var(--cb-text-muted)]">
                            These details help us create an update
                            that is personal and informative.
                        </p>
                    </div>

                    {/* Form fields */}
                    <div className="px-6 py-7 sm:px-8 sm:py-8">
                        <div className="space-y-6">
                            <TextInput
                                label="Name"
                                value={data.patient.name}
                                onChange={(value) =>
                                    updatePatient({
                                        name: value
                                    })
                                }
                                placeholder="John"
                                required
                            />

                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                <TextInput
                                    label="Date of birth"
                                    value={data.patient.dateOfBirth}
                                    onChange={(value) =>
                                        updatePatient({
                                            dateOfBirth: value
                                        })
                                    }
                                    type="date"
                                />

                                <TextInput
                                    label="Location"
                                    value={data.patient.location}
                                    onChange={(value) =>
                                        updatePatient({
                                            location: value
                                        })
                                    }
                                    placeholder="Denver, Colorado"
                                />
                            </div>

                            <TextInput
                                label="Diagnosis or reason for care"
                                value={data.patient.diagnosis}
                                onChange={(value) =>
                                    updatePatient({
                                        diagnosis: value
                                    })
                                }
                                placeholder="Lymphoma"
                                required
                            />
                        </div>

                        {/* Story section */}
                        <div className="mt-8 border-t border-[var(--cb-border)] pt-7">
                            <div className="mb-4">
                                <h2 className="text-base font-semibold text-[var(--cb-text)]">
                                    What's happening?
                                </h2>

                                <p className="mt-1 text-sm leading-6 text-[var(--cb-text-muted)]">
                                    Share whatever feels important.
                                    It doesn't need to be polished.
                                </p>
                            </div>

                            <TextArea
                                label="Tell us in your own words"
                                value={data.patient.description}
                                onChange={(value) =>
                                    updatePatient({
                                        description: value
                                    })
                                }
                                placeholder="For example: John was diagnosed with lymphoma last week. He's starting treatment soon, and we're taking things one day at a time..."
                                rows={6}
                                required
                            />

                            <p className="mt-2 text-xs leading-5 text-[var(--cb-text-muted)]">
                                We'll use this information to help
                                create your first update.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <div className="mt-8 flex items-center justify-between px-2 sm:px-4">
                    <Button
                        variant="secondary"
                        onClick={onBack}
                    >
                        ← Back
                    </Button>

                    <Button onClick={onNext}>
                        Continue →
                    </Button>
                </div>
            </div>
        </>
    );
}