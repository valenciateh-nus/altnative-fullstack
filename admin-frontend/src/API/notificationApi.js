import API from './index'

export const sendTargetedNotification = (directNotification) => API.post(`/api/v1/notification/`, directNotification);

export const sendNotificationToTopic = (topicNotification) => API.post(`/api/v1/topic/notification/`, topicNotification);

export const subscribeToTopic = (subscriptionRequest) => API.post(`/api/v1/topic/subscription/`, subscriptionRequest);

export const updateNotificationToken = (token) => API.put(`/api/v1/updateNotificationToken?token=${token}`)