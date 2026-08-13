import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export type Role = "student" | "parent" | "official";

type Ctx = {
  session: Session | null;
  user: User | null;
  role: Role | null;
  fullName: string;
  loading: boolean;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<Ctx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [role, setRole] = useState<Role | null>(null);
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_event, next) => {
      setSession(next);
      if (!next) {
        setRole(null);
        setFullName("");
      }
    });
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const uid = session?.user.id;
    if (!uid) return;
    let cancelled = false;
    (async () => {
      const [{ data: roles }, { data: profile }] = await Promise.all([
        supabase.from("user_roles").select("role").eq("user_id", uid).limit(1),
        supabase.from("profiles").select("full_name").eq("id", uid).maybeSingle(),
      ]);
      if (cancelled) return;
      setRole((roles?.[0]?.role as Role) ?? null);
      setFullName(profile?.full_name ?? "");
    })();
    return () => {
      cancelled = true;
    };
  }, [session?.user.id]);

  const value = useMemo<Ctx>(
    () => ({
      session,
      user: session?.user ?? null,
      role,
      fullName,
      loading,
      signOut: async () => {
        await supabase.auth.signOut();
        setRole(null);
      },
    }),
    [session, role, fullName, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
