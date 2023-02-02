import express, {Express, NextFunction, Request, Response, Router} from 'express';
import {Routes} from "./controllers/routes"
import {Controller} from "./controllers/controller";

export class Server {
  private server: Express = express();
  private routes: Routes;

  constructor(server: Express) {
    this.server = server;
    this.routes = new Routes();
  }


  // make server listen on some port
  public start(port: number) {
    this.server.listen(port, () => console.log(`Listening on port ${port}`));
    this.routes.configurePaths(this.server);
  }
}

