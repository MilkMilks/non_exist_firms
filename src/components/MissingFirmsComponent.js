import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Button,
  Container,
  ListGroup,
  ListGroupItem,
  Col,
  Row,
} from "react-bootstrap";

const MissingFirmsComponent = () => {
  const [missingFirms, setMissingFirms] = useState([]);
  const [currentFirmIndex, setCurrentFirmIndex] = useState(0);
  const [formData, setFormData] = useState({});
  const [observations, setObservations] = useState([]);
  // firstLoad
  const [firstLoad, setFirstLoad] = useState(false);

  const postDataToServer = async () => {
    try {
      console.log("observations: ", observations);
      const response = await axios.post(
        "/save_data",
        observations, // No need for JSON.stringify() if you set the content type to JSON
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        console.log("Data sent successfully");
      } else {
        console.log("Failed to send data");
      }
    } catch (error) {
      console.error("Error sending data:", error);
    }
  };
  const updateFormData = () => {
    const currentFirm = missingFirms[currentFirmIndex];
    const observation = observations.find((obs) => obs.cik === currentFirm[1]);
    console.log("observation: ", observation);
    if (observation) {
      setFormData(observation);
    } else {
      setFormData({
        date: "2022",
        name: currentFirm.title,
        cik: currentFirm.cik,
        firm: currentFirm.ticker,
        source: "proxy",
        black: "",
        male: "",
        female: "",
        lgbt: "",
        non_binary: "",
        asian: "",
        latinx: "",
        directors: "",
        notes: "",
        DND_GENDER: "",
        DND_DEMO: "",
      });
    }
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const [csvResponse, jsonResponse] = await Promise.all([
          fetch("MISSING_FIRMS_FINAL.csv"),
          fetch("sec_tickers_ciks.json"),
        ]);

        const csvData = await csvResponse.text();
        const jsonData = await jsonResponse.json();

        const csvRows = csvData.split("\n");
        const csvHeaders = csvRows[0].split(",");

        const missingFirms = csvRows
          .slice(1) // Skip the header row
          .map((row) => {
            const rowValues = row.split(",");
            const cik = rowValues[1].trim();
            const matchingRecord = Object.values(jsonData).find(
              (record) => record.cik_str === parseInt(cik)
            );
            if (matchingRecord) {
              const { ticker, title } = matchingRecord;
              return {
                cik,
                ticker,
                title,
              };
            }
            return null;
          })
          .filter(Boolean);

        setMissingFirms(missingFirms);
        setFormData(
          observations[currentFirmIndex] || {
            date: "",
            name: "",
            cik: "",
            firm: "ERROR",
            source: "proxy",
            black: "",
            male: "",
            female: "",
            lgbt: "",
            non_binary: "",
            asian: "",
            latinx: "",
            directors: "",
            notes: "",
            DND_GENDER: "",
            DND_DEMO: "",
          }
        );
      } catch (error) {
        console.error("Error fetching or processing data:", error);
      }
    }

    fetchData();
  }, []);
  const handleSearch = (searchQuery) => {
    // console.log("missingFirms1: ", missingFirms[0]);
    const foundIndex = missingFirms.findIndex(
      (firm) => firm.ticker.toLowerCase() === searchQuery.toLowerCase()
    );
    if (foundIndex !== -1) {
      saveObservation(); // Save the existing observation before moving
      setCurrentFirmIndex(foundIndex);
      updateFormData();
    } else {
      console.log("Firm not found.");
    }
  };
  useEffect(() => {
    if (missingFirms.length > 0) {
      const currentFirm = missingFirms[currentFirmIndex];
      const observation = observations.find(
        (obs) => obs.cik === currentFirm.cik
      );

      if (observation) {
        setFormData(observation);
      } else {
        setFormData(
          observations[currentFirmIndex] || {
            date: "2022",
            name: currentFirm.title,
            cik: currentFirm.cik,
            firm: currentFirm.ticker,
            source: "proxy",
            black: "",
            male: "",
            female: "",
            lgbt: "",
            non_binary: "",
            asian: "",
            latinx: "",
            directors: "",
            notes: "",
            DND_GENDER: "",
            DND_DEMO: "",
          }
        );
      }
    }
  }, [currentFirmIndex, missingFirms]);

  useEffect(() => {
    if (observations.length > 0) {
      postDataToServer();
    }
  }, [observations]);

  const handleGoogleSearch = (firmName) => {
    const googleSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(
      firmName
    )} investor relations`;
    window.open(googleSearchUrl, "_blank");
  };

  const handleSecEdgarQuery = (ticker, title) => {
    const secEdgarUrl = `https://www.sec.gov/edgar/search/?CIK=${ticker}`;
    window.open(secEdgarUrl, "_blank");
  };

  useEffect(() => {
    if (!firstLoad) {
      fetch("./data.tsv")
        .then((response) => response.text())
        .then((data) => {
          const lines = data.split("\n");
          const headers = lines[0].split("\t");
          const newObservations = lines.slice(1).map((line) => {
            const parts = line.split("\t");
            const obj = {};
            headers.forEach((header, index) => {
              obj[header] = parts[index];
            });
            return obj;
          });
          setObservations(newObservations);
          setFirstLoad(true);
        })
        .catch((error) => console.error("Error fetching TSV:", error));
    }
  }, [firstLoad]);

  const saveObservation = () => {
    const currentFirm = missingFirms[currentFirmIndex];
    console.log("old observations: ", observations);
    let newObservations = [...observations];
    console.log("new observations: ", newObservations);
    const existingIndex = newObservations.findIndex(
      (obs) => obs.cik === currentFirm.cik
    );

    if (existingIndex > -1) {
      newObservations[existingIndex] = formData;
    } else {
      newObservations.push(formData);
    }

    // Deduplicate based on cik
    const uniqueObservations = Object.values(
      newObservations.reduce((acc, curr) => {
        acc[curr.cik] = curr;
        return acc;
      }, {})
    );

    setObservations(uniqueObservations);
    return uniqueObservations;
  };

  const handleNextFirm = () => {
    saveObservation();
    setCurrentFirmIndex((prevIndex) => (prevIndex + 1) % missingFirms.length);
    updateFormData(); // Add this line
  };

  const handlePreviousFirm = () => {
    saveObservation();
    setCurrentFirmIndex(
      (prevIndex) => (prevIndex - 1 + missingFirms.length) % missingFirms.length
    );
    updateFormData(); // Add this line
  };

  return (
    <Container className="my-5 text-center">
      <h1 className="mt-3">Missing Firms</h1>
      <Button
        variant="primary"
        onClick={handlePreviousFirm}
        style={{ margin: "3px", padding: "7px" }}
      >
        Previous Firm
      </Button>
      <Button
        variant="primary"
        onClick={handleNextFirm}
        style={{ margin: "3px", padding: "7px" }}
      >
        Next Firm
      </Button>
      <input
        type="text"
        placeholder="Search for a firm"
        onChange={(e) => handleSearch(e.target.value)}
      />
      {missingFirms.length > 0 && (
        <ListGroup className="mt-3">
          {missingFirms.map((firm, index) => {
            return currentFirmIndex === index ? (
              <ListGroupItem key={index} className="my-2">
                <h3>
                  <u>{firm.title}</u> - <u>{firm.ticker}</u>
                </h3>
                <Button
                  variant="primary"
                  onClick={() => handleGoogleSearch(firm.title)}
                  style={{ margin: "3px", padding: "7px" }}
                >
                  Google Search
                </Button>
                <Button
                  variant="primary"
                  onClick={() => handleSecEdgarQuery(firm.ticker, firm.title)}
                  style={{ margin: "3px", padding: "7px" }}
                >
                  SEC Edgar Query
                </Button>
              </ListGroupItem>
            ) : null;
          })}
        </ListGroup>
      )}
      <Col>
        {formData && (
          <Row className="mt-5" md={6}>
            {Object.keys(formData).map((key, index) => (
              <div key={index} className="mb-3">
                <label htmlFor={key} className="form-label">
                  {key}
                </label>
                <input
                  type="text"
                  className="form-control"
                  id={key}
                  name={key}
                  value={formData[key]}
                  onChange={(e) =>
                    setFormData({ ...formData, [key]: e.target.value })
                  }
                />
              </div>
            ))}
          </Row>
        )}
      </Col>
    </Container>
  );
};

export default MissingFirmsComponent;
