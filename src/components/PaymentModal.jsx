// src/components/PaymentModal.jsx
import React from "react";
import "./PaymentModal.css";

function PaymentModal({ visible, status }) {
  if (!visible) return null;

  return (
    <div className="payment-overlay">
      <div className="payment-modal">
        {status === "loading" && (
          <>
            <div className="loader"></div>
            <p className="mt-3">Processando pagamento...</p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="success-icon">✔</div>
            <p className="mt-3">Pagamento aprovado!</p>
          </>
        )}
      </div>
    </div>
  );
}

export default PaymentModal;
