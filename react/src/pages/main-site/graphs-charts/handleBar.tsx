// charts/handleBar.tsx
import * as React from "react";
import { SciChartReact } from "scichart-react";
import { drawBar } from "./drawBar";
import { useKpiData } from "../supabase/fetchKpi";

export default function BarChart() {
  const { data, loading } = useKpiData();

  if (loading) return <div>Loading...</div>;

  const labels = data.map((d) => d.dropout_label);
  const counts = data.map((d) => d.dropped_at);

  return (
    <SciChartReact
      initChart={(root) => drawBar(root, { labels, counts })}
      className="chart-wrapper"
    />
  );
}
