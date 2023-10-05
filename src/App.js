import "./App.css"
import { useQuery, useMutation } from "@apollo/client"
import { GET_EXPENSES, DELETE_EXPENSE, } from "./Queries";
import React, { useState } from "react";
import { AiOutlineCheck } from "react-icons/ai"
import { AiOutlineClose } from "react-icons/ai"
import { GiMoneyStack } from "react-icons/gi"
import { BsTrash3 } from "react-icons/bs"
import Deletionpopup from "./components/deletionpopup"
import Formpopup from "./components/Formpopup"
import {AiOutlinePlus} from "react-icons/ai"

function App() {
  const { loading, error, data } = useQuery(GET_EXPENSES);
  const [deleteProcessorMutation] = useMutation(DELETE_EXPENSE, {
    update(cache, { data: { deleteExpense } }) {
      // Remove the deleted processor from the cache
      cache.modify({
        fields: {
          expenses(existingExpenses = [], { readField }) {
            return existingExpenses.filter(
              (expenseRef) => deleteExpense.id !== readField("id", expenseRef)
            );
          },
        },
      });
    },
  });
  
  const [searchText, setSearchText] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [showDeletionPopup, setShowDeletionPopup] = useState(false);
  const [processorToDelete, setProcessorToDelete] = useState(null); // To track the processor to delete
  const [showFormPopup, setShowFormPopup] = useState(false);

const toggleFormPopup = () => {
  setShowFormPopup(!showFormPopup);
};

  const handleDeleteProcessor = (expenseId) => {
    setProcessorToDelete(expenseId); // Set the processor to delete
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
        console.log("Successfully deleted expense");
        setShowDeletionPopup(false); // Close the deletion pop-up
      } catch (e) {
        console.error("Error deleting expense", e);
      }
    }
  };

  function handleSearch(e) {
    e.preventDefault();
    const trimmedSearchText = searchText.trim();
  
    // Filter expenses based on searchText
    const filteredExpenses = data.expenses.filter((expense) =>
      expense.card.toLowerCase().includes(trimmedSearchText.toLowerCase())
    );
  
    // Update the 'filteredData' state with the filtered expense results
    setFilteredData(filteredExpenses);
  
    // Clear the search text
    setSearchText("");
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
          <GiMoneyStack fontSize="3em" color="#cfcfcf" />
        </div>

        <form onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search all Processors"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="search-input"
          />
        </form>

   <AiOutlinePlus onClick={toggleFormPopup} fontSize="3em" color="#cfcfcf" />
      </div>

      <h1>Expense Tracker</h1>
      <div className={`logo-div ${filteredData.length > 0 ? 'hidden' : ''}`}>
        <GiMoneyStack fontSize="20em" color="#cfcfcf" />
      </div>

      <ul className="processor-info-container">
        {filteredData.length > 0 ? (
          filteredData.map((expense) => (
            <li key={expense.id} className="processor-info">
              <h4 className="card-header">CARD <BsTrash3 height="25px" color="#cfcfcf" onClick={() => handleDeleteProcessor(expense.id)} className="trashcan-icon" /> </h4>
              <p>{expense.card}</p>
              <h4>ITEM</h4>
              <p>{expense.item}</p>
              <h4>AMOUNT</h4>
              <p>${expense.amount}</p>
              <h4 className="ucc-style">
                DEDUCTIBLE?
              </h4>
              <p> {expense.deductible ? (
                  <AiOutlineCheck color="green" />
                ) : (
                  <AiOutlineClose color="red" />
                )}</p>
              <h4>DATE</h4>
              <p>{expense.date}</p>
            </li>
          ))
        ) : loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>Error: {error.message}</p>
        ) : (
          <p className="default-search">Keep track of your expenses</p>
        )}
      </ul>
      <p className="creator-stamp">Designed and Built by <a href="https://marc-v.dev/"> Marc-V</a></p>

      {/* Conditionally render the pop-up */}
      {showDeletionPopup && (
        <Deletionpopup show={showDeletionPopup} onCancel={handleCancelDeletion} onConfirm={handleConfirmDeletion} />
      )}
      {showFormPopup && (
  <Formpopup
    show={showFormPopup}
    onClose={toggleFormPopup}
    /* Any other props you want to pass to Formpopup */
  />
)}
    </>
  );
}

export default App;
