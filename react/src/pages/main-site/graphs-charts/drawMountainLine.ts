// charts/drawMountainLine.ts
import {
  SciChartSurface,
  NumericAxis,
  NumberRange,
  FastMountainRenderableSeries,
  GradientParams,
  Point,
  XyDataSeries,
} from "scichart";
import { SciChartJSLightTheme } from "scichart/Charting/Themes/SciChartJSLightTheme";

SciChartSurface.loadWasmFromCDN();

// New interface for axis titles
export interface MountainOptions {
  xAxisTitle?: string;
  yAxisTitle?: string;
}

export const drawMountainLine = async (
  rootElement: string | HTMLDivElement,
  chartData: { xValues: number[]; yValues: number[] },
  options: MountainOptions = {}
) => {
  const { wasmContext, sciChartSurface } = await SciChartSurface.create(
    rootElement
  );

  // Always apply the light theme
  sciChartSurface.applyTheme(new SciChartJSLightTheme());

  // X Axis
  sciChartSurface.xAxes.add(
    new NumericAxis(wasmContext, {
      axisTitle: options.xAxisTitle ?? "",
      growBy: new NumberRange(0.1, 0.1),
    })
  );

  // Y Axis
  sciChartSurface.yAxes.add(
    new NumericAxis(wasmContext, {
      axisTitle: options.yAxisTitle ?? "",
      growBy: new NumberRange(0.1, 0.1),
    })
  );

  // Data
  const ds = new XyDataSeries(wasmContext, {
    xValues: chartData.xValues,
    yValues: chartData.yValues,
  });

  sciChartSurface.renderableSeries.add(
    new FastMountainRenderableSeries(wasmContext, {
      dataSeries: ds,
      stroke: "#ffffff",
      strokeThickness: 2,
      fillLinearGradient: new GradientParams(new Point(0, 0), new Point(0, 1), [
        { offset: 0, color: "#ffffff88" },
        { offset: 1, color: "transparent" },
      ]),
    })
  );

  sciChartSurface.zoomExtents();
  return { wasmContext, sciChartSurface };
};
