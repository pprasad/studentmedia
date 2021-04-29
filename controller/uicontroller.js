const bcrypt = require('bcrypt');

const saltRounds = 10;

const orm=require("../config/orm");

const model=require("../config/model");

exports.search=(req,res)=>{
	var posts=[];
	var search=req.query.query;
    if(search){
		orm.fetchAllPostsByTag(['%'+search+'%']).then((resp)=>{
			 Object.keys(resp).forEach((key)=>{
					var obj=resp[key];
					Object.keys(obj).forEach((key)=>{
						 posts.push(obj[key]);
					});
			});
			res.render("search",{data:posts});
		}).catch((err)=>{
            res.render("search",{error:err.sqlMessage});
		});
    }else{
		res.render("search",{});
	}
}
/*
 * User registration form 
 */
exports.registration=(req,res)=>{
	let data=req.body;
    var respObj=Object.assign({},model.response);
	if('get'===req.method.toLowerCase()){
	   res.render("signup",{});
	}else{
	   let encryptedPassword =bcrypt.hashSync(data.password,saltRounds)	
	   orm.createUser([data.email_id,data.user_name,encryptedPassword,data.mobile_no]).then((resp)=>{
		   respObj.status=model.STATUS_SUCCESS;
		   respObj.message="Successfully User registered";
		   res.render("signup",respObj);
	   }).catch((err)=>{
		   respObj.status=model.STATUS_FAILURE;
		   if(err.code && err.code==='ER_DUP_ENTRY'){ 
			  respObj.message=data.email_id+" already Avaliable,Please re-login.";
			}else{
			  respObj.message=err.message;
		    }
		    data['error']=respObj;
		    res.render("signup",data);
	   });	
	}
}

exports.loginPage=(req,res)=>{
	var message=null;
    if("get"==req.method.toLowerCase()){
		res.render("login",{});
	}else{
		let data=req.body;
		var loginType=model.isEmail(data.user_name)?model.LOGIN_TYPE_EMAILID:model.LOGIN_TYPE_USERNAME;
        orm.loginAuth(loginType,[req.body.user_name])
		.then((resp)=>{
			if(resp && resp.length!=0 && resp[0].PASSWORD){
			   let comparison=bcrypt.compareSync(data.password,resp[0].PASSWORD)  
			   if(comparison){
				   req.session.user=resp[0].USER_NAME;
			       res.redirect("/dashboard");
			   }else{
				   res.render("login",{"error":{"message":"Email Id and Password does not match"}});
			   }
			}else{
			   res.render("login",{"error":{"message":"Email Id or Password does not match"}});
			}
		}).catch((err)=>{
			res.render("login",{});
		})
	}
}

exports.dashboardPage=(req,res)=>{
	if(req.session.user){
	    res.render("dashboard",{loginId:req.session.user});
	}else{
		res.redirect("/login");
	}
};

exports.index=(req,res)=>{
	var posts=[];
	orm.fetchAllPosts().then((resp)=>{
		 Object.keys(resp).forEach((key)=>{
			    var obj=resp[key];
				Object.keys(obj).forEach((key)=>{
					 posts.push(obj[key]);
				});
    	});
		res.render("index",{"title":"Student Social Media","name":"Adithya",data:posts});
	}).catch((err)=>{
		
	});
}

exports.logout=(req,res)=>{
	res.clearCookie('user_sid');
    res.redirect("/login");	
};

exports.myprofile=(req,res)=>{
	if(req.session.user){
	   orm.fetchUserDetailsByUserId([req.session.user])
	   .then((resp)=>{
		   if(resp){
		   	   res.render("myaccount",{loginId:req.session.user,userinfo:resp[0]});
		   }else{
			   res.render("myaccount",{loginId:req.session.user,error:'Please re-try after some time'});
		   }
	   }).catch((err)=>{
		   console.log("error:{}",err);
		   res.redirect("/login"); 	
	   })	
	}else{
	   res.redirect("/login"); 	
	}
};

exports.updateUserDetailsByUserId=(req,res)=>{
	var data=req.body;
	if(req.session.user){
		orm.updateUserDetailsByUserId([data.first_name,data.middle_name,data.last_name,data.mobile_no,data.gender,data.user_name])
		.then((resp)=>{
			 res.render("myaccount",{loginId:req.session.user,userinfo:data,message:'Successfully Updated UserDetails.'});
		}).catch((err)=>{
			  console.log("err:{}",err.sqlMessage);
			  res.render("myaccount",{loginId:req.session.user,userinfo:data,error:{message:'Some thing went wrong.'}});
		})
	}else{
	   res.redirect("/login"); 	
	}
}