// charts/drawBar.ts
import {
  SciChartSurface,
  NumericAxis,
  CategoryAxis,
  NumberRange,
  StackedColumnRenderableSeries,
  XyDataSeries,
} from "scichart";
// Only import the LightTheme
import { SciChartJSLightTheme } from "scichart/Charting/Themes/SciChartJSLightTheme";

SciChartSurface.loadWasmFromCDN();

export const drawBar = async (
  rootElement: string | HTMLDivElement,
  inputData: { labels: string[]; counts: number[] }
) => {
  // 1) Create the Surface
  const { wasmContext, sciChartSurface } = await SciChartSurface.create(
    rootElement
  );

  // 2) Always apply the Light theme
  sciChartSurface.applyTheme(new SciChartJSLightTheme());

  // 3) Rest of your setup unchanged
  const { labels, counts } = inputData;
  const xValues = labels.map((_, i) => i);
  const yValues = counts;

  const xAxis = new CategoryAxis(wasmContext, {
    drawLabels: false,
    drawMajorGridLines: false,
    drawMinorGridLines: false,
    visibleRange: new NumberRange(-0.5, xValues.length - 0.5),
  });
  (xAxis as any).formatLabel = (d: number) => labels[Math.round(d)] || "";
  sciChartSurface.xAxes.add(xAxis);

  sciChartSurface.yAxes.add(
    new NumericAxis(wasmContext, {
      axisTitle: "Users Dropped",
      growBy: new NumberRange(0.1, 0.1),
    })
  );

  sciChartSurface.renderableSeries.add(
    new StackedColumnRenderableSeries(wasmContext, {
      dataSeries: new XyDataSeries(wasmContext, {
        xValues,
        yValues,
        dataSeriesName: "Dropouts",
      }),
      fill: "white",
    })
  );

  sciChartSurface.zoomExtents();
  return { wasmContext, sciChartSurface };
};
