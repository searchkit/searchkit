import express, { Express } from 'express';

import cors from 'cors';

export const createApp = (): Express => {
  const app = express();

  app.use(cors());

  return app;
};
