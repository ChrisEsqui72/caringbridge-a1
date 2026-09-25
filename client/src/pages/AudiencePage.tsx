import type { OnboardingData, PageFor } from "../../../shared/types";
import { CardSelector } from "../components/CardSelector";
import { PageHeader } from "../components/PageHeader";
import { Button } from "../components/Button";

interface Props {
    data: OnboardingData;
    updateData: (data: Partial<OnboardingData>) => void;
    onBack: () => void;
    onNext: () => void;
}

const options = [
    {
        value: "myself" as PageFor,
        title: "Myself",
        description:
            "I'm receiving care and want to keep people updated.",
        icon: "👤"
    },
    {
        value: "family" as PageFor,
        title: "A family member",
        description:
            "I'm helping share updates about someone I love.",
        icon: "❤️"
    },
    {
        value: "friend" as PageFor,
        title: "A friend",
        description:
            "I'm creating a page to support a friend.",
        icon: "🤝"
    },
    {
        value: "someone_else" as PageFor,
        title: "Someone else",
        description:
            "I'm helping create a page on their behalf.",
        icon: "👥"
    }
];

export function AudiencePage({
    data,
    updateData,
    onBack,
    onNext
}: Props) {
    return (
        <>
            <PageHeader
                eyebrow="Let's get started"
                title="Who is this page for?"
                description="This helps us shape the update around your relationship with the patient."
            />

            <div className="mt-5">
                <CardSelector
                    options={options}
                    value={data.pageFor}
                    onChange={(value) =>
                        updateData({ pageFor: value })
                    }
                />
            </div>

            <div className="mt-5 flex items-center justify-between">
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