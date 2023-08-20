/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useEffect, useState } from "react";
import { Pie, Line } from "react-chartjs-2";
import DataTable from "react-data-table-component";
import { ArcElement, CategoryScale } from "chart.js";
import Chart from "chart.js/auto";
import axios from "axios";
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
const currentDate = new Date();
const lastMonthDate = new Date(currentDate);
lastMonthDate.setMonth(currentDate.getMonth() - 1);

function Dashboard() {
  const [startDate, setStartDate] = useState<any>(lastMonthDate);
  const [endDate, setEndDate] = useState<any>(new Date().toString());
  const [chartData, setChartData] = useState<any>({});
  const [loading, setLoading] = useState(false);

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
    setLoading(true);
    axios
      .get(
        `https://demarc.azurewebsites.net/dmarc/report?startDate=${convertDate(
          startDate
        )}&endDate=${convertDate(endDate)}`
      )
      .then((response) => {
        setChartData(response.data);
        console.log(">>", response.data);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
      });
  };

  const isEmpty = JSON.stringify(chartData) === "{}";
  const dmarcAlignment =
    !isEmpty && Object.values(chartData.demarcAlignmentChart);
  const dkimAlignment = !isEmpty && Object.values(chartData.dkimAlignmentChart);
  const spfAlignment = !isEmpty && Object.values(chartData.spfAlignmentChart);

  // Dummy data for pie and line charts
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
    labels: ["January", "February", "March", "April", "May", "June", "July"],
    datasets: [
      {
        label: "Total Successful",
        data: [65, 59, 80, 81, 56, 55, 40],
      },
      {
        label: "Total Fail",
        data: [28, 48, 40, 19, 86, 27, 90],
      },
    ],
  };

  // Define columns for the data table
  const columns = [
    {
      name: "From Domain",
      selector: (row: any) => row.fromDomain,
    },
    {
      name: "Ip Address",
      selector: (row: any) => row.ipAddress,
    },
    {
      name: "Server",
      selector: (row: any) => row.server,
    },
    {
      name: "Country Name",
      selector: (row: any) => row.countryName,
    },
    {
      name: "Country Iso code",
      selector: (row: any) => row.countryName,
    },
    {
      name: "Date From",
      selector: (row: any) => {
        return row.dateFrom.join("/");
      },
    },
    {
      name: "Date To",
      selector: (row: any) => {
        return row.dateTo.join("/");
      },
    },
    {
      name: "Demarc Alignment",
      selector: (row: any) => row.demarcAlignment,
    },

    {
      name: "DKIM",
      selector: (row: any) => {
        return row.dkim.result;
      },
    },
    {
      name: "Email contact",
      selector: (row: any) => row.emailContact,
    },
    {
      name: "Policy applied",
      selector: (row: any) => row.policyApplied,
    },
    {
      name: "Reporter",
      selector: (row: any) => row.reporter,
    },
    {
      name: "SPF",
      selector: (row: any) => {
        return row.spf.result;
      },
    },
    {
      name: "Volume",
      selector: (row: any) => row.volume,
    },
  ];

  const data = chartData.records;
  if (loading) {
    return <p>Loading...</p>
  }

  return (
    <div className="flex flex-col p-5">
      {/* Row 1: Filter by Date */}
      <div className="flex flex-row p-4">
        <div className="w-1/4 pt-10">
          {/* <p className="font-semibold">Filter by Date</p> */}
          <div className="flex space-x-2 text-black">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border rounded p-2 cursor-pointer"
            />
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="border rounded p-2 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Row 2: Pie charts */}
      <div className="flex flex-row p-4">
        {/* <p className="font-semibold">Alignment</p> */}
        <div className="p-4">
          <p>De Marc Chart</p>
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
        {/* <div className="p-4">
          <Pie data={pieChartData} />
        </div> */}
      </div>

      {/* Row 3: Line chart */}
      <div className="flex flex-row p-4">
        <div>
          <p className="font-semibold">Success and Fail Trend</p>
          <div className="w-[900px]">
            <Line data={lineChartData} />
          </div>
        </div>
      </div>

      {/* Row 4: Data table */}
      <div className="flex flex-row p-4">
        <div className="w-full">
          <p className="font-semibold">De Marc Table</p>
          <DataTable
            title="Demarc"
            columns={columns}
            data={data}
            // defaultSortFieldId={1}
          />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
