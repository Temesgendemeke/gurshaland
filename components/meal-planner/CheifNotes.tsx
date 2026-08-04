import { NotebookPen, Target } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface CheifNotesProps {
  pro_tips: string[];
}

const CheifNotes = ({ pro_tips }: CheifNotesProps) => {
  return (
    pro_tips &&
    pro_tips.length > 0 && (
      <div className="space-y-5">
        <div className="flex items-center gap-3 pb-2 border-b border-border/40">
          <div className="p-2 rounded-lg text-primary ">
            <NotebookPen className="w-5 h-5" />
          </div>
          <h3 className="text-xl font-bold text-foreground">
            Chef&apos;s Notes
          </h3>
        </div>

        <div className={`grid gap-4`}>
          {pro_tips.map((tip, idx) => (
            <div
              key={idx}
              className="border rounded-lg p-4 bg-card transition-colors cursor-default"
            >
              <div className="prose prose-sm prose-neutral max-w-none text-lg flex items-start gap-2">
                <div className="shrink-0">
                  <Target className="w-5 h-5 text-primary" />
                </div>
                <ReactMarkdown>{tip}</ReactMarkdown>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  );
};

export default CheifNotes;
