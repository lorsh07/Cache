import type { SavedItem } from "../store";
import type { Recommendation } from "../../shared/types";
import { RecCard } from "../components/RecCard";

export function Saved({ saved, onToggle, onLog }: { saved: SavedItem[]; onToggle: (r: Recommendation) => void; onLog: (r: Recommendation) => void }) {
  if (!saved.length) {
    return <p className="secondary center pad-y">마음에 드는 추천을 보관해 두면 여기에 모여요.</p>;
  }
  return (
    <div className="rec-list">
      {saved.map((r) => (
        <RecCard key={r.title} rec={r} saved onSave={() => onToggle(r)} onLog={() => onLog(r)} />
      ))}
    </div>
  );
}
