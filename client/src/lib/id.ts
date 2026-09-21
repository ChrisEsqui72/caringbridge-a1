/**
 * crypto.randomUUID() only exists in secure contexts. Serving the dev build
 * over a LAN IP (`vite --host`, e.g. demoing on a phone) is not one, so fall
 * back to a random string there.
 */
export function createId(): string {
    if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
        return crypto.randomUUID();
    }

    return `id-${Date.now().toString(36)}-${Math.random()
        .toString(36)
        .slice(2, 10)}`;
}
