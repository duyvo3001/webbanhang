import initWebRoute from './route/web';
import express from 'express';
import expressLayouts from 'express-ejs-layouts'; 
import configViewEngine from './configs/ViewEngine';
import initAPIRoute from './route/api';
import bodyParser from 'body-parser';
const cookieParser = require('cookie-parser')
const session = require('express-session');
require('dotenv').config();
// const helmet = require('helmet')
const cookie = require('cookie');
const app = express();
const port = process.env.PORT || 8000 ; // vào .env để thiết lập biến

app.use(cookieParser());
app.use(session({
  secret : 'some secret',
  cookie : { maxAge : 30000},
  saveUninitialized : false
}))
app.use(bodyParser.json());
app.set('layout' ,'./layouts/layout') 
app.use(express.urlencoded({ extended : true }));
app.use(express.json());
app.use(expressLayouts);
// app.use(errorHandler);
//setup viewEngine
configViewEngine(app);

initAPIRoute(app);

initWebRoute(app);  

app.use((req,res)=>{
  return res.render('404.ejs',{layout:false});
})
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});