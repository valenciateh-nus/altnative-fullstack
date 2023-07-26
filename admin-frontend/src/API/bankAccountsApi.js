import API from './index'

export const retrieveUnverifiedBankAccountDetails = () => API.get('/api/v1/bankAccountDetails/retrieveUnverifiedBankAccountDetails')

export const retrieveBankAccountDetailsById = (id) => API.get(`/api/v1/bankAccountDetails/retrieveBankAccountDetailsById/${id}`)

export const retrieveAllBankAccountDetails = () => API.get('/api/v1/bankAccountDetails/retrieveAllBankAccountDetails')

export const verifyBankAccount = (id) => API.put(`/api/v1/bankAccountDetails/verify/${id}`)

export const rejectBankAccount = (id,rr) => API.put(`/api/v1/bankAccountDetails/reject/${id}?rejectionReason=${rr}`)
