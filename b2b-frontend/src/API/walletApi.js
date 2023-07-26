import API from './index'

export const retrieveOwnTransactions = (page) => API.get(`/api/v1/wallet/transactions/personal?page=${page || 0}`)

export const deposit = (amount) => API.post(`/api/v1/wallet/createPaymentIntent?amount=${amount}`)

export const completeTransaction = (paymentIntentId) => API.patch(`/api/v1/wallet/${paymentIntentId}/approve`);

export const withdrawRequest = (amount) => API.put(`/api/v1/wallet/withdrawRequest?amount=${amount}`);

export const approveWithdrawRequest = (id,transactionId) => API.put(`/api/v1/wallet/withdraw/${id}/approve?bankTransactionId=${transactionId}`)





