import {
    BedrockRuntimeClient,
    ConverseCommand
} from "@aws-sdk/client-bedrock-runtime";

import type {
    Draft,
    DraftTone,
    OnboardingData,
    PageFor
} from "../../../shared/types/index.js";

import { SUPPORT_LABELS } from "../../../shared/types/index.js";

const client = new BedrockRuntimeClient({
    region: 
        process.env.AWS_REGION ?? "us-east-1"
});

const MODEL_ID =
    process.env.BEDROCK_MODEL_ID ??
    "amazon.nova-lite-v1:0";

const MODEL_TONES: DraftTone[] = [
    "warm-personal",
    "clear-informative",
    "community-focused"
];

/**
 * How to write, shared by first drafts and regenerated ones so both follow
 * the same tone guides. The response shape is left to each request, since
 * one returns three drafts and the other returns one.
 */
const SYSTEM_PROMPT = `
Your job is to write the first journal update for a CaringBridge-style page: a private
site where someone going through a health event keeps friends and family
informed. The readers care about the patient. They want to know what is
happening, what comes next, and how they can help.

You will be given who the author is, the facts they entered, and the kinds
of support they want to mention. Turn those facts into an update that sounds
like a real person wrote it for people they know so that the author can edit and post it on their page.

## Voice

- Write as the author, never as an assistant. Never mention drafts,
  templates, or AI.
- Use plain, everyday words. Contractions are good. Keep paragraphs to two
  to four sentences.
- Call the patient by their first name. Use the pronouns the author used
  for the patient in their own words. If they used none, use the name or
  rephrase. Never guess "he" or "she" from a name.

## Facts

Every fact must come from the information given. That covers the
diagnosis, treatment, dates, places, people, and how anyone feels.

- If the author described a feeling or outlook in their own words (for
  example "we're taking things one day at a time"), you may carry it
  through, in their words or close to them.
- Otherwise do not say how the patient, the author, or the readers feel,
  and do not describe the patient's character ("so strong", "a fighter",
  "staying positive"). Warmth comes from how the author speaks to the
  readers, not from adjectives about the patient.
- Do not explain the diagnosis, predict outcomes, or give medical advice.
- If something wasn't given, leave it out rather than filling it in.

## Tones

Each tone is a different kind of letter, not the same letter with different
adjectives. Drafts in different tones should differ in how they open, what
order they go in, and how they close.

### warm-personal: a letter to people who love the patient
- Open by greeting the readers directly ("Hi everyone,") and saying why
  you're writing.
- Tell what has happened as a short story, in the order it happened, the
  way you'd tell a close friend.
- Then say what's coming next, and, if any support options were given,
  how readers can help.
- Close by thanking people for reading and following along, and say you'll
  keep posting updates here.

### clear-informative: a briefing for someone who wants the facts quickly
- The first sentence gives the main news: who, and the diagnosis or reason
  for care. Skip the greeting, or keep it to "Hi all,".
- Then what happens next, in date order. When there are two or more
  upcoming events, put each on its own line starting with "- " (for example
  "- Surgery on March 4").
- Short, direct sentences. No metaphors and no filler.
- If any support options were given, list them, each on its own line
  starting with "- ". If a care coordinator is named, say they are the
  person to go to with offers of help.
- Close with one sentence saying updates will be posted here.

### community-focused: a note to the whole circle about staying connected and helping
- Open by addressing the group ("Friends and family," or "To everyone who
  has reached out,") and say this page is where they can keep up.
- Give the situation in two or three sentences.
- Most of the update is about how people can help. Name every support
  option given, each as a specific, friendly invitation rather than a plea
  (for example "If you'd like to help with meals, ..."). Add no ways to help
  beyond those given.
- If a care coordinator is named, say they are the person to go to with
  offers of help.
- If no support options were given, write about staying connected instead
  (following the page, leaving a note) and ask for nothing.
- Close by thanking people for being part of the patient's circle.

## Length

Match the length to how much the author gave you. A few sparse facts make a
short update of 60 to 120 words. Detailed input makes a fuller one, up to
about 300 words. Don't pad a thin update, and don't squeeze a detailed one
into a summary.

## Title

Three to eight words that say what this update is about, in the same tone
as the body (for example "Starting treatment next week"). No colons or
emojis, and nothing generic like "An update".

## Body format

Plain text. Put a blank line between paragraphs. No Markdown headings, bold,
or emojis. No sign-off, signature, or placeholders like [Name]; the page
shows who posted it.

## coveredTopics

The pieces of information the body actually includes, each two to four
words (for example "Diagnosis", "Upcoming surgery", "Meal help"). List only
what is in the body.

## Output

Respond with one JSON object in the shape the request gives. The first
character must be { and the last must be }. No Markdown code fences and no
text before or after the JSON.
`;

const DRAFT_FIELDS = `"title": "string",
    "body": "string",
    "coveredTopics": ["string"]`;

/**
 * Pins the point of view. Without it the model switched between "I", "we",
 * and a narrator voice, sometimes within one draft.
 */
function describeAuthor(data: OnboardingData): string {
    const name = data.patient?.name?.trim() || "the patient";

    const byPageFor: Record<PageFor, string> = {
        myself: `The author is the patient, ${name}, writing about themselves. Write in the first person ("I", "my").`,
        family: `The author is a member of ${name}'s family. Write in the first person, using "we" for the family where it fits.`,
        friend: `The author is a friend of ${name}. Write in the first person ("I"), and don't speak for the family.`,
        someone_else: `The author is writing on ${name}'s behalf. Write in the first person ("I").`
    };

    return byPageFor[data.pageFor ?? "someone_else"];
}

// Parsed as UTC so the server's timezone can't shift the day.
const formatDate = (value: string): string => {
    const [year, month, day] = value.split("-").map(Number);
    const date = new Date(Date.UTC(year, month - 1, day));

    return Number.isNaN(date.getTime())
        ? value
        : date.toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              timeZone: "UTC"
          });
};

/**
 * The facts as labeled plain text. Date of birth, email, and phone are
 * never sent: the update goes to a wide circle, and the model can't leak
 * what it never sees.
 */
function describeFacts(data: OnboardingData): string {
    const lines: string[] = [];

    const add = (label: string, value: string | undefined) => {
        const text = value?.trim();

        if (text) {
            lines.push(`${label}: ${text}`);
        }
    };

    add("Patient's name", data.patient?.name);
    add("Where they are", data.patient?.location);
    add("Diagnosis or reason for care", data.patient?.diagnosis);
    add("In the author's own words", data.patient?.description);
    add("What happens next", data.care?.nextSteps);

    const events = (data.care?.upcomingEvents ?? [])
        .filter((event) => event.type?.trim())
        .map((event) => {
            const date = event.date?.trim();
            const details = event.description?.trim();

            return `- ${event.type.trim()}${date ? ` on ${formatDate(date)}` : ""}${details ? `: ${details}` : ""}`;
        });

    if (events.length > 0) {
        lines.push(`Upcoming events:\n${events.join("\n")}`);
    }

    const coordinator = data.caregiver?.name?.trim();
    const relationship = data.caregiver?.relationship?.trim();

    if (coordinator) {
        add(
            "Care coordinator",
            relationship
                ? `${coordinator} (relationship to the patient: ${relationship})`
                : coordinator
        );
    }

    return lines.length > 0
        ? lines.join("\n")
        : "The author did not provide any details.";
}

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
        return "No support options were selected. No draft may ask readers for help.";
    }

    return `The author selected ${lines.length} support option(s). The community-focused draft must name EVERY one of these; none may be left out or merged together. The warm-personal and clear-informative drafts should mention every one as well, more briefly.

${lines.join("\n")}`;
}

function describeRequest(data: OnboardingData): string {
    return `
## Author

${describeAuthor(data)}

## Facts

${describeFacts(data)}

## Support options (authoritative)

${describeSupport(data)}

This list is the only source of truth for support. A kind of help that comes
up in the author's own words is not on this list unless it appears here, and
must not become the focus of the update.
`;
}

export async function generateDrafts(
    data: OnboardingData
): Promise<Draft[]> {
    const userPrompt = `${describeRequest(data)}
## Request

Write three drafts from these facts, one in each tone: warm-personal,
clear-informative, and community-focused. Follow each tone's guide.

Respond with JSON in exactly this shape:

{
  "drafts": [
    {
      "id": "warm-personal",
      "tone": "warm-personal",
      ${DRAFT_FIELDS}
    },
    {
      "id": "clear-informative",
      "tone": "clear-informative",
      ${DRAFT_FIELDS}
    },
    {
      "id": "community-focused",
      "tone": "community-focused",
      ${DRAFT_FIELDS}
    }
  ]
}
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
        // Length only: the response holds the patient's health details.
        console.error(
            `Invalid JSON from Bedrock (${cleanedResponse.length} chars)`
        );

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
    // The tone is interpolated into the prompt, so only accept the ones the
    // system prompt has a guide for.
    if (!MODEL_TONES.includes(draft.tone)) {
        throw new Error(
            `Cannot regenerate a draft with tone "${draft.tone}"`
        );
    }

    const userPrompt = `${describeRequest(data)}
## Previous version

Title: ${draft.title}

${draft.body}

## Request

The author wants a different ${draft.tone} version of this update. Write a
new one from the same facts, following the ${draft.tone} guide. Cover the
same information, but make it genuinely different: a new title, a
different first sentence, and different phrasing throughout. Do not reuse
sentences from the previous version.

Respond with JSON in exactly this shape:

{
    ${DRAFT_FIELDS}
}
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

    let parsed: Pick<Draft, "title" | "body" | "coveredTopics">;

    try {
        parsed = JSON.parse(cleanedResponse);
    } catch {
        console.error(
            `Invalid regeneration JSON from Bedrock (${cleanedResponse.length} chars)`
        );

        throw new Error(
            "Bedrock returned invalid JSON"
        );
    }

    // Identity comes from the request, not the model, so a regenerated
    // draft always replaces the one the user clicked.
    return {
        ...parsed,
        id: draft.id,
        tone: draft.tone
    };
}
