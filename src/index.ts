import 'reflect-metadata';
import express from 'express';
import AppDataSource from './config/ormconfig';
import indexRoutes from './routes/index';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
// Use the index routes
app.use('/api/v1', indexRoutes);

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


app.use('/', router)

console.log('JWT_SECRET:', process.env.JWT_SECRET); // Debug log (remove in production)

