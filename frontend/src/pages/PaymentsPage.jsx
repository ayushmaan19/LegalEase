import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getLawyerPayments, getCitizenPayments, getPaymentDetails, releasePayment } from '../api/paymentService';
import styles from './PaymentsPage.module.css';
import { FiDollarSign, FiClock, FiCheckCircle, FiFileText, FiX, FiDownload, FiAlertCircle } from 'react-icons/fi';

const PaymentsPage = () => {
  const { user } = useAuth();
  const [payments, setPayments] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [breakdown, setBreakdown] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const isLawyer = user?.role === 'lawyer';

  useEffect(() => {
    fetchPayments();
  }, [user]);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const data = isLawyer 
        ? await getLawyerPayments() 
        : await getCitizenPayments();
      setPayments(data.payments || []);
      setSummary(data.summary || null);
    } catch (err) {
      console.error('Error fetching payments:', err);
      setError('Failed to load payments');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = async (paymentId) => {
    try {
      const data = await getPaymentDetails(paymentId);
      setSelectedPayment(data.payment);
      setBreakdown(data.breakdown);
      setShowModal(true);
    } catch (err) {
      console.error('Error fetching payment details:', err);
    }
  };

  const handleReleasePayment = async (paymentId) => {
    try {
      await releasePayment(paymentId);
      fetchPayments();
      setShowModal(false);
    } catch (err) {
      console.error('Error releasing payment:', err);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  const formatDate = (date) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'pending': { label: 'Pending', class: styles.statusPending },
      'advance-paid': { label: 'Advance Paid', class: styles.statusAdvance },
      'in-progress': { label: 'In Progress', class: styles.statusProgress },
      'to-be-released': { label: 'To Be Released', class: styles.statusRelease },
      'released': { label: 'Released', class: styles.statusComplete },
      'disputed': { label: 'Disputed', class: styles.statusDisputed },
      'refunded': { label: 'Refunded', class: styles.statusRefunded },
    };
    const config = statusConfig[status] || { label: status, class: '' };
    return <span className={`${styles.statusBadge} ${config.class}`}>{config.label}</span>;
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading payments...</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>{isLawyer ? 'Earnings & Payments' : 'Invoices & Payments'}</h1>
        <p>{isLawyer ? 'Track your earnings from resolved cases' : 'Track your case payments and invoices'}</p>
      </div>

      {/* Summary Cards */}
      {summary && (
        <div className={styles.summaryGrid}>
          {isLawyer ? (
            <>
              <div className={styles.summaryCard}>
                <div className={styles.summaryIcon} style={{ background: '#10b981' }}>
                  <FiDollarSign />
                </div>
                <div className={styles.summaryContent}>
                  <span className={styles.summaryLabel}>Total Earnings</span>
                  <span className={styles.summaryValue}>{formatCurrency(summary.totalEarnings)}</span>
                </div>
              </div>
              <div className={styles.summaryCard}>
                <div className={styles.summaryIcon} style={{ background: '#f59e0b' }}>
                  <FiClock />
                </div>
                <div className={styles.summaryContent}>
                  <span className={styles.summaryLabel}>Pending Release</span>
                  <span className={styles.summaryValue}>{formatCurrency(summary.pendingRelease)}</span>
                </div>
              </div>
              <div className={styles.summaryCard}>
                <div className={styles.summaryIcon} style={{ background: '#3b82f6' }}>
                  <FiCheckCircle />
                </div>
                <div className={styles.summaryContent}>
                  <span className={styles.summaryLabel}>Released</span>
                  <span className={styles.summaryValue}>{formatCurrency(summary.released)}</span>
                </div>
              </div>
              <div className={styles.summaryCard}>
                <div className={styles.summaryIcon} style={{ background: '#8b5cf6' }}>
                  <FiFileText />
                </div>
                <div className={styles.summaryContent}>
                  <span className={styles.summaryLabel}>Cases Completed</span>
                  <span className={styles.summaryValue}>{summary.casesCompleted}</span>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className={styles.summaryCard}>
                <div className={styles.summaryIcon} style={{ background: '#10b981' }}>
                  <FiDollarSign />
                </div>
                <div className={styles.summaryContent}>
                  <span className={styles.summaryLabel}>Total Paid</span>
                  <span className={styles.summaryValue}>{formatCurrency(summary.totalPaid)}</span>
                </div>
              </div>
              <div className={styles.summaryCard}>
                <div className={styles.summaryIcon} style={{ background: '#f59e0b' }}>
                  <FiClock />
                </div>
                <div className={styles.summaryContent}>
                  <span className={styles.summaryLabel}>Pending Payment</span>
                  <span className={styles.summaryValue}>{formatCurrency(summary.pendingPayment)}</span>
                </div>
              </div>
              <div className={styles.summaryCard}>
                <div className={styles.summaryIcon} style={{ background: '#3b82f6' }}>
                  <FiCheckCircle />
                </div>
                <div className={styles.summaryContent}>
                  <span className={styles.summaryLabel}>Advance Paid</span>
                  <span className={styles.summaryValue}>{formatCurrency(summary.advancePaid)}</span>
                </div>
              </div>
              <div className={styles.summaryCard}>
                <div className={styles.summaryIcon} style={{ background: '#8b5cf6' }}>
                  <FiFileText />
                </div>
                <div className={styles.summaryContent}>
                  <span className={styles.summaryLabel}>Total Cases</span>
                  <span className={styles.summaryValue}>{summary.casesCount}</span>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* Payments Table */}
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Payment ID</th>
              <th>Case</th>
              <th>{isLawyer ? 'Client' : 'Lawyer'}</th>
              <th>Amount</th>
              {isLawyer && <th>Your Earnings</th>}
              <th>Status</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {payments.length === 0 ? (
              <tr>
                <td colSpan={isLawyer ? 8 : 7} className={styles.emptyState}>
                  No payments found
                </td>
              </tr>
            ) : (
              payments.map((payment) => (
                <tr key={payment._id}>
                  <td className={styles.paymentId}>{payment.paymentId}</td>
                  <td>
                    <div className={styles.caseInfo}>
                      <span className={styles.caseTitle}>{payment.case?.title || 'N/A'}</span>
                      <span className={styles.caseId}>{payment.case?.caseId}</span>
                    </div>
                  </td>
                  <td>{isLawyer ? payment.citizen?.name : payment.lawyer?.name}</td>
                  <td className={styles.amount}>{formatCurrency(payment.totalAmount)}</td>
                  {isLawyer && <td className={styles.earnings}>{formatCurrency(payment.lawyerEarnings)}</td>}
                  <td>{getStatusBadge(payment.status)}</td>
                  <td>{formatDate(payment.createdAt)}</td>
                  <td>
                    <button 
                      className={styles.viewBtn}
                      onClick={() => handleViewDetails(payment.paymentId)}
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Payment Details Modal */}
      {showModal && selectedPayment && breakdown && (
        <div className={styles.modalOverlay} onClick={() => setShowModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>Payment Breakdown</h2>
              <button className={styles.closeBtn} onClick={() => setShowModal(false)}>
                <FiX />
              </button>
            </div>
            
            <div className={styles.modalBody}>
              {/* Invoice Header */}
              <div className={styles.invoiceHeader}>
                <div>
                  <h3>LegalEase</h3>
                  <p>Payment ID: {selectedPayment.paymentId}</p>
                  {selectedPayment.invoiceNumber && (
                    <p>Invoice: {selectedPayment.invoiceNumber}</p>
                  )}
                </div>
                <div className={styles.invoiceDate}>
                  <p>Date: {formatDate(selectedPayment.createdAt)}</p>
                  {selectedPayment.case?.resolvedAt && (
                    <p>Resolved: {formatDate(selectedPayment.case.resolvedAt)}</p>
                  )}
                </div>
              </div>

              {/* Case Info */}
              <div className={styles.caseDetails}>
                <h4>Case Details</h4>
                <p><strong>Title:</strong> {selectedPayment.case?.title}</p>
                <p><strong>Case ID:</strong> {selectedPayment.case?.caseId}</p>
                <p><strong>Type:</strong> {selectedPayment.case?.caseType}</p>
                <p><strong>Status:</strong> {selectedPayment.case?.status}</p>
              </div>

              {/* Parties */}
              <div className={styles.partiesRow}>
                <div className={styles.party}>
                  <h4>Client</h4>
                  <p>{selectedPayment.citizen?.name}</p>
                  <p>{selectedPayment.citizen?.email}</p>
                </div>
                <div className={styles.party}>
                  <h4>Lawyer</h4>
                  <p>{selectedPayment.lawyer?.name}</p>
                  <p>{selectedPayment.lawyer?.email}</p>
                </div>
              </div>

              {/* Amount Breakdown */}
              <div className={styles.breakdownSection}>
                <h4>Payment Breakdown</h4>
                <div className={styles.breakdownTable}>
                  <div className={styles.breakdownRow}>
                    <span>Case Fee (Total)</span>
                    <span>{formatCurrency(breakdown.totalAmount)}</span>
                  </div>
                  <div className={styles.breakdownRow}>
                    <span>Advance Payment (30%)</span>
                    <span>{formatCurrency(breakdown.advanceAmount)}</span>
                  </div>
                  <div className={styles.breakdownRow}>
                    <span>Remaining Amount</span>
                    <span>{formatCurrency(breakdown.remainingAmount)}</span>
                  </div>
                  <div className={styles.breakdownDivider}></div>
                  <div className={styles.breakdownRow}>
                    <span>Platform Commission ({breakdown.commissionRate}%)</span>
                    <span className={styles.deduction}>- {formatCurrency(breakdown.commissionAmount)}</span>
                  </div>
                  <div className={styles.breakdownRow}>
                    <span>GST on Commission ({breakdown.gstRate}%)</span>
                    <span className={styles.deduction}>- {formatCurrency(breakdown.gstAmount)}</span>
                  </div>
                  <div className={styles.breakdownDivider}></div>
                  <div className={`${styles.breakdownRow} ${styles.totalRow}`}>
                    <span>Total Platform Fee</span>
                    <span className={styles.deduction}>{formatCurrency(breakdown.platformFee)}</span>
                  </div>
                  <div className={`${styles.breakdownRow} ${styles.earningsRow}`}>
                    <span>Lawyer Earnings</span>
                    <span className={styles.earningsAmount}>{formatCurrency(breakdown.lawyerEarnings)}</span>
                  </div>
                </div>
              </div>

              {/* Status & Release Info */}
              <div className={styles.statusSection}>
                <div className={styles.statusInfo}>
                  <span>Payment Status:</span>
                  {getStatusBadge(selectedPayment.status)}
                </div>
                
                {selectedPayment.status === 'to-be-released' && (
                  <div className={styles.releaseInfo}>
                    <FiAlertCircle />
                    <span>
                      Payment will be released on {formatDate(selectedPayment.releaseEligibleDate)}
                    </span>
                  </div>
                )}

                {selectedPayment.status === 'released' && (
                  <div className={styles.releasedInfo}>
                    <FiCheckCircle />
                    <span>Released on {formatDate(selectedPayment.releasedDate)}</span>
                  </div>
                )}
              </div>

              {/* Transactions */}
              {selectedPayment.transactions?.length > 0 && (
                <div className={styles.transactionsSection}>
                  <h4>Transaction History</h4>
                  <div className={styles.transactionsList}>
                    {selectedPayment.transactions.map((txn, idx) => (
                      <div key={idx} className={styles.transactionItem}>
                        <div className={styles.txnType}>
                          {txn.type === 'advance' && '💰 Advance'}
                          {txn.type === 'final' && '✅ Final Payment'}
                          {txn.type === 'release' && '🏦 Released'}
                          {txn.type === 'refund' && '↩️ Refund'}
                        </div>
                        <div className={styles.txnAmount}>{formatCurrency(txn.amount)}</div>
                        <div className={styles.txnDate}>{formatDate(txn.date)}</div>
                        <div className={`${styles.txnStatus} ${txn.status === 'success' ? styles.success : ''}`}>
                          {txn.status}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className={styles.modalFooter}>
              {selectedPayment.invoiceNumber && (
                <button className={styles.downloadBtn}>
                  <FiDownload /> Download Invoice
                </button>
              )}
              {isLawyer && selectedPayment.status === 'to-be-released' && 
               new Date(selectedPayment.releaseEligibleDate) <= new Date() && (
                <button 
                  className={styles.releaseBtn}
                  onClick={() => handleReleasePayment(selectedPayment.paymentId)}
                >
                  Release Payment
                </button>
              )}
              <button className={styles.cancelBtn} onClick={() => setShowModal(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentsPage;