import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import './income.css'; // Add your CSS file for styling
import API from '../../../utils/api';

function Income() {
  const [incomes, setIncomes] = useState([]); // State to hold income data
  const [modalIsOpen, setModalIsOpen] = useState(false); // State to control modal visibility
  const [isEditing, setIsEditing] = useState(false); // State to track if we are editing an existing income
  const [selectedIncomeId, setSelectedIncomeId] = useState(null); // State to store the id of the income being edited
  const [formData, setFormData] = useState({
    amount: '',
    category: '',
    date: '',
    description: '',
  });

  useEffect(() => {
    // Fetch incomes from the backend API
    const fetchIncomes = async () => {
      try {
        const response = await API.get('/income');
        setIncomes(response.data.income); // Assuming the response contains the income array
      } catch (error) {
        console.error('Error fetching incomes:', error);
      }
    };
    fetchIncomes();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        // Update existing income
        await API.put(`/income/${selectedIncomeId}`, formData);
        const updatedIncomes = incomes.map(income => 
          income._id === selectedIncomeId ? { ...income, ...formData } : income
        );
        setIncomes(updatedIncomes);
      } else {
        // Add new income
        const response = await API.post('/income', formData);
        setIncomes([...incomes, response.data.income]); // Add the new income to the existing list
      }
      
      setModalIsOpen(false); // Close the modal
      setFormData({ amount: '', category: '', date: '', description: '' }); // Reset form data
      setIsEditing(false); // Reset editing state
    } catch (error) {
      console.error('Failed to add or update income:', error);
    }
  };

  const handleRowClick = (income) => {
    // Populate the form with the income data
    setFormData({
      amount: income.amount,
      category: income.category,
      date: income.date,
      description: income.description,
    });
    setSelectedIncomeId(income._id); // Set the id of the income being edited
    setIsEditing(true); // Set the editing state to true
    setModalIsOpen(true); // Open the modal
  };

  const handleAddIncomeClick = () => {
    setFormData({ amount: '', category: '', date: '', description: '' }); // Clear the form data for a new entry
    setIsEditing(false); // Reset editing state
    setModalIsOpen(true); // Open the modal
  };

  const handleDelete = async () => {
    try {
      // Call the API to delete the income
      await API.delete(`/income/${selectedIncomeId}`);
      // Remove the deleted income from the state
      const updatedIncomes = incomes.filter(income => income._id !== selectedIncomeId);
      setIncomes(updatedIncomes);
      // Close the modal after deletion
      setModalIsOpen(false);
      // Reset the form data and editing state
      setFormData({ amount: '', category: '', date: '', description: '' });
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to delete income:', error);
    }
  };

  return (
    <div className="income-container">
      <h1>Incomes</h1>
      <button onClick={handleAddIncomeClick}>Add Income</button> {/* Button to add new income */}
  
      <table>
        <thead>
          <tr>
            <th>Amount</th>
            <th>Category</th>
            <th>Date</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {incomes.map((income, index) => (
            <tr key={index} onClick={() => handleRowClick(income)}> {/* Clicking a row fills the form with data */}
              <td data-label="Amount">{income.amount}</td>
              <td data-label="Category">{income.category}</td>
              <td data-label="Date">{new Date(income.date).toLocaleDateString()}</td>
              <td data-label="Description">{income.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
  
      {/* Modal for adding/updating income */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        contentLabel={isEditing ? "Edit Income" : "Add Income"}
        className="modal"
        overlayClassName="overlay"
      >
        <div className="modal-header">
          <h2>{isEditing ? "Edit Income" : "Add Income"}</h2>
          {isEditing && (
            <button className="delete-button" onClick={handleDelete}>
              Delete
            </button>
          )} {/* Show delete button only in edit mode */}
        </div>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Amount:</label>
            <input type="number" name="amount" value={formData.amount} onChange={handleChange} required />
          </div>
          <div>
            <label>Category:</label>
            <input type="text" name="category" value={formData.category} onChange={handleChange} required />
          </div>
          <div>
            <label>Date:</label>
            <input type="date" name="date" value={formData.date} onChange={handleChange} required />
          </div>
          <div>
            <label>Description:</label>
            <textarea name="description" value={formData.description} onChange={handleChange} rows="4" />
          </div>
          <button type="submit">{isEditing ? "Update" : "Add"}</button>
          <button type="button" onClick={() => setModalIsOpen(false)}>Cancel</button>
        </form>
      </Modal>
    </div>
  );
}

export default Income;
