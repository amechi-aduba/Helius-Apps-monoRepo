// charts/handleMountainLine.tsx
import * as React from "react";
import { SciChartReact } from "scichart-react";
import { drawMountainLine, MountainOptions } from "./drawMountainLine";
import { supabase } from "../supabase/createClient";

interface Props {
  type: "completion" | "engagement";
}

export default function MountainLine({ type }: Props) {
  const [chartData, setChartData] = React.useState<{
    xValues: number[];
    yValues: number[];
  }>({ xValues: [], yValues: [] });
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    (async () => {
      if (type === "completion") {
        // 1) Pull sign-up dates
        const { data: signupRows } = await supabase
          .from("hel_candidate")
          .select("creation_date")
          .not("creation_date", "is", null);

        // 2) Pull scored completion dates
        const { data: scoreRows } = await supabase
          .from("hel_scores")
          .select("creation_date")
          .not("creation_date", "is", null);

        // 3) Tally sign-ups per day
        const signupsMap = new Map<string, number>();
        signupRows?.forEach((r: any) => {
          const day = r.creation_date.split("T")[0];
          signupsMap.set(day, (signupsMap.get(day) || 0) + 1);
        });

        // 4) Tally completions per day
        const completionsMap = new Map<string, number>();
        scoreRows?.forEach((r: any) => {
          const day = r.creation_date.split("T")[0];
          completionsMap.set(day, (completionsMap.get(day) || 0) + 1);
        });

        // 5) Merge & sort all days
        const allDays = Array.from(
          new Set([...signupsMap.keys(), ...completionsMap.keys()])
        ).sort();

        // 6) Build cumulative completion %
        let cumSignups = 0,
          cumCompletions = 0;
        const xValues = allDays.map((_, i) => i);
        const yValues = allDays.map((day) => {
          cumSignups += signupsMap.get(day) || 0;
          cumCompletions += completionsMap.get(day) || 0;
          return cumSignups > 0
            ? Math.round((cumCompletions / cumSignups) * 1000) / 10
            : 0;
        });

        setChartData({ xValues, yValues });
      } else {
        // engagement: count messages per day
        const { data: rows } = await supabase
          .from("hel_chat_logs")
          .select("sms_created_date")
          .not("sms_created_date", "is", null);

        const counts = new Map<string, number>();
        rows?.forEach((r: any) => {
          const day = r.sms_created_date.split("T")[0];
          counts.set(day, (counts.get(day) || 0) + 1);
        });

        const days = Array.from(counts.keys()).sort();
        setChartData({
          xValues: days.map((_, i) => i),
          yValues: days.map((d) => counts.get(d)!),
        });
      }

      setReady(true);
    })();
  }, [type]);

  if (!ready) return <div>Loading...</div>;

  const axisOpts: MountainOptions =
    type === "completion"
      ? { xAxisTitle: "Days Since Launch", yAxisTitle: "Completion Rate (%)" }
      : { xAxisTitle: "Days Since Launch", yAxisTitle: "Messages per Day" };

  return (
    <SciChartReact
      initChart={(root) => drawMountainLine(root, chartData, axisOpts)}
      style={{ height: "300px", width: "100%" }}
    />
  );
}
