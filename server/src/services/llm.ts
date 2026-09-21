import {
    BedrockRuntimeClient,
    ConverseCommand
} from "@aws-sdk/client-bedrock-runtime";

import type {
    Draft,
    OnboardingData
} from "../../../shared/types/index.js";

import { SUPPORT_LABELS } from "../../../shared/types/index.js";

const client = new BedrockRuntimeClient({
    region: 
        process.env.AWS_REGION ?? "us-east-1"
});

const MODEL_ID =
    process.env.BEDROCK_MODEL_ID ??
    "amazon.nova-lite-v1:0";

const SYSTEM_PROMPT = `
You help users create a first health update for a CaringBridge-style personal journal.

The user has provided information about a patient, their care, their caregiver, and ways their community can provide support.

Your job is to create exactly three meaningful draft updates using the information provided.

The three drafts must have these tones:

1. warm-personal
   - Warm, personal, and compassionate.
   - Appropriate for updating friends and family.
   - Should feel natural rather than overly formal.

2. clear-informative
   - Clear, organized, and straightforward.
   - Prioritize the important facts and upcoming steps.
   - Avoid unnecessary emotional language.

3. community-focused
   - Emphasize the role of the patient's community.
   - Clearly communicate ways people can provide support when appropriate.
   - Still provide the important health and care information.

Important rules:

- Use the provided information accurately.
- Never invent medical facts, diagnoses, treatments, prognosis, dates, events, or personal information.
- Do not make assumptions about information that was not provided.
- Do not provide medical advice.
- Do not make the update unnecessarily dramatic or frightening.
- Use compassionate and natural language.
- Write as though the update is being written by the caregiver or person creating the journal.
- Respect the intended audience indicated by pageFor.
- Only mention support options that are actually selected in the support information.
- If a support option is not selected, do not imply that the user needs it.
- Do not include private contact information such as email addresses or phone numbers in the draft unless the provided information explicitly indicates that it should be public.
- The patient's date of birth does not need to appear in the update unless it is relevant to the writing.
- Each draft should communicate the important information without simply copying the input fields word-for-word.
- Do not add emotional descriptions, relationships, opinions, feelings, or characterizations that are not explicitly supported by the provided information.
- Do not invent phrases such as "my rock", "incredibly strong", "fighting", "staying positive", etc.
- Do not imply that the author, patient, caregiver, or audience feels a particular way unless that feeling is explicitly provided.
- You may use natural conversational language and reasonable transitions to make the update sound human.
- Do not infer that someone is struggling, hopeful, strong, positive, grateful, scared, overwhelmed, or in need unless that is explicitly supported by the provided information.
- Selecting a support option means the user wants that type of support mentioned; it does not necessarily mean the patient is currently in crisis or urgently needs it.

Return ONLY valid JSON.

DO NOT wrap the JSON in Markdown code fences.
Do not include any explanation, introduction, or text before or after the JSON.
The first character of your response must be { and the last character must be }.

The JSON must contain exactly three drafts in this format:

{
    "drafts": [
        {
            "id": "warm-personal",
            "tone": "warm-personal",
            "title": "string",
            "body": "string",
            "coveredTopics": ["string"]
        },
        {
            "id": "clear-informative",
            "tone": "clear-informative",
            "title": "string",
            "body": "string",
            "coveredTopics": ["string"]
        },
        {
            "id": "community-focused",
            "tone": "community-focused",
            "title": "string",
            "body": "string",
            "coveredTopics": ["string"]
        }
    ]
}

coveredTopics should be a short list of the major pieces of information included in that particular draft.
`;

/**
 * Spells out the selected support options by name. Handing the model a raw
 * booleans blob made it drop options when many were selected, and let
 * support needs mentioned in earlier free-text fields crowd out the
 * explicit choices.
 */
function describeSupport(data: OnboardingData): string {
    // The request body is not schema-validated yet, so tolerate a missing
    // or partial support object rather than 500ing on it.
    const support: Partial<OnboardingData["support"]> =
        data.support ?? {};

    const selected = (
        Object.keys(SUPPORT_LABELS) as (keyof typeof SUPPORT_LABELS)[]
    ).filter((key) => support[key] === true);

    const lines = selected.map(
        (key) => `- ${SUPPORT_LABELS[key]}`
    );

    const other =
        typeof support.other === "string"
            ? support.other.trim()
            : "";

    if (other) {
        lines.push(`- ${other}`);
    }

    if (lines.length === 0) {
        return "No specific support options were selected. Do not mention or imply any need for support.";
    }

    return `The user selected ${lines.length} support option(s). EVERY one of these must appear in the community-focused draft, and none may be omitted or merged away:

${lines.join("\n")}`;
}

export async function generateDrafts(
    data: OnboardingData
): Promise<Draft[]> {
    const userPrompt = `
Here is the complete information provided during onboarding:

${JSON.stringify(data, null, 2)}

SUPPORT OPTIONS (authoritative)

${describeSupport(data)}

This list is the only source of truth for support needs. If an earlier
free-text field happens to mention a kind of help, that does not add it to
this list, and it must not become the focus of the update.

LENGTH

Scale each draft to how much information was actually provided. Sparse
input should produce a short update of a few sentences; detailed input
should produce a correspondingly fuller one. Do not pad a thin update to
look substantial, and do not compress a detailed one into a summary.

Create the three requested drafts using this information.
`;

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
                        text: userPrompt
                    }
                ]
            }
        ],

        inferenceConfig: {
            maxTokens: 4000,
            temperature: 0.7
        }
    });

    const response = await client.send(command);

    const responseText =
        response.output?.message?.content?.[0]?.text;

    if (!responseText) {
    throw new Error("Bedrock returned an empty response");
    }

    console.log("Raw Bedrock response:");
    console.log(responseText);

    let parsed: {
        drafts?: Draft[];
    };

    const cleanedResponse = responseText
        .trim()
        .replace(/^```json\s*/i, "")
        .replace(/^```\s*/i, "")
        .replace(/\s*```$/i, "")
        .trim();

    try {
        parsed = JSON.parse(cleanedResponse);
    } catch {
        console.error("Invalid JSON from Bedrock:");
        console.error(cleanedResponse);

        throw new Error(
            "Bedrock returned invalid JSON"
        );
    }

    if (
        !parsed.drafts ||
        !Array.isArray(parsed.drafts) ||
        parsed.drafts.length !== 3
    ) {
        throw new Error(
            "Bedrock response did not contain exactly three drafts"
        );
    }

    return parsed.drafts;
}

export async function regenerateDraft(
    data: OnboardingData,
    draft: Draft
): Promise<Draft> {
    const userPrompt = `
Here is the complete information provided during onboarding:

${JSON.stringify(data, null, 2)}

Here is the draft that the user wants to regenerate:

${JSON.stringify(draft, null, 2)}

Create a new version of this draft.

Keep the same tone:
${draft.tone}

The new version should communicate the same relevant information
but use different wording and structure.

Do not invent any information that is not supported by the
onboarding data.

Return ONLY valid JSON in this exact format:

{
    "id": "${draft.id}",
    "tone": "${draft.tone}",
    "title": "string",
    "body": "string",
    "coveredTopics": ["string"]
}

Do not wrap the JSON in Markdown code fences.
Do not include any explanation before or after the JSON.
`;

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
                        text: userPrompt
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
            "Bedrock returned an empty response"
        );
    }

    const cleanedResponse = responseText
        .trim()
        .replace(/^```json\s*/i, "")
        .replace(/^```\s*/i, "")
        .replace(/\s*```$/i, "")
        .trim();

    let parsed: Draft;

    try {
        parsed = JSON.parse(cleanedResponse);
    } catch {
        console.error(
            "Invalid regeneration response:"
        );
        console.error(cleanedResponse);

        throw new Error(
            "Bedrock returned invalid JSON"
        );
    }

    return parsed;
}