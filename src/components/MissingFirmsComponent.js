
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  Button,
  ListGroup,
  ListGroupItem,
  Col,
  Row,
} from "react-bootstrap";

const MissingFirmsComponent = () => {
  const [observations, setObservations] = useState([]);
  const [currentObservationIndex, setCurrentObservationIndex] = useState(0);

  useEffect(() => {
    let fetchObservations = async () => {
      const response = await fetch("/observations.tsv");
      const text = await response.text();
      console.log("text: ", text);
      let rows = text.split("\n");
      const header = rows[0].split("\t"); // Assuming the first row contains headers
      let observations_fetch = rows.slice(1).map((line) => {
        const values = line.split("\t");
        const observation = {};
        header.forEach((h, index) => {
          observation[h] = values[index];
        });
        return observation;
      });
      console.log("observations_fetch: ", observations_fetch);
      setObservations(observations_fetch);
    };

    fetchObservations();
  }, []);

  useEffect(() => {
    const saveObservations = async () => {
      if (observations.length > 0) {
        // Add this condition
        try {
          console.log("observations123 ", observations);
          await axios.post("/save_data", JSON.stringify(observations), {
            headers: {
              "Content-Type": "application/json",
            },
          });
          console.log("Observations saved successfully.");
        } catch (error) {
          console.error("Error while saving observations:", error);
        }
      }
    };

    saveObservations();
  }, [currentObservationIndex]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setObservations((prevObs) => {
      // Create shallow copy of observations
      const updatedObservations = [...prevObs];

      // Update the observation being edited
      updatedObservations[currentObservationIndex][name] = value;

      // Return new observations array
      return updatedObservations;
    });
  };

  const handlePreviousFirm = () => {
    if (currentObservationIndex > 0) {
      setCurrentObservationIndex(currentObservationIndex - 1);
    }
  };

  const handleNextFirm = () => {
    if (currentObservationIndex < observations.length - 1) {
      setCurrentObservationIndex(currentObservationIndex + 1);
    }
  };

  const handleGoogleSearch = (searchQuery) => {
    const googleSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(
      searchQuery + " investor relations"
    )}`;
    window.open(googleSearchUrl, "_blank");
  };
  return (
    <Container className="my-5 text-center">
      <h1 className="mt-3">Missing Firms</h1>
      <Button onClick={handlePreviousFirm}>Prev</Button>
      <Button onClick={handleNextFirm}>Next</Button>
      {observations && observations.length > 0 && (
        <ListGroup className="mt-3">
          <ListGroupItem key={currentObservationIndex} className="my-2">
            <h3>
              {[1].forEach((x) => {
                console.log("xxxxx ", observations[currentObservationIndex]);
              })}
              <u>{observations[currentObservationIndex].name}</u> -{" "}
              <u>{observations[currentObservationIndex].cik}</u>
              <u>{observations[currentObservationIndex].firm}</u>
            </h3>
            <Button
              variant="primary"
              onClick={() =>
                handleGoogleSearch(observations[currentObservationIndex].NAME)
              }
              style={{ margin: "3px", padding: "7px" }}
            >
              Google Search
            </Button>
          </ListGroupItem>
        </ListGroup>
      )}
      <Col>
        {observations.length > 0 && (
          <Row className="mt-5" md={6}>
            {Object.keys(observations[currentObservationIndex]).map(
              (key, index) => (
                <div key={index} className="mb-3">
                  <label htmlFor={key} className="form-label">
                    {key}
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id={key}
                    name={key}
                    value={observations[currentObservationIndex][key] || ""}
                    onChange={handleInputChange}
                  />
                </div>
              )
            )}
          </Row>
        )}
      </Col>
    </Container>
  );
};

export default MissingFirmsComponent;


I need to keep everything the same except move to new row with its respective info:
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  Button,
  ListGroup,
  ListGroupItem,
  Col,
  Row,
} from "react-bootstrap";

const MissingFirmsComponent = () => {
  const [observations, setObservations] = useState([]);
  const [currentObservationIndex, setCurrentObservationIndex] = useState(0);

  useEffect(() => {
    let fetchObservations = async () => {
      const response = await fetch("/observations.tsv");
      const text = await response.text();
      console.log("text: ", text);
      let rows = text.split("\n");
      const header = rows[0].split("\t"); // Assuming the first row contains headers
      let observations_fetch = rows.slice(1).map((line) => {
        const values = line.split("\t");
        const observation = {};
        header.forEach((h, index) => {
          observation[h] = values[index];
        });
        return observation;
      });
      console.log("observations_fetch: ", observations_fetch);
      setObservations(observations_fetch);
    };

    fetchObservations();
  }, []);

  useEffect(() => {
    const saveObservations = async () => {
      if (observations.length > 0) {
        // Add this condition
        try {
          console.log("observations123 ", observations);
          await axios.post("/save_data", JSON.stringify(observations), {
            headers: {
              "Content-Type": "application/json",
            },
          });
          console.log("Observations saved successfully.");
        } catch (error) {
          console.error("Error while saving observations:", error);
        }
      }
    };

    saveObservations();
  }, [currentObservationIndex]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setObservations((prevObs) => {
      // Create shallow copy of observations
      const updatedObservations = [...prevObs];

      // Update the observation being edited
      updatedObservations[currentObservationIndex][name] = value;

      // Return new observations array
      return updatedObservations;
    });
  };

  const handlePreviousFirm = () => {
    if (currentObservationIndex > 0) {
      setCurrentObservationIndex(currentObservationIndex - 1);
    }
  };

  const handleNextFirm = () => {
    if (currentObservationIndex < observations.length - 1) {
      setCurrentObservationIndex(currentObservationIndex + 1);
    }
  };

  const handleGoogleSearch = (searchQuery) => {
    const googleSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(
      searchQuery + " investor relations"
    )}`;
    window.open(googleSearchUrl, "_blank");
  };
  return (
    <Container className="my-5 text-center">
      <h1 className="mt-3">Missing Firms</h1>
      <Button onClick={handlePreviousFirm}>Prev</Button>
      <Button onClick={handleNextFirm}>Next</Button>
      {observations && observations.length > 0 && (
        <ListGroup className="mt-3">
          <ListGroupItem key={currentObservationIndex} className="my-2">
            <h3>
              {[1].forEach((x) => {
                console.log("xxxxx ", observations[currentObservationIndex]);
              })}
              <u>{observations[currentObservationIndex].name}</u> -{" "}
              <u>{observations[currentObservationIndex].cik}</u>
              <u>{observations[currentObservationIndex].firm}</u>
            </h3>
            <Button
              variant="primary"
              onClick={() =>
                handleGoogleSearch(observations[currentObservationIndex].NAME)
              }
              style={{ margin: "3px", padding: "7px" }}
            >
              Google Search
            </Button>
          </ListGroupItem>
        </ListGroup>
      )}
      <Col>
        {observations.length > 0 && (
          <Row className="mt-5" md={6}>
            {Object.keys(observations[currentObservationIndex]).map(
              (key, index) => (
                <div key={index} className="mb-3">
                  <label htmlFor={key} className="form-label">
                    {key}
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id={key}
                    name={key}
                    value={observations[currentObservationIndex][key] || ""}
                    onChange={handleInputChange}
                  />
                </div>
              )
            )}
          </Row>
        )}
      </Col>
    </Container>
  );
};

export default MissingFirmsComponent;