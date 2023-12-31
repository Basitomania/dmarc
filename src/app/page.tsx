/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useEffect, useState } from "react";
import { Pie, Line } from "react-chartjs-2";
import DataTable from "react-data-table-component";
import { ArcElement, CategoryScale } from "chart.js";
import Chart from "chart.js/auto";
import axios from "axios";
import NavigationMenu from "./NavigationMenu";
Chart.register(ArcElement, CategoryScale);

type ResObject = {
  failScore: number;
  passScore: number;
};

interface ChartData {
  demarcAlignmentChart: ResObject;
  dkimAlignmentChart: {};
  spfAlignmentChart: {};
  records: [];
  trendsPlots: [];
}

const lastWeekAgo = new Date();
lastWeekAgo.setDate(lastWeekAgo.getDate() - 7);

function Dashboard() {
  const [startDate, setStartDate] = useState<any>(null);
  const [endDate, setEndDate] = useState<any>(null);
  const [chartData, setChartData] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const convertDate = (data: any) => {
    const inputDate = new Date(data);
    const year = inputDate.getFullYear();
    const month = String(inputDate.getMonth() + 1).padStart(2, "0");
    const day = String(inputDate.getDate()).padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}`;
    return formattedDate;
  };

  useEffect(() => {
    getDasboardData();
  }, [startDate, endDate]);

  const getDasboardData = () => {
    const newStartDate = startDate
      ? startDate
      : lastWeekAgo.toISOString().slice(0, 10);
    const newEndDate = endDate
      ? endDate
      : new Date().toISOString().slice(0, 10);
    setLoading(true);
    axios
      .get(
        `https://demarc.azurewebsites.net/dmarc/report?startDate=${convertDate(
          newStartDate
        )}&endDate=${convertDate(newEndDate)}`
      )
      .then((response) => {
        setError("");
        setChartData(response.data);
        setLoading(false);
      })
      .catch((err) => {
        if (err.response.status == 404) {
          const modifiedMsg = `No records for the selected Date`;
          setError(modifiedMsg);
        }
        setLoading(false);
      });
  };

  const lineLabel = chartData.trendPlots?.map((item: any) => item.date);
  const dmarcLabel = chartData.trendPlots?.map(
    (item: any) => item.failDmarcAlignment
  );
  const volumeLabel = chartData.trendPlots?.map((item: any) => item.volume);

  const isEmpty = JSON.stringify(chartData) === "{}";
  const dmarcAlignment =
    !isEmpty && Object.values(chartData.demarcAlignmentChart);
  const dkimAlignment = !isEmpty && Object.values(chartData.dkimAlignmentChart);
  const spfAlignment = !isEmpty && Object.values(chartData.spfAlignmentChart);

  const dMarcPieChartData = {
    labels: ["Fail Score", "Pass Score"],
    datasets: [
      {
        data: dmarcAlignment,
        backgroundColor: ["#FF6384", "#36A2EB"],
        hoverBackgroundColor: ["#FF6384", "#36A2EB"],
      },
    ],
  };

  const dkimPieChartData = {
    labels: ["Fail Score", "Pass Score"],
    datasets: [
      {
        data: dkimAlignment,
        backgroundColor: ["#FF6384", "#36A2EB"],
        hoverBackgroundColor: ["#FF6384", "#36A2EB"],
      },
    ],
  };

  const spfPieChartData = {
    labels: ["Fail Score", "Pass Score"],
    datasets: [
      {
        data: spfAlignment,
        backgroundColor: ["#FF6384", "#36A2EB"],
        hoverBackgroundColor: ["#FF6384", "#36A2EB"],
      },
    ],
  };

  const lineChartData = {
    labels: lineLabel,
    datasets: [
      {
        label: "Failed Dmarc Alignment",
        data: dmarcLabel,
      },
      {
        label: "Volumne",
        data: volumeLabel,
      },
    ],
  };

  // Define columns for the data table
  const columns = [
    {
      name: "From Domain",
      selector: (row: any) => row.fromDomain,
      minWidth: "150px",
    },
    {
      name: "Ip Address",
      selector: (row: any) => row.ipAddress,
      minWidth: "150px",
    },
    {
      name: "Server",
      selector: (row: any) => row.server,
      minWidth: "250px",
    },
    {
      name: "Country Name",
      selector: (row: any) => row.countryName,
      minWidth: "150px",
    },
    {
      name: "Country Iso code",
      selector: (row: any) => row.countryName,
      minWidth: "150px",
    },
    {
      name: "Date From",
      selector: (row: any) => {
        return row.dateFrom.join("/");
      },
      minWidth: "150px",
    },
    {
      name: "Date To",
      selector: (row: any) => {
        return row.dateTo.join("/");
      },
      minWidth: "150px",
    },
    {
      name: "DEMARC Alignment",
      selector: (row: any) => row.demarcAlignment,
      minWidth: "150px",
    },

    {
      name: "DKIM",
      selector: (row: any) => {
        return row.dkim.result;
      },
      minWidth: "150px",
    },
    {
      name: "Email contact",
      selector: (row: any) => row.emailContact,
      minWidth: "250px",
    },
    {
      name: "Policy applied",
      selector: (row: any) => row.policyApplied,
      minWidth: "150px",
    },
    {
      name: "Reporter",
      selector: (row: any) => row.reporter,
      minWidth: "150px",
    },
    {
      name: "SPF",
      selector: (row: any) => {
        return row.spf.result;
      },
      minWidth: "150px",
    },
    {
      name: "Volume",
      selector: (row: any) => row.volume,
      minWidth: "150px",
    },
  ];

  const data = chartData.records;
  if (loading) {
    return <p>Loading...</p>;
  }
  console.log("<<<", error);

  return (
    <div className="pt-20">
      <NavigationMenu />

      <div className="flex flex-col p-5 justify-center items-center">
        <div className="flex flex-row p-4">
          <div className=" pt-10">
            <div className="flex space-x-2 text-black">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="border rounded p-2 cursor-pointer"
                defaultValue={lastWeekAgo.toISOString().slice(0, 10)}
              />
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="border rounded p-2 cursor-pointer"
                defaultValue={new Date().toISOString().slice(0, 10)}
              />
            </div>
          </div>
        </div>

       {!error ?  <>
          <div className="flex flex-row p-4">
            <div className="p-4">
              <p>DEMARC Chart</p>
              <Pie data={dMarcPieChartData} />
            </div>
            <div className="p-4">
              <p>DKIM</p>
              <Pie data={dkimPieChartData} />
            </div>
            <div className="p-4">
              <p>SPF</p>
              <Pie data={spfPieChartData} />
            </div>
          </div>

          <div className="flex flex-row p-4 pt-5">
            <div>
              <p className="font-semibold">Success and Fail Trend</p>
              <div className="w-[900px]">
                <Line data={lineChartData} />
              </div>
            </div>
          </div>

          <div className="flex justify-center pt-5">
            <div className="w-[40%]">
              <p className="font-semibold">DEMARC Table</p>
              <DataTable
                title="DEMARC"
                columns={columns}
                data={data}
              />
            </div>
          </div>
        </> : <div>{error}</div>}
      </div>
    </div>
  );


}

export default Dashboard;
