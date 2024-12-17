import 'reflect-metadata';
import express from 'express';
import AppDataSource from './config/ormconfig';
import userRoutes from './routes/UserRoutes';


const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use('/users', userRoutes);

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

app.get('/', (req, res) => {
  res.send('Hello, world!');
});


export default app; // Export the app for testing