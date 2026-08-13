
CREATE TYPE public.app_role AS ENUM ('student','parent','official');
CREATE TYPE public.complaint_status AS ENUM ('submitted','under_review','resolved');

CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own profile read" ON public.profiles FOR SELECT TO authenticated USING (id = auth.uid());
CREATE POLICY "own profile write" ON public.profiles FOR UPDATE TO authenticated USING (id = auth.uid()) WITH CHECK (id = auth.uid());

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own roles read" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid());

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE TABLE public.students (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  roll_number text NOT NULL UNIQUE,
  full_name text NOT NULL,
  class_level int NOT NULL,
  school_name text NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.students TO authenticated;
GRANT ALL ON public.students TO service_role;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.parent_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  student_id uuid NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  UNIQUE (parent_user_id, student_id)
);
GRANT SELECT ON public.parent_links TO authenticated;
GRANT ALL ON public.parent_links TO service_role;
ALTER TABLE public.parent_links ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own links read" ON public.parent_links FOR SELECT TO authenticated USING (parent_user_id = auth.uid());

CREATE OR REPLACE FUNCTION public.can_view_student(_student_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.students s WHERE s.id = _student_id AND s.user_id = auth.uid())
      OR EXISTS (SELECT 1 FROM public.parent_links p WHERE p.student_id = _student_id AND p.parent_user_id = auth.uid())
$$;

CREATE POLICY "student visible to self and parent" ON public.students FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.can_view_student(id));

CREATE TABLE public.attendance (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  month date NOT NULL,
  present_days int NOT NULL,
  total_days int NOT NULL,
  UNIQUE (student_id, month)
);
GRANT SELECT ON public.attendance TO authenticated;
GRANT ALL ON public.attendance TO service_role;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;
CREATE POLICY "attendance visible to self and parent" ON public.attendance FOR SELECT TO authenticated
  USING (public.can_view_student(student_id));

CREATE TABLE public.results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  subject text NOT NULL,
  term text NOT NULL,
  marks int NOT NULL,
  max_marks int NOT NULL DEFAULT 100
);
GRANT SELECT ON public.results TO authenticated;
GRANT ALL ON public.results TO service_role;
ALTER TABLE public.results ENABLE ROW LEVEL SECURITY;
CREATE POLICY "results visible to self and parent" ON public.results FOR SELECT TO authenticated
  USING (public.can_view_student(student_id));

CREATE SEQUENCE public.ticket_seq START 1001;
GRANT USAGE ON SEQUENCE public.ticket_seq TO authenticated, service_role;

CREATE TABLE public.complaints (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id text NOT NULL UNIQUE DEFAULT ('KS-' || to_char(now(),'YYYY') || '-' || nextval('public.ticket_seq')),
  created_by uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  student_id uuid REFERENCES public.students(id) ON DELETE SET NULL,
  school_name text NOT NULL,
  category text NOT NULL,
  description text NOT NULL,
  photo_url text,
  status public.complaint_status NOT NULL DEFAULT 'submitted',
  official_response text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.complaints TO authenticated;
GRANT ALL ON public.complaints TO service_role;
ALTER TABLE public.complaints ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own complaints read" ON public.complaints FOR SELECT TO authenticated
  USING (created_by = auth.uid() OR public.has_role(auth.uid(),'official'));
CREATE POLICY "create complaints" ON public.complaints FOR INSERT TO authenticated
  WITH CHECK (created_by = auth.uid());
CREATE POLICY "officials update complaints" ON public.complaints FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(),'official')) WITH CHECK (public.has_role(auth.uid(),'official'));

CREATE TABLE public.complaint_updates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  complaint_id uuid NOT NULL REFERENCES public.complaints(id) ON DELETE CASCADE,
  status public.complaint_status NOT NULL,
  note text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.complaint_updates TO authenticated;
GRANT ALL ON public.complaint_updates TO service_role;
ALTER TABLE public.complaint_updates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "updates visible with complaint" ON public.complaint_updates FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.complaints c WHERE c.id = complaint_id AND (c.created_by = auth.uid() OR public.has_role(auth.uid(),'official'))));
CREATE POLICY "officials add updates" ON public.complaint_updates FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(),'official'));

CREATE TABLE public.library_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  class_level int NOT NULL,
  subject text NOT NULL,
  topic text NOT NULL,
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  media_type text NOT NULL CHECK (media_type IN ('pdf','video')),
  url text NOT NULL,
  language text NOT NULL DEFAULT 'en',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.library_items TO anon, authenticated;
GRANT ALL ON public.library_items TO service_role;
ALTER TABLE public.library_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "library public read" ON public.library_items FOR SELECT USING (true);

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  _role public.app_role;
  _roll text;
  _sid uuid;
BEGIN
  _role := COALESCE(NULLIF(NEW.raw_user_meta_data->>'role','')::public.app_role, 'student');
  _roll := NULLIF(NEW.raw_user_meta_data->>'roll_number','');

  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name',''));

  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, _role)
  ON CONFLICT DO NOTHING;

  IF _roll IS NOT NULL THEN
    SELECT id INTO _sid FROM public.students WHERE roll_number = _roll;
    IF _sid IS NOT NULL THEN
      IF _role = 'student' THEN
        UPDATE public.students SET user_id = NEW.id WHERE id = _sid;
      ELSIF _role = 'parent' THEN
        INSERT INTO public.parent_links (parent_user_id, student_id) VALUES (NEW.id, _sid)
        ON CONFLICT DO NOTHING;
      END IF;
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;
CREATE TRIGGER complaints_touch BEFORE UPDATE ON public.complaints
FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

INSERT INTO public.students (roll_number, full_name, class_level, school_name) VALUES
  ('KS1001','Ananya Rao', 8, 'Govt. Higher Primary School, Hulimavu'),
  ('KS1002','Manoj Kumar', 9, 'Govt. High School, Yelahanka'),
  ('KS1003','Fathima Begum', 7, 'Govt. Higher Primary School, Hubballi');

INSERT INTO public.attendance (student_id, month, present_days, total_days)
SELECT s.id, m.month, m.p, m.t FROM public.students s
CROSS JOIN (VALUES
  (DATE '2026-02-01', 20, 24),
  (DATE '2026-03-01', 22, 25),
  (DATE '2026-04-01', 19, 23),
  (DATE '2026-05-01', 21, 22),
  (DATE '2026-06-01', 23, 25),
  (DATE '2026-07-01', 24, 26)
) AS m(month,p,t);

INSERT INTO public.results (student_id, subject, term, marks)
SELECT s.id, r.subject, r.term, r.marks FROM public.students s
CROSS JOIN (VALUES
  ('Kannada','Term 1', 78), ('English','Term 1', 71), ('Mathematics','Term 1', 65),
  ('Science','Term 1', 74), ('Social Science','Term 1', 69),
  ('Kannada','Term 2', 82), ('English','Term 2', 76), ('Mathematics','Term 2', 73),
  ('Science','Term 2', 80), ('Social Science','Term 2', 75)
) AS r(subject,term,marks);

INSERT INTO public.library_items (class_level, subject, topic, title, description, media_type, url) VALUES
  (8,'Mathematics','Linear Equations','Linear Equations in One Variable','Step-by-step solved examples with practice problems.','pdf','https://ncert.nic.in/textbook/pdf/hemh102.pdf'),
  (8,'Science','Crop Production','Crop Production and Management','Chapter notes covering agricultural practices.','pdf','https://ncert.nic.in/textbook/pdf/hesc101.pdf'),
  (9,'Mathematics','Number Systems','Number Systems Explained','Video lesson on rational and irrational numbers.','video','https://www.youtube.com/embed/qFN60wZE-Yc'),
  (9,'Science','Matter','Matter in Our Surroundings','Chapter notes on states of matter and change of state.','pdf','https://ncert.nic.in/textbook/pdf/iesc101.pdf'),
  (7,'English','Grammar','Basic English Grammar','Parts of speech and sentence formation for Class 7.','pdf','https://ncert.nic.in/textbook/pdf/gehc1dd.pdf'),
  (7,'Kannada','Reading','Kannada Reading Practice','Guided reading lesson in Kannada with pronunciation.','video','https://www.youtube.com/embed/2Vv-BfVoq4g'),
  (8,'Social Science','History','From Trade to Territory','How the East India Company became the master of India.','pdf','https://ncert.nic.in/textbook/pdf/hess102.pdf'),
  (9,'Mathematics','Polynomials','Polynomials Video Lesson','Concept video with worked examples.','video','https://www.youtube.com/embed/5_iBcNCJ2Hg');
