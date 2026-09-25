import { Button } from "../components/Button";
import { PageHeader } from "../components/PageHeader";

interface LandingPageProps {
  hasProgress: boolean;
  onNext: () => void;
  onStartOver: () => void;
}

export function LandingPage({
  hasProgress,
  onNext,
  onStartOver,
}: LandingPageProps) {
  return (
    <div className="cb-landing__card">
      <PageHeader
        eyebrow="Care Update Assistant"
        title="Share what’s happening. We’ll help you put it into words."
        description="Creating a care update can feel overwhelming, especially when you’re not sure where to start. Tell us a little about the situation, and we’ll help you create a few different drafts to choose from."
      />

      <div className="cb-landing__actions">
        <Button onClick={onNext}>
          {hasProgress ? "Continue where you left off →" : "Get started →"}
        </Button>

        {hasProgress && (
          <Button variant="secondary" onClick={onStartOver}>
            Start over
          </Button>
        )}
      </div>

      <p className="cb-landing__note">
        {hasProgress
          ? "Starting over clears everything you’ve entered and any drafts."
          : "You’ll review the information before anything is turned into a draft."}
      </p>
    </div>
  );
}
