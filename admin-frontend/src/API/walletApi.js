import API from './index'

export const retrieveOwnTransactions = () => API.get(`/api/v1/wallet/transactions/personal`)

export const deposit = (amount) => API.post(`/api/v1/wallet/createPaymentIntent?amount=${amount}`)

export const completeTransaction = (paymentIntentId) => API.patch(`/api/v1/wallet/${paymentIntentId}/approve`);

export const withdrawRequest = (amount) => API.put(`/api/v1/wallet/withdrawRequest?amount=${amount}`);

export const searchTransactions = (statuses) => API.get(`/api/v1/wallet/transactions/search?statuses=${statuses}`);

export const approveWithdrawRequest = (txnId, bankTrfId) => API.put(`/api/v1/wallet/withdraw/${txnId}/approve?bankTransactionId=${bankTrfId}`);

export const rejectWithdrawRequest = (txnId, remarks) => API.put(`/api/v1/wallet/withdraw/${txnId}/reject?remarks=${remarks}`);





