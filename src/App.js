import "./App.css";
import { useQuery, useMutation } from "@apollo/client";
import { GET_PROCESSORS, DELETE_PROCESSOR } from "./Queries"; 
import React, { useState } from "react";
import { RiArrowDropDownLine } from "react-icons/ri";
import { AiOutlineCheck } from "react-icons/ai";
import { AiOutlineClose } from "react-icons/ai";
import { GiBank } from "react-icons/gi";
import { BsTrash3 } from "react-icons/bs";
import Deletionpopup from "./components/deletionpopup";

function App() {
  const { loading, error, data } = useQuery(GET_PROCESSORS);
  const [deleteProcessorMutation] = useMutation(DELETE_PROCESSOR, {
    update(cache, { data: { deleteProcessor } }) {
      // Remove the deleted processor from the cache
      cache.modify({
        fields: {
          processors(existingProcessors = [], { readField }) {
            return existingProcessors.filter(
              (processorRef) => deleteProcessor.id !== readField("id", processorRef)
            );
          },
        },
      });
    },
  });
  
  const [searchText, setSearchText] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [clientInfoOpen, setClientInfoOpen] = useState({});
  const [showDeletionPopup, setShowDeletionPopup] = useState(false);
  const [processorToDelete, setProcessorToDelete] = useState(null); // To track the processor to delete

  const handleDeleteProcessor = (processorId) => {
    setProcessorToDelete(processorId); // Set the processor to delete
    setShowDeletionPopup(true); // Show the pop-up
  };

  const handleCancelDeletion = () => {
    setProcessorToDelete(null); // Clear the processor to delete
    setShowDeletionPopup(false); // Close the deletion pop-up
  };

  const handleConfirmDeletion = async () => {
    if (processorToDelete) {
      try {
        await deleteProcessorMutation({ variables: { id: processorToDelete } });
        // Update filteredData state after deletion
        updateFilteredData(processorToDelete);
        console.log("Successfully deleted processor");
        setShowDeletionPopup(false); // Close the deletion pop-up
      } catch (e) {
        console.error("Error deleting processor", e);
      }
    }
  };

  function handleSearch(e) {
    e.preventDefault();
    const trimmedSearchText = searchText.trim();

    // Filter processors based on searchText
    const filteredProcessors = data.processors.filter((processor) =>
      processor.processor
        .toLowerCase()
        .includes(trimmedSearchText.toLowerCase())
    );

    // Function to handle the delete action

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

  const updateFilteredData = (deletedProcessorId) => {
    setFilteredData((prevData) =>
      prevData.filter((processor) => processor.id !== deletedProcessorId)
    );
  };

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
              <h4 className="card-header">PROCESSOR: <BsTrash3 height="25px" color="#cfcfcf" onClick={() => handleDeleteProcessor(processor.id)} /> </h4>
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

      {/* Conditionally render the pop-up */}
      {showDeletionPopup && (
        <Deletionpopup show={showDeletionPopup} onCancel={handleCancelDeletion} onConfirm={handleConfirmDeletion} />
      )}
    </>
  );
}

export default App;
