import {NextFunction, Request, Response, Router} from "express";
import {TimeSlots} from "../calendar/timeSlots";
import {Meeting, TimeSlotsData} from "../calendar/dto/meeting";
import {Query} from 'express-serve-static-core';

export interface TypedRequestBody<T> extends Express.Request {
  body: T
}

export interface TypedRequestQuery<T extends Query> extends Express.Request {
  query: T
}

export class Controller {
  private calendar: Meeting[] = [];

  constructor() {
    new TimeSlotsData(this.calendar);
  }

  private timeSlots = new TimeSlots();

  private areMeetingsEqual(m0: Meeting, m1: Meeting) {
    return m0.start.getTime() == m1.start.getTime() && m0.end.getTime() == m1.end.getTime()
  }

  public mainPage = (req: Request, res: Response, next: NextFunction) => {
    res.status(200).send("Hello! This is the take home test from Caribou.");
  }

  public searchTimeSlots = (req: TypedRequestQuery<{ start: string, duration: string, amount: string }>, res: Response, next: NextFunction) => {
    const duration = req.query.duration ? parseInt(req.query.duration) : 60
    const amount = req.query.amount ? parseInt(req.query.amount) : 10

    // set default meeting time to +1 hour from now on
    let now = new Date()
    now.setHours(now.getHours() + 1)

    // parse params and create a meeting (desired one)
    const desiredStartTime = req.query.start ? this.timeSlots.convertTime(req.query.start) : this.timeSlots.convertTime(now.toString())
    const desiredMeeting: Meeting = {
      start: desiredStartTime,
      eventName: "Desired Slot",
      end: new Date(desiredStartTime.getTime() + duration * 60 * 1000)
    }

    // search for available time slots. There always be an array of slots
    // for specified duration. Lenth of that array is another param, called [amount]
    let data = this.timeSlots.searchAvailableTimeSlots(desiredMeeting, amount, this.calendar);

    res.status(200).send(data);
  }


  public bookTimeSlot = (req: TypedRequestBody<{ eventName: string, desiredStartTime: string, duration: number }>, res: Response, next: NextFunction) => {
    // get body and create a meeting object
    let now = new Date()
    now.setHours(now.getHours() + 1)

    // parse params and create a meeting (desired one)
    const bookingStartTime = req.body.desiredStartTime ? this.timeSlots.convertTime(req.body.desiredStartTime) : this.timeSlots.convertTime(now.toString())
    const bookingMeeting: Meeting = {
      start: bookingStartTime,
      eventName: "Booking Slot",
      end: new Date(bookingStartTime.getTime() + req.body.duration * 60 * 1000)
    }

    // search for availability without other parameters
    // if it is available, then add to the calendar and sort calendar, otherwise return error
    // much efficient would be not to use sort with its complexity of N*logN, rather than
    // inserting data into the middle of the array and shifting the rest of the elements
    // which takes linear complexity, this operation will be done in place, which neither sort,
    // nor copy don't provide
    // HOWEVER - for the sake of simplicity - JUST SORT IT :)
    if (this.areMeetingsEqual(bookingMeeting, this.timeSlots.searchAvailableTimeSlots(bookingMeeting, 1, this.calendar)[0])) {
      this.calendar.push(bookingMeeting)
      this.calendar.sort((m0, m1) => m0.start == m1.start ? 0 : m0.start < m1.start ? -1 : 1)
      res.status(202).send("Meeting booked");
    } else {
      res.status(406).send("Time slot is no longer available")
    }
  }

  public listAllMeetings = (req: Request, res: Response, next: NextFunction) => {
    res.status(200).json(this.calendar)
  }
}

