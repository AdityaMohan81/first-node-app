import express from 'express';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import postRoutes from './routes/postRoutes.js';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import connectDB from './config/db.js';

dotenv.config();

const app = express();
app.set('view engine', 'ejs');

const port = process.env.PORT || 3000;
const hostname = process.env.HOST || 'localhost';

app.use(cookieParser());

//Importing mongodb connection
connectDB();

// Middleware setup
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

// Rendering frontPage page
app.get('/', (req, res) => {
  res.render('frontPage');
});

// Swagger setup
const options = {
  definition: {
    openapi: '3.1.0',
    info: {
      title: 'My Node App API with Swagger',
      version: '0.1.0',
      description: 'This is a simple CRUD API application made with Express and documented with Swagger',
      license: {
        name: 'MIT',
        url: 'https://spdx.org/licenses/MIT.html',
      },
      contact: {
        name: 'DiamondLease',
        url: 'https://diamondlease.com',
        email: 'info@email.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000/api',
        description: 'Local server',
      },
    ],
    components: {
      securitySchemes: {
        jwt: {
          type: 'http',
          scheme: 'bearer',
          in: 'header',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [{
      jwt: [],
    }],
  },
  apis: ['./controllers/*.js'],
};

const specs = swaggerJSDoc(options);
app.use(
  '/api/documentation',
  swaggerUi.serve,
  swaggerUi.setup(specs, { explorer: true, swaggerOptions: { persistAuthorization: true } })
);

// Routes
app.use('/api', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/post', postRoutes);

// Server listen
app.listen(port, hostname, () => {
  console.log(`Server is running at http://${hostname}:${port}/`);
});
