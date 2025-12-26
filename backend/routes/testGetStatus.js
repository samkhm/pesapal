var axios = require("axios");

const ACCESS_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3VzZXJkYXRhIjoiMzMxZTlhNzctYWEyYy00YWNlLWI1MzgtZGFlZjU0NzgyNjM5IiwidWlkIjoiRG85QjF1Ti8xNmdJVkxyNTV5MjVSdFV5N0o4NXpoeGsiLCJuYmYiOjE3NjY3NjA4MjgsImV4cCI6MTc2Njc2MTEyOCwiaWF0IjoxNzY2NzYwODI4LCJpc3MiOiJodHRwOi8vcGF5LnBlc2FwYWwuY29tLyIsImF1ZCI6Imh0dHA6Ly9wYXkucGVzYXBhbC5jb20vIn0.VrH33CV3Z3xuFpLIfalZDTpZFxdg501QArgxoOGbny4"; // must be valid (≤ 5 minutes old)

var config = {
  method: "get",
  maxBodyLength: Infinity,
  url: "https://pay.pesapal.com/v3/api/Transactions/GetTransactionStatus?orderTrackingId=c0fb5d1d-4d01-4ebb-b757-569e2f25642c",
  headers: {
    Authorization: `Bearer ${ACCESS_TOKEN}`,
    Accept: "application/json"
  }
};

axios(config)
  .then(function (response) {
    console.log("Transaction status response:");
    console.log(JSON.stringify(response.data, null, 2));
  })
  .catch(function (error) {
    console.error(
      "Status check failed:",
      error.response?.data || error.message
    );
  });
