const express = require("express");
const app = express();
const port = 3000; // You can change this to any port you prefer
const fs = require("fs");
app.use(express.json());
// Middleware to serve static files from the /dist directory
app.use(express.static(__dirname + "/dist"));

// Basic route
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/dist/index.html");
});

app.post("/save_data", (req, res) => {
  const observations = req.body;
  console.log("observations: ", observations);

  const tsvHeader =
    "DATE\tNAME\tCIK\tFIRM\tSOURCE\tBLACK\tMALE\tFEMALE\tLGBT\tNONBINARY\tASIAN\tLATINX\tDIRECTORS\tNOTES\tDND_GENDER\tDND_DEMO"; // your full header here

  const existingTsvData = fs.readFileSync("./dist/data.tsv", "utf8");
  const existingLines = existingTsvData.split("\n");
  const headerExists = existingLines[0] === tsvHeader;

  const dataLines = headerExists ? existingLines.slice(1) : existingLines;

  // Create a map of existing data by CIK
  const existingMap = existingLines.reduce((map, line) => {
    const columns = line.split("\t");
    const cik = columns[2];
    map[cik] = line;
    return map;
  }, {});

  // Update or add new observations
  observations.forEach((obs) => {
    const line = Object.values(obs).join("\t");
    const cik = obs.cik;
    existingMap[cik] = line;
  });

  // Generate the final TSV data string
  const finalTsvData = Object.values(existingMap).join("\n");

  const tsvOutput = `${tsvHeader}\n${finalTsvData}`;

  // Write the final data to the file
  fs.writeFile("./dist/data.tsv", tsvOutput, (err) => {
    if (err) throw err;
    console.log("Saved as TSV!");
    res.status(200).send("Data saved successfully");
  });
});
// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
