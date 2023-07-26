import API from './index'

export const retrieveAllTransactions = () => API.get(`/api/v1/transactions`);

export const retrieveTransactionById = (id) => API.get(`/api/v1/transactions/${id}`);

export const searchTransactionsByStatus = (statuses) => API.get(`/api/v1/admin/transactions?statuses=${statuses}`);