import {
  SciChartSurface,
  NumericAxis,
  NumberRange,
  StackedColumnCollection,
  StackedColumnRenderableSeries,
  XyDataSeries,
} from "scichart";

SciChartSurface.loadWasmFromCDN();

const xValues = [1997, 1998, 1999, 2000, 2001, 2002, 2003];
const tomatoesData = [15, 17, 26, 22, 28, 21, 22];
const cucumberData = [14, 12, 27, 25, 23, 17, 17];
const pepperData = [17, 14, 27, 26, 22, 28, 16];

export const drawBar = async (rootElement: string | HTMLDivElement) => {
  const { wasmContext, sciChartSurface } = await SciChartSurface.create(
    rootElement
  );

  // Axes
  sciChartSurface.xAxes.add(
    new NumericAxis(wasmContext, {
      growBy: new NumberRange(0.02, 0.02),
    })
  );
  sciChartSurface.yAxes.add(
    new NumericAxis(wasmContext, {
      growBy: new NumberRange(0.02, 0.05),
    })
  );

  // Renderable series (no styling)
  const rendSeries1 = new StackedColumnRenderableSeries(wasmContext, {
    dataSeries: new XyDataSeries(wasmContext, {
      xValues,
      yValues: tomatoesData,
    }),
    stackedGroupId: "A",
  });

  const rendSeries2 = new StackedColumnRenderableSeries(wasmContext, {
    dataSeries: new XyDataSeries(wasmContext, {
      xValues,
      yValues: pepperData,
    }),
    stackedGroupId: "B",
  });

  const rendSeries3 = new StackedColumnRenderableSeries(wasmContext, {
    dataSeries: new XyDataSeries(wasmContext, {
      xValues,
      yValues: cucumberData,
    }),
    stackedGroupId: "C",
  });

  // Group the series into a collection
  const stackedColumnCollection = new StackedColumnCollection(wasmContext);
  stackedColumnCollection.add(rendSeries1, rendSeries2, rendSeries3);

  sciChartSurface.renderableSeries.add(stackedColumnCollection);
  sciChartSurface.zoomExtents();

  return { wasmContext, sciChartSurface };
};
