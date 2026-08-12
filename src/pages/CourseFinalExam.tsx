import { Helmet } from 'react-helmet-async';
import { Link, useParams } from 'react-router-dom';
import { useState } from 'react';
import Navigation from '@/components/Navigation';
import { useCourseByCountry } from '@/hooks/useCourses';
import { useCourseProgress } from '@/hooks/useCourseProgress';
import Quiz from '@/components/courses/Quiz';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Award, Lock, ShieldCheck } from 'lucide-react';

export default function CourseFinalExam() {
  const { country } = useParams<{ country: string }>();
  const { course, modules, loading } = useCourseByCountry(country);
  const { progress, recordFinalExam } = useCourseProgress(country);
  const [started, setStarted] = useState(false);

  if (loading) {
    return (
      <>
        <Navigation />
        <main className="container mx-auto px-4 py-16 text-center text-muted-foreground">
          Loading exam…
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

  const allComplete =
    modules.length > 0 &&
    modules.every((m) => progress.completedModules.includes(m.slug));
  const threshold = course.final_pass_threshold ?? 70;
  const hasQuestions = course.final_quiz && course.final_quiz.length > 0;

  return (
    <>
      <Helmet>
        <title>Final Exam · {course.title} | Future Homes Academy</title>
        <meta
          name="description"
          content={`Final exam for ${course.title}. Test all the competencies you built across the course.`}
        />
      </Helmet>

      <Navigation />

      <main className="min-h-screen bg-gradient-to-b from-muted/40 via-background to-background">
        <section className="container mx-auto px-4 py-10 max-w-3xl">
          <Button asChild variant="ghost" size="sm" className="mb-4">
            <Link to={`/courses/${course.country_code}`}>
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to course
            </Link>
          </Button>

          <div className="flex items-center gap-3 mb-3">
            <div className="p-2.5 rounded-xl bg-primary/15 text-primary">
              <Award className="w-6 h-6" />
            </div>
            <span className="text-sm font-medium text-primary uppercase tracking-wider">
              Final Exam
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
            {course.title}
          </h1>
          <p className="text-muted-foreground text-lg mb-8">
            Test the competencies you built across all {modules.length} modules.
            Score at least {threshold}% to earn your course certification.
          </p>

          {!hasQuestions && (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">
                The final exam for this course is being prepared. Check back soon.
              </p>
            </Card>
          )}

          {hasQuestions && !allComplete && (
            <Card className="p-8 text-center">
              <Lock className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <h2 className="text-xl font-semibold mb-1">Finish every module first</h2>
              <p className="text-muted-foreground mb-5">
                Complete all {modules.length} modules to unlock the final exam.
              </p>
              <Button asChild>
                <Link to={`/courses/${course.country_code}`}>Go to modules</Link>
              </Button>
            </Card>
          )}

          {hasQuestions && allComplete && !started && (
            <Card className="p-8">
              <div className="grid sm:grid-cols-3 gap-4 mb-6 text-center">
                <div className="p-4 rounded-lg bg-muted/50">
                  <div className="text-2xl font-bold">{course.final_quiz.length}</div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wide">
                    Questions
                  </div>
                </div>
                <div className="p-4 rounded-lg bg-muted/50">
                  <div className="text-2xl font-bold">{threshold}%</div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wide">
                    To pass
                  </div>
                </div>
                <div className="p-4 rounded-lg bg-muted/50">
                  <div className="text-2xl font-bold">
                    {progress.finalExamScore ?? '—'}
                    {progress.finalExamScore != null && '%'}
                  </div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wide">
                    Best score
                  </div>
                </div>
              </div>

              {progress.finalExamPassed && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-primary/10 text-primary mb-6">
                  <ShieldCheck className="w-5 h-5" />
                  <span className="text-sm font-medium">
                    You already passed this exam — you can retake it any time.
                  </span>
                </div>
              )}

              <Button size="lg" className="w-full" onClick={() => setStarted(true)}>
                {progress.finalExamPassed ? 'Retake the final exam' : 'Start the final exam'}
              </Button>
            </Card>
          )}

          {hasQuestions && allComplete && started && (
            <Quiz
              questions={course.final_quiz}
              passThreshold={threshold}
              onComplete={(score, passed) => recordFinalExam(score, passed)}
            />
          )}
        </section>
      </main>
    </>
  );
}
