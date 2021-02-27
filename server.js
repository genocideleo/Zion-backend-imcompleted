const express = require('express');
const app = express();
const connectDB = require('./config/db');
//connect db
connectDB();
//init middleware
app.use(express.json({ extended: false })); //3folder/2file - 1:41 time
app.get('/', (req, res) => res.send('API running'));
//define routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/explore', require('./routes/api/explore'));
app.use('/api/malls', require('./routes/api/malls'));
app.use('/api/services', require('./routes/api/services'));
app.use('/api/stores', require('./routes/api/stores'));
app.use('/api/items', require('./routes/api/items'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
