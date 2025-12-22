require("dotenv").config();
const { getAccessToken } = require("./services/pesapal");

(async () => {
  const token = await getAccessToken();
  console.log("Sandbox access token:", token);
})();
