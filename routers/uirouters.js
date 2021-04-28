const express=require("express");

const Router=express.Router();

//Database
const dbConn=require('../config/database');

//UI Controller
const UI_CONTROLLER=require("../controller/uicontroller.js");

const sessionChecker=(req, res, next)=>{
    if(req.session.user && req.cookies.user_sid) {
        res.redirect('/dashboard');
    }else{
       next();
    }    
};

Router.get('/search',UI_CONTROLLER.search);

Router.get('/registration',sessionChecker,UI_CONTROLLER.registration);

Router.post('/registration',UI_CONTROLLER.registration);

Router.get('/login',sessionChecker,UI_CONTROLLER.loginPage);

Router.post('/login',UI_CONTROLLER.loginPage);

Router.get('/dashboard',UI_CONTROLLER.dashboardPage);

Router.get('/',sessionChecker,UI_CONTROLLER.index);

Router.get('/logout',UI_CONTROLLER.logout);

//Export all UI dependence
module.exports=Router;