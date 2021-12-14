import { NextFunction, Router, Response, Request } from 'express';
import { Event } from '../shared/models/event.model';
import * as uuid from 'uuid';
import { validationResult } from 'express-validator';
import { validEventId, validAllDay, requiredEventValues, validEndDate } from '../shared/validators/valiators';


const eventsRouter =  Router();

const  testEvents: Event[] = [
    {
        eventId: '123',
        eventName: 'test title',
        startDate: new Date().toString(),
        allDay: false,
        userId: uuid.v4()
    }
];

// Middleware when an id is sent to the API
eventsRouter.param('eventId', (req: Request, res: Response, next: NextFunction, eventId: string) => {
    if(!eventId || eventId === '') {
        res.sendStatus(400);
    } else if(!uuid.validate(eventId)) {
        res.status(400).json({ errors: 'Invalid id forma'});
    };

    let event = testEvents.find(e => e.eventId === eventId);
    if(event) {
        req['event'] = event; // Append the event that was found to the request
        next();
    } else {
        res.status(404).json({ message: 'Event not found'}); // If not, send 404 error message
    };
});

eventsRouter.get('/', (_, res: Response) => {
    if(testEvents) {
        res.status(200).json({ events: testEvents });
    } else {
        res.sendStatus(400);
    };
});

eventsRouter.get('/:eventId', validEventId() , (req: Request, res: Response) => {
    const event = req['event'];

    if(event) {
        res.status(200).json({ event: event }); // Further validation that the event exists
    } else {
        res.status(404).json({ message: 'Event not found'}); // If not, send 404 error message
    };
});

eventsRouter.post('/',
        requiredEventValues(),
        validEndDate(),
        validAllDay(),
        (req: Request, res: Response) => {

    const errors = validationResult(req);

    if(!errors.isEmpty() || errors.array().length > 0) {
        res.status(400).json({ errors: errors.array() });
    } else {
        const { eventName, startDate, endDate, userId, allDay } = req.query && req.query;

        let newEvent: Event = {
            eventId: uuid.v4(),
            userId: userId as string,
            eventName: eventName as string,
            startDate: startDate as string,
            ...(endDate && endDate !== '') && {
                endDate: endDate as string
            },
            ...(allDay && allDay !== '') && {
                allDay: allDay === 'true' ? true : false // Since req.query sets the values as strings, I have to do this weird conversion here :c
            }
        };

        testEvents.push(newEvent);

        res.status(201).json({ newEvent: newEvent, message: 'New event was created successfully' })
    };
});

eventsRouter.put('/:eventId',
                requiredEventValues(),
                validEndDate(),
                validAllDay(),
                validEventId(),
                (req: Request, res: Response) => {

    const errors = validationResult(req);

    if(!errors.isEmpty() || errors.array().length > 0) { 
        res.status(400).json({ errors: errors.array() });
    } else{
        let  event = req['event'];
        const { eventName, startDate, endDate, eventId, allDay, registrationCost } = req.query && req.query;

        if(eventName) {
            event.eventName = eventName;
        };

        if(startDate) {
            event.startDate = startDate;
        };

        if(registrationCost) {
            event.registrationCost = registrationCost;
        };

        if(endDate) {
            event.endDate = endDate;
        };

        if(allDay) {
            event.allDay = allDay === 'true' ? true : false;
        };

        const eventIndex = testEvents.findIndex(e => e.eventId === eventId);
        testEvents.splice(eventIndex, 1, event);

        res.status(200).json({ updatedEvent: event, message: 'Event has been successfully updated' });
    };
});

eventsRouter.delete('/:eventId', validEventId(), (req: Request, res: Response) => {
    const event = req['event'];

    if(event) {
        const eventIndex = testEvents.findIndex(e => e.eventId === event.eventId);
        testEvents.splice(eventIndex, 1);

        res.status(200).json({ eventId: event.eventId, message: 'Event was deleted successfully '});
    } else {
        res.sendStatus(400);
    };
});

export default eventsRouter;

