import { PageHeader } from "../components/PageHeader";
import type { OnboardingData } from "../../../shared/types";
import { Button } from "../components/Button";

interface Props {
    data: OnboardingData,
    onBack: () => void;
    onNext: () => void;
}

export function ReviewPage({ 
    data,
    onBack,
    onNext
 }: Props) {
    const support = Object.entries(
        data.support
    ).filter(
        ([key, value]) =>
            key !== "other" && value === true
    );

    return (
        <>
            <PageHeader
                title="Here's what we've heard."
                description="Take a moment to make sure everything looks right before we create your drafts."
            />

            <section className="review-section">
                <h2>About {data.patient.name}</h2>

                <p>
                    {data.patient.description}
                </p>

                <dl>
                    <dt>Diagnosis</dt>
                    <dd>{data.patient.diagnosis}</dd>

                    <dt>Location</dt>
                    <dd>{data.patient.location}</dd>
                </dl>
            </section>

            <section className="review-section">
                <h2>What's next</h2>
                <p>{data.care.nextSteps}</p>
            </section>

            <section className="review-section">
                <h2>How people can help</h2>

                <div className="support-summary">
                    {support.map(([key]) => (
                        <span key={key}>
                            {key}
                        </span>
                    ))}
                </div>
            </section>

            <div className="mt-8 flex items-center justify-between px-4">
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
        </>
    );
}