import React, { useState, useEffect } from 'react';
import TopBar from '../Topbar/TopBar';
import Footer from '../Footer/Footer';
import './Dashboard.css';
import { useNavigate } from 'react-router-dom'; // route me to different routes

const Dashboard = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dropdownVisible, setDropdownVisible] = useState(null); // State to track which dropdown is visible
  const navigate = useNavigate();
  const accessToken = localStorage.getItem('accessToken'); // fetch token from localStorage

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
        body: JSON.stringify({ status: 'paid' }),
      });
  
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
  
      // Update the state to reflect the change immediately
      setInvoices((prev) =>
        prev.map((invoice) =>
          invoice.id === id ? { ...invoice, status: 'paid' } : invoice
        )
      );
  
      // Optionally close the dropdown after marking as paid
      setDropdownVisible(null);
  
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

  // Download invoice handler
  const downloadInvoice = async (id) => {
    const accessToken = localStorage.getItem('accessToken');
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/invoices/${id}/pdf`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `invoice_${id}.pdf`;
        a.click();
        URL.revokeObjectURL(url);
      } else {
        throw new Error(`Error downloading invoice: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error downloading invoice:', error);
    }
  };

  // Toggle dropdown visibility
  const toggleDropdown = (id) => {
    setDropdownVisible((prev) => (prev === id ? null : id));
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
                    <button className="dropdown-button" onClick={() => toggleDropdown(invoice.id)}>View</button>
                    {dropdownVisible === invoice.id && (
                      <div className="dropdown-content">
                        {/* Always show Download and Delete */}
                        <button onClick={() => downloadInvoice(invoice.id)}>Download</button>
                        <button onClick={() => deleteInvoice(invoice.id)}>Delete</button>

                        {/* Only show Edit and Mark as Paid if not Paid */}
                        {invoice.status !== 'paid' && (
                          <>
                            <button onClick={() => navigate(`/edit/${invoice.id}`)}>Edit</button>
                            <button onClick={() => markAsPaid(invoice.id)}>Mark as Paid</button>
                          </>
                        )}
                      </div>
                    )}
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
