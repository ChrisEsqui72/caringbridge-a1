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
                title="What's next?"
                description="Tell us about upcoming treatment, appointments, or other important steps."
            />

            <TextArea
                label="What happens next?"
                value={data.care.nextSteps}
                onChange={(value) =>
                    updateCare({
                        nextSteps: value
                    })
                }
                placeholder="Chemotherapy will begin next month..."
                rows={7}
            />
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