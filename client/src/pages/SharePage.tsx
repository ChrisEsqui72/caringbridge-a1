import {
    useEffect,
    useRef,
    useState,
    type Dispatch,
    type FormEvent,
    type SetStateAction
} from "react";
import type { Draft, OnboardingData } from "../../../shared/types";
import { PageHeader } from "../components/PageHeader";
import { Button } from "../components/Button";
import { EMAIL_PATTERN } from "../lib/validation";

interface Props {
    draft: Draft;
    data: OnboardingData;
    // Held by the caller so a trip back to the editor keeps the list.
    invites: string[];
    setInvites: Dispatch<SetStateAction<string[]>>;
    onBack: () => void;
    onDone: () => void;
}

type PublishState = "idle" | "publishing" | "published";

// Long enough to read as "working", short enough not to drag a demo.
const PRETEND_PUBLISH_MS = 1200;
const COPIED_RESET_MS = 2000;
const SITE_HOST = "caringbridge.org/visit/";

const possessive = (name: string) =>
    name.endsWith("s") ? `${name}'` : `${name}'s`;

const toSlug = (name: string) =>
    `${
        name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, "") || "my"
    }-journey`;

const parseEmails = (input: string) =>
    input
        .split(/[\s,;]+/)
        .map((email) => email.trim())
        .filter(Boolean);

/**
 * Prototype only: nothing is sent or posted. Invites are held until
 * "Publish and Share", which pretends to publish and shows the result.
 */
export function SharePage({
    draft,
    data,
    invites,
    setInvites,
    onBack,
    onDone
}: Props) {
    const name = data.patient.name.trim();
    const siteName = name
        ? `${possessive(name)} Health Journey`
        : "Your Health Journey";
    const siteLink = `${SITE_HOST}${toSlug(name)}`;

    const [emailInput, setEmailInput] = useState("");
    const [emailError, setEmailError] = useState("");
    const [notice, setNotice] = useState("");
    const [copied, setCopied] = useState(false);
    const [publishState, setPublishState] =
        useState<PublishState>("idle");

    const linkRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (publishState !== "publishing") return;

        const timer = window.setTimeout(
            () => setPublishState("published"),
            PRETEND_PUBLISH_MS
        );

        return () => window.clearTimeout(timer);
    }, [publishState]);

    useEffect(() => {
        if (!copied) return;

        const timer = window.setTimeout(
            () => setCopied(false),
            COPIED_RESET_MS
        );

        return () => window.clearTimeout(timer);
    }, [copied]);

    // Returns false, with the error shown, when anything typed is invalid.
    const commitPendingInvites = (): boolean => {
        const emails = parseEmails(emailInput);
        const invalid = emails.filter(
            (email) => !EMAIL_PATTERN.test(email)
        );

        if (invalid.length > 0) {
            setEmailError(
                `Check ${invalid.length === 1 ? "this address" : "these addresses"}: ${invalid.join(", ")}`
            );
            return false;
        }

        setInvites((current) =>
            emails.reduce(
                (merged, email) =>
                    merged.some(
                        (existing) =>
                            existing.toLowerCase() ===
                            email.toLowerCase()
                    )
                        ? merged
                        : [...merged, email],
                current
            )
        );
        setEmailInput("");
        setEmailError("");
        return true;
    };

    const addInvites = (event: FormEvent) => {
        event.preventDefault();

        if (parseEmails(emailInput).length === 0) {
            setEmailError("Enter at least one email address.");
            return;
        }

        commitPendingInvites();
    };

    // An address typed but never added would otherwise be dropped
    // without a word.
    const publish = () => {
        if (commitPendingInvites()) {
            setPublishState("publishing");
        }
    };

    // The async Clipboard API only exists in secure contexts, so a demo
    // served over a LAN IP falls back to selecting the text.
    const copyLink = async () => {
        try {
            if (!navigator.clipboard) {
                throw new Error("Clipboard API unavailable");
            }

            await navigator.clipboard.writeText(`https://${siteLink}`);
            setCopied(true);
            setNotice("");
        } catch {
            linkRef.current?.select();
            setNotice(
                "Couldn't copy automatically. The link is selected, so copy it with Ctrl+C or ⌘C."
            );
        }
    };

    const pretend = (action: string) =>
        setNotice(
            `Prototype: in the real product this would ${action}. Nothing was shared.`
        );

    if (publishState === "published") {
        return (
            <>
                <PageHeader
                    eyebrow="You're all set"
                    title="Your update is posted."
                    description={
                        invites.length > 0
                            ? `We sent an invitation to ${invites.length} ${invites.length === 1 ? "person" : "people"}. They'll see this update when they join.`
                            : "Share your private link whenever you're ready. Only people you invite can see it."
                    }
                />

                <div className="cb-share cb-share--done">
                    <article className="cb-post">
                        <p className="cb-post__site">{siteName}</p>
                        <h2 className="cb-post__title">
                            {draft.title || "Untitled update"}
                        </h2>
                        <p className="cb-post__body">{draft.body}</p>
                    </article>

                    {invites.length > 0 && (
                        <div className="cb-share__section">
                            <p className="cb-field__label">Invited</p>
                            <ul className="cb-share__chips">
                                {invites.map((email) => (
                                    <li
                                        key={email}
                                        className="cb-draft__topic"
                                    >
                                        <span aria-hidden="true">✓</span>
                                        {email}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <p className="cb-share__prototype-note">
                        This is a prototype. Nothing was actually posted
                        or sent.
                    </p>

                    <div className="cb-share__done-actions">
                        <Button onClick={onDone}>Start a new site</Button>
                    </div>
                </div>
            </>
        );
    }

    const isPublishing = publishState === "publishing";

    return (
        <>
            <PageHeader title="Congratulations, your post is ready to share!" />

            <div className="cb-share">
                <div className="cb-share__post-title">
                    <p className="cb-post__site">Your post</p>
                    <p className="cb-post__title">
                        {draft.title || "Untitled update"}
                    </p>
                </div>

                <div className="cb-share__intro">
                    <h2 className="cb-share__heading">
                        Share with your circle
                    </h2>
                    <p className="cb-share__lede">
                        {name
                            ? `Invite close friends and family to join ${possessive(name)} site, follow updates, and send words of support.`
                            : "Invite close friends and family to join, follow updates, and send words of support."}
                    </p>
                </div>

                <div className="cb-share__layout">
                    <div className="cb-share__main">
                        <form
                            className="cb-share__section"
                            onSubmit={addInvites}
                            noValidate
                        >
                            <label
                                className="cb-field__label"
                                htmlFor="cb-invite-emails"
                            >
                                Invite via email
                            </label>

                            <div className="cb-share__row">
                                <input
                                    id="cb-invite-emails"
                                    className="cb-field__control"
                                    type="text"
                                    inputMode="email"
                                    autoComplete="off"
                                    value={emailInput}
                                    onChange={(event) => {
                                        setEmailInput(event.target.value);
                                        setEmailError("");
                                    }}
                                    placeholder="friend@example.com, family@example.com"
                                    aria-describedby={
                                        emailError
                                            ? "cb-invite-error"
                                            : undefined
                                    }
                                    aria-invalid={Boolean(emailError)}
                                />
                                <Button type="submit" variant="secondary">
                                    Add
                                </Button>
                            </div>

                            {emailError && (
                                <p
                                    id="cb-invite-error"
                                    className="cb-share__error"
                                    role="alert"
                                >
                                    {emailError}
                                </p>
                            )}

                            {invites.length > 0 && (
                                <>
                                    <ul className="cb-share__chips">
                                        {invites.map((email) => (
                                            <li
                                                key={email}
                                                className="cb-draft__topic"
                                            >
                                                {email}
                                                <button
                                                    type="button"
                                                    className="cb-share__chip-remove"
                                                    onClick={() =>
                                                        setInvites(
                                                            (current) =>
                                                                current.filter(
                                                                    (item) =>
                                                                        item !==
                                                                        email
                                                                )
                                                        )
                                                    }
                                                    aria-label={`Remove ${email}`}
                                                >
                                                    ✕
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                    <p className="cb-share__hint">
                                        Invitations go out when you
                                        publish.
                                    </p>
                                </>
                            )}
                        </form>

                        <div className="cb-share__section">
                            <label
                                className="cb-field__label"
                                htmlFor="cb-share-link"
                            >
                                Copy private link
                            </label>

                            <div className="cb-share__row">
                                <input
                                    id="cb-share-link"
                                    ref={linkRef}
                                    className="cb-field__control"
                                    value={siteLink}
                                    readOnly
                                    onFocus={(event) =>
                                        event.target.select()
                                    }
                                />
                                <Button onClick={copyLink}>
                                    {copied ? "Copied ✓" : "Copy link"}
                                </Button>
                            </div>
                        </div>

                        <div className="cb-share__section">
                            <p className="cb-field__label">
                                Or share directly to
                            </p>

                            <div className="cb-share__social">
                                <Button
                                    variant="secondary"
                                    onClick={() =>
                                        pretend("open Facebook with your link")
                                    }
                                >
                                    Facebook
                                </Button>
                                <Button
                                    variant="secondary"
                                    onClick={() =>
                                        pretend("open X / Twitter with your link")
                                    }
                                >
                                    X / Twitter
                                </Button>
                                <Button
                                    variant="secondary"
                                    onClick={() =>
                                        pretend("open a text message with your link")
                                    }
                                >
                                    Send text
                                </Button>
                            </div>
                        </div>

                        <p
                            className="cb-share__notice"
                            role="status"
                        >
                            {notice}
                        </p>
                    </div>

                    <aside className="cb-share__aside">
                        <div className="cb-site-card">
                            <div
                                className="cb-site-card__banner"
                                aria-hidden="true"
                            />
                            <div className="cb-site-card__body">
                                <img
                                    className="cb-site-card__wordmark"
                                    src="/caringbridge-wordmark.svg"
                                    alt="CaringBridge"
                                    width={140}
                                    height={20}
                                />
                                <h2 className="cb-site-card__title">
                                    {siteName}
                                </h2>
                                <p className="cb-site-card__text">
                                    Follow updates, share encouragement,
                                    and send messages of support.
                                </p>
                                <Button
                                    variant="secondary"
                                    onClick={() =>
                                        pretend("open your private site")
                                    }
                                >
                                    Visit private site
                                </Button>
                            </div>
                        </div>

                        <p className="cb-share__nonprofit">
                            CaringBridge is a 501(c)(3) nonprofit. Because
                            of our donors, your site is entirely free,
                            protected, and private forever.
                        </p>
                    </aside>
                </div>

                <div className="cb-editor__nav">
                    <Button
                        variant="secondary"
                        onClick={onBack}
                        disabled={isPublishing}
                    >
                        ← Back
                    </Button>

                    <Button
                        onClick={publish}
                        disabled={isPublishing}
                    >
                        {isPublishing
                            ? "Publishing..."
                            : "Publish and share →"}
                    </Button>
                </div>
            </div>
        </>
    );
}
