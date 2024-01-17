
import express from "express";
import { BetaAnalyticsDataClient } from "@google-analytics/data";

// 要開一堆鬼權限
// GOOGLE_APPLICATION_CREDENTIALS="./key.json" node index.js
// https://stackoverflow.com/questions/51005448/setting-up-environment-variables-in-node-specifically-google-application-crede
// 要加入 ga4 帳號訪問權限管理

// [TODO]
// 把環境檔案丟進 這支檔案裡面!

const app = express();
const PORT = 3780;

const analyticsDataClient = new BetaAnalyticsDataClient();
let response = []

async function runReport() {
  const propertyId = "423114570";
  // 客戶需求：
  const [response] = await analyticsDataClient.runReport({
    property: `properties/${propertyId}`,
    dateRanges: [
      {
        startDate: "2024-01-10",
        endDate: "2024-01-17",
        name: "時間區間",
      },
    ],
    dimensions: [
      {
        name: "fullPageUrl",
      },
      {
        name: "eventName",
      },
    ],
    metrics: [
      {
        name: "eventCount",
      },
      {
        name: "eventCountPerUser",
      },
      {
        name: "averageSessionDuration",
      },
    ],
  });
  // Debug
  // console.log("Report result:");
  // response.rows.forEach((row) => {
  //   console.log(row.dimensionValues[0], row.metricValues[0]);
  // });
  return response
}

app.get('/', async function (req, res) {
  console.log("User runReport")
  response = await runReport()
  res.json({ data: response })
  res.end();
});

app.listen(PORT, function (err) {
  if (err) console.log(err);
  console.log("Server listening on PORT", PORT);
});

