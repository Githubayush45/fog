import React, { useState, useEffect, useContext } from 'react';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';
import './MyOrders.css';
import { FiPackage, FiChevronRight, FiX, FiCheck } from 'react-icons/fi';

const MyOrders = () => {
  const { token, url } = useContext(StoreContext);
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cancellingOrderId, setCancellingOrderId] = useState(null);

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

  const handleCancelOrder = async (orderId) => {
    try {
      setCancellingOrderId(orderId);
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.patch(
        `${url}/api/order/order/${orderId}/status`,
        { status: 'cancelled' },
        config
      );
      if (response.data.success) {
        setOrders(prevOrders =>
          prevOrders.map(order =>
            order._id === orderId ? { ...order, status: 'cancelled' } : order
          )
        );
      }
    } catch (error) {
      alert('Failed to cancel order');
    } finally {
      setCancellingOrderId(null);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return { bg: '#FFF4E5', text: '#FFA700' };
      case 'processing':
        return { bg: '#E5F1FF', text: '#0066CC' };
      case 'delivered':
        return { bg: '#E6F7EE', text: '#00A651' };
      case 'cancelled':
        return { bg: '#FFEBEE', text: '#D32F2F' };
      default:
        return { bg: '#F5F5F5', text: '#616161' };
    }
  };

  return (
    <div className="my-orders-container">
      <div className="orders-header">
        <h1>My Orders</h1>
        <div className="order-filters">
          {['all', 'pending', 'processing', 'delivered', 'cancelled'].map((status) => (
            <button
              key={status}
              className={`filter-btn ${filter === status ? 'active' : ''}`}
              onClick={() => setFilter(status)}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {loading && (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading your orders...</p>
        </div>
      )}

      {error && (
        <div className="error-state">
          <p>{error}</p>
          <button onClick={() => fetchOrders(filter)}>Try Again</button>
        </div>
      )}

      {!loading && !error && orders.length === 0 && (
        <div className="empty-state">
          <FiPackage size={48} />
          <p>No orders found</p>
          <p>You haven't placed any orders yet</p>
        </div>
      )}

      <div className="orders-list">
        {orders.map((order) => {
          const statusColor = getStatusColor(order.status);
          return (
            <div key={order._id} className="order-card">
              <div className="order-header">
                <div className="order-meta">
                  <div className="order-id">Order #{order._id.substring(order._id.length - 6)}</div>
                  <div className="order-date">Placed on {new Date(order.date).toLocaleDateString()}</div>
                </div>
                <div
                  className="order-status"
                  style={{
                    backgroundColor: statusColor.bg,
                    color: statusColor.text,
                  }}
                >
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </div>
              </div>

              <div className="order-summary">
                <div className="order-items-preview">
                  {order.items.slice(0, 3).map((item, index) => (
                    <div key={index} className="item-preview">
                      <div className="item-image-placeholder">
                        <FiPackage />
                      </div>
                      <div className="item-details">
                        <div className="item-name">{item.name}</div>
                        <div className="item-quantity">Qty: {item.quantity}</div>
                      </div>
                    </div>
                  ))}
                  {order.items.length > 3 && (
                    <div className="more-items">+{order.items.length - 3} more items</div>
                  )}
                </div>

                <div className="order-actions">
                  <div className="order-total">Total: ${order.amount.toFixed(2)}</div>
                  <div className="action-buttons">
                    {order.status === 'processing' && (
                      <button
                        className="cancel-btn"
                        onClick={() => handleCancelOrder(order._id)}
                        disabled={cancellingOrderId === order._id}
                      >
                        {cancellingOrderId === order._id ? 'Cancelling...' : 'Cancel Order'}
                      </button>
                    )}
                  
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MyOrders;
