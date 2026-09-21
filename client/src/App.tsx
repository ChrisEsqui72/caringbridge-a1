import { useState } from "react";

import { LandingPage } from "./pages/LandingPage";
import { AudiencePage } from "./pages/AudiencePage";
import { PatientPage } from "./pages/PatientPage";
import { CarePage } from "./pages/CarePage";
import { CaregiverPage } from "./pages/CaregiverPage";
import { SupportPage } from "./pages/SupportPage";
import { ReviewPage } from "./pages/ReviewPage";
import { DraftsPage } from "./pages/DraftsPage";
import { EditorPage } from "./pages/EditorPage";
import { SharePage } from "./pages/SharePage";
import { PageShell } from "./components/PageShell";
import { createId } from "./lib/id";

import type { OnboardingData } from "../../shared/types";
import type { Draft } from "../../shared/types";

import "./styles/theme.css";

type Page =
  | "landing"
  | "audience"
  | "patient"
  | "care"
  | "caregiver"
  | "support"
  | "review"
  | "drafts"
  | "editor"
  | "share";

// Pages that count toward the progress indicator. Landing, drafts, the
// editor and sharing sit outside the numbered flow.
const onboardingSteps: Page[] = [
  "audience",
  "patient",
  "care",
  "caregiver",
  "support",
  "review",
];

const initialData: OnboardingData = {
  pageFor: null,

  patient: {
    name: "",
    dateOfBirth: "",
    location: "",
    diagnosis: "",
    description: "",
  },

  care: {
    nextSteps: "",
    upcomingEvents: [],
  },

  caregiver: {
    name: "",
    relationship: "",
    email: "",
    phone: "",
  },

  support: {
    meals: false,
    rides: false,
    childcare: false,
    petCare: false,
    householdHelp: false,
    visits: false,
    flowers: false,
    gifts: false,
    thoughtsPrayers: false,
    fundraising: false,
    phoneCalls: false,
    other: "",
  },
};

function App() {
  const [page, setPage] = useState<Page>("landing");
  const [data, setData] = useState<OnboardingData>(initialData);
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [selectedDraft, setSelectedDraft] = useState<Draft | null>(null);
  const [invites, setInvites] = useState<string[]>([]);

  const updateData = (updates: Partial<OnboardingData>) => {
    setData((current) => ({
      ...current,
      ...updates,
    }));
  };

  const updatePatient = (
    updates: Partial<OnboardingData["patient"]>
  ) => {
    setData((current) => ({
      ...current,
      patient: {
        ...current.patient,
        ...updates,
      },
    }));
  };

  const updateCare = (
    updates: Partial<OnboardingData["care"]>
  ) => {
    setData((current) => ({
      ...current,
      care: {
        ...current.care,
        ...updates,
      },
    }));
  };

  const updateCaregiver = (
    updates: Partial<OnboardingData["caregiver"]>
  ) => {
    setData((current) => ({
      ...current,
      caregiver: {
        ...current.caregiver,
        ...updates,
      },
    }));
  };

  const updateSupport = (
  key: keyof OnboardingData["support"],
  value: boolean
) => {
  setData((current) => ({
    ...current,
    support: {
      ...current.support,
      [key]: value,
    },
  }));
};

  const navigate = (nextPage: Page) => {
    setPage(nextPage);
  };

  // Opens the editor on an empty draft so the user can write their own
  // update instead of starting from one of the generated options.
  const startOwnDraft = () => {
    setSelectedDraft({
      id: createId(),
      tone: "custom",
      title: "",
      body: "",
      coveredTopics: [],
    });

    navigate("editor");
  };

  const saveDraft = (updatedDraft: Draft) => {
    setSelectedDraft(updatedDraft);

    // An untouched "Draft my own post" is not worth a card. Without this,
    // opening it and backing out leaves a blank card, and they stack.
    const isEmptyOwnDraft =
      updatedDraft.tone === "custom" &&
      !updatedDraft.title.trim() &&
      !updatedDraft.body.trim();

    setDrafts((currentDrafts) => {
      if (isEmptyOwnDraft) {
        return currentDrafts.filter(
          (draft) => draft.id !== updatedDraft.id
        );
      }

      return currentDrafts.some((draft) => draft.id === updatedDraft.id)
        ? currentDrafts.map((draft) =>
            draft.id === updatedDraft.id ? updatedDraft : draft
          )
        : [...currentDrafts, updatedDraft];
    });
  };

  // Starting over should not inherit the previous run's answers or drafts.
  const startOver = () => {
    setData(initialData);
    setDrafts([]);
    setSelectedDraft(null);
    setInvites([]);
    navigate("landing");
  };

  const renderDraftsPage = () => (
    <DraftsPage
      data={data}
      drafts={drafts}
      setDrafts={setDrafts}
      onSelect={(draft) => {
        setSelectedDraft(draft);
        navigate("editor");
      }}
      onBack={() => navigate("review")}
      onDraftOwn={startOwnDraft}
    />
  );

  const renderPage = () => {
  switch (page) {
    case "landing":
      return (
        <LandingPage
          onNext={() => navigate("audience")}
        />
      );

    case "audience":
      return (
        <AudiencePage
          data={data}
          updateData={updateData}
          onBack={() => navigate("landing")}
          onNext={() => navigate("patient")}
        />
      );

    case "patient":
      return (
        <PatientPage
          data={data}
          updatePatient={updatePatient}
          onBack={() => navigate("audience")}
          onNext={() => navigate("care")}
        />
      );

    case "care":
      return (
        <CarePage
          data={data}
          updateCare={updateCare}
          onBack={() => navigate("patient")}
          onNext={() => navigate("caregiver")}
        />
      );

    case "caregiver":
      return (
        <CaregiverPage
          data={data}
          updateCaregiver={updateCaregiver}
          onBack={() => navigate("care")}
          onNext={() => navigate("support")}
        />
      );

    case "support":
      return (
        <SupportPage
          data={data}
          updateSupport={updateSupport}
          onBack={() => navigate("caregiver")}
          onNext={() => navigate("review")}
        />
      );

    case "review":
      return (
        <ReviewPage
          data={data}
          onBack={() => navigate("support")}
          onNext={() => navigate("drafts")}
        />
      );

    case "drafts":
      return renderDraftsPage();

    case "editor":
      if (!selectedDraft) {
        return renderDraftsPage();
      }

      return (
        <EditorPage
          draft={selectedDraft}
          data={data}
          onSave={saveDraft}
          onBack={(updatedDraft) => {
            saveDraft(updatedDraft);
            navigate("drafts");
          }}
          onFinish={(updatedDraft) => {
            saveDraft(updatedDraft);
            navigate("share");
          }}
        />
      );

    case "share":
      if (!selectedDraft) {
        return renderDraftsPage();
      }

      return (
        <SharePage
          draft={selectedDraft}
          data={data}
          invites={invites}
          setInvites={setInvites}
          onBack={() => navigate("editor")}
          onDone={startOver}
        />
      );
    default:
      return null;
  }
  };

  const step = onboardingSteps.indexOf(page);

  return (
    <PageShell
      step={step >= 0 ? step + 1 : undefined}
      totalSteps={step >= 0 ? onboardingSteps.length : undefined}
    >
      {renderPage()}
    </PageShell>
  );
}

export default App;