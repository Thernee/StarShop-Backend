// import express from 'express';
// import authRoutes from './modules/auth/routes/auth.routes.js';
// import errorHandler from './modules/shared/middleware/error.middleware.js';
// import AppDataSource from './config/ormconfig.js';

// const app = express();
// const port = process.env.PORT || 3000;

// app.use(express.json());

// // Use auth routes
// app.use('/api/v1/auth', authRoutes);

// // Swagger documentation route
// app.get('/api-docs', (req, res) => {
//   res.send('API documentation will be available here');
// });

// // Register the global error-handling middleware
// app.use((err: any, req: express.Request, res: express.Response) => {
//   errorHandler(err, req, res);
// });

// AppDataSource.initialize()
//   .then(() => {
//     console.log('Database connection established');
//     app.listen(port, () => {
//       console.log(`Server is running on port ${port}`);
//     });
//   })
//   .catch((error) => {
//     console.error('Error during Data Source initialization:', error);
//   });
