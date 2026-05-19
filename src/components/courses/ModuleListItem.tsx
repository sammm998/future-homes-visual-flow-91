import { Link } from 'react-router-dom';
import { CheckCircle2, Lock, PlayCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { CourseModule } from '@/hooks/useCourses';

type Props = {
  countryCode: string;
  module: CourseModule;
  index: number;
  unlocked: boolean;
  completed: boolean;
  score?: number;
};

export default function ModuleListItem({
  countryCode,
  module,
  index,
  unlocked,
  completed,
  score,
}: Props) {
  const Wrapper: any = unlocked ? Link : 'div';
  const props = unlocked
    ? { to: `/courses/${countryCode}/${module.slug}` }
    : { 'aria-disabled': true };

  return (
    <Wrapper
      {...props}
      className={cn(
        'flex items-center gap-4 p-4 rounded-lg border transition-colors',
        unlocked && 'hover:border-primary hover:bg-muted/30 cursor-pointer',
        !unlocked && 'opacity-60 cursor-not-allowed'
      )}
    >
      <div
        className={cn(
          'w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0',
          completed && 'bg-primary text-primary-foreground',
          !completed && unlocked && 'bg-primary/10 text-primary',
          !unlocked && 'bg-muted text-muted-foreground'
        )}
      >
        {completed ? (
          <CheckCircle2 className="w-5 h-5" />
        ) : !unlocked ? (
          <Lock className="w-4 h-4" />
        ) : (
          <span className="font-semibold text-sm">{index + 1}</span>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <h4 className="font-semibold truncate">{module.title}</h4>
        {module.summary && (
          <p className="text-sm text-muted-foreground line-clamp-1">{module.summary}</p>
        )}
      </div>

      <div className="flex items-center gap-3 flex-shrink-0">
        {completed && score !== undefined && (
          <span className="text-xs font-medium text-primary">{score}%</span>
        )}
        {unlocked && !completed && <PlayCircle className="w-5 h-5 text-primary" />}
      </div>
    </Wrapper>
  );
}
