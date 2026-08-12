import { Helmet } from 'react-helmet-async';
import Navigation from '@/components/Navigation';
import { useCourses } from '@/hooks/useCourses';
import { useAllCourseProgress } from '@/hooks/useCourseProgress';
import CountryCourseCard from '@/components/courses/CountryCourseCard';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { GraduationCap } from 'lucide-react';

export default function CoursesIndex() {
  const { courses, loading } = useCourses();
  const allProgress = useAllCourseProgress();
  const [moduleCounts, setModuleCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    if (courses.length === 0) return;
    (async () => {
      const { data } = await supabase
        .from('course_modules')
        .select('course_id')
        .eq('is_published', true);
      const counts: Record<string, number> = {};
      for (const row of (data as any[]) || []) {
        counts[row.course_id] = (counts[row.course_id] || 0) + 1;
      }
      setModuleCounts(counts);
    })();
  }, [courses]);

  return (
    <>
      <Helmet>
        <title>Real Estate Investment Courses | Future Homes</title>
        <meta
          name="description"
          content="Free pedagogical courses on investing in property across Turkey, Dubai, Cyprus, Bali, Spain and Greece. Learn the legal framework, taxes, financing and rental yields."
        />
        <link rel="canonical" href="https://future-homes-visual-flow-91.lovable.app/courses" />
      </Helmet>

      <Navigation />

      <main className="min-h-screen bg-background">
        <section className="relative bg-gradient-to-br from-primary/10 via-background to-accent/5 py-20 border-b">
          <div className="container mx-auto px-4 text-center max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium mb-4">
              <GraduationCap className="w-4 h-4" />
              Future Homes Academy
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Learn how to invest in international real estate
            </h1>
            <p className="text-lg text-muted-foreground">
              Free, country-specific courses covering the legal framework, taxes, financing, and the
              real numbers behind property investment. Each course has lessons, key takeaways and a
              quiz at the end of every module.
            </p>
          </div>
        </section>

        <section className="container mx-auto px-4 py-16">
          {loading ? (
            <p className="text-center text-muted-foreground">Loading courses…</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => {
                const moduleCount = moduleCounts[course.id] || 0;
                const progress = allProgress[course.country_code];
                const completed = progress?.completedModules.length || 0;
                const percent =
                  moduleCount > 0 ? Math.round((completed / moduleCount) * 100) : 0;
                return (
                  <CountryCourseCard
                    key={course.id}
                    course={course}
                    progressPercent={percent}
                    moduleCount={moduleCount}
                  />
                );
              })}
            </div>
          )}
        </section>
      </main>
    </>
  );
}
