import { Chart } from "react-google-charts";
import useApi from "../api/fetch/index";
import { useEffect, useState } from "react";
import config from "../config/config";

// Loader component
import { Bars } from "react-loader-spinner";
export default function Bar(props) {
  const seriesId = props.id;
  const apiUrl = `${config.apiPath}${seriesId}&api_key=${config.apiKey}&file_type=json`;
  const { data, loading, error } = useApi(apiUrl);
  const [barcodeData, setBarcodeData] = useState(null);

  useEffect(() => {
    if (data) {
      const years = 20;
      const observationsData = data?.observations?.map(({ date, value }) => [
        date,
        parseFloat(value),
      ]);
      const limitedObservationsData = observationsData?.slice(-years);
      const observationDataWithColumns = [
        ["Year", "Difference"],
        ...limitedObservationsData,
      ];
      setBarcodeData(observationDataWithColumns);
    }
  }, [data]);

  if (loading) {
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

  if (error) {
    return <p className="error-message">Error: {error.message}</p>;
  }
  var options = {
    legend: { position: "none" },
    colors: ["#4c4cd1"],
  };
  return (
    <div>
      <Chart
        chartType="Bar"
        width="100%"
        height="400px"
        data={barcodeData}
        options={options}
      />
    </div>
  );
}
