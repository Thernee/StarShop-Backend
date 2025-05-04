import 'reflect-metadata';
import express from 'express';
import SwaggerUI from 'swagger-ui-express';
import YAML from 'yamljs';
import AppDataSource from './config/ormconfig';
import indexRoutes from './routes/index';
import { errorHandler } from './middleware/error.middleware';

const app = express();
const PORT = process.env.PORT || 3000;

// Load OpenAPI spec
const swaggerDocument = YAML.load('./openapi.yaml');

app.use(express.json());
// Use the index routes
app.use('/api/v1', indexRoutes);

// Swagger documentation route
app.use('/docs', SwaggerUI.serve, SwaggerUI.setup(swaggerDocument));

// Register the global error-handling middleware
app.use(errorHandler);

AppDataSource.initialize()
  .then(() => {
    console.log('Data Source has been initialized!');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Error during Data Source initialization:', error);
  });

// app.use('/', router)

