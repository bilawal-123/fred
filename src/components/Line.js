import { Chart } from "react-google-charts";
import useApi from "../api/fetch/index";
import { useEffect, useState } from "react";
import config from "../config/config";
// Loader component
import { Bars } from "react-loader-spinner";
export default function Line(props) {
  const seriesId1 = props.id1;
  const seriesId2 = props.id2;
  const apiUrl1 = `${config.apiPath}${seriesId1}&api_key=${config.apiKey}&file_type=json`;
  const apiUrl2 = `${config.apiPath}${seriesId2}&api_key=${config.apiKey}&file_type=json`;

  const { data: data1, loading: loading1, error: error1 } = useApi(apiUrl1);
  const { data: data2, loading: loading2, error: error2 } = useApi(apiUrl2);

  const [subtractedData, setSubtractedData] = useState(null);

  useEffect(() => {
    if (data1 && data2) {
      const observationsData1 = data1?.observations?.map(({ date, value }) => ({
        date,
        value: parseFloat(value, 2),
      }));
      const observationsData2 = data2?.observations?.map(({ date, value }) => ({
        date,
        value: parseFloat(value, 2),
      }));

      // Create a map for easy lookup based on date
      const data2Map = new Map(
        observationsData2.map(({ date, value }) => [date, value])
      );
      console.log("data2Map", data2Map);

      // Find common dates
      const commonDates = observationsData1.filter(({ date }) =>
        data2Map.has(date)
      );

      // Save the matched data in subtractedData
      const subtractedData = commonDates.map(({ date, value }) => ({
        date,
        value: value - data2Map.get(date),
      }));

      console.log("subs", subtractedData);

      setSubtractedData(subtractedData);
    }
  }, [data1, data2]);

  if (loading1 || loading2) {
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

  if (error1 || error2) {
    return (
      <p className="error-message">
        Error: {error1?.message || error2?.message}
      </p>
    );
  }
  var options = {
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
          options={options}
          data={[
            ["Year", "Difference"],
            ...subtractedData.map(({ date, value }) => [date, value]),
          ]}
        />
      )}
    </div>
  );
}
