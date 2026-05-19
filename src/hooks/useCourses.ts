import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export type Course = {
  id: string;
  country_code: string;
  slug: string;
  title: string;
  description: string;
  hero_image: string | null;
  difficulty: string;
  estimated_minutes: number;
  language_code: string;
  order_index: number;
  is_published: boolean;
};

export type QuizQuestion = {
  q: string;
  options: string[];
  correctIndex: number;
  explanation?: string;
};

export type CourseModule = {
  id: string;
  course_id: string;
  slug: string;
  title: string;
  summary: string | null;
  body_html: string;
  image_url: string | null;
  key_takeaways: string[];
  quiz: QuizQuestion[];
  order_index: number;
  is_published: boolean;
};

export function useCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    supabase
      .from('courses')
      .select('*')
      .eq('is_published', true)
      .order('order_index')
      .then(({ data }) => {
        if (mounted) {
          setCourses((data as Course[]) || []);
          setLoading(false);
        }
      });
    return () => {
      mounted = false;
    };
  }, []);

  return { courses, loading };
}

export function useCourseByCountry(countryCode: string | undefined) {
  const [course, setCourse] = useState<Course | null>(null);
  const [modules, setModules] = useState<CourseModule[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!countryCode) return;
    let mounted = true;
    setLoading(true);

    (async () => {
      const { data: courseRows } = await supabase
        .from('courses')
        .select('*')
        .eq('country_code', countryCode)
        .eq('is_published', true)
        .limit(1);

      const courseRow = (courseRows?.[0] as Course | undefined) || null;
      if (!mounted) return;
      setCourse(courseRow);

      if (courseRow) {
        const { data: moduleRows } = await supabase
          .from('course_modules')
          .select('*')
          .eq('course_id', courseRow.id)
          .eq('is_published', true)
          .order('order_index');

        if (mounted) {
          setModules(((moduleRows as any[]) || []).map((m) => ({
            ...m,
            key_takeaways: Array.isArray(m.key_takeaways) ? m.key_takeaways : [],
            quiz: Array.isArray(m.quiz) ? m.quiz : [],
          })) as CourseModule[]);
        }
      } else {
        setModules([]);
      }
      if (mounted) setLoading(false);
    })();

    return () => {
      mounted = false;
    };
  }, [countryCode]);

  return { course, modules, loading };
}
