import { Chart } from "react-google-charts";
import useApi from "../api/fetch/index";
import { useEffect, useState } from "react";
import config from "../config/config";

// Loader component
import { Bars } from "react-loader-spinner";

export default function LineChartComparison(props) {
  const firstSeriesId = props.firstSeriesId;
  const secondSeriesId = props.secondSeriesId;

  const firstSeriesApiUrl = `${config.apiPath}${firstSeriesId}&api_key=${config.apiKey}&file_type=json`;
  const secondSeriesApiUrl = `${config.apiPath}${secondSeriesId}&api_key=${config.apiKey}&file_type=json`;

  const {
    data: firstSeriesData,
    loading: firstSeriesLoading,
    error: firstSeriesError,
  } = useApi(firstSeriesApiUrl);
  const {
    data: secondSeriesData,
    loading: secondSeriesLoading,
    error: secondSeriesError,
  } = useApi(secondSeriesApiUrl);

  const [subtractedData, setSubtractedData] = useState(null);

  useEffect(() => {
    if (firstSeriesData && secondSeriesData) {
      const observationsFirstSeries = firstSeriesData?.observations?.map(
        ({ date, value }) => ({
          date,
          value: parseFloat(value, 2),
        })
      );
      const observationsSecondSeries = secondSeriesData?.observations?.map(
        ({ date, value }) => ({
          date,
          value: parseFloat(value, 2),
        })
      );

      // Create a map for easy lookup based on date
      const secondSeriesMap = new Map(
        observationsSecondSeries.map(({ date, value }) => [date, value])
      );

      // Find common dates
      const commonDates = observationsFirstSeries.filter(({ date }) =>
        secondSeriesMap.has(date)
      );

      // Save the matched data in subtractedData
      const subtractedData = commonDates.map(({ date, value }) => ({
        date,
        value: value - secondSeriesMap.get(date),
      }));

      setSubtractedData(subtractedData);
    }
  }, [firstSeriesData, secondSeriesData]);

  if (firstSeriesLoading || secondSeriesLoading) {
    return (
      <div className="loading-container">
        <Bars
          height="80"
          width="80"
          color="#4c4cd1"
          ariaLabel="bars-loading"
          wrapperStyle={{}}
          wrapperClass=""
          visible={true}
        />
      </div>
    );
  }

  if (firstSeriesError || secondSeriesError) {
    return (
      <p className="error-message">
        Error: {firstSeriesError?.message || secondSeriesError?.message}
      </p>
    );
  }

  var chartOptions = {
    legend: { position: "none" },
    colors: ["#4c4cd1"],
  };

  return (
    <div>
      {subtractedData && (
        <Chart
          chartType="Line"
          width="100%"
          height="400px"
          options={chartOptions}
          data={[
            ["Year", "Difference"],
            ...subtractedData.map(({ date, value }) => [date, value]),
          ]}
        />
      )}
    </div>
  );
}
