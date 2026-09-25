import { CheckboxCard } from "../components/CheckboxCard";
import { PageHeader } from "../components/PageHeader";
import { supportOptions } from "../data/supportOptions";
import type { OnboardingData } from "../../../shared/types";
import { Button } from "../components/Button";

interface Props {
    data: OnboardingData;
    updateSupport: (
        key: keyof OnboardingData["support"],
        value: boolean
    ) => void;
    onBack: () => void;
    onNext: () => void;
}

export function SupportPage({
    data,
    updateSupport,
    onBack,
    onNext
}: Props) {
    return (
        <>
            <PageHeader
                title="How can people help?"
                description="Select anything that would make things easier for the patient or caregiver."
            />

            <div className="cb-support-grid">
                {supportOptions.map((option) => (
                    <CheckboxCard
                        key={option.key}
                        title={option.title}
                        description={option.description}
                        icon={option.icon}
                        checked={
                            data.support[
                                option.key
                            ]
                        }
                        onChange={(checked) =>
                            updateSupport(
                                option.key,
                                checked
                            )
                        }
                    />
                ))}
            </div>

            <div className="mt-5 flex items-center justify-between px-4">
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