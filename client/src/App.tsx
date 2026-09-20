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
  | "editor";

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
      return (
        <DraftsPage
          data={data}
          drafts={drafts}
          setDrafts={setDrafts}
          onSelect={(draft) => {
            setSelectedDraft(draft);
            navigate("editor");
          }}
          onBack={() => navigate("review")}
          onNext={() => navigate("editor")}
        />
      );

    case "editor":
      if (!selectedDraft) {
        return (
          <DraftsPage
            data={data}
            drafts={drafts}
            setDrafts={setDrafts}
            onSelect={(draft) => {
              setSelectedDraft(draft);
              navigate("editor");
            }}
            onBack={() => navigate("review")}
            onNext={() => navigate("editor")}
          />
        );
      }

      return (
        <EditorPage
          draft={selectedDraft}
          onSave={(updatedDraft) => {
            setSelectedDraft(updatedDraft);

            setDrafts((currentDrafts) =>
              currentDrafts.map((draft) =>
                draft.id === updatedDraft.id ? updatedDraft : draft
              )
            );
          }}
          onBack={() => navigate("drafts")}
          onFinish={() => navigate("landing")}
        />
      );
    default:
      return null;
  }
}

export default App;