import { Helmet } from 'react-helmet-async';
import { Link, NavLink, useNavigate, useParams } from 'react-router-dom';
import { useMemo, useState } from 'react';
import DOMPurify from 'dompurify';
import Navigation from '@/components/Navigation';
import { useCourseByCountry } from '@/hooks/useCourses';
import { useCourseProgress } from '@/hooks/useCourseProgress';
import Quiz from '@/components/courses/Quiz';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Lightbulb,
  Clock,
  BookOpen,
  Circle,
} from 'lucide-react';

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
  const nextModule =
    moduleIdx >= 0 && moduleIdx < modules.length - 1 ? modules[moduleIdx + 1] : null;
  const prevModule = moduleIdx > 0 ? modules[moduleIdx - 1] : null;
  const isCompleted = mod ? progress.completedModules.includes(mod.slug) : false;

  const completedCount = progress.completedModules.length;
  const totalCount = modules.length || 1;
  const progressPct = Math.round((completedCount / totalCount) * 100);

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
  const readingMinutes = Math.max(3, Math.round(mod.body_html.replace(/<[^>]+>/g, '').split(/\s+/).length / 200));

  return (
    <>
      <Helmet>
        <title>{mod.title} | {course.title}</title>
        <meta name="description" content={mod.summary || course.description} />
      </Helmet>

      <Navigation />

      <main className="min-h-screen bg-gradient-to-b from-muted/40 via-background to-background">
        {/* Hero */}
        <header className="relative">
          <div className="relative h-[42vh] min-h-[280px] max-h-[420px] w-full overflow-hidden">
            {mod.image_url ? (
              <img
                src={mod.image_url}
                alt={mod.title}
                className="absolute inset-0 w-full h-full object-cover"
                loading="eager"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-primary/5" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/10" />
          </div>

          <div className="container mx-auto px-4 -mt-32 md:-mt-40 relative">
            <div className="max-w-4xl">
              <Button asChild variant="ghost" size="sm" className="mb-4 backdrop-blur bg-background/60 hover:bg-background/80">
                <Link to={`/courses/${course.country_code}`}>
                  <ArrowLeft className="w-4 h-4 mr-2" /> Back to course
                </Link>
              </Button>

              <div className="flex flex-wrap items-center gap-2 text-xs font-medium mb-3">
                <span className="px-2.5 py-1 rounded-full bg-primary text-primary-foreground">
                  Module {moduleIdx + 1} of {modules.length}
                </span>
                <span className="px-2.5 py-1 rounded-full bg-background/80 backdrop-blur text-foreground border">
                  {course.title}
                </span>
                <span className="px-2.5 py-1 rounded-full bg-background/80 backdrop-blur text-muted-foreground border flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {readingMinutes} min read
                </span>
                {isCompleted && (
                  <span className="px-2.5 py-1 rounded-full bg-green-600/90 text-white flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Completed
                  </span>
                )}
              </div>

              <h1 className="text-3xl md:text-5xl font-bold tracking-tight leading-tight">
                {mod.title}
              </h1>
              {mod.summary && (
                <p className="text-lg md:text-xl text-muted-foreground mt-3 max-w-3xl">
                  {mod.summary}
                </p>
              )}

              <div className="mt-6 max-w-md">
                <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
                  <span>Course progress</span>
                  <span>{completedCount}/{totalCount} modules</span>
                </div>
                <Progress value={progressPct} className="h-2" />
              </div>
            </div>
          </div>
        </header>

        {/* Body */}
        <div className="container mx-auto px-4 py-10">
          <div className="grid lg:grid-cols-[1fr_280px] gap-10 max-w-6xl mx-auto">
            <article>
              <div
                className="prose prose-slate dark:prose-invert max-w-none prose-headings:font-semibold prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-3 prose-h3:text-xl prose-p:leading-relaxed prose-strong:text-foreground prose-a:text-primary mb-10"
                dangerouslySetInnerHTML={{ __html: sanitizedBody }}
              />

              {mod.key_takeaways.length > 0 && (
                <Card className="p-6 mb-10 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="p-2 rounded-lg bg-primary/15">
                      <Lightbulb className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="font-semibold text-lg">Key takeaways</h3>
                  </div>
                  <ul className="space-y-3">
                    {mod.key_takeaways.map((t, i) => (
                      <li key={i} className="flex gap-3 text-sm md:text-base">
                        <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <span>{t}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              )}

              {!showQuiz ? (
                <Card className="p-6 md:p-8 bg-card border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">
                      {hasQuiz ? 'Ready to test what you learned?' : 'Finished reading?'}
                    </div>
                    <h3 className="font-semibold text-lg">
                      {hasQuiz
                        ? isCompleted
                          ? 'Retake the module quiz'
                          : `Take the ${mod.quiz.length}-question quiz`
                        : 'Mark this module as complete'}
                    </h3>
                  </div>
                  {hasQuiz ? (
                    <Button size="lg" onClick={() => setShowQuiz(true)}>
                      {isCompleted ? 'Retake quiz' : 'Start quiz'}{' '}
                      <ArrowRight className="w-4 h-4 ml-2" />
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
                </Card>
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

              {/* Prev / Next nav */}
              <div className="mt-12 grid sm:grid-cols-2 gap-4">
                {prevModule ? (
                  <Link
                    to={`/courses/${course.country_code}/${prevModule.slug}`}
                    className="group p-4 rounded-xl border hover:border-primary/40 hover:bg-muted/40 transition"
                  >
                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                      <ArrowLeft className="w-3 h-3" /> Previous
                    </div>
                    <div className="font-medium mt-1 group-hover:text-primary line-clamp-1">
                      {prevModule.title}
                    </div>
                  </Link>
                ) : <div />}
                {nextModule ? (
                  <Link
                    to={`/courses/${course.country_code}/${nextModule.slug}`}
                    className="group p-4 rounded-xl border hover:border-primary/40 hover:bg-muted/40 transition sm:text-right"
                  >
                    <div className="text-xs text-muted-foreground flex items-center gap-1 sm:justify-end">
                      Next <ArrowRight className="w-3 h-3" />
                    </div>
                    <div className="font-medium mt-1 group-hover:text-primary line-clamp-1">
                      {nextModule.title}
                    </div>
                  </Link>
                ) : <div />}
              </div>
            </article>

            {/* Sidebar TOC */}
            <aside className="hidden lg:block">
              <div className="sticky top-24 space-y-3">
                <Card className="p-4">
                  <div className="flex items-center gap-2 mb-3 text-sm font-semibold">
                    <BookOpen className="w-4 h-4 text-primary" />
                    Modules
                  </div>
                  <ol className="space-y-1">
                    {modules.map((m, i) => {
                      const done = progress.completedModules.includes(m.slug);
                      const active = m.slug === mod.slug;
                      return (
                        <li key={m.id}>
                          <NavLink
                            to={`/courses/${course.country_code}/${m.slug}`}
                            className={`flex items-start gap-2 px-2 py-2 rounded-md text-sm transition ${
                              active
                                ? 'bg-primary/10 text-primary font-medium'
                                : 'hover:bg-muted text-foreground'
                            }`}
                          >
                            {done ? (
                              <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                            ) : (
                              <Circle className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                            )}
                            <span className="line-clamp-2">
                              <span className="text-xs text-muted-foreground mr-1">
                                {String(i + 1).padStart(2, '0')}
                              </span>
                              {m.title.replace(/^Module \d+:\s*/i, '')}
                            </span>
                          </NavLink>
                        </li>
                      );
                    })}
                  </ol>
                </Card>
              </div>
            </aside>
          </div>
        </div>
      </main>
    </>
  );
}
