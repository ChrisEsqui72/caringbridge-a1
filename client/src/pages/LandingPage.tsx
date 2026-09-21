import { Button } from "../components/Button";
import { PageHeader } from "../components/PageHeader";

interface LandingPageProps {
  onNext: () => void;
}

export function LandingPage({ onNext }: LandingPageProps) {
  return (
    <div className="cb-landing__card">
      <PageHeader
        eyebrow="Care Update Assistant"
        title="Share what’s happening. We’ll help you put it into words."
        description="Creating a care update can feel overwhelming, especially when you’re not sure where to start. Tell us a little about the situation, and we’ll help you create a few different drafts to choose from."
      />

      <div className="cb-landing__actions">
        <Button onClick={onNext}>
          Get started →
        </Button>
      </div>

      <p className="cb-landing__note">
        You’ll review the information before anything is turned into a
        draft.
      </p>
    </div>
  );
}
