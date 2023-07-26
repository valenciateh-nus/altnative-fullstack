import { Typography } from "@mui/material"

export const ORDER_CREATED = "ORDER_CREATED"
export const ORDER_STARTED = "ORDER_STARTED"
export const ARRANGE_FOR_COURIER = "ARRANGE_FOR_COURIER"
export const MATERIAL_LOCATION_PENDING = "MATERIAL_LOCATION_PENDING"
export const LOCATION_REGISTERED = "LOCATION_REGISTERED"
export const COURIER_OTW = "COURIER_OTW"
export const COURIER_DELIVERED = "COURIER_DELIVERED"
export const MEASUREMENTS_REQUESTED = "MEASUREMENTS_REQUESTED"
export const ADD_ON = "ADD_ON"
export const PAYMENT = "PAYMENT"
export const ADD_ON_OFFER_MADE = "ADD_ON_OFFER_MADE"
export const ADD_ON_OFFER_DECLINED = "ADD_ON_OFFER_DECLINED"
export const ADD_ON_ORDER_STARTED = "ADD_ON_ORDER_STARTED"
export const ADD_ON_ORDER_COMPLETE = "ADD_ON_ORDER_COMPLETE"
export const PROGRESS_UPDATE_REQUEST = "PROGRESS_UPDATE_REQUEST"
export const PROGRESS_UPDATE = "PROGRESS_UPDATE"
export const FINAL_APPROVAL_PENDING = "FINAL_APPROVAL_PENDING"
export const FINAL_APPROVAL = "FINAL_APPROVAL"
export const FINAL_LOCATION_PENDING = "FINAL_LOCATION_PENDING"
export const FINAL_APPROVAL_OK = "FINAL_APPROVAL_OK"
export const FINAL_APPROVAL_REJECTED = "FINAL_APPROVAL_REJECTED"
export const DISPUTE_REQUEST_PENDING_REVIEW = "DISPUTE_REQUEST_PENDING_REVIEW"
export const DISPUTE_REQUEST_REJECTED = "DISPUTE_REQUEST_REJECTED"
export const DISPUTE_REQUEST_REFUND_PENDING = "DISPUTE_REQUEST_REFUND_PENDING"
export const DISPUTE_REQUEST_COMPLETED = "DISPUTE_REQUEST_COMPLETED"
export const DISPUTE_REQUEST_ACCEPTED = "DISPUTE_REQUEST_ACCEPTED"
export const DISPUTE_REQUEST_PENDING_ADMIN_REVIEW = "DISPUTE_REQUEST_PENDING_ADMIN_REVIEW"
export const JNT_STATUS = "JNT_STATUS"

export function getMilestoneTitle(type, description, isRefashioner) {
    switch (type) {
        case ORDER_CREATED:
        case ORDER_STARTED:
            return (
                <Typography>
                    Order Created <Typography display={'inline'} color={'secondary.main'} fontWeight='fontWeightBold'>{description}</Typography>
                </Typography>
            )
        case ARRANGE_FOR_COURIER:
            return (
                <Typography>
                    Arrange for courier
                </Typography>
            )
        case MATERIAL_LOCATION_PENDING:
            return (
                <Typography color={!description ? 'secondary.main' : 'inherit'} fontWeight={!description ? 'fontWeightBold' : 400}>
                    {isRefashioner ? 'Pickup location required' : 'Dropoff location required'}
                </Typography>
            )
        case LOCATION_REGISTERED:
            return (
                <Typography>
                    Delivery information updated
                </Typography>
            )
        case COURIER_OTW:
            return (
                <Typography>
                    Courier on the way <Typography display={'inline'} color={'secondary.main'} fontWeight='fontWeightBold'>{description}</Typography>
                </Typography>
            )
        case COURIER_DELIVERED:
            return (
                <Typography>
                    Courier delivered
                </Typography>
            )
        case MEASUREMENTS_REQUESTED:
            return (
                <Typography>
                    Measurement requested
                </Typography>
            )
        case ADD_ON_OFFER_MADE:
            return (
                <Typography>
                    {isRefashioner ? 'Refashioner' : 'Refashionee'} has sent an Additional order offer
                </Typography>
            )
        case ADD_ON_OFFER_DECLINED:
            return (
                <Typography>
                    {isRefashioner ? 'Refashioner' : 'Refashionee'} has rejected the Additional order offer. {description ? `Reason : ${description}` : ''}
                </Typography>
            )
        case ADD_ON_ORDER_STARTED:
            return (
                <Typography>
                    Additional order has been made. <Typography display={'inline'} color={'secondary.main'} fontWeight='fontWeightBold'>{description}</Typography>
                </Typography>
            )
        case PAYMENT:
            return (
                <Typography color={'secondary.main'} fontWeight='fontWeightBold'>
                    {`${isRefashioner ? 'Refashioner' : 'Refashionee'} has paid SGD ${description} for the order.`}
                </Typography>
            )
        case PROGRESS_UPDATE_REQUEST:
            return (
                <Typography>
                    <Typography display={'inline'} color={'secondary.main'} fontWeight='fontWeightBold'>{isRefashioner ? 'Refashioner' : 'Refashionee'} has requested for progress pictures. </Typography>
                    Please upload soon.
                </Typography>
            )
        case PROGRESS_UPDATE:
            return (
                <Typography>
                    Progress picture shared
                </Typography>
            )
        case FINAL_APPROVAL_PENDING:
            return (
                <Typography>
                    {isRefashioner ? <>Refashioner have sent the <Typography display={'inline'} color={'secondary.main'} fontWeight='fontWeightBold'>final pictures</Typography>. Pending your approval.</>
                        : <>Refashionee has sent the <Typography fontWeight='fontWeightBold' display={'inline'} color={'secondary.main'}>Final pictures</Typography>. Pending your approval.</>}
                </Typography>
            )
        case FINAL_APPROVAL_OK:
            return (
                <Typography>
                    You have approved the final pictures! Awaiting for courier arrangement.
                </Typography>
            )
        case FINAL_APPROVAL_REJECTED:
            return (
                <Typography>
                    You have has rejected the final pictures. Reason: {description}
                </Typography>
            )
        case FINAL_LOCATION_PENDING:
            return (
                <Typography color={'secondary.main'} fontWeight='fontWeightBold'>
                    {!isRefashioner ? 'Pickup location required' : 'Dropoff location required'}
                </Typography>
            )
        case DISPUTE_REQUEST_PENDING_REVIEW:
            return (
                <Typography>
                    A <Typography color={'secondary.main'} display={'inline'} fontWeight='fontWeightBold'> Dispute Request </Typography> has been created:
                </Typography>
            )
        case DISPUTE_REQUEST_ACCEPTED:
            return (
                <Typography>
                    Dispute Request has been <Typography color={'#228C22'} display={'inline'} fontWeight='fontWeightBold'>accepted</Typography>. A refund will be processed.
                </Typography>
            )
        case DISPUTE_REQUEST_PENDING_ADMIN_REVIEW:
            return (
                <Typography>
                    Dispute Request has been <Typography color={'error'} display={'inline'} fontWeight='fontWeightBold'>rejected</Typography>. An admin will follow up with the dispute.
                </Typography>
            )
        case DISPUTE_REQUEST_REFUND_PENDING:
            return (
                <Typography>
                    Dispute Request has been <Typography color={'success'} display={'inline'} fontWeight='fontWeightBold'>accepted</Typography>. A refund will be processed within the next 2-3 working days.
                </Typography>
            )
        case DISPUTE_REQUEST_COMPLETED:
            return (
                <Typography>
                    Dispute Request has been <Typography color={'secondary.main'} display={'inline'} fontWeight='fontWeightBold'>completed</Typography>. A refund has been processed.
                </Typography>
            )
        case JNT_STATUS:
            function getStatus(status) {
                switch(status?.trim()) {
                    case "PENDING_PICKUP":
                    case "ASSIGNED_PICKUP":
                    case "ACCEPTED_PICKUP":
                        return {
                            header : 'Packed and Ready to Ship',
                            sub : 'Package has been packed and will be handed over to a logistic partner'
                        }
                    case "CANCELLED":
                        return {
                            header : 'Order has been cancelled',
                            sub : 'The delivery has been cancelled.'
                        }
                    case "ENROUTE_TO_HUB":
                        return {
                            header : 'Handed over to Logistic Partner',
                            sub : 'Package has been picked up by a logistic partner'
                        }
                    case "ARRIVED_AT_HUB":
                        return {
                            header : 'Arrived at Logistics Facility',
                            sub : 'Package has arrived at a logistic facility'
                        }
                    case "OUT_FOR_DELIVERY":
                        return {
                            header : 'Out for Delivery',
                            sub : 'JNT will attempt to deliver the parcel today!'
                        }
                    case "DELIVERED":
                        return {
                            header : 'Delivered',
                            sub : 'Package has been delivered'
                        }
                    case "RETURNED_TO_SENDER":
                        return {
                            header : 'Returned to Sender',
                            sub : 'Package has been returned to sender'
                        }
                    case "RETURNED_TO_HUB":
                        return {
                            header : 'Returned to Logistic Facility',
                            sub : 'Package has been returned to a logistic facility'
                        }
                    case "FORWARDED_TO_SHIPPING_PARTNER":
                        return {
                            header : 'Forwarded to Shipping Parnter',
                            sub : 'The package has been forwarded to a shipping partner'
                        }
                    case "SCHEDULED_RTS":
                        return {
                            header : 'Scheduled to be returned',
                            sub : 'Package has scheduled to be returned to sender'
                        }
                    case "OUT_FOR_RTS":
                        return {
                            header : 'Out for return delivery ',
                            sub : 'JNT will attempt to return the package to sender today!'
                        }
                    case "PARCEL_DISPOSED":
                        return {
                            header : 'Package Disposed',
                            sub : 'Package has been disposed by JNT'
                        }
                    case "PARCEL_LEAKAGE":
                        return {
                            header : 'Package Leakage',
                            sub : 'Package has a leakage'
                        }
                    case "PARCEL_LOST":
                        return {
                            header : 'Package Lost',
                            sub : 'Package has been lost'
                        }
                    case "MERCHANT_DROPPED_OFF":
                        return {
                            header : 'Packed and Ready to Ship',
                            sub : 'Package has been dropped-off and will be picked up by a logistic partner'
                        }
                    case "FAILED_RTS":
                        return {
                            header : 'Failed to return to sender',
                            sub : 'Package has failed to be returned to sender'
                        }
                    case "FAILED_PICKUP":
                        return {
                            header : 'Failed to pick-up Package',
                            sub : 'Package has not been picked-up'
                        }
                    case "FAILED_DELIVERY":
                        return {
                            header : 'Failed to Deliver',
                            sub : 'Package could not be delivered'
                        }
                    default :
                    return {
                        header : status,
                        sub : ''
                    }
                }
            }
            const desc = description.split(':');
            const text = getStatus(desc[1]);

            
            return (
                <>
                <Typography display={'inline'} color={'secondary.main'} fontWeight='fontWeightBold'>{text.header}</Typography>
                <Typography >
                    {text.sub}
                </Typography>
                <Typography variant='subtitle2'>
                    Tracking Number : {desc[0]}
                </Typography>
                </>
            )
    }
}