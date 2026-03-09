const express = require(`express`);
const app = express();
const cors = require(`cors`);
const port = process.env.PORT || 5000;
require(`dotenv`).config();

app.use(cors());
app.use(express.json());

const mongoose = require(`mongoose`);

const movieRoutes = require(`./routes/movieRoutes`);

const reviewRoutes = require(`./routes/reviewRoutes`);

const authRoutes = require(`./routes/authRoutes`);

mongoose.connect(process.env.MONGO_URI)
    .then(() => {console.log('Connected to MongoDB');})
    .catch((err) => {console.error('Error connecting to MongoDB:', err);});

app.use('/api/v1/movies', movieRoutes);
app.use('/api/v1/reviews', reviewRoutes);
app.use('/api/v1/auth', authRoutes);

// app.get('/api/v1/notifications', (req, res) => {
//   res.send('Bạn có 2 thông báo mới! ')
// });

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});