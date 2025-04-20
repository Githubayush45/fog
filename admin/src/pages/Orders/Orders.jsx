import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Orders.css';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        console.log('Token:', token);
        const response = await axios.get('http://localhost:4000/api/order/orders', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.data.success) {
          setOrders(response.data.orders);
        } else {
          const errorMsg = response.data.message || 'Failed to fetch orders';
          setError(errorMsg);
          console.error('API response error:', response.data);
        }
      } catch (err) {
        const errorMsg = err.response?.data?.message || 'Error fetching orders';
        setError(errorMsg);
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <div>Loading orders...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="orders-container">
      <h2>Orders</h2>
      <table className="orders-table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>User Name</th>
            <th>User Email</th>
            <th>Items</th>
            <th>Amount</th>
            <th>Address</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order._id}>
              <td>{order._id}</td>
              <td>{order.userId?.name || 'N/A'}</td>
              <td>{order.userId?.email || 'N/A'}</td>
              <td>
                <ul>
                  {order.items.map((item, index) => (
                    <li key={index}>
                      {item.name} x {item.quantity}
                    </li>
                  ))}
                </ul>
              </td>
              <td>${order.amount.toFixed(2)}</td>
              <td>
                {order.address
                  ? `${order.address.street || ''}, ${order.address.city || ''}, ${order.address.state || ''}, ${order.address.zipcode || ''}, ${order.address.country || ''}`
                  : 'N/A'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Orders;
