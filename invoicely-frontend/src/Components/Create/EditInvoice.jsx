import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom'; // useParams to get the invoice ID from the URL
import './Create.css';

function EditInvoice() {
  const navigate = useNavigate();
  const { id } = useParams(); // Get invoice ID from the URL
  const [invoice, setInvoice] = useState({
    invoice_number: '',
    date: '',
    payment_terms: '',
    due_date: '',
    po_number: '',
    logo: null,
    sender: '',
    notes: '',
    customer_name: '',
    tax: 0,
    discount: 0,
    shipment: 0,
    amount_paid: 0,
    balance_due: 0,
  });

  const [items, setItems] = useState([
    {
      description: 'Item 1', 
      quantity: 1,           
      rate: 1,               
      amount: 1,             
    },
  ]);
  
  const [currency, setCurrency] = useState('USD');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch the invoice data on component mount
    const fetchInvoice = async () => {
      const token = localStorage.getItem('accessToken');
      if (!token) return;

      try {
        const response = await fetch(`http://127.0.0.1:8000/api/invoices/${id}/`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setInvoice(data);
          setItems(data.items); // Assuming the invoice contains an array of items
        } else {
          console.error('Error fetching invoice:', response.statusText);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchInvoice();
  }, [id]);

  useEffect(() => {
    calculateBalanceDue();
  }, [invoice.tax, invoice.discount, invoice.shipment, invoice.amount_paid, items]);

  const handleInvoiceChange = (e) => {
    const { name, value } = e.target;
    setInvoice((prev) => ({
      ...prev,
      [name]: name === 'logo' ? e.target.files[0] : value,
    }));
    if (['tax', 'discount', 'shipment', 'amount_paid'].includes(name)) {
      calculateBalanceDue();
    }
  };

  const handleItemChange = (e, index) => {
    const { name, value } = e.target;
    setItems((prevItems) => {
      const updatedItems = [...prevItems];
      updatedItems[index][name] = value;
      if (name === 'quantity' || name === 'rate') {
        updatedItems[index].amount = updatedItems[index].quantity * updatedItems[index].rate;
      }
      return updatedItems;
    });
    calculateBalanceDue();
  };

  const handleAddItem = () => {
    setItems((prevItems) => [
      ...prevItems,
      { description: '', quantity: 0, rate: 0, amount: 0 },
    ]);
  };

  const handleRemoveItem = (index) => {
    setItems((prevItems) => prevItems.filter((_, i) => i !== index));
    calculateBalanceDue();
  };

  const calculateSubtotal = () => {
    return items.reduce((total, item) => total + item.amount, 0);
  };

  const calculateBalanceDue = () => {
  const subtotal = calculateSubtotal();
  const tax = (subtotal * (parseFloat(invoice.tax) || 0)) / 100; // Ensure tax is a number
  const discount = parseFloat(invoice.discount) || 0;           // Convert discount to a number
  const shipment = parseFloat(invoice.shipment) || 0;           // Convert shipment to a number
  const amountPaid = parseFloat(invoice.amount_paid) || 0;      // Convert amount paid to a number

  const balanceDue = subtotal + tax - discount + shipment - amountPaid;

  setInvoice((prevState) => ({
    ...prevState,
    balance_due: balanceDue,
  }));
};


  const validateForm = () => {
    const newErrors = {};
    if (!invoice.customer_name) newErrors.customer_name = 'Customer name is required';
    if (!invoice.sender) newErrors.sender = 'Sender name is required';
    if (
      items.length === 0 ||
      items.some(
        (item) => !item.description.trim() || item.quantity <= 0 || item.rate <= 0
      )
    ) {
      newErrors.items = 'Each item must have a description, positive quantity, and positive rate';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    const token = localStorage.getItem('accessToken');
    if (!token) {
      console.error('Access token is missing');
      setLoading(false);
      return;
    }

    const formData = new FormData();
    Object.keys(invoice).forEach((key) => {
      if (key === 'logo' && !invoice[key]) {
        return;
      }
      formData.append(key, invoice[key]);
    });

    items.forEach((item, index) => {
      formData.append(`items[${index}][description]`, item.description);
      formData.append(`items[${index}][quantity]`, item.quantity);
      formData.append(`items[${index}][rate]`, item.rate);
      formData.append(`items[${index}][amount]`, item.amount);
    });

    formData.append('subtotal', calculateSubtotal());
    formData.append('currency', currency);

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/invoices/${id}/`, {
        method: 'PATCH', // Use PATCH to update the invoice
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.status === 200) {
        navigate('/dashboard');
      } else {
        const data = await response.json();
        setErrors(data);
        console.error('Error:', data);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-invoice-container">
      <h1>Edit Invoice</h1>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="form-group">
          <label>Logo</label>
          <input type="file" name="logo" onChange={handleInvoiceChange} />
        </div>
        
        <div className="form-group">
          <label>Invoice No</label>
          <input
            type="text"
            name="invoice_number"
            value={invoice.invoice_number}
            onChange={handleInvoiceChange}
            className={errors.invoice_number ? 'error' : ''}
          />
        </div>

        <div className="form-group">
          <label>Sender</label>
          <input
            type="text"
            name="sender"
            value={invoice.sender}
            onChange={handleInvoiceChange}
            className={errors.sender ? 'error' : ''}
          />
        </div>

        <div className="form-group">
          <label>Customer Name</label>
          <input
            type="text"
            name="customer_name"
            value={invoice.customer_name}
            onChange={handleInvoiceChange}
            className={errors.customer_name ? 'error' : ''}
          />
        </div>

        <div className="form-group">
          <label>Date</label>
          <input
            type="date"
            name="date"
            value={invoice.date}
            onChange={handleInvoiceChange}
          />
        </div>

        <div className="form-group">
          <label>Payment Terms</label>
          <input
            type="text"
            name="payment_terms"
            value={invoice.payment_terms}
            onChange={handleInvoiceChange}
          />
        </div>

        <div className="form-group">
          <label>Due Date</label>
          <input
            type="date"
            name="due_date"
            value={invoice.due_date}
            onChange={handleInvoiceChange}
          />
        </div>

        <div className="form-group">
          <label>PO Number</label>
          <input
            type="text"
            name="po_number"
            value={invoice.po_number}
            onChange={handleInvoiceChange}
          />
        </div>

        <h2>Items</h2>
        <table>
          <thead>
            <tr>
              <th>Description</th>
              <th>Quantity</th>
              <th>Rate</th>
              <th>Amount</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={index}>
                <td>
                  <input
                    type="text"
                    name="description"
                    value={item.description}
                    onChange={(e) => handleItemChange(e, index)}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    name="quantity"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(e, index)}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    name="rate"
                    value={item.rate}
                    onChange={(e) => handleItemChange(e, index)}
                  />
                </td>
                <td>
                  <input type="number" name="amount" value={item.amount} readOnly />
                </td>
                <td>
                  <button type="button" onClick={() => handleRemoveItem(index)}>
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <button type="button" onClick={handleAddItem}>
          Add Item
        </button>

        <div className="form-group">
          <label>Notes</label>
          <textarea
            name="notes"
            value={invoice.notes}
            onChange={handleInvoiceChange}
          ></textarea>
        </div>

        <div className="form-group">
          <label>Subtotal</label>
          <input type="number" name="subtotal" value={calculateSubtotal()} readOnly />
        </div>

        <div className="form-group">
          <label>Tax(%)</label>
          <input type="number" name="tax" value={invoice.tax} onChange={handleInvoiceChange} />
        </div>

        <div className="form-group">
          <label>Discount</label>
          <input type="number" name="discount" value={invoice.discount} onChange={handleInvoiceChange} />
        </div>

        <div className="form-group">
          <label>Shipment</label>
          <input type="number" name="shipment" value={invoice.shipment} onChange={handleInvoiceChange} />
        </div>

        <div className="form-group">
          <label>Amount Paid</label>
          <input type="number" name="amount_paid" value={invoice.amount_paid} onChange={handleInvoiceChange} />
        </div>

        <div className="form-group">
          <label>Balance Due</label>
          <input type="number" name="balance_due" value={invoice.balance_due} readOnly />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Saving...' : 'Save Invoice'}
        </button>
      </form>
    </div>
  );
}

export default EditInvoice;
