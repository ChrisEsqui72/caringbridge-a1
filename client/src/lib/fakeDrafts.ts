import type {
    Draft,
    OnboardingData
} from "../../../shared/types";

export function generateFakeDrafts(
    data: OnboardingData
): Draft[] {
    const {
        patient,
        care,
        caregiver
    } = data;

    const patientName =
        patient.name || "our loved one";

    const diagnosis =
        patient.diagnosis || "a health condition";

    const description =
        patient.description ||
        `We recently learned that ${patientName} is being treated for ${diagnosis}.`;

    const nextSteps =
        care.nextSteps ||
        "We will share more information as we know more.";

    const caregiverName =
        caregiver.name;

    const caregiverInfo =
        caregiverName
            ? `${caregiverName}${caregiver.relationship ? `, ${caregiver.relationship}` : ""}`
            : "our family";

    return [
        {
            id: "fake-draft-1",
            tone: "warm-personal",
            title: "A warm, personal update",
            body:
                `${description}\n\n` +
                `${nextSteps}\n\n` +
                `This is a lot for all of us to take in, but we are taking things one step at a time and are grateful for the people who have supported ${patientName} along the way.` +
                (caregiverName
                    ? ` ${caregiverInfo} will help coordinate updates and keep everyone informed as things progress.`
                    : "") +
                `\n\nThank you for thinking of ${patientName} and our family. We will continue to share updates here as we know more.`,
            coveredTopics: [
                "Current situation",
                "Upcoming care",
                "Family perspective",
                "Future updates"
            ]
        },

        {
            id: "fake-draft-2",
            tone: "clear-informative",
            title: "A clear, straightforward update",
            body:
                `${patientName} is currently receiving care for ${diagnosis}.\n\n` +
                `${description}\n\n` +
                `The next step is ${nextSteps.toLowerCase().replace(/\.$/, "")}. ` +
                `We wanted to share this information in one place so friends and family can stay up to date.\n\n` +
                `Thank you for your support and understanding. We will post additional updates as ${patientName}'s care continues.`,
            coveredTopics: [
                "Diagnosis",
                "Current situation",
                "Next steps",
                "Future updates"
            ]
        },

        {
            id: "fake-draft-3",
            tone: "community-focused",
            title: "An update for our community",
            body:
                `We wanted to let our community know how ${patientName} is doing and what comes next. ` +
                `${description}\n\n` +
                `Right now, the focus is on the next stage of care: ${nextSteps.toLowerCase().replace(/\.$/, "")}. ` +
                `There may be some uncertainty along the way, but having friends, family, and loved ones around us makes a meaningful difference.` +
                (caregiverName
                    ? ` ${caregiverInfo} will be helping coordinate things and keep everyone connected.`
                    : "") +
                `\n\nWe appreciate every message, visit, meal, ride, and other form of support. ` +
                `Thank you for being part of ${patientName}'s community. We will keep sharing updates as we move forward.`,
            coveredTopics: [
                "Patient update",
                "Upcoming care",
                "Community support",
                "Ways to stay connected"
            ]
        }
    ];
}