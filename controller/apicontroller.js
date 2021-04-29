const MOMENT= require( 'moment' );

const orm=require("../config/orm");

const model=require("../config/model");

/*Validate UserName*/
exports.isValidUsername=(req,res)=>{
	var respObj=Object.assign({},model.response);
	respObj.status=model.STATUS_SUCCESS;
	orm.validateUserName([req.query.username])
	.then((resp)=>{
		 if(resp.length!=0){
			respObj.status=model.STATUS_FAILURE;
			respObj.message="UserName Not Available";
	     }else{
			respObj.message="UserName Available";
		 }
		 res.json(respObj);
	}).catch((err)=>{
		respObj.status=model.STATUS_FAILURE;
		respObj.message=err.message;
		res.json(respObj);
	});
};

exports.publishpost=(req,res)=>{
	let datetime = MOMENT().format( 'YYYY-MM-DD  HH:mm:ss.000' );
	orm.createPost([req.body.data,req.session.user,req.body.tag,datetime])
	.then((resp)=>{
		if(res && resp.insertId!=0){
		    orm.createComment([req.body.comments,req.session.user,resp.insertId,datetime])
		    res.json({status:model.STATUS_SUCCESS});
	    }else{
			res.json({status:model.STATUS_FAILURE,message:err});
		}
	}).catch((err)=>{
	  	res.json({status:model.STATUS_FAILURE,message:err});
	});
};

exports.findAllPosts=(req,res)=>{
	var posts=[];
    orm.findAllPosts([req.session.user]).then((resp)=>{
		   Object.keys(resp).forEach((key)=>{
			    var obj=resp[key];
				Object.keys(obj).forEach((key)=>{
					 posts.push(obj[key]);
				});
    		});
		 res.json({status:model.STATUS_SUCCESS,posts:posts});
	}).catch((err)=>{
		 console.log(err);
	     res.json({status:model.STATUS_FAILURE,message:err.sqlMessage});
	});	
};

exports.publishcomments=(req,res)=>{
    let datetime = MOMENT().format( 'YYYY-MM-DD  HH:mm:ss.000' );
	orm.createComment([req.body.comments,req.session.user,req.params.postid,datetime])
	.then((resp)=>{
		if(resp){
			res.json({status:model.STATUS_SUCCESS,message:"Successfully published"});
		}else{
			res.json({status:model.STATUS_FAILURE,message:"Please re-try after some time"});
		}
	}).catch((err)=>{
		res.json({status:model.STATUS_FAILURE,message:err.sqlMessage});
	})
};

exports.insertVote=(req,res)=>{
   var userId=req.session.user?req.session.user:req.body.loginId;
   orm.findVotesByPostIdAndUserId([req.params.postid,userId])
	.then((resp)=>{
	   if(resp && resp.length!=0){
		    orm.updateVote([req.body.voteUp,req.body.voteDown,req.params.postid,userId])
		    .then((resp)=>{
				 if(resp){
					 res.json({status:model.STATUS_SUCCESS,message:"Successfully published"});
				 }else{
					 res.json({status:model.STATUS_FAILURE,message:"Please re-try after some time"});
				 }
			}).catch((err)=>{
				res.json({status:model.STATUS_FAILURE,message:err.sqlMessage});
			});
	   }else{
		   orm.insertVote([req.params.postid,userId,req.body.voteUp,req.body.voteDown])
		    .then((resp)=>{
				 if(resp){
					 res.json({status:model.STATUS_SUCCESS,message:"Successfully published"});
				 }else{
					 res.json({status:model.STATUS_FAILURE,message:"Please re-try after some time"});
				 }
			}).catch((err)=>{
				res.json({status:model.STATUS_FAILURE,message:err.sqlMessage});
			});
	   }
    }).catch((err)=>{
	   res.json({status:model.STATUS_FAILURE,message:err.sqlMessage});
   })
};