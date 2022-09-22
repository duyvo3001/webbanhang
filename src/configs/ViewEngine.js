import express from 'express';
const configViewEngine = (app)=>{
    app.use(express.static('./src/public'));//config để hiển thị public cho ng khác xem
    app.set('view engine','ejs');
    app.set('views', './src/views');
}
export default configViewEngine ;