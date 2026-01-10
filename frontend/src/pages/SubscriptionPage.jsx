import React, { useState, useEffect } from 'react';
import { getSubscriptionPlans, getMySubscription, upgradeSubscription } from '../api/paymentService';
import styles from './SubscriptionPage.module.css';
import { FiCheck, FiStar, FiZap, FiAward, FiX } from 'react-icons/fi';

const SubscriptionPage = () => {
  const [plans, setPlans] = useState([]);
  const [currentSubscription, setCurrentSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [upgrading, setUpgrading] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [plansData, subData] = await Promise.all([
        getSubscriptionPlans(),
        getMySubscription(),
      ]);
      setPlans(plansData);
      setCurrentSubscription(subData);
    } catch (err) {
      console.error('Error fetching subscription data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = async (plan) => {
    if (plan === 'free') return;
    setSelectedPlan(plan);
    setShowPaymentModal(true);
  };

  const confirmUpgrade = async () => {
    try {
      setUpgrading(true);
      // Simulate payment (in production, integrate with Razorpay/Stripe)
      const transactionId = `TXN-${Date.now()}`;
      await upgradeSubscription(selectedPlan, transactionId, 'upi');
      await fetchData();
      setShowPaymentModal(false);
      setSelectedPlan(null);
    } catch (err) {
      console.error('Error upgrading subscription:', err);
    } finally {
      setUpgrading(false);
    }
  };

  const getPlanIcon = (planName) => {
    const icons = {
      free: <FiStar />,
      basic: <FiZap />,
      professional: <FiAward />,
      enterprise: <FiAward />,
    };
    return icons[planName] || <FiStar />;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading subscription plans...</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Subscription Plans</h1>
        <p>Choose a plan that fits your practice. Upgrade anytime to reduce commission and unlock more features.</p>
      </div>

      {/* Current Plan Banner */}
      {currentSubscription?.subscription && (
        <div className={styles.currentPlanBanner}>
          <div className={styles.currentPlanInfo}>
            <span className={styles.currentLabel}>Current Plan</span>
            <span className={styles.currentPlanName}>
              {currentSubscription.planDetails?.name || 'Free'}
            </span>
          </div>
          <div className={styles.currentPlanStats}>
            <div className={styles.statItem}>
              <span className={styles.statValue}>{currentSubscription.subscription.commissionRate}%</span>
              <span className={styles.statLabel}>Commission Rate</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statValue}>
                {currentSubscription.subscription.maxCasesPerMonth === -1 
                  ? 'Unlimited' 
                  : currentSubscription.subscription.maxCasesPerMonth}
              </span>
              <span className={styles.statLabel}>Cases/Month</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statValue}>
                {currentSubscription.subscription.status === 'active' ? '✓ Active' : 'Inactive'}
              </span>
              <span className={styles.statLabel}>Status</span>
            </div>
          </div>
        </div>
      )}

      {/* Plans Grid */}
      <div className={styles.plansGrid}>
        {['free', 'basic', 'professional', 'enterprise'].map((planKey) => {
          const plan = plans.find(p => p.name.toLowerCase() === planKey) || {};
          const isCurrentPlan = currentSubscription?.subscription?.plan === planKey;
          const isPro = planKey === 'professional';

          return (
            <div 
              key={planKey} 
              className={`${styles.planCard} ${isCurrentPlan ? styles.current : ''} ${isPro ? styles.popular : ''}`}
            >
              {isPro && <div className={styles.popularBadge}>Most Popular</div>}
              
              <div className={styles.planHeader}>
                <div className={styles.planIcon} style={{ 
                  background: planKey === 'free' ? '#f3f4f6' : 
                             planKey === 'basic' ? '#dbeafe' : 
                             planKey === 'professional' ? '#ede9fe' : '#fef3c7'
                }}>
                  {getPlanIcon(planKey)}
                </div>
                <h3>{plan.name || planKey}</h3>
                <div className={styles.planPrice}>
                  <span className={styles.priceAmount}>{formatCurrency(plan.price || 0)}</span>
                  <span className={styles.priceInterval}>/month</span>
                </div>
              </div>

              <div className={styles.planFeatures}>
                <div className={styles.commissionHighlight}>
                  <span className={styles.commissionValue}>{plan.commissionRate || 20}%</span>
                  <span className={styles.commissionLabel}>Platform Commission</span>
                </div>

                <ul className={styles.featuresList}>
                  {(plan.features || []).map((feature, idx) => (
                    <li key={idx}>
                      <FiCheck className={styles.checkIcon} />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <button
                className={`${styles.planBtn} ${isCurrentPlan ? styles.currentBtn : ''}`}
                onClick={() => handleUpgrade(planKey)}
                disabled={isCurrentPlan || planKey === 'free'}
              >
                {isCurrentPlan ? 'Current Plan' : planKey === 'free' ? 'Free Tier' : 'Upgrade'}
              </button>
            </div>
          );
        })}
      </div>

      {/* Commission Comparison */}
      <div className={styles.comparisonSection}>
        <h2>Commission Comparison</h2>
        <p>See how much you save with different plans on a ₹50,000 case fee</p>
        <div className={styles.comparisonTable}>
          <div className={styles.comparisonRow}>
            <span>Plan</span>
            <span>Commission</span>
            <span>Platform Fee</span>
            <span>Your Earnings</span>
          </div>
          {[
            { name: 'Free', rate: 20 },
            { name: 'Basic', rate: 15 },
            { name: 'Professional', rate: 10 },
            { name: 'Enterprise', rate: 5 },
          ].map((plan) => {
            const caseFee = 50000;
            const commission = (caseFee * plan.rate) / 100;
            const gst = (commission * 18) / 100;
            const earnings = caseFee - commission - gst;
            return (
              <div key={plan.name} className={styles.comparisonRow}>
                <span>{plan.name}</span>
                <span>{plan.rate}%</span>
                <span>{formatCurrency(commission + gst)}</span>
                <span className={styles.earningsCell}>{formatCurrency(earnings)}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && selectedPlan && (
        <div className={styles.modalOverlay} onClick={() => setShowPaymentModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>Upgrade to {selectedPlan.charAt(0).toUpperCase() + selectedPlan.slice(1)}</h2>
              <button className={styles.closeBtn} onClick={() => setShowPaymentModal(false)}>
                <FiX />
              </button>
            </div>
            <div className={styles.modalBody}>
              <p>You are about to upgrade your subscription plan.</p>
              <div className={styles.paymentSummary}>
                <div className={styles.paymentRow}>
                  <span>Plan</span>
                  <span>{selectedPlan.charAt(0).toUpperCase() + selectedPlan.slice(1)}</span>
                </div>
                <div className={styles.paymentRow}>
                  <span>Amount</span>
                  <span className={styles.paymentAmount}>
                    {formatCurrency(
                      selectedPlan === 'basic' ? 999 :
                      selectedPlan === 'professional' ? 2499 : 4999
                    )}
                  </span>
                </div>
                <div className={styles.paymentRow}>
                  <span>Billing</span>
                  <span>Monthly</span>
                </div>
              </div>
              <p className={styles.paymentNote}>
                Payment will be processed via UPI. Your subscription will be activated immediately.
              </p>
            </div>
            <div className={styles.modalFooter}>
              <button className={styles.cancelBtn} onClick={() => setShowPaymentModal(false)}>
                Cancel
              </button>
              <button 
                className={styles.confirmBtn} 
                onClick={confirmUpgrade}
                disabled={upgrading}
              >
                {upgrading ? 'Processing...' : 'Confirm & Pay'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubscriptionPage;
