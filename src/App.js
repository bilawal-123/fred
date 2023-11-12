import "./App.css";
import Line from "./components/Line";
import Bar from "./components/Bar";
import Shaded from "./components/Shaded";

import { Fragment } from "react";
import { Tab } from "@headlessui/react";

function App() {
  return (
    <div className="container">
      <Tab.Group>
        <Tab.List className="chart-button-row">
          <Tab as={Fragment}>
            {({ selected }) => (
              <button className={selected ? "selected chart-btn" : "chart-btn"}>
                Shaded Chart
              </button>
            )}
          </Tab>
          <Tab as={Fragment}>
            {({ selected }) => (
              <button className={selected ? "selected chart-btn" : "chart-btn"}>
                Bar Chart
              </button>
            )}
          </Tab>
          <Tab as={Fragment}>
            {({ selected }) => (
              <button className={selected ? "selected chart-btn" : "chart-btn"}>
                Line Chart
              </button>
            )}
          </Tab>
        </Tab.List>
        <Tab.Panels>
          <Tab.Panel>
            <div className="chart-box">
              <p>
                <strong>T10Y2Y</strong>: plot line area chart (shaded line
                chart)
              </p>
              <Shaded id="T10Y2Y"></Shaded>
            </div>
          </Tab.Panel>
          <Tab.Panel>
            <div className="chart-box">
              <p>
                <strong>GDPCA</strong>: plot bar chart for the last 20 years
              </p>
              <Bar id="GDPCA"></Bar>
            </div>
          </Tab.Panel>
          <Tab.Panel>
            <div className="chart-box">
              <p>
                <strong>DGS10</strong> minus <strong>T10YIE</strong>: plot line
                chart
              </p>
              <Line id1="DGS10" id2="T10YIE"></Line>
            </div>
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
}

export default App;
