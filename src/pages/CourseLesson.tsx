import { Helmet } from 'react-helmet-async';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useMemo, useState } from 'react';
import DOMPurify from 'dompurify';
import Navigation from '@/components/Navigation';
import { useCourseByCountry } from '@/hooks/useCourses';
import { useCourseProgress } from '@/hooks/useCourseProgress';
import Quiz from '@/components/courses/Quiz';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, ArrowRight, CheckCircle2, Lightbulb } from 'lucide-react';

export default function CourseLesson() {
  const { country, moduleSlug } = useParams<{ country: string; moduleSlug: string }>();
  const navigate = useNavigate();
  const { course, modules, loading } = useCourseByCountry(country);
  const { progress, completeModule } = useCourseProgress(country);
  const [showQuiz, setShowQuiz] = useState(false);

  const moduleIdx = useMemo(
    () => modules.findIndex((m) => m.slug === moduleSlug),
    [modules, moduleSlug]
  );
  const mod = moduleIdx >= 0 ? modules[moduleIdx] : null;
  const nextModule = moduleIdx >= 0 && moduleIdx < modules.length - 1 ? modules[moduleIdx + 1] : null;
  const isCompleted = mod ? progress.completedModules.includes(mod.slug) : false;

  if (loading) {
    return (
      <>
        <Navigation />
        <main className="container mx-auto px-4 py-16">
          <p className="text-center text-muted-foreground">Loading lesson…</p>
        </main>
      </>
    );
  }

  if (!course || !mod) {
    return (
      <>
        <Navigation />
        <main className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Lesson not found</h1>
          <Button asChild>
            <Link to={`/courses/${country || ''}`}>Back to course</Link>
          </Button>
        </main>
      </>
    );
  }

  const hasQuiz = mod.quiz.length > 0;
  const sanitizedBody = DOMPurify.sanitize(mod.body_html);

  return (
    <>
      <Helmet>
        <title>{mod.title} | {course.title}</title>
        <meta name="description" content={mod.summary || course.description} />
      </Helmet>

      <Navigation />

      <main className="min-h-screen bg-background">
        <article className="container mx-auto px-4 py-10 max-w-3xl">
          <Button asChild variant="ghost" size="sm" className="mb-4">
            <Link to={`/courses/${course.country_code}`}>
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to course
            </Link>
          </Button>

          <div className="text-sm text-muted-foreground mb-2">
            Module {moduleIdx + 1} of {modules.length}
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">{mod.title}</h1>
          {mod.summary && <p className="text-lg text-muted-foreground mb-6">{mod.summary}</p>}

          {mod.image_url && (
            <div className="rounded-xl overflow-hidden mb-8 aspect-[16/9] bg-muted">
              <img
                src={mod.image_url}
                alt={mod.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
          )}

          <div
            className="prose prose-slate dark:prose-invert max-w-none mb-10"
            dangerouslySetInnerHTML={{ __html: sanitizedBody }}
          />

          {mod.key_takeaways.length > 0 && (
            <Card className="p-6 mb-10 bg-primary/5 border-primary/20">
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb className="w-5 h-5 text-primary" />
                <h3 className="font-semibold">Key takeaways</h3>
              </div>
              <ul className="space-y-2">
                {mod.key_takeaways.map((t, i) => (
                  <li key={i} className="flex gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </Card>
          )}

          {!showQuiz ? (
            <div className="text-center">
              {hasQuiz ? (
                <Button size="lg" onClick={() => setShowQuiz(true)}>
                  {isCompleted ? 'Retake quiz' : 'Start quiz'} <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button
                  size="lg"
                  onClick={() => {
                    completeModule(mod.slug, 100);
                    if (nextModule) navigate(`/courses/${course.country_code}/${nextModule.slug}`);
                    else navigate(`/courses/${course.country_code}`);
                  }}
                >
                  Mark complete & continue <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          ) : (
            <div>
              <Quiz
                questions={mod.quiz}
                onComplete={(score, passed) => {
                  if (passed) completeModule(mod.slug, score);
                }}
              />
              <div className="mt-6 flex justify-between">
                <Button variant="outline" onClick={() => setShowQuiz(false)}>
                  Back to lesson
                </Button>
                {progress.completedModules.includes(mod.slug) && nextModule && (
                  <Button asChild>
                    <Link to={`/courses/${course.country_code}/${nextModule.slug}`}>
                      Next module <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                )}
                {progress.completedModules.includes(mod.slug) && !nextModule && (
                  <Button asChild>
                    <Link to={`/courses/${course.country_code}`}>Back to course overview</Link>
                  </Button>
                )}
              </div>
            </div>
          )}
        </article>
      </main>
    </>
  );
}
