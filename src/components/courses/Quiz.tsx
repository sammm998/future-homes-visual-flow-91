import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CheckCircle2, XCircle, RotateCcw } from 'lucide-react';
import type { QuizQuestion } from '@/hooks/useCourses';
import { cn } from '@/lib/utils';

type Props = {
  questions: QuizQuestion[];
  onComplete: (scorePercent: number, passed: boolean) => void;
  passThreshold?: number; // default 70
};

export default function Quiz({ questions, onComplete, passThreshold = 70 }: Props) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [finished, setFinished] = useState(false);

  if (questions.length === 0) {
    return (
      <Card className="p-6 text-center">
        <p className="text-muted-foreground">No quiz for this module.</p>
        <Button className="mt-4" onClick={() => onComplete(100, true)}>
          Mark as complete
        </Button>
      </Card>
    );
  }

  const q = questions[currentIdx];
  const isLast = currentIdx === questions.length - 1;

  const submit = () => {
    if (selected === null) return;
    setRevealed(true);
  };

  const next = () => {
    const correct = selected === q.correctIndex;
    const newAnswers = [...answers, correct];
    setAnswers(newAnswers);

    if (isLast) {
      const score = Math.round((newAnswers.filter(Boolean).length / questions.length) * 100);
      setFinished(true);
      onComplete(score, score >= passThreshold);
    } else {
      setCurrentIdx(currentIdx + 1);
      setSelected(null);
      setRevealed(false);
    }
  };

  const restart = () => {
    setCurrentIdx(0);
    setSelected(null);
    setRevealed(false);
    setAnswers([]);
    setFinished(false);
  };

  if (finished) {
    const correctCount = answers.filter(Boolean).length;
    const score = Math.round((correctCount / questions.length) * 100);
    const passed = score >= passThreshold;
    return (
      <Card className="p-8 text-center">
        <div className="flex justify-center mb-4">
          {passed ? (
            <CheckCircle2 className="w-16 h-16 text-primary" />
          ) : (
            <XCircle className="w-16 h-16 text-destructive" />
          )}
        </div>
        <h3 className="text-2xl font-bold mb-2">
          {passed ? 'Passed!' : 'Not quite there'}
        </h3>
        <p className="text-muted-foreground mb-4">
          You got <strong>{correctCount}</strong> out of <strong>{questions.length}</strong> correct ({score}%).
          {!passed && ` You need ${passThreshold}% to unlock the next module.`}
        </p>
        {!passed && (
          <Button onClick={restart} variant="outline">
            <RotateCcw className="w-4 h-4 mr-2" />
            Try again
          </Button>
        )}
      </Card>
    );
  }

  return (
    <Card className="p-6 md:p-8">
      <div className="flex justify-between items-center mb-4 text-sm text-muted-foreground">
        <span>Question {currentIdx + 1} of {questions.length}</span>
        <span>Pass at {passThreshold}%</span>
      </div>
      <h3 className="text-xl font-semibold mb-6">{q.q}</h3>
      <div className="space-y-3">
        {q.options.map((opt, i) => {
          const isCorrect = i === q.correctIndex;
          const isPicked = i === selected;
          return (
            <button
              key={i}
              type="button"
              disabled={revealed}
              onClick={() => setSelected(i)}
              className={cn(
                'w-full text-left p-4 rounded-lg border-2 transition-colors',
                !revealed && isPicked && 'border-primary bg-primary/5',
                !revealed && !isPicked && 'border-border hover:border-primary/50',
                revealed && isCorrect && 'border-primary bg-primary/10',
                revealed && isPicked && !isCorrect && 'border-destructive bg-destructive/10',
                revealed && !isCorrect && !isPicked && 'border-border opacity-60'
              )}
            >
              <span className="font-medium">{opt}</span>
            </button>
          );
        })}
      </div>

      {revealed && q.explanation && (
        <div className="mt-4 p-4 rounded-lg bg-muted text-sm">
          <strong>Why:</strong> {q.explanation}
        </div>
      )}

      <div className="mt-6 flex justify-end gap-2">
        {!revealed ? (
          <Button onClick={submit} disabled={selected === null}>
            Submit answer
          </Button>
        ) : (
          <Button onClick={next}>{isLast ? 'See results' : 'Next question'}</Button>
        )}
      </div>
    </Card>
  );
}
