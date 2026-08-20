const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send(`
    <html>
      <head>
        <title>DevOps Application</title>
      </head>
      <body>
        <h1>🚀 DevOps Application</h1>
        <p>Node.js application deployed with Docker, EKS, and Argo CD - GitOps Pipeline v5 (Trivy Security Passed!) 🟢</p>
        <p>Environment: ${process.env.NODE_ENV || "development"}</p>
      </body>
    </html>
  `);
});

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "healthy",
    application: "devops-nodejs-app"
  });
});

app.listen(PORT, () => {
  console.log(`Application running on port ${PORT}`);
});