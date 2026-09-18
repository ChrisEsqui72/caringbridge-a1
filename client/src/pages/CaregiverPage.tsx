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
                title="Who is helping coordinate things?"
                description="This information can help people know who to contact."
            />

            <div className="form-stack">
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

                <TextInput
                    label="Email"
                    value={data.caregiver.email}
                    onChange={(value) =>
                        updateCaregiver({
                            email: value
                        })
                    }
                    placeholder="sarah@example.com"
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
                />
            </div>
            <Button
                onClick={() =>
                    onBack()
                }
            >
                Back
            </Button>
            
            <Button
                onClick={() =>
                    onNext()
                }
            >
                Next
            </Button>
        </>
    );
}