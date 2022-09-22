import express from 'express';
import apiController from '../controller/apiController';
let router = express.Router();
//init apiRoute
const initAPIRoute = (app) =>{
    router.get('/users',apiController.getallUsers);
    router.get('/test',apiController.testUser);
    router.post('/create_users',apiController.createUser);
      return app.use('/api/v1',router);
}
export default initAPIRoute