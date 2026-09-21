import { SUPPORT_LABELS } from "../../../shared/types";

export const supportOptions = [
    {
        key: "meals",
        title: SUPPORT_LABELS.meals,
        description: "Home-cooked meals or meal delivery",
        icon: "🍲"
    },
    {
        key: "rides",
        title: SUPPORT_LABELS.rides,
        description: "Transportation to appointments",
        icon: "🚗"
    },
    {
        key: "childcare",
        title: SUPPORT_LABELS.childcare,
        description: "Help looking after children",
        icon: "👶"
    },
    {
        key: "petCare",
        title: SUPPORT_LABELS.petCare,
        description: "Walking, feeding, or watching pets",
        icon: "🐕"
    },
    {
        key: "householdHelp",
        title: SUPPORT_LABELS.householdHelp,
        description: "Errands, cleaning, or chores",
        icon: "🏠"
    },
    {
        key: "visits",
        title: SUPPORT_LABELS.visits,
        description: "Spending time with the patient",
        icon: "👋"
    },
    {
        key: "flowers",
        title: SUPPORT_LABELS.flowers,
        description: "Flowers or other gestures",
        icon: "💐"
    },
    {
        key: "gifts",
        title: SUPPORT_LABELS.gifts,
        description: "Gifts or care packages",
        icon: "🎁"
    },
    {
        key: "thoughtsPrayers",
        title: SUPPORT_LABELS.thoughtsPrayers,
        description: "Messages, encouragement, or prayer",
        icon: "🙏"
    },
    {
        key: "fundraising",
        title: SUPPORT_LABELS.fundraising,
        description: "Financial support",
        icon: "💵"
    },
    {
        key: "phoneCalls",
        title: SUPPORT_LABELS.phoneCalls,
        description: "Checking in by phone",
        icon: "📞"
    }
] as const;