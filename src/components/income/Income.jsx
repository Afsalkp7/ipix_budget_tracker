import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import './income.css';
import API from '../../../utils/api';

function Income() {
  const [incomes, setIncomes] = useState([]);
  const [filteredIncomes, setFilteredIncomes] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedIncomeId, setSelectedIncomeId] = useState(null);
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
    const fetchIncomes = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await API.get('/income');
        setIncomes(response.data.income);
      } catch (error) {
        setError('Error fetching incomes. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchIncomes();
  }, []);

  useEffect(() => {
    const filtered = incomes.filter((income) => {
      const incomeDate = new Date(income.date);
      return incomeDate.getMonth() === currentMonth.getMonth() && incomeDate.getFullYear() === currentMonth.getFullYear();
    });
    setFilteredIncomes(filtered);
  }, [incomes, currentMonth]);

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
    
    // Validate formData
    if (formData.amount <= 0) {
      setError('Amount must be a positive number.');
      return;
    }

    setLoading(true);
    try {
      if (isEditing) {
        await API.put(`/income/${selectedIncomeId}`, formData);
        setIncomes((prev) =>
          prev.map((income) => (income._id === selectedIncomeId ? { ...income, ...formData } : income))
        );
      } else {
        const response = await API.post('/income', formData);
        setIncomes((prev) => [...prev, response.data.income]);
      }
      setSuccessMessage(isEditing ? 'Income updated successfully!' : 'Income added successfully!');
      closeModal();
    } catch (error) {
      setError('Failed to add or update income. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (selectedIncomeId) {
      setLoading(true);
      try {
        await API.delete(`/income/${selectedIncomeId}`);
        setIncomes((prev) => prev.filter((income) => income._id !== selectedIncomeId));
        closeModal();
        setSuccessMessage('Income deleted successfully!');
      } catch (error) {
        setError('Error deleting income. Please try again later.');
      } finally {
        setLoading(false);
      }
    }
  };

  const openAddModal = (income = null) => {
    if (income) {
      setIsEditing(true);
      setSelectedIncomeId(income._id);
      setFormData({
        amount: income.amount,
        category: income.category,
        date: new Date(income.date).toISOString().split("T")[0],
        description: income.description,
      });
    } else {
      setIsEditing(false);
      setSelectedIncomeId(null);
      setFormData({ amount: '', category: '', date: '', description: '' });
    }
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedIncomeId(null);
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
    <div className="income-container">
      <h1>Income for {currentMonth.toLocaleString("default", { month: "long", year: "numeric" })}</h1>
      <div className="pagination-buttons">
        <button onClick={handlePreviousMonth}>Previous Month</button>
        <button onClick={handleCurrentMonth}>Current Month</button>
        <button onClick={handleNextMonth}>Next Month</button>
      </div>
      <button className="add-income-button" onClick={() => openAddModal()}>Add Income</button>
      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}
      {successMessage && <p className="success">{successMessage}</p>}
      <table className="income-table">
        <thead>
          <tr>
            <th>Amount</th>
            <th>Category</th>
            <th>Description</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {filteredIncomes.length > 0 ? (
            filteredIncomes.map((income) => (
              <tr key={income._id} onClick={() => openAddModal(income)}>
                <td style={{ color: "green" }}>${income.amount}</td>
                <td>{income.category}</td>
                <td>{income.description}</td>
                <td>{new Date(income.date).toLocaleDateString()}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" style={{ textAlign: "center" }}>No income entries available for this month.</td>
            </tr>
          )}
        </tbody>
      </table>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Add Income Modal"
        className="modal"
        overlayClassName="overlay"
      >
        <h2>{isEditing ? "Edit Income" : "Add Income"}</h2>
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

export default Income;
