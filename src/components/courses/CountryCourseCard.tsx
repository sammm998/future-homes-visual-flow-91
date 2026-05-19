import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { ArrowRight, Clock, GraduationCap } from 'lucide-react';
import type { Course } from '@/hooks/useCourses';

const COUNTRY_FLAGS: Record<string, string> = {
  turkey: '🇹🇷',
  dubai: '🇦🇪',
  cyprus: '🇨🇾',
  bali: '🇮🇩',
  spain: '🇪🇸',
  greece: '🇬🇷',
};

type Props = {
  course: Course;
  progressPercent: number;
  moduleCount: number;
};

export default function CountryCourseCard({ course, progressPercent, moduleCount }: Props) {
  return (
    <Card className="overflow-hidden hover:shadow-elegant transition-shadow group">
      <div className="relative h-40 bg-gradient-to-br from-primary/20 via-primary/10 to-accent/20 flex items-center justify-center">
        <span className="text-7xl" aria-hidden="true">
          {COUNTRY_FLAGS[course.country_code] || '🌍'}
        </span>
        <Badge className="absolute top-3 right-3" variant="secondary">
          {course.difficulty}
        </Badge>
      </div>

      <CardContent className="p-6">
        <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
          {course.title}
        </h3>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{course.description}</p>

        <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
          <span className="flex items-center gap-1">
            <GraduationCap className="w-3.5 h-3.5" />
            {moduleCount} {moduleCount === 1 ? 'module' : 'modules'}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            ~{course.estimated_minutes} min
          </span>
        </div>

        {progressPercent > 0 && (
          <div className="mb-4">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-muted-foreground">Your progress</span>
              <span className="font-medium">{progressPercent}%</span>
            </div>
            <Progress value={progressPercent} className="h-1.5" />
          </div>
        )}

        <Button asChild className="w-full" variant={progressPercent > 0 ? 'default' : 'outline'}>
          <Link to={`/courses/${course.country_code}`}>
            {progressPercent > 0 ? 'Continue course' : 'Start course'}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
