import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import "./planning.css"; // For styling the table and modal
import API from "../../../utils/api";

function Planning() {
  const [plannings, setPlannings] = useState([]); // Holds all planning data
  const [filteredPlannings, setFilteredPlannings] = useState([]); // Holds filtered planning data for the selected month
  const [currentMonth, setCurrentMonth] = useState(new Date()); // Tracks the currently displayed month
  const [modalIsOpen, setModalIsOpen] = useState(false); // Controls the modal visibility
  const [editingPlan, setEditingPlan] = useState(null); // To track the current plan being edited or added
  const [formData, setFormData] = useState({
    type: "", // Either 'INCOME' or 'EXPENSE'
    category: "",
    description: "",
    amount: "",
    date: "",
  });

  // Fetch all planning data
  useEffect(() => {
    const fetchPlannings = async () => {
      try {
        const response = await API.get("/planning");
        setPlannings(response.data.plan || []); // Ensure we set an empty array if no data
      } catch (error) {
        console.error("Error fetching planning data:", error);
        setPlannings([]); // Set plannings to an empty array in case of error
      }
    };
    fetchPlannings();
  }, []);

  // Filter plannings based on the currentMonth
  useEffect(() => {
    if (plannings.length > 0) {
      const filtered = plannings.filter((plan) => {
        const planDate = new Date(plan.date);
        return (
          planDate.getMonth() === currentMonth.getMonth() &&
          planDate.getFullYear() === currentMonth.getFullYear()
        );
      });
      setFilteredPlannings(filtered);
    }
  }, [plannings, currentMonth]);

  // Calculate totals
  const incomeTotal = filteredPlannings
    .filter((plan) => plan.type === "INCOME")
    .reduce((sum, plan) => sum + parseFloat(plan.amount), 0);

  const expenseTotal = filteredPlannings
    .filter((plan) => plan.type === "EXPENSE")
    .reduce((sum, plan) => sum + parseFloat(plan.amount), 0);

  const totalBalance = incomeTotal - expenseTotal;

  // Handle input change in form
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle form submit (add or update planning)
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form data submitted:", formData); // Debugging line

    if (editingPlan) {
      // Update an existing plan
      try {
        const response = await API.put(`/planning/${editingPlan._id}`, formData);
        console.log("Update response:", response.data); // Debugging line
        setPlannings((prevPlannings) =>
          prevPlannings.map((plan) =>
            plan._id === editingPlan._id ? { ...plan, ...response.data.plan } : plan
          )
        );
        closeModal();
      } catch (error) {
        console.error("Error updating planning:", error);
      }
    } else {
      // Add a new plan
      try {
        const response = await API.post("/planning", formData);
        console.log("Add response:", response.data); // Debugging line
        setPlannings((prevPlannings) => [
          ...prevPlannings,
          response.data.plan,
        ]);
        closeModal();
      } catch (error) {
        console.error("Error adding planning:", error);
      }
    }
  };

  // Handle delete planning
  const handleDelete = async () => {
    if (editingPlan && editingPlan._id) {
      try {
        await API.delete(`/planning/${editingPlan._id}`);
        setPlannings((prevPlannings) =>
          prevPlannings.filter((plan) => plan._id !== editingPlan._id)
        );
        closeModal();
      } catch (error) {
        console.error("Error deleting planning:", error);
      }
    } else {
      console.error("Editing plan ID is undefined.");
    }
  };

  // Open modal for adding or editing planning
  const openAddModal = (plan = null) => {
    if (plan) {
      setEditingPlan(plan); // Set the plan to be edited
      setFormData({
        type: plan.type,
        category: plan.category,
        description: plan.description,
        amount: plan.amount,
        date: new Date(plan.date).toISOString().split("T")[0], // Format date for the input field
      });
    } else {
      setEditingPlan(null); // Clear editing mode
      setFormData({
        type: "",
        category: "",
        description: "",
        amount: "",
        date: "",
      });
    }
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setEditingPlan(null); // Clear editing mode
  };

  // Navigate to previous, current, and next months
  const handlePreviousMonth = () => {
    setCurrentMonth((prevMonth) =>
      new Date(prevMonth.setMonth(prevMonth.getMonth() - 1))
    );
  };

  const handleNextMonth = () => {
    setCurrentMonth((prevMonth) =>
      new Date(prevMonth.setMonth(prevMonth.getMonth() + 1))
    );
  };

  const handleCurrentMonth = () => {
    setCurrentMonth(new Date());
  };

  return (
    <div className="planning-container">
      <h1>
        Planning for{" "}
        {currentMonth.toLocaleString("default", {
          month: "long",
          year: "numeric",
        })}
      </h1>
      
      <div className="pagination-buttons">
        <button onClick={handlePreviousMonth}>Previous Month</button>
        <button onClick={handleCurrentMonth}>Current Month</button>
        <button onClick={handleNextMonth}>Next Month</button>
      </div>

      <button className="add-planning-button" onClick={() => openAddModal()}>
        Add Planning
      </button>

      {/* Planning Table */}
      <table className="planning-table">
        <thead>
          <tr>
            <th>Type</th>
            <th>Category</th>
            <th>Description</th>
            <th>Amount</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {filteredPlannings && filteredPlannings.length > 0 ? (
            filteredPlannings.map((plan, index) => (
              <tr key={index} onClick={() => openAddModal(plan)}>
                <td>{plan.type}</td>
                <td>{plan.category}</td>
                <td>{plan.description}</td>
                <td
                  style={{ color: plan.type === "INCOME" ? "green" : "red" }}
                >
                  {plan.amount}
                </td>
                <td>{new Date(plan.date).toLocaleDateString()}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" style={{ textAlign: "center" }}>
                No planning entries available for this month.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Display totals */}
      <div className="summary-section">
        <h2>Monthly Planning Summary</h2>
        <table className="totals-table">
          <thead>
            <tr>
              <th>Total Income</th>
              <th>Total Expense</th>
              <th>Total Balance</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ color: "green" }}>${incomeTotal.toFixed(2)}</td>
              <td style={{ color: "red" }}>${expenseTotal.toFixed(2)}</td>
              <td>${totalBalance.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Modal for adding or updating planning */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Add Planning Modal"
        className="modal"
        overlayClassName="overlay"
      >
        <h2>{editingPlan ? "Edit Planning" : "Add Planning"}</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Type:
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              required
            >
              <option value="">Select Type</option>
              <option value="INCOME">Income</option>
              <option value="EXPENSE">Expense</option>
            </select>
          </label>

          <label>
            Category:
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Description:
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Amount:
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Date:
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </label>

          <button type="submit">{editingPlan ? "Update" : "Add"}</button>
          {editingPlan && (
            <button type="button" onClick={handleDelete}>
              Delete
            </button>
          )}
          <button type="button" onClick={closeModal}>Cancel</button>
        </form>
      </Modal>
    </div>
  );
}

export default Planning;
