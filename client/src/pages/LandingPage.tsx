import { Button } from "../components/Button";

interface LandingPageProps {
  onNext: () => void;
}

export function LandingPage({ onNext }: LandingPageProps) {
  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center px-6 py-16">
        <div className="rounded-2xl bg-white p-8 shadow-sm sm:p-12">
          <div className="max-w-2xl">
            <p className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">
              Care Update Assistant
            </p>

            <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              Share what’s happening. We’ll help you put it into words.
            </h1>

            <p className="mt-6 text-lg leading-8 text-slate-600">
              Creating a care update can feel overwhelming, especially when
              you’re not sure where to start. Tell us a little about the
              situation, and we’ll help you create a few different drafts to
              choose from.
            </p>

            <Button
                onClick={() =>
                    onNext()
                }
            >
                Get Started
            </Button>

            <p className="mt-5 text-sm text-slate-500">
              You’ll review the information before anything is turned into a
              draft.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}