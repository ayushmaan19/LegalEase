import axiosInstance from "./axiosInstance";

// Get platform payment settings
export const getPaymentSettings = async () => {
  const response = await axiosInstance.get("/payments/settings");
  return response.data;
};

// Get lawyer payments
export const getLawyerPayments = async () => {
  const response = await axiosInstance.get("/payments/lawyer");
  return response.data;
};

// Get citizen payments/invoices
export const getCitizenPayments = async () => {
  const response = await axiosInstance.get("/payments/citizen");
  return response.data;
};

// Get payment details with breakdown
export const getPaymentDetails = async (paymentId) => {
  const response = await axiosInstance.get(`/payments/${paymentId}`);
  return response.data;
};

// Create payment for a case
export const createPayment = async (caseId, totalAmount) => {
  const response = await axiosInstance.post("/payments/create", {
    caseId,
    totalAmount,
  });
  return response.data;
};

// Pay advance
export const payAdvance = async (paymentId, transactionId, paymentMethod) => {
  const response = await axiosInstance.post(
    `/payments/${paymentId}/pay-advance`,
    {
      transactionId,
      paymentMethod,
    }
  );
  return response.data;
};

// Mark payment for release (when case resolved)
export const markPaymentResolved = async (paymentId) => {
  const response = await axiosInstance.post(
    `/payments/${paymentId}/mark-resolved`
  );
  return response.data;
};

// Release payment
export const releasePayment = async (paymentId) => {
  const response = await axiosInstance.post(`/payments/${paymentId}/release`);
  return response.data;
};

// Get subscription plans
export const getSubscriptionPlans = async () => {
  const response = await axiosInstance.get("/payments/subscription/plans");
  return response.data;
};

// Get my subscription
export const getMySubscription = async () => {
  const response = await axiosInstance.get("/payments/subscription/my");
  return response.data;
};

// Upgrade subscription
export const upgradeSubscription = async (
  plan,
  transactionId,
  paymentMethod
) => {
  const response = await axiosInstance.post("/payments/subscription/upgrade", {
    plan,
    transactionId,
    paymentMethod,
  });
  return response.data;
};
