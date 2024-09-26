import React, { useEffect, useState } from 'react';
import './dashboard.css';
import API from '../../../utils/api.js'; // Assuming you have an API service to handle requests

export const ExpenceOverView = () => {
  // State to hold income, expense, and budget
  const [data, setData] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    remainingBudget: 0,
  });

  // Fetch data from the API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await API.get("/dashboard/overview"); // Call the API
        const { totalIncome, totalExpenses, remainingBudget } = response.data;
        
        // Set the data from the API response
        setData({
          totalIncome,
          totalExpenses,
          remainingBudget,
        });
      } catch (error) {
        console.error('Error fetching dashboard overview data:', error);
      }
    };

    fetchData(); // Call fetchData on component mount
  }, []); // Empty dependency array to only fetch on mount

  return (
    <div className="expense-overview">
      <div className="card">
        <h3>Total Income</h3>
        <p>{data.totalIncome}</p> {/* Display total income */}
      </div>
      <div className="card">
        <h3>Total Expenses</h3>
        <p>{data.totalExpenses}</p> {/* Display total expenses */}
      </div>
      <div className="card">
        <h3>Remaining Budget</h3>
        <p>{data.remainingBudget}</p> {/* Display remaining budget */}
      </div>
    </div>
  );
};
