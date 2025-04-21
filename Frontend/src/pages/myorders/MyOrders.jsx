import React, { useState, useEffect, useContext } from 'react';

import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';
import './MyOrders.css';

const MyOrders = () => {
  const { token, url } = useContext(StoreContext);
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const statusMap = {
    all: null,
    pending: 'pending',
    processing: 'processing',
    delivered: 'delivered',
    cancelled: 'cancelled',
  };

  const fetchOrders = async (statusFilter) => {
    setLoading(true);
    setError(null);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {},
      };
      if (statusFilter && statusMap[statusFilter]) {
        config.params.status = statusMap[statusFilter];
      }
      const response = await axios.get(`${url}/api/order/user/orders`, config);
      if (response.data.success) {
        setOrders(response.data.orders);
      } else {
        setError('Failed to fetch orders');
      }
    } catch (err) {
      setError('Error fetching orders');
    }
    setLoading(false);
  };

  useEffect(() => {
    if (token) {
      fetchOrders(filter);
    }
  }, [token, filter]);

  const handleFilterChange = (status) => {
    setFilter(status);
  };

  return (
    <>
      <div className="myorders-container">
        <h1>My Orders</h1>
        <div className="filters">
          <button
            className={filter === 'all' ? 'active' : ''}
            onClick={() => handleFilterChange('all')}
          >
            All
          </button>
          <button
            className={filter === 'pending' ? 'active' : ''}
            onClick={() => handleFilterChange('pending')}
          >
            Pending
          </button>
          <button
            className={filter === 'processing' ? 'active' : ''}
            onClick={() => handleFilterChange('processing')}
          >
            Processing
          </button>
          <button
            className={filter === 'delivered' ? 'active' : ''}
            onClick={() => handleFilterChange('delivered')}
          >
            Delivered
          </button>
          <button
            className={filter === 'cancelled' ? 'active' : ''}
            onClick={() => handleFilterChange('cancelled')}
          >
            Cancelled
          </button>
        </div>
        {loading && <p>Loading orders...</p>}
        {error && <p className="error">{error}</p>}
        {!loading && !error && orders.length === 0 && <p>No orders found.</p>}
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order._id} className="order-card">
              <p><strong>Order ID:</strong> {order._id}</p>
              <p><strong>Status:</strong> {order.status}</p>
              <p><strong>Amount:</strong> ${order.amount.toFixed(2)}</p>
              <p><strong>Items:</strong></p>
              <ul>
                {order.items.map((item, index) => (
                  <li key={index}>
                    {item.name} x {item.quantity}
                  </li>
                ))}
              </ul>
              <p><strong>Address:</strong></p>
              <p>
                {order.address.firstName} {order.address.lastName}<br />
                {order.address.email}<br />
                {order.address.street}<br />
                {order.address.city}, {order.address.state} {order.address.zipcode}<br />
                {order.address.country}<br />
                Phone: {order.address.phone}
              </p>
              <p><strong>Date:</strong> {new Date(order.date).toLocaleString()}</p>
              {order.status === 'processing' && (
                <button
                  className="cancel-button"
                  onClick={async () => {
                    try {
                      const config = {
                        headers: {
                          Authorization: `Bearer ${token}`,
                        },
                      };
                      const response = await axios.patch(
                        `${url}/api/order/order/${order._id}/status`,
                        { status: 'cancelled' },
                        config
                      );
                      if (response.data.success) {
                        // Update order status locally
                        setOrders((prevOrders) =>
                          prevOrders.map((o) =>
                            o._id === order._id ? { ...o, status: 'cancelled' } : o
                          )
                        );
                      } else {
                        alert('Failed to cancel order');
                      }
                    } catch (error) {
                      alert('Error cancelling order');
                    }
                  }}
                >
                  Cancel
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default MyOrders;
