import React, { useState, useEffect } from 'react';
import TopBar from '../Topbar/TopBar';
import Footer from '../Footer/Footer';
import './Dashboard.css';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const accessToken = localStorage.getItem('accessToken'); // Assuming token is stored in localStorage

  // Fetch invoices on component mount
  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/invoices/', { // Make sure the URL is correct
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }

        const data = await response.json();
        setInvoices(data);
      } catch (error) {
        console.error('Error fetching invoices:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, [accessToken]);

  // Mark as Paid handler
  const markAsPaid = async (id) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/invoices/${id}/`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'Paid' }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      setInvoices((prev) =>
        prev.map((invoice) =>
          invoice.id === id ? { ...invoice, status: 'Paid' } : invoice
        )
      );
      alert('Invoice marked as Paid');
    } catch (error) {
      console.error('Error marking invoice as Paid:', error);
    }
  };

  // Delete handler
  const deleteInvoice = async (id) => {
    if (!window.confirm('Are you sure you want to delete this invoice?')) return;

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/invoices/${id}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      setInvoices((prev) => prev.filter((invoice) => invoice.id !== id));
      alert('Invoice deleted');
    } catch (error) {
      console.error('Error deleting invoice:', error);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <TopBar />
      <div className="dashboard-header">
        <h1>My Invoices</h1>
        <button className="create-button" onClick={() => navigate('/create')}>
          Create Invoice
        </button>
      </div>
      <div className="dashboard-table-container">
        <table className="dashboard-table">
          <thead>
            <tr>
              <th>Customer</th>
              <th>Reference</th>
              <th>Date</th>
              <th>Due Date</th>
              <th>Status</th>
              <th>Total</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((invoice) => (
              <tr key={invoice.id}>
                <td>{invoice.customer_name}</td>
                <td>{invoice.invoice_number}</td>
                <td>{invoice.date}</td>
                <td>{invoice.due_date}</td>
                <td>{invoice.status}</td>
                <td>{invoice.balance_due}</td>
                <td>
                  <div className="dropdown">
                    <button className="dropdown-button">View</button>
                    <ul className="dropdown-menu">
                      <li>
                        <a href={`http://127.0.0.1:8000/api/invoices/${invoice.id}/download`}>Download</a>
                      </li>
                      <li>
                        <button onClick={() => navigate(`/edit/${invoice.id}`)}>Edit</button>
                      </li>
                      <li>
                        <button onClick={() => markAsPaid(invoice.id)}>Mark as Paid</button>
                      </li>
                      <li>
                        <button onClick={() => deleteInvoice(invoice.id)}>Delete</button>
                      </li>
                    </ul>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;
