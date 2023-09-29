const express = require("express");
const app = express();
const port = 3000; // You can change this to any port you prefer
const fs = require("fs");
const path = require("path"); // Import path module
const bodyParser = require("body-parser");
app.use(bodyParser.json({ limit: "50mb" }));
app.use(
  bodyParser.urlencoded({
    limit: "50mb",
    extended: true,
    parameterLimit: 50000,
  })
);
// app.use(express.json());

// Middleware to serve static files from the /dist directory
app.use(express.static(__dirname + "/dist"));

// Basic route
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/dist/index.html");
});

app.post("/save_data", (req, res) => {
  console.log(req.body);
  if (!req.body || Object.keys(req.body).length === 0) {
    console.error("Request body is empty");
  }

  const tsvHeader =
    "DATE\tNAME\tCIK\tFIRM\tSOURCE\tBLACK\tMALE\tFEMALE\tLGBT\tNONBINARY\tASIAN\tLATINX\tDIRECTORS\tNOTES\tDND_GENDER\tDND_DEMO"; // your full header here
  const tsvRows = req.body.map((row) => {
    return Object.values(row).join("\t");
  });
  const tsv = [tsvHeader, ...tsvRows].join("\n");
  fs.writeFileSync(path.join(__dirname, "/dist/observations.tsv"), tsv);
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
