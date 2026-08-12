import { Helmet } from 'react-helmet-async';
import { Link, useParams } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import { useCourseByCountry } from '@/hooks/useCourses';
import { useCourseProgress } from '@/hooks/useCourseProgress';
import ModuleListItem from '@/components/courses/ModuleListItem';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Award, ArrowLeft, Clock, GraduationCap, RotateCcw } from 'lucide-react';

export default function CourseOverview() {
  const { country } = useParams<{ country: string }>();
  const { course, modules, loading } = useCourseByCountry(country);
  const { progress, isModuleUnlocked, resetCountry } = useCourseProgress(country);

  if (loading) {
    return (
      <>
        <Navigation />
        <main className="container mx-auto px-4 py-16">
          <p className="text-center text-muted-foreground">Loading course…</p>
        </main>
      </>
    );
  }

  if (!course) {
    return (
      <>
        <Navigation />
        <main className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Course not found</h1>
          <Button asChild>
            <Link to="/courses">Back to all courses</Link>
          </Button>
        </main>
      </>
    );
  }

  const slugsInOrder = modules.map((m) => m.slug);
  const completedCount = progress.completedModules.filter((s) => slugsInOrder.includes(s)).length;
  const percent = modules.length > 0 ? Math.round((completedCount / modules.length) * 100) : 0;
  const allComplete = modules.length > 0 && completedCount === modules.length;

  return (
    <>
      <Helmet>
        <title>{course.title} | Future Homes Academy</title>
        <meta name="description" content={course.description} />
      </Helmet>

      <Navigation />

      <main className="min-h-screen bg-background">
        <section className="bg-gradient-to-br from-primary/10 via-background to-accent/5 py-12 border-b">
          <div className="container mx-auto px-4 max-w-4xl">
            <Button asChild variant="ghost" size="sm" className="mb-4">
              <Link to="/courses">
                <ArrowLeft className="w-4 h-4 mr-2" /> All courses
              </Link>
            </Button>
            <h1 className="text-3xl md:text-4xl font-bold mb-3">{course.title}</h1>
            <p className="text-muted-foreground text-lg mb-6">{course.description}</p>
            <div className="flex flex-wrap items-center gap-5 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4" />
                {modules.length} modules
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                ~{course.estimated_minutes} minutes
              </span>
              <span className="px-2 py-0.5 rounded bg-primary/10 text-primary font-medium">
                {course.difficulty}
              </span>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-10 max-w-4xl">
          {modules.length > 0 && (
            <div className="mb-8">
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium">Course progress</span>
                <span className="text-muted-foreground">
                  {completedCount} / {modules.length} modules · {percent}%
                </span>
              </div>
              <Progress value={percent} className="h-2" />
            </div>
          )}

          {allComplete && (
            <div className="mb-8 p-6 rounded-xl border-2 border-primary bg-primary/5 text-center">
              <Award className="w-12 h-12 text-primary mx-auto mb-2" />
              <h3 className="text-xl font-bold mb-1">All modules complete!</h3>
              <p className="text-sm text-muted-foreground">
                You've finished every module of {course.title}.
              </p>
            </div>
          )}

          {modules.length > 0 && (
            <div className="mb-8 p-6 rounded-xl border bg-gradient-to-br from-primary/10 to-primary/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1 text-xs font-semibold uppercase tracking-wider text-primary">
                  <Award className="w-4 h-4" /> Final exam
                </div>
                <h3 className="font-semibold text-lg">Test all your competencies</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {allComplete
                    ? progress.finalExamPassed
                      ? `Passed with ${progress.finalExamScore}% — retake any time.`
                      : 'Unlocked. Score 70% to earn certification.'
                    : 'Unlocks after you complete every module.'}
                </p>
              </div>
              <Button asChild disabled={!allComplete} variant={allComplete ? 'default' : 'outline'}>
                <Link to={`/courses/${course.country_code}/final-exam`}>
                  {progress.finalExamPassed ? 'Retake exam' : allComplete ? 'Start final exam' : 'Locked'}
                </Link>
              </Button>
            </div>
          )}

          <div className="space-y-3">
            {modules.map((mod, idx) => (
              <ModuleListItem
                key={mod.id}
                countryCode={course.country_code}
                module={mod}
                index={idx}
                unlocked={isModuleUnlocked(idx, slugsInOrder)}
                completed={progress.completedModules.includes(mod.slug)}
                score={progress.quizScores[mod.slug]}
              />
            ))}
          </div>

          {progress.completedModules.length > 0 && (
            <div className="mt-8 text-center">
              <Button variant="ghost" size="sm" onClick={resetCountry}>
                <RotateCcw className="w-4 h-4 mr-2" /> Reset my progress for this course
              </Button>
            </div>
          )}
        </section>
      </main>
    </>
  );
}
