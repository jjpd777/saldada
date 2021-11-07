const {createProxyMiddleware} = require("http-proxy-middleware");
require('dotenv').config();


// module.exports = app => {
//   app.use(
//     "/api",
//     createProxyMiddleware({
//       target: process.env.REACT_APP_API_HOST || "http://localhost:8000",
//       changeOrigin: true
//     })
//   );
// };
// https://saldada-deploy.herokuapp.com/t
module.exports = app => {
  console.log("SUCCESFUL LOGIN ", process.env.REACT_APP_API_HOST)

  app.use(
    "/api",
    createProxyMiddleware({
      target: "https://saldada-deploy.herokuapp.com",
      changeOrigin: true
    })
  );
};