import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import './expense.css'; // Add your CSS file for styling
import API from '../../../utils/api';

function Expense() {
  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date()); // State to hold expense data
  const [modalIsOpen, setModalIsOpen] = useState(false); // State to control modal visibility
  const [isEditing, setIsEditing] = useState(false); // State to track if we are editing an existing expense
  const [selectedExpenseId, setSelectedExpenseId] = useState(null); // State to store the id of the expense being edited
  const [formData, setFormData] = useState({
    amount: '',
    category: '',
    date: '',
    description: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  useEffect(() => {
    // Fetch expenses from the backend API
    const fetchExpenses = async () => {
      try {
        const response = await API.get('/expense');
        setExpenses(response.data.expense); // Assuming the response contains the expense array
      } catch (error) {
        console.error('Error fetching expenses:', error);
      }finally {
        setLoading(false);
      }
    };
    fetchExpenses();
  }, []);

  useEffect(() => {
    const filtered = expenses.filter((expense) => {
      const expenseDate = new Date(expense.date);
      return expenseDate.getMonth() === currentMonth.getMonth() && expenseDate.getFullYear() === currentMonth.getFullYear();
    });
    setFilteredExpenses(filtered);
  }, [expenses, currentMonth]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    if (formData.amount <= 0) {
        setError('Amount must be a positive number.');
        return;
      }
  
      setLoading(true);
    try {
      if (isEditing) {
        // Update existing expense
        await API.put(`/expense/${selectedExpenseId}`, formData);
        setExpenses((prev) =>
            prev.map((expense) => (expense._id === selectedExpenseId ? { ...expense, ...formData } : expense))
          );
      } else {
        // Add new expense
        const response = await API.post('/expense', formData);
        setExpenses((prev) => [...prev, response.data.expense]); // Add the new expense to the existing list
      }
      
      setSuccessMessage(isEditing ? 'Expense updated successfully!' : 'expense added successfully!');
      closeModal();
      setSuccessMessage('Expense deleted successfully!');
    } catch (error) {
      console.error('Failed to add or update expense:', error);
    } finally {
        setLoading(false);
      }
  };

  const handleDelete = async () => {
    if (selectedExpenseId) {
      setLoading(true);
      try {
        await API.delete(`/expense/${selectedExpenseId}`);
        setExpenses((prev) => prev.filter((expense) => expense._id !== selectedExpenseId));
        closeModal();
        setSuccessMessage('expense deleted successfully!');
      } catch (error) {
        setError('Error deleting expense. Please try again later.');
      } finally {
        setLoading(false);
      }
    }
  };
  
  const openAddModal = (expense = null) => {
    if (expense) {
      setIsEditing(true);
      setSelectedExpenseId(expense._id);
      setFormData({
        amount: expense.amount,
        category: expense.category,
        date: new Date(expense.date).toISOString().split("T")[0],
        description: expense.description,
      });
    } else {
      setIsEditing(false);
      setSelectedExpenseId(null);
      setFormData({ amount: '', category: '', date: '', description: '' });
    }
    setModalIsOpen(true);
  };
  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedExpenseId(null);
    setIsEditing(false);
    setSuccessMessage('');
    setError('');
  };
  const handlePreviousMonth = () => {
    setCurrentMonth((prev) => {
      const newDate = new Date(prev); // Clone the previous date
      newDate.setMonth(prev.getMonth() - 1); // Update the month
      return newDate;
    });
  };
  
  const handleNextMonth = () => {
    setCurrentMonth((prev) => {
      const newDate = new Date(prev); // Clone the previous date
      newDate.setMonth(prev.getMonth() + 1); // Update the month
      return newDate;
    });
  };
  

  const handleCurrentMonth = () => {
    setCurrentMonth(new Date());
  };
  

 

 
  return (
    <div className="expense-container">
    <h1>Expense for {currentMonth.toLocaleString("default", { month: "long", year: "numeric" })}</h1>
    <div className="pagination-buttons">
      <button onClick={handlePreviousMonth}>Previous Month</button>
      <button onClick={handleCurrentMonth}>Current Month</button>
      <button onClick={handleNextMonth}>Next Month</button>
    </div>
    <button className="add-expense-button" onClick={() => openAddModal()}>Add Expense</button>
    {loading && <p>Loading...</p>}
    {error && <p className="error">{error}</p>}
    {successMessage && <p className="success">{successMessage}</p>}
    <table className="expense-table">
      <thead>
        <tr>
          <th>Amount</th>
          <th>Category</th>
          <th>Description</th>
          <th>Date</th>
        </tr>
      </thead>
      <tbody>
        {filteredExpenses.length > 0 ? (
          filteredExpenses.map((expense) => (
            <tr key={expense._id} onClick={() => openAddModal(expense)}>
              <td style={{ color: "green" }}>${expense.amount}</td>
              <td>{expense.category}</td>
              <td>{expense.description}</td>
              <td>{new Date(expense.date).toLocaleDateString()}</td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="4" style={{ textAlign: "center" }}>No Expense entries available for this month.</td>
          </tr>
        )}
      </tbody>
    </table>
    <Modal
      isOpen={modalIsOpen}
      onRequestClose={closeModal}
      contentLabel="Add expense Modal"
      className="modal"
      overlayClassName="overlay"
    >
      <h2>{isEditing ? "Edit expense" : "Add expense"}</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Amount:
          <input type="number" name="amount" value={formData.amount} onChange={handleChange} required />
        </label>
        <label>
          Category:
          <input type="text" name="category" value={formData.category} onChange={handleChange} required />
        </label>
        <label>
          Description:
          <input type="text" name="description" value={formData.description} onChange={handleChange} required />
        </label>
        <label>
          Date:
          <input type="date" name="date" value={formData.date} onChange={handleChange} required />
        </label>
        <button type="submit">{isEditing ? "Update" : "Add"}</button>
        {isEditing && <button type="button" onClick={handleDelete}>Delete</button>}
        <button type="button" onClick={closeModal}>Cancel</button>
      </form>
    </Modal>
  </div>
  );
}

export default Expense;


