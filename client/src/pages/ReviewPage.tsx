import { PageHeader } from "../components/PageHeader";
import type { OnboardingData } from "../../../shared/types";
import { Button } from "../components/Button";

interface Props {
    data: OnboardingData;
    onBack: () => void;
    onNext: () => void;
}

export function ReviewPage({
    data,
    onBack,
    onNext
}: Props) {
    const support = Object.entries(data.support).filter(
        ([key, value]) =>
            key !== "other" && value === true
    );

    return (
        <>
            <PageHeader
                eyebrow="Almost there"
                title="Here's what we've heard."
                description="Take a moment to make sure everything looks right before we create your drafts."
            />

            <div className="mx-auto mt-8 w-full max-w-3xl space-y-5">
                {/* Patient summary */}
                <section className="overflow-hidden rounded-2xl border border-[var(--cb-border)] bg-[var(--cb-bg)] shadow-sm">
                    <div className="border-b border-[var(--cb-border)] bg-[var(--cb-green-50)] px-6 py-5 sm:px-8">
                        <h2 className="text-base font-semibold text-[var(--cb-text)]">
                            About {data.patient.name || "the patient"}
                        </h2>
                    </div>

                    <div className="px-6 py-6 sm:px-8">
                        <p className="text-sm leading-7 text-[var(--cb-text)]">
                            {data.patient.description ||
                                "No description provided."}
                        </p>

                        <dl className="mt-6 grid grid-cols-1 gap-5 border-t border-[var(--cb-border)] pt-6 sm:grid-cols-2">
                            <div>
                                <dt className="text-xs font-semibold uppercase tracking-wide text-[var(--cb-text-muted)]">
                                    Diagnosis
                                </dt>
                                <dd className="mt-1 text-sm font-medium text-[var(--cb-text)]">
                                    {data.patient.diagnosis ||
                                        "Not provided"}
                                </dd>
                            </div>

                            <div>
                                <dt className="text-xs font-semibold uppercase tracking-wide text-[var(--cb-text-muted)]">
                                    Location
                                </dt>
                                <dd className="mt-1 text-sm font-medium text-[var(--cb-text)]">
                                    {data.patient.location ||
                                        "Not provided"}
                                </dd>
                            </div>
                        </dl>
                    </div>
                </section>

                {/* Care summary */}
                <section className="overflow-hidden rounded-2xl border border-[var(--cb-border)] bg-[var(--cb-bg)] shadow-sm">
                    <div className="border-b border-[var(--cb-border)] bg-[var(--cb-green-50)] px-6 py-5 sm:px-8">
                        <h2 className="text-base font-semibold text-[var(--cb-text)]">
                            What's next
                        </h2>
                    </div>

                    <div className="px-6 py-6 sm:px-8">
                        <p className="text-sm leading-7 text-[var(--cb-text)]">
                            {data.care.nextSteps ||
                                "No upcoming steps provided."}
                        </p>
                    </div>
                </section>

                {/* Support summary */}
                <section className="overflow-hidden rounded-2xl border border-[var(--cb-border)] bg-[var(--cb-bg)] shadow-sm">
                    <div className="border-b border-[var(--cb-border)] bg-[var(--cb-green-50)] px-6 py-5 sm:px-8">
                        <h2 className="text-base font-semibold text-[var(--cb-text)]">
                            How people can help
                        </h2>

                        <p className="mt-1 text-sm leading-6 text-[var(--cb-text-muted)]">
                            The kinds of support you'd like people
                            to know about.
                        </p>
                    </div>

                    <div className="px-6 py-6 sm:px-8">
                        {support.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                                {support.map(([key]) => (
                                    <span
                                        key={key}
                                        className="rounded-full border border-[var(--cb-green-200)] bg-[var(--cb-green-50)] px-3 py-1.5 text-sm font-medium text-[var(--cb-green-700)]"
                                    >
                                        {key}
                                    </span>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-[var(--cb-text-muted)]">
                                No specific support needs selected.
                            </p>
                        )}
                    </div>
                </section>
            </div>

            <div className="mx-auto mt-8 flex w-full max-w-3xl items-center justify-between px-2 sm:px-4">
                <Button
                    variant="secondary"
                    onClick={onBack}
                >
                    ← Back
                </Button>

                <Button onClick={onNext}>
                    Create drafts →
                </Button>
            </div>
        </>
    );
}