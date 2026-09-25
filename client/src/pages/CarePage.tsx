import { PageHeader } from "../components/PageHeader";
import { TextArea } from "../components/TextArea";
import type { OnboardingData } from "../../../shared/types";
import { Button } from "../components/Button";

interface Props {
    data: OnboardingData;
    updateCare: (
        values: Partial<OnboardingData["care"]>
    ) => void;
    onBack: () => void;
    onNext: () => void;
}

export function CarePage({
    data,
    updateCare,
    onBack,
    onNext
}: Props) {
    return (
        <>
            <PageHeader
                eyebrow="What's next"
                title="What happens next?"
                description="Tell us about upcoming treatment, appointments, or other important steps."
            />

            <div className="mx-auto mt-5 w-full max-w-3xl">
                <div className="overflow-hidden rounded-2xl border border-[var(--cb-border)] bg-[var(--cb-surface)] shadow-sm">
                    {/* Section header */}
                    <div className="border-b border-[var(--cb-border)] bg-[var(--cb-brand-50)] px-6 py-3 sm:px-8">
                        <h2 className="text-base font-semibold text-[var(--cb-text)]">
                            Upcoming care
                        </h2>

                        <p className="mt-1 text-sm leading-6 text-[var(--cb-text-muted)]">
                            Share what the patient and their loved ones
                            can expect next.
                        </p>
                    </div>

                    {/* Form */}
                    <div className="px-6 py-5 sm:px-8">
                        <TextArea
                            label="What happens next?"
                            value={data.care.nextSteps}
                            onChange={(value) =>
                                updateCare({
                                    nextSteps: value
                                })
                            }
                            placeholder="For example: Chemotherapy will begin next month, followed by weekly appointments with the care team..."
                            rows={5}
                        />

                        <p className="mt-2 text-xs leading-5 text-[var(--cb-text-muted)]">
                            Treatment, appointments, milestones, or
                            anything else people should know about.
                        </p>
                    </div>
                </div>

                {/* Navigation */}
                <div className="mt-5 flex items-center justify-between px-2 sm:px-4">
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