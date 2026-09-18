import type {
    Draft,
    OnboardingData
} from "../../../shared/types";

export async function generateDrafts(
    data: OnboardingData
): Promise<Draft[]> {
    const patientName = data.patient.name;

    return [
        {
            id: crypto.randomUUID(),
            tone: "warm-personal",
            title: `${patientName}'s Journey`,
            body: `We wanted to share an update about ${patientName} and what the next few weeks will look like...`,
            coveredTopics: [
                "diagnosis",
                "next steps",
                "support"
            ]
        },

        {
            id: crypto.randomUUID(),
            tone: "clear-informative",
            title: `An Update on ${patientName}`,
            body: `${patientName} was recently diagnosed with ${data.patient.diagnosis}. Here's what we know and what comes next...`,
            coveredTopics: [
                "diagnosis",
                "treatment",
                "practical information"
            ]
        },

        {
            id: crypto.randomUUID(),
            tone: "community-focused",
            title: `Supporting ${patientName}`,
            body: `We are grateful for the people surrounding ${patientName} during this time. Here's an update on what is happening and how you can help...`,
            coveredTopics: [
                "community",
                "support",
                "gratitude"
            ]
        }
    ];
}