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
                title={`Tell us about ${data.patient.name || "the patient"}.`}
                description="You don't need to find the perfect words. Just tell us what's happening."
            />

            <div className="form-stack">
                <TextInput
                    label="Name"
                    value={data.patient.name}
                    onChange={(value) =>
                        updatePatient({ name: value })
                    }
                    placeholder="John"
                    required
                />

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

                <TextArea
                    label="What's happening?"
                    value={data.patient.description}
                    onChange={(value) =>
                        updatePatient({
                            description: value
                        })
                    }
                    placeholder="Tell us what's happening in your own words..."
                    required
                />

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
            </div>
        </>
    );
}