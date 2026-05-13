import HistoryClient from "../../components/summarizer/HistoryClient";

export const metadata = {
  title: "History — AI Summarizer",
  description: "Browse and manage your saved summaries",
};

export default function HistoryPage() {
  return <HistoryClient />;
}
