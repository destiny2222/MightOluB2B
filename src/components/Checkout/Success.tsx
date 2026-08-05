"use client";
import React, { useEffect, useState } from "react";
import Breadcrumb from "../Common/Breadcrumb";
import Link from "next/link";
import styles from "./Success.module.css";

const Success = () => {
  const [orderNumber, setOrderNumber] = useState<string>("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const orderId = params.get("order_id") || "ORD-" + Math.floor(100000 + Math.random() * 900000);
      setOrderNumber(orderId);
    }
  }, []);

  return (
    <>
      <Breadcrumb title={"Order Successful"} pages={["checkout", "success"]} />
      <section className={styles.successWrapper}>
        <div className={styles.successCard}>
          <div className={styles.iconContainer}>
            <svg 
              className={styles.checkmark} 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor" 
              strokeWidth="3"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <h2 className={styles.title}>Thank You For Your Order!</h2>
          <p className={styles.message}>
            Your payment was successful and your order is now being processed. 
            You will receive an email confirmation shortly.
          </p>

          <div className={styles.detailsBox}>
            <div className={styles.detailsRow}>
              <span className={styles.detailsLabel}>Order Reference</span>
              <span className={styles.detailsValue}>#{orderNumber || "..."}</span>
            </div>
            <div className={styles.detailsRow}>
              <span className={styles.detailsLabel}>Status</span>
              <span className={styles.detailsValue} style={{color: '#059669'}}>Processing</span>
            </div>
            <div className={styles.detailsRow}>
              <span className={styles.detailsLabel}>Date</span>
              <span className={styles.detailsValue}>{new Date().toLocaleDateString()}</span>
            </div>
          </div>
          
          <div className={styles.actions}>
            <Link href="/my-account" className={styles.primaryBtn}>
              View Order Details
            </Link>
            <Link href="/shop-with-sidebar" className={styles.secondaryBtn}>
              Continue Shopping
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default Success;
