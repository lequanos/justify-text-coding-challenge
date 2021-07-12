require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');

const router = require('./routers');

const app = express();

app.use(express.json());
app.use(express.text());
app.use(cookieParser());
app.use(router);

app.listen(process.env.PORT || 3000, () => {
    console.log('Server running on :', process.env.PORT);
});