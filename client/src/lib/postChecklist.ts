import {
    SUPPORT_LABELS,
    type OnboardingData,
    type SupportNeeds
} from "../../../shared/types";
import { createId } from "./id";

export interface ChecklistItem {
    id: string;
    label: string;
    // The sentence added to the post when the item is picked.
    line: string;
    // Text whose presence in the post means the topic is already covered.
    evidence: string[];
    checked: boolean;
}

const joinList = (items: string[]): string => {
    if (items.length <= 1) return items.join("");
    if (items.length === 2) return `${items[0]} and ${items[1]}`;

    return `${items.slice(0, -1).join(", ")}, and ${items.at(-1)}`;
};

const asSentence = (text: string): string => {
    const trimmed = text.trim();

    return /[.!?]$/.test(trimmed) ? trimmed : `${trimmed}.`;
};

// Parsed at local noon: a bare YYYY-MM-DD is read as UTC midnight, which
// renders as the previous day anywhere west of Greenwich.
const formatDate = (value: string): string => {
    const date = new Date(`${value}T12:00:00`);

    return Number.isNaN(date.getTime())
        ? value
        : date.toLocaleDateString(undefined, {
              month: "long",
              day: "numeric"
          });
};

const selectedSupport = (support: SupportNeeds): string[] => {
    const selected = (
        Object.keys(SUPPORT_LABELS) as (keyof typeof SUPPORT_LABELS)[]
    )
        .filter((key) => support[key])
        .map((key) => SUPPORT_LABELS[key].toLowerCase());

    return support.other.trim()
        ? [...selected, support.other.trim()]
        : selected;
};

/**
 * Suggested topics for a post, each with a line built only from what the
 * user entered during onboarding. A topic with nothing to say is left out
 * rather than filled with invented detail.
 */
function suggestions(
    data: OnboardingData
): Pick<ChecklistItem, "label" | "line" | "evidence">[] {
    const { patient, care, caregiver, support } = data;
    const isSelf = data.pageFor === "myself";
    const name = patient.name.trim();
    const subject = isSelf ? "I have" : `${name || "Our loved one"} has`;

    const events = care.upcomingEvents
        .filter((event) => event.type.trim())
        .map((event) =>
            event.date
                ? `${event.type.trim()} on ${formatDate(event.date)}`
                : event.type.trim()
        );

    const help = selectedSupport(support);

    const all = [
        patient.diagnosis.trim() && {
            label: "Diagnosis",
            line: `${subject} been diagnosed with ${patient.diagnosis.trim()}.`,
            evidence: [patient.diagnosis]
        },
        care.nextSteps.trim() && {
            label: "Next steps",
            line: `What's next: ${asSentence(care.nextSteps)}`,
            evidence: [care.nextSteps]
        },
        events.length > 0 && {
            label: "Upcoming dates",
            line: `Coming up: ${joinList(events)}.`,
            evidence: care.upcomingEvents.map((event) => event.type)
        },
        caregiver.name.trim() && {
            label: "Who's writing",
            line: `Updates here will come from ${caregiver.name.trim()}${
                caregiver.relationship.trim()
                    ? ` (${caregiver.relationship.trim()})`
                    : ""
            }.`,
            evidence: [caregiver.name]
        },
        help.length > 0 && {
            label: "How to help",
            line: `If you'd like to help, we'd welcome ${joinList(help)}.`,
            evidence: help
        },
        {
            label: "Sharing okay?",
            line: "Feel free to share this site with anyone who would want to stay updated.",
            evidence: []
        },
        {
            label: "Thank you",
            line: "Thank you for your support.",
            evidence: ["thank you"]
        }
    ];

    return all.filter(
        (item): item is { label: string; line: string; evidence: string[] } =>
            Boolean(item)
    );
}

/**
 * The same list for every post, whether it started from a generated draft
 * or a blank one. Whether an item is covered is not stored here; it is
 * read from the post text by `withCoverage`.
 */
export function buildChecklist(data: OnboardingData): ChecklistItem[] {
    return suggestions(data).map((item) => ({
        ...item,
        id: createId(),
        checked: false
    }));
}

// Words of four or more letters: drops "in", "on", "the" and the like.
const MIN_WORD_LENGTH = 4;
// Below this many meaningful words, only an exact mention counts.
const MIN_WORDS_FOR_OVERLAP = 3;

// Long enough to pass MIN_WORD_LENGTH but common in any update, so they
// say nothing about which topic a sentence is about.
const FILLER_WORDS = new Set([
    "about", "been", "from", "have", "here", "more", "that", "their",
    "them", "they", "this", "update", "updates", "were", "what", "when",
    "will", "with", "your"
]);

const significantWords = (text: string): string[] =>
    text
        .toLowerCase()
        .split(/[^a-z0-9]+/)
        .filter(
            (word) =>
                word.length >= MIN_WORD_LENGTH && !FILLER_WORDS.has(word)
        );

const escapeRegExp = (value: string) =>
    value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// Whole words only: a caregiver named "Al" must not match inside "also".
const containsWhole = (text: string, needle: string): boolean =>
    new RegExp(`(^|[^a-z0-9])${escapeRegExp(needle)}($|[^a-z0-9])`).test(
        text
    );

const mentions = (
    text: string,
    words: Set<string>,
    phrase?: string
): boolean => {
    const needle = phrase?.trim().toLowerCase();

    if (!needle) return false;
    if (containsWhole(text, needle)) return true;

    // Free-text answers (next steps, above all) come back paraphrased rather
    // than quoted, so count one as mentioned when most of its meaningful
    // words appear. Short phrases like a name stay exact-match only.
    const key = significantWords(needle);

    if (key.length < MIN_WORDS_FOR_OVERLAP) return false;

    const found = key.filter((word) => words.has(word)).length;

    return found / key.length > 0.5;
};

/**
 * Marks each suggestion covered when the post mentions it. Derived from the
 * text on every render, so it reflects edits as they happen and needs no
 * trust in the model's own list of what it covered.
 */
export function withCoverage(
    items: ChecklistItem[],
    body: string
): ChecklistItem[] {
    const text = body.toLowerCase();
    const words = new Set(significantWords(body));

    return items.map((item) => ({
        ...item,
        checked:
            // The line is our own template, so only a verbatim copy
            // counts: fuzzy-matching its wording would tick "Who's
            // writing" for any post saying "updates here".
            containsWhole(text, item.line.toLowerCase()) ||
            item.evidence.some((phrase) => mentions(text, words, phrase))
    }));
}

export function appendLine(body: string, line: string): string {
    const trimmed = body.trimEnd();

    return trimmed ? `${trimmed}\n\n${line}` : line;
}
