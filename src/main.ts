// import express from 'express';
// import authRoutes from './backup/auth/routes/auth.routes';
// import errorHandler from './modules/shared/middleware/error.middleware';

// const app = express();
// const port = process.env.PORT || 3000;

// app.use(express.json());
// app.use('/api/v1/auth', authRoutes);
// app.use((err: any, req: express.Request, res: express.Response) => {
//   errorHandler(err, req, res);
// });

// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });


import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 3000;

  app.enableCors();
  
  await app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
  });
}
bootstrap();
