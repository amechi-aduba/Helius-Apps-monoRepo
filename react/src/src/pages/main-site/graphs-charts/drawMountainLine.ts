import {
  SciChartSurface,
  NumericAxis,
  NumberRange,
  FastMountainRenderableSeries,
  GradientParams,
  Point,
  XyDataSeries,
} from "scichart";

SciChartSurface.loadWasmFromCDN();

// You can remove appTheme if you're not styling right now
export const drawMountainLine = async (
  rootElement: string | HTMLDivElement
) => {
  const { sciChartSurface, wasmContext } = await SciChartSurface.create(
    rootElement
  );

  // Axes
  const xAxis = new NumericAxis(wasmContext, {
    growBy: new NumberRange(0.1, 0.1),
  });
  const yAxis = new NumericAxis(wasmContext, {
    growBy: new NumberRange(0.1, 0.1),
  });
  sciChartSurface.xAxes.add(xAxis);
  sciChartSurface.yAxes.add(yAxis);

  // Static data (replace this with your own data if needed)
  const xValues = Array.from({ length: 50 }, (_, i) => i);
  const yValues = xValues.map((x) => Math.sin(x * 0.1) * 10);

  const dataSeries = new XyDataSeries(wasmContext, {
    xValues,
    yValues,
  });

  sciChartSurface.renderableSeries.add(
    new FastMountainRenderableSeries(wasmContext, {
      dataSeries,
      stroke: "#4EC1E8",
      strokeThickness: 3,
      fillLinearGradient: new GradientParams(new Point(0, 0), new Point(0, 1), [
        { offset: 0, color: "#4EC1E877" },
        { offset: 1, color: "Transparent" },
      ]),
    })
  );

  return { sciChartSurface, wasmContext };
};
