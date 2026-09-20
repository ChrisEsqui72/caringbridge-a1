import {
    BedrockRuntimeClient,
    ConverseCommand
} from "@aws-sdk/client-bedrock-runtime";

import type {
    Draft,
    OnboardingData
} from "../../../shared/types/index.js";

const client = new BedrockRuntimeClient({
    region:
        process.env.AWS_REGION ?? "us-east-1"
});

const MODEL_ID =
    process.env.BEDROCK_MODEL_ID ??
    "amazon.nova-lite-v1:0";

const SYSTEM_PROMPT = `
You are helping create a CaringBridge-style personal health journal update.

Your job is to turn the information provided by the user into exactly three
meaningful draft options.

The three drafts must have these tones:
1. warm-personal
2. clear-informative
3. community-focused

Follow these rules:

- Use only information provided by the user.
- Do not invent medical facts, diagnoses, treatments, prognoses, dates,
  events, relationships, personal information, or circumstances.
- Do not provide medical advice.
- Do not add emotional descriptions, relationships, opinions, feelings, or
  characterizations that are not explicitly supported by the provided
  information.
- Do not invent phrases such as "my rock", "incredibly strong", "fighting",
  "staying positive", etc.
- Do not imply that the author, patient, caregiver, or audience feels a
  particular way unless that feeling is explicitly provided.
- You may use natural conversational language and reasonable transitions to
  make the update sound human.
- Selecting a support option means the user wants that type of support
  mentioned. It does not necessarily mean the patient is currently in crisis
  or urgently needs it.
- Only mention support options that were selected.
- Respect who the page is being created for.
- Do not expose contact information unless it is appropriate and explicitly
  intended for the update.
- A date of birth does not need to be included unless it is relevant.
- Keep the writing compassionate and natural without being dramatic.

Return exactly this JSON structure:

{
  "drafts": [
    {
      "id": "warm-personal",
      "tone": "warm-personal",
      "title": "...",
      "body": "...",
      "coveredTopics": ["...", "..."]
    },
    {
      "id": "clear-informative",
      "tone": "clear-informative",
      "title": "...",
      "body": "...",
      "coveredTopics": ["...", "..."]
    },
    {
      "id": "community-focused",
      "tone": "community-focused",
      "title": "...",
      "body": "...",
      "coveredTopics": ["...", "..."]
    }
  ]
}

Return ONLY valid JSON.
Do not wrap the JSON in Markdown code fences.
Do not include \`\`\`json or \`\`\` anywhere in the response.
Do not include any explanation, introduction, or text before or after the JSON.
The first character of your response must be { and the last character must be }.
`;

function cleanJsonResponse(responseText: string): string {
    return responseText
        .trim()
        .replace(/^```json\s*/i, "")
        .replace(/^```\s*/i, "")
        .replace(/\s*```$/i, "")
        .trim();
}

export async function generateDrafts(
    data: OnboardingData
): Promise<Draft[]> {
    const command = new ConverseCommand({
        modelId: MODEL_ID,
        system: [
            {
                text: SYSTEM_PROMPT
            }
        ],
        messages: [
            {
                role: "user",
                content: [
                    {
                        text: `
Create three draft updates using this onboarding information:

${JSON.stringify(data, null, 2)}
`
                    }
                ]
            }
        ],
        inferenceConfig: {
            maxTokens: 2000,
            temperature: 0.7
        }
    });

    const response = await client.send(command);

    const responseText =
        response.output?.message?.content?.[0]?.text;

    if (!responseText) {
        throw new Error(
            "No response received from Bedrock."
        );
    }

    const cleanedResponse =
        cleanJsonResponse(responseText);

    const parsed = JSON.parse(
        cleanedResponse
    ) as {
        drafts: Draft[];
    };

    if (
        !parsed.drafts ||
        parsed.drafts.length !== 3
    ) {
        throw new Error(
            "Bedrock did not return exactly three drafts."
        );
    }

    return parsed.drafts;
}

export async function regenerateDraft(
    data: OnboardingData,
    draft: Draft
): Promise<Draft> {
    const command = new ConverseCommand({
        modelId: MODEL_ID,
        system: [
            {
                text: SYSTEM_PROMPT
            }
        ],
        messages: [
            {
                role: "user",
                content: [
                    {
                        text: `
Create a new version of the following draft.

Keep the same tone:
${draft.tone}

Use the same onboarding information, but change the
wording and structure so this feels like a genuinely
different version.

Do not add information that is not present in the
onboarding data.

Onboarding information:
${JSON.stringify(data, null, 2)}

Previous draft:
${JSON.stringify(draft, null, 2)}

Return exactly one Draft object using this structure:

{
  "id": "${draft.id}",
  "tone": "${draft.tone}",
  "title": "...",
  "body": "...",
  "coveredTopics": ["...", "..."]
}

Return ONLY valid JSON.
Do not wrap the JSON in Markdown code fences.
Do not include any explanation before or after the JSON.
The first character must be { and the last character must be }.
`
                    }
                ]
            }
        ],
        inferenceConfig: {
            maxTokens: 1200,
            temperature: 0.8
        }
    });

    const response = await client.send(command);

    const responseText =
        response.output?.message?.content?.[0]?.text;

    if (!responseText) {
        throw new Error(
            "No response received from Bedrock."
        );
    }

    const cleanedResponse =
        cleanJsonResponse(responseText);

    return JSON.parse(
        cleanedResponse
    ) as Draft;
}