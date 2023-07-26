import API from './index'

export const deleteChat = (chatId) => API.put(`/api/v1/chat/delete/${chatId}`);

export const getChat = (chatId) => API.get(`/api/v1/chat/${chatId}`);

export const resetMessageCountOwn = (chatId, username) => API.put(`/api/v1/chat/reset/${chatId}/${username}`)

export const getChatMessages = (chatId) => API.get(`/api/v1/chat/${chatId}/messages`);