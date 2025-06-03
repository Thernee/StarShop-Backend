import express from 'express';
import indexRoutes from './routes/index.js';
import errorHandler from './modules/shared/middleware/error.middleware.js';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use('/api/v1', indexRoutes);
app.use((err: any, req: express.Request, res: express.Response) => {
  errorHandler(err, req, res);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
