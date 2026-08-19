ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS phone text NOT NULL DEFAULT '';
ALTER TABLE public.library_items ADD COLUMN IF NOT EXISTS content text NOT NULL DEFAULT '';

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  _role public.app_role;
  _roll text;
  _sid uuid;
  _class int;
  _school text;
BEGIN
  _role := COALESCE(NULLIF(NEW.raw_user_meta_data->>'role','')::public.app_role, 'student');
  _roll := NULLIF(NEW.raw_user_meta_data->>'roll_number','');
  _class := COALESCE(NULLIF(NEW.raw_user_meta_data->>'class_level','')::int, 8);
  _school := COALESCE(NULLIF(NEW.raw_user_meta_data->>'school_name',''), 'Government School');

  INSERT INTO public.profiles (id, full_name, phone)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name',''), COALESCE(NEW.raw_user_meta_data->>'phone',''))
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, _role)
  ON CONFLICT DO NOTHING;

  IF _roll IS NOT NULL THEN
    SELECT id INTO _sid FROM public.students WHERE roll_number = _roll;
    IF _sid IS NULL AND _role = 'student' THEN
      INSERT INTO public.students (roll_number, full_name, class_level, school_name, user_id)
      VALUES (_roll, COALESCE(NEW.raw_user_meta_data->>'full_name',''), _class, _school, NEW.id)
      RETURNING id INTO _sid;
    ELSIF _sid IS NOT NULL THEN
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
$function$;