import * as React from "react";
import { SciChartReact } from "scichart-react";
import { drawBar } from "./drawBar";

export default function BarChart() {
  return <SciChartReact initChart={drawBar} />;
}
