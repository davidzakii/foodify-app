import { createNodeRequestHandler } from '@angular/ssr/node';
import server from '../dist/foodify-app/server/server.mjs';

export const reqHandler = createNodeRequestHandler(server);
