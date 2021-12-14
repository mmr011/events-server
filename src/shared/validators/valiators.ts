import { body, query, ValidationChain } from 'express-validator';

export function requiredEventValues(): ValidationChain {
    return query(['eventName', 'startDate', 'userId']).isString();
};

export function validEndDate(): ValidationChain {
    return query('endDate').optional(true).isString();
};

export function validAllDay(): ValidationChain {
    return query('endDate').optional(true).isBoolean();
};

export function validEventId(): ValidationChain {
    return body('eventId').isString();
};

export function validUser(): ValidationChain { 
    return query(['email', 'password', 'userName']).isString();
};
