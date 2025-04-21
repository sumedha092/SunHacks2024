// Import necessary modules
import express, { Application, Request, Response } from 'express';
import cors, { CorsOptions } from 'cors';
import { Globals } from '../library/Globals/Globals';
import { LoggerUtils } from '../library/Utilities/LoggerUtils';

import { HttpStatusCode } from 'axios';
import { GetRouter } from './Routes/Get';
import { PostRouter } from './Routes/Post';
import { PutRouter } from './Routes/Put';

export class Server {
  private readonly app: Application;
  private readonly port: number | string;
  private readonly allowedOrigins: string[] = ['http://localhost:3000'];

  constructor() {
    this.app = express();
    this.port = Globals.PORT;

    this.configureMiddleware();
    this.configureRoutes();
    this.configureErrorHandling();
  }

  /**
   * Configures middleware for the Express application.
   */
  private configureMiddleware(): void {
    // Define a regex pattern to match any subdomain of ngrok-free.app
    const ngrokFreeAppRegex = /^https?:\/\/([a-zA-Z0-9-]+\.)*ngrok-free\.app$/;

    // Define CORS options
    const corsOptions: CorsOptions = {
      origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);

        // Check if the origin matches the ngrok-free.app pattern
        if (ngrokFreeAppRegex.test(origin)) {
          return callback(null, true);
        }

        // Check if the origin is in the allowedOrigins array
        if (this.allowedOrigins.includes(origin)) {
          return callback(null, true);
        }

        // If the origin doesn't match, reject the request
        const msg = `The CORS policy for this site does not allow access from the specified Origin: ${origin}`;
        return callback(new Error(msg), false);
      },
      credentials: true, // Allow cookies and other credentials if needed
      optionsSuccessStatus: 200 // Some legacy browsers choke on 204
    };

    // Apply CORS middleware
    this.app.use(cors(corsOptions));

    // Handle preflight requests for all routes
    this.app.options('*', cors(corsOptions));

    // Parse incoming JSON requests
    this.app.use(express.json());
  }

  /**
   * Configures the routes for the Express application.
   */
  private configureRoutes(): void {
    // Example route
    this.app.get('/helloworld', (req: Request, res: Response) => {
      res.status(HttpStatusCode.Ok).send({ message: 'Hello World' });
    });

    // Apply routers
    this.app.use('/api', new GetRouter().router);
    this.app.use('/api', new PostRouter().router);
    this.app.use('/api', new PutRouter().router);
  }

  /**
   * Configures error handling middleware.
   */
  private configureErrorHandling(): void {
    // CORS error handling
    this.app.use((err: any, req: Request, res: Response) => {
      if (err instanceof Error && err.message.startsWith('The CORS policy')) {
        LoggerUtils.error(`CORS Error: ${err.message}`);
        return res
          .status(HttpStatusCode.Forbidden)
          .json({ message: err.message });
      }
      // Handle other types of errors
      LoggerUtils.error(`Internal Server Error: ${err}`);
      res
        .status(HttpStatusCode.InternalServerError)
        .json({ message: 'Internal Server Error' });
    });
  }

  /**
   * Starts the Express server.
   */
  public start(): void {
    this.app.listen(Number(this.port), '0.0.0.0', () => {
      LoggerUtils.info(`Server is running on port ${this.port}`);
    });
  }
}
