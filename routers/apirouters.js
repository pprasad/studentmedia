const express=require("express");

const Router=express.Router();

const API_CONTROLER=require("../controller/apicontroller");

Router.get("/validate/:username",API_CONTROLER.isValidUsername);

Router.post("/publishpost",API_CONTROLER.publishpost);

Router.get("/findAllPosts",API_CONTROLER.findAllPosts);

Router.post("/publishcomments/:postid",API_CONTROLER.publishcomments);

Router.post("/updateVotesByPostId/:postid",API_CONTROLER.insertVote);

module.exports=Router;