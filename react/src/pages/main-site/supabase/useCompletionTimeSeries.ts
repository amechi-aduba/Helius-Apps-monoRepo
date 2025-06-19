// hooks/useCompletionTimeSeries.ts
import { useState, useEffect } from "react";
import { supabase } from "../supabase/createClient";

export interface DayMetrics {
  day: string;
  signups: number;
  completions: number;
  completionPct: number;
}

export function useCompletionTimeSeries() {
  const [data, setData] = useState<DayMetrics[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      // 1) Sign-ups per day
      const { data: signupRows } = await supabase
        .from("hel_candidate")
        .select("creation_date")
        .not("creation_date", "is", null);

      // 2) “True” completions per day – pulled from hel_scores.creation_date
      const { data: scoreRows } = await supabase
        .from("hel_scores")
        .select("creation_date")
        .not("creation_date", "is", null);

      // 3) Group into maps
      const signupsMap = new Map<string, number>();
      signupRows?.forEach((r: any) => {
        const day = r.creation_date.slice(0, 10);
        signupsMap.set(day, (signupsMap.get(day) || 0) + 1);
      });

      const completionsMap = new Map<string, number>();
      scoreRows?.forEach((r: any) => {
        const day = r.creation_date.slice(0, 10);
        completionsMap.set(day, (completionsMap.get(day) || 0) + 1);
      });

      // 4) Build a sorted list of all days
      const days = Array.from(
        new Set([...signupsMap.keys(), ...completionsMap.keys()])
      ).sort();

      // 5) Compose your DayMetrics
      const series = days.map((day) => {
        const s = signupsMap.get(day) || 0;
        const c = completionsMap.get(day) || 0;
        const pct = s > 0 ? Math.round((c / s) * 1000) / 10 : 0;
        return { day, signups: s, completions: c, completionPct: pct };
      });

      setData(series);
      setLoading(false);
    })();
  }, []);

  return { data, loading };
}
