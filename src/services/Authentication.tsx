import axios from "axios";
const accessToken = "YOUR_ACCESS_TOKEN"; // Replace with your actual access token
const apiUrl = "https://www.googleapis.com/gmail/v1/users/me/labels";
const headers = { Authorization: `Bearer ${accessToken}` };

axios
  .get(apiUrl, { headers })
  .then((response) => {
    console.log("Labels:", response.data);
  })
  .catch((error) => {
    console.error("Error fetching labels:", error);
  });
