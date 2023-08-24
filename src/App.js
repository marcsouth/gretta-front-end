import "./App.css";
import { useQuery } from "@apollo/client";
import { GET_PROCESSORS } from "./Queries"; // Import the GET_PROCESSORS query
import React, { useState } from "react";
import { RiArrowDropDownLine } from "react-icons/ri";
import { AiOutlineCheck } from "react-icons/ai";
import { AiOutlineClose } from "react-icons/ai";
import { GiBank } from "react-icons/gi";

function App() {
  const { loading, error, data } = useQuery(GET_PROCESSORS); // Use GET_PROCESSORS query
  const [searchText, setSearchText] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [clientInfoOpen, setClientInfoOpen] = useState({});

  function handleSearch(e) {
    e.preventDefault();
    const trimmedSearchText = searchText.trim();

    // Filter processors based on searchText
    const filteredProcessors = data.processors.filter((processor) =>
      processor.processor
        .toLowerCase()
        .includes(trimmedSearchText.toLowerCase())
    );

    // Update the 'filteredData' state with the filtered processor results
    setFilteredData(filteredProcessors);

    // Clear the search text
    setSearchText("");
  }

  function toggleClientInfo(processorId) {
    setClientInfoOpen({
      ...clientInfoOpen,
      [processorId]: !clientInfoOpen[processorId],
    });
  }

  function resetToDefault() {
    // Reset filteredData to an empty array
    setFilteredData([]);
  }

  return (
    <>
      <div className="search-bar-container">
        <div className="default-home" onClick={resetToDefault}>
          <GiBank fontSize="3em" color="#cfcfcf" />
        </div>

        <form onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search all Processors"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="search-input"
          />
          <button type="submit">SEARCH</button>
        </form>
      </div>

      <h1>GRETTA CAPITAL</h1>
      <div className={`logo-div ${filteredData.length > 0 ? 'hidden' : ''}`}>
        <GiBank fontSize="20em" color="#cfcfcf" />
      </div>

      <ul className="processor-info-container">
        {filteredData.length > 0 ? (
          filteredData.map((processor) => (
            <li key={processor.id} className="processor-info">
              <h4>PROCESSOR:</h4>
              <p>{processor.processor}</p>
              <h4>MERCHANT ID:</h4>
              <p>{processor.merchantid}</p>
              <h4 className="ucc-style">
                UCC:{" "}
                {processor.ucc ? (
                  <AiOutlineCheck color="green" />
                ) : (
                  <AiOutlineClose color="red" />
                )}
              </h4>
              <h4>ADDRESS:</h4>
              <p>{processor.adress}</p>
              <div className="client-dropdown">
                <h4 className="client-title">
                  CLIENTS
                  <RiArrowDropDownLine
                    color="#CFCFCF"
                    fontSize="2em"
                    onClick={() => toggleClientInfo(processor.id)}
                  />
                </h4>
              </div>
              {clientInfoOpen[processor.id] && (
                <ul className="client-info-container">
                  {processor.clients.map((client) => (
                    <li className="client-info-dropdown" key={client.id}>
                      {client.name}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))
        ) : loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>Error: {error.message}</p>
        ) : (
          <p className="default-search">Search for Processors...</p>
        )}
      </ul>
        <p className="creator-stamp">Designed and Built by <a href="https://marc-v.dev/"> Marc-V</a></p>
    </>
  );
}

export default App;
