import * as React from "react";
import { SciChartReact } from "scichart-react";
import { drawMountainLine } from "./drawMountainLine"; // Make sure this matches the actual file name

export default function MountainLine() {
  return (
    <SciChartReact initChart={drawMountainLine} className="chart-wrapper" />
  );
}
