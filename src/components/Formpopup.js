import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { ADD_EXPENSE, GET_EXPENSES } from '../Queries';
import { AiOutlineClose } from "react-icons/ai"


export default function Formpopup({ show, onClose }) {
  const [formData, setFormData] = useState({
    card: '',
    item: '',
    amount: 0.00,
    date: "",
    deductible: false,
  });

  const [addExpense] = useMutation(ADD_EXPENSE, {
    update(cache, { data: { addExpense } }) {
      const existingexpenses = cache.readQuery({ query: GET_EXPENSES });

      cache.writeQuery({
        query: GET_EXPENSES,
        data: {
          expenses: [...existingexpenses.expenses, addExpense],
        },
      });
    },
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
      deductible: type === 'checkbox' ? checked : prevData.deductible,
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      await addExpense({
        variables: {
          expense: {
            card: formData.card,
            item: formData.item,
            amount: parseFloat(formData.amount),
            date: formData.date,
            deductible: formData.deductible || false,
          },
        },
      });
  
      onClose();
    } catch (error) {
      console.error('Error adding expense:', error);
    }
  };

  return (
    <div className={`${show ? 'pop-up-container-form ' : 'hidden'}`}>
      <div className="pop-up">
      <div className="close-button" onClick={onClose}>
      <AiOutlineClose fontSize="1em" color="#cfcfcf" />
        </div>
        <form onSubmit={handleSubmit} className='form-pop-up'>
          <label>
            Card
            </label>
            <input
              type="text"
              name="card"
              value={formData.expense}
              onChange={handleChange}
              required
            />

          <label>
            Item
            </label>
            <input
              type="text"
              name="item"
              value={formData.item}
              onChange={handleChange}
              required
            />

          <label>
            amount
            </label>
            <input
              type="text"
              name="amount"
              value={formData.street}
              onChange={handleChange}
              required
            />
             <label>
            Deductible?
            </label>
            <input
              type="checkbox"
              name="deductible"
              checked={formData.deductible}
              onChange={handleChange}
            />

             <label>
            Date
            </label>
            <input
              type="date"
              name="date"
              checked={formData.date}
              onChange={handleChange}
            />
            
          <button type="submit" className='add-processor-button'>ADD EXPENSE</button>
        </form>
      </div>
    </div>
  );
}
