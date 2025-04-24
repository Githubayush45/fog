import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FiPackage, FiTruck, FiCheck, FiX, FiUser, FiMail, FiMapPin, FiDollarSign } from 'react-icons/fi';
import './Orders.css';

const AdminOrders = ({url}) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${url}/api/orders/orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data.success) {
        setOrders(response.data.orders);
      } else {
        setError(response.data.message || 'Failed to fetch orders');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching orders');
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchOrders();
  }, []);

  const updateOrderStatus = async (orderId, status) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.patch(
        `${url}/api/orders/order/${orderId}/status`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.success) {
        toast.success(`Order marked as ${status}`);
        setOrders(prevOrders =>
          prevOrders.map(order =>
            order._id === orderId ? { ...order, status } : order
          )
        );
      } else {
        toast.error(response.data.message || 'Failed to update order');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error updating order');
    }
  };

  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return true;
    return order.status === filter;
  });

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

  if (loading) {
    return (
      <div className="admin-orders-loading">
        <div className="spinner"></div>
        <p>Loading orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-orders-error">.
        <p>{error}</p>
        <button onClick={fetchOrders}>Try Again</button>
      </div>
    );
  }

  return (
    <div className="admin-orders-container">
      <h1>Manage Orders</h1>
      
      <div className="admin-orders-filters">
        {['all', 'pending', 'processing', 'delivered', 'cancelled'].map(status => (
          <button
            key={status}
            className={`filter-btn ${filter === status ? 'active' : ''}`}
            onClick={() => setFilter(status)}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {filteredOrders.length === 0 ? (
        <div className="admin-orders-empty">
          <FiPackage size={48} />
          <p>No orders found</p>
          <p>There are no {filter === 'all' ? '' : filter} orders at this time</p>
        </div>
      ) : (
        <div className="admin-orders-list">
          {filteredOrders.map(order => {
            const statusColor = getStatusColor(order.status);
            return (
              <div key={order._id} className="admin-order-card">
                <div className="order-header">
                  <div className="order-meta">
                    <div className="order-id">
                      <FiPackage /> Order #{order._id.substring(order._id.length - 6)}
                    </div>
                    <div className="order-date">
                      {new Date(order.date).toLocaleDateString()}
                    </div>
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

                <div className="order-customer">
                  <div className="customer-info">
                    <div className="customer-name">
                      <FiUser /> {order.userId?.name || 'N/A'}
                    </div>
                    <div className="customer-email">
                      <FiMail /> {order.userId?.email || 'N/A'}
                    </div>
                  </div>
                  <div className="order-amount">
                    <FiDollarSign /> {order.amount.toFixed(2)}
                  </div>
                </div>

                <div className="order-items-section">
                  <div className="order-items">
                    {order.items.slice(0, 3).map((item, index) => (
                      <div key={index} className="order-item">
                        <div className="item-name">{item.name}</div>
                        <div className="item-quantity">x{item.quantity}</div>
                      </div>
                    ))}
                    {order.items.length > 3 && (
                      <div className="more-items">+{order.items.length - 3} more items</div>
                    )}
                  </div>
                </div>

                <div className="order-address">
                  <div className="address-header">
                    <FiMapPin /> Delivery Address
                  </div>
                  {order.address ? (
                    <div className="address-details">
                      <div>{order.address.street}</div>
                      <div>
                        {order.address.city}, {order.address.state} {order.address.zipcode}
                      </div>
                      <div>{order.address.country}</div>
                      <div>Phone: {order.address.phone}</div>
                    </div>
                  ) : (
                    <div className="address-missing">No address provided</div>
                  )}
                </div>

                <div className="order-actions">
                  {order.status === 'pending' && (
                    <button
                      className="process-btn"
                      onClick={() => updateOrderStatus(order._id, 'processing')}
                    >
                      <FiTruck /> Process Order
                    </button>
                  )}
                  {order.status === 'processing' && (
                    <button
                      className="deliver-btn"
                      onClick={() => updateOrderStatus(order._id, 'delivered')}
                    >
                      <FiCheck /> Mark Delivered
                    </button>
                  )}
                  {order.status !== 'cancelled' && order.status !== 'delivered' && (
                    <button
                      className="cancel-btn"
                      onClick={() => updateOrderStatus(order._id, 'cancelled')}
                    >
                      <FiX /> Cancel Order
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
      <ToastContainer position="bottom-right" />
    </div>
  );
};

export default AdminOrders;
