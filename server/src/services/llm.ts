import {
    BedrockRuntimeClient,
    ConverseCommand
} from "@aws-sdk/client-bedrock-runtime";

import type {
    Draft,
    DraftTone,
    OnboardingData,
    PageFor,
    SupportNeeds,
} from "../../../shared/types/index.js";

const SUPPORT_LABELS: Record<
    "meals" |
    "rides" |
    "childcare" |
    "petCare" |
    "householdHelp" |
    "visits" |
    "flowers" |
    "gifts" |
    "thoughtsPrayers" |
    "fundraising" |
    "phoneCalls",
    string
> = {
    meals: "Meals",
    rides: "Rides",
    childcare: "Childcare",
    petCare: "Pet care",
    householdHelp: "Household help",
    visits: "Visits",
    flowers: "Flowers",
    gifts: "Gifts",
    thoughtsPrayers: "Thoughts & prayers",
    fundraising: "Fundraising",
    phoneCalls: "Phone calls"
};

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

The three drafts MUST contain the same core information. Do not omit a fact
merely to make a draft feel different. Differentiation comes from voice,
organization, emphasis, sentence structure, and length.

Each tone should feel like a genuinely different kind of update, not the
same update with a few adjectives changed.

### warm-personal: the personal letter

This should feel like the author personally talking to people they care about.

- Open warmly and directly, such as "Hi everyone," followed by a natural
explanation of why the author is writing.
- Tell the story in a conversational, chronological way when possible.
- Use transitions and slightly fuller sentences to make the update feel
like a personal letter rather than a list of facts.
- Give every submitted fact a natural place in the story, even if some
details receive only one sentence.
- Mention upcoming events and next steps naturally rather than presenting
them as a checklist.
- Include every selected support option, but weave them into the letter as
friendly invitations rather than making the update feel like a resource list.
- End with a warm thank-you and a reminder that updates will continue here.
- This should be the longest and most conversational draft.

### clear-informative: the concise briefing

This should feel like a person quickly bringing friends and family up to date
on the important facts.

- Start immediately with the main news. A greeting such as "Hi all," is
optional but should be brief.
- Present information in a logical order: current situation, diagnosis or
reason for care, location, next steps, upcoming events, care coordinator,
and available support.
- Every submitted fact must still appear. Do not remove information simply
because it is less central.
- Use short, direct sentences and compact paragraphs.
- Upcoming events may be listed individually with "- " when this improves
readability.
- Support options may be listed individually with "- " when there are several.
- Avoid emotional embellishment, metaphors, repetition, and conversational
filler.
- End with a short statement that updates will be posted here.
- This should be the shortest and most efficient draft.

### community-focused: the community invitation

This should feel like an update written for a whole circle of people who want
to stay connected and know how they can participate.

- Open by addressing the community directly, such as "Friends and family,"
or "To everyone who has reached out,".
- Explain the situation briefly, then shift the emphasis toward the
community: staying connected, following the page, and helping in the specific
ways the author selected.
- Every submitted fact must still appear somewhere in the draft. Facts that
are not central to the community message should be incorporated briefly rather
than omitted.
- Make each support option feel like a specific invitation to participate.
Do not combine distinct support options into a generic "help out" statement.
- If a care coordinator is named, identify them as the person to contact
about offers of help.
- Use more direct second-person language ("If you'd like to...",
"You can...", "For anyone who wants to...") than the other two tones.
- Close by thanking the community for staying connected and being part of
the patient's circle.
- This should be medium length: longer than the clear-informative draft,
but shorter than the warm-personal draft.

## Information coverage

Every draft MUST use all meaningful information supplied by the author.

The drafts may differ in how much emphasis they give each fact, but they
must not differ in which facts they include.

Before writing each draft, mentally create a checklist of all supplied facts,
including:
- Patient name
- Location
- Diagnosis or reason for care
- The author's own description
- What happens next
- Every upcoming event, including its date and details
- Care coordinator and relationship, when provided
- Every selected support option

Every applicable item on this checklist MUST appear in the body.

Do not treat a fact as optional merely because it is less important to the
selected tone. Tone changes emphasis and presentation, not factual coverage.

Do not invent connecting facts, feelings, motivations, medical details,
outcomes, or support needs.

## Length

Length is intentionally different by tone.

 warm-personal: approximately 180–280 words when enough information is
available. Use the extra space for natural transitions, context, and a
conversational voice. Do not pad sparse input.

- clear-informative: approximately 100–180 words when enough information is
available. Compress information into efficient sentences while still
including every fact.

- community-focused: approximately 140–220 words when enough information is
available. Give enough space to make each support option feel like a real
invitation while keeping the overall update focused.

These are targets, not hard limits. Sparse input may produce a shorter draft,
while unusually detailed input may require a longer draft. Never remove a
submitted fact just to hit a word count, and never add invented material to
reach a target.

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

## Coverage requirement

Every meaningful fact above must be represented in the draft.

The three drafts are NOT allowed to omit facts in order to make themselves
different. All three drafts should communicate the same underlying update.

The drafts should instead differ through:
- tone
- organization
- sentence structure
- amount of conversational detail
- emphasis
- length

The support options above are authoritative. Every selected support option must
be represented in every draft.

This list is the only source of truth for support. A kind of help that comes
up in the author's own words is not on this list unless it appears here, and
must not become a new support option.
`;
}

export async function generateDrafts(
    data: OnboardingData
): Promise<Draft[]> {
    const userPrompt = `${describeRequest(data)}
## Request

Write three drafts from these facts, one in each tone:
1. warm-personal
2. clear-informative
3. community-focused

IMPORTANT: All three drafts must contain the same underlying information.
Before finalizing each draft, verify that every supplied fact appears in its
body. Do not omit a fact simply because another tone gives it less emphasis.

The drafts should feel substantially different from one another.

The warm-personal draft should be the longest and most conversational.
The clear-informative draft should be the shortest and most concise.
The community-focused draft should fall between the other two and emphasize
community participation and the selected ways people can help.

Do not achieve differentiation by removing information. Achieve it through
voice, organization, emphasis, sentence structure, and length.

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

    console.log("Sending draft generation request to Bedrock...");

    const response = await client.send(command);

    console.log("Received response from Bedrock");

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

The author wants a different ${draft.tone} version of this update.

Create a new version using the SAME complete set of facts from the onboarding
information. Do not drop or shorten away any submitted information simply to
make the wording different.

Preserve complete factual coverage while making the writing genuinely
different through:
- a new title
- a different first sentence
- different organization where appropriate
- different sentence structure
- different phrasing throughout
- stronger adherence to the ${draft.tone} voice
- the appropriate length for the ${draft.tone} tone

Do not reuse sentences from the previous version.

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
