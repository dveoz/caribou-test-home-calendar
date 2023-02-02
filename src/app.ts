import express from 'express';
import {Server} from './initServer';

const server: Server = new Server(express());
server.start(3000);
