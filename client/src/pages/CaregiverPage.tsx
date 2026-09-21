import { PageHeader } from "../components/PageHeader";
import { TextInput } from "../components/TextInput";
import type { OnboardingData } from "../../../shared/types";
import { Button } from "../components/Button";

interface Props {
    data: OnboardingData;
    updateCaregiver: (
        values: Partial<OnboardingData["caregiver"]>
    ) => void;
    onBack: () => void;
    onNext: () => void;
}

export function CaregiverPage({
    data,
    updateCaregiver,
    onBack,
    onNext
}: Props) {
    return (
        <>
            <PageHeader
                eyebrow="Your care team"
                title="Who is helping coordinate things?"
                description="This information can help people know who to contact."
            />

            <div className="mx-auto mt-8 w-full max-w-3xl">
                <div className="overflow-hidden rounded-2xl border border-[var(--cb-border)] bg-[var(--cb-surface)] shadow-sm">
                    {/* Section header */}
                    <div className="border-b border-[var(--cb-border)] bg-[var(--cb-brand-50)] px-6 py-5 sm:px-8">
                        <h2 className="text-base font-semibold text-[var(--cb-text)]">
                            Caregiver information
                        </h2>

                        <p className="mt-1 text-sm leading-6 text-[var(--cb-text-muted)]">
                            Add the person who can help coordinate
                            updates, questions, or support.
                        </p>
                    </div>

                    {/* Form */}
                    <div className="px-6 py-7 sm:px-8 sm:py-8">
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                <TextInput
                                    label="Name"
                                    value={data.caregiver.name}
                                    onChange={(value) =>
                                        updateCaregiver({
                                            name: value
                                        })
                                    }
                                    placeholder="Sarah"
                                />

                                <TextInput
                                    label="Relationship"
                                    value={data.caregiver.relationship}
                                    onChange={(value) =>
                                        updateCaregiver({
                                            relationship: value
                                        })
                                    }
                                    placeholder="Daughter"
                                />
                            </div>

                            <div className="border-t border-[var(--cb-border)] pt-6">
                                <h3 className="text-sm font-semibold text-[var(--cb-text)]">
                                    Contact information
                                </h3>

                                <p className="mt-1 mb-4 text-sm leading-6 text-[var(--cb-text-muted)]">
                                    How should people get in touch?
                                </p>

                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                    <TextInput
                                        label="Email"
                                        value={data.caregiver.email}
                                        onChange={(value) =>
                                            updateCaregiver({
                                                email: value
                                            })
                                        }
                                        placeholder="sarah@example.com"
                                        type="email"
                                    />

                                    <TextInput
                                        label="Phone"
                                        value={data.caregiver.phone}
                                        onChange={(value) =>
                                            updateCaregiver({
                                                phone: value
                                            })
                                        }
                                        placeholder="(555) 555-5555"
                                        type="tel"
                                    />
                                </div>
                            </div>
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