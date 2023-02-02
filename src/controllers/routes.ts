import express, {Express, NextFunction, Request, Response, Router} from "express";
import {Controller} from "./controller";

export class Routes {
  private controller: Controller = new Controller();
  private router: Router = Router();

  public configurePaths(server: Express) {
    server.use(express.json())
    server.get('/', this.controller.mainPage);
    server.use('/api/v1', this.router);

    this.configureSubUri();
  }

  private configureSubUri() {
    this.router.get('/available-time-slots', this.controller.searchTimeSlots)
    this.router.get('/events', this.controller.listAllMeetings)
    this.router.post('/events', this.controller.bookTimeSlot)
  }
}