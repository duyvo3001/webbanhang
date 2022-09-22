import express from 'express';
import homeController from '../controller/homeController';
import apiController from '../controller/apiController';
import indexController from '../controller/indexController';
import storeController from '../controller/storeController';
import accountPage from '../controller/accountController';
import detailsController from '../controller/detailsController';
import momoPage from '../controller/momoController';
import test1 from '../controller/test';
let router = express.Router();
router.param("IdItem", (req, res, next, id) => {
  next();
});

router.param("malk", (req, res, next, id) => {
  next();
});

const initWebRoute = async (app) =>{
  //indexController
    router.get('/',indexController.getHomePage,function (req, res){
      throw new Error('BROKEN') // Express will catch this on its own.
    });

    router.get('/detailsPage',function(req,res,next){
      next();
     }, detailsController.DetailsPage);

  //accountcontroller
    router.get('/accountSignUp',function(req,res,next)
      {next();},accountPage.getAccountPageUp);
    router.get('/accountSignIn',accountPage.getAccountPageIn);
    router.post('/cre_User',accountPage.createUser);
    router.post('/sign_User',accountPage.SignUser);
    
  //storeController
    router.get('/storePage' , storeController.StorePage,function (req, res){
      throw new Error('BROKEN') // Express will catch this on its own.
    });
    router.put('/Payitem,',storeController.getPayItem);
    router.put('/SuaItem,', storeController.getPutItem,
     (req, res,next)=>{ res.end("hello"); },
    ); 
    router.delete('/XoaItem,',storeController.getDeleteItem);
    router.post('/item/:IdItem',function(req,res,next){
      next();
     },storeController.getStoreItem );
     
  //  device controller
  router.get('/AlldevicesPage', indexController.AlldevicesPage );///device/:id
  
    // cookie 
  app.get('/getcookie', function (req, res) {
    res.send(req.cookies['user_id']);
  })

  // momo pay 
    
  router.get('/payPage',momoPage.momoPayPage);
  router.get('/momopay',momoPage.paymentMethod);
  router.get('/getAPImomo',momoPage.APIpayment);

  // test 
    router.put('/test',test1.testrq);
    router.post('/createUser',homeController.createUser);
    router.post('/deleteUser', homeController.deleteUserSQL);
    router.get('/updateUser/user/:id', homeController.GetupdateUserSQL);
    router.post('/postUpdateUser/user/:id', homeController.PostupdateUserSQL);
    return app.use('/',router);
}

export default initWebRoute/*, deleteWeb*/;