// hooks/useKpiData.ts
import { useEffect, useState } from "react";
import { supabase } from "./createClient";

type KpiRecord = {
  dropout_label: string;
  dropped_at: number;
};

export function useKpiData() {
  const [data, setData] = useState<KpiRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchKpis() {
      const { data, error } = await supabase
        .from("dashboard_kpis")
        .select("dropout_label, dropped_at")
        .order("dropped_at", { ascending: false });

      if (!error && data) setData(data);
      setLoading(false);
    }

    fetchKpis();
  }, []);

  return { data, loading };
}
