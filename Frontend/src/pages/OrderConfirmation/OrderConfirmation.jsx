import React, { useEffect } from "react";
import "./OrderConfirmation.css";

const OrderConfirmation = () => {
  useEffect(() => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance("Thank you for placing order with us");
      window.speechSynthesis.speak(utterance);
    }
  }, []);

  return (
    <div className="order-confirmation-page">
      <div className="confirmation-container">
        <h1>Order Confirmed!</h1>
        <p>Thank you for placing your order with us.</p>
        <p>We are processing your order and will notify you shortly.</p>
      </div>
    </div>
  );
};

export default OrderConfirmation;
