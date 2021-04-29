const db=require("./database");

const model=require("./model");

exports.validateUserName=(parameters)=>{
	 var query=db.prepareQuery("SELECT * FROM STUD_REG_USER WHERE USER_NAME=?",parameters);
	 return db.executeQuery(query);
};

exports.createUser=(parameters)=>{
   var query=db.prepareQuery("INSERT INTO STUD_REG_USER VALUES(?,?,?,?)",parameters);
   return db.executeQuery(query);
};

exports.loginAuth=(loginType,parameters)=>{
	var query=null;
	if(model.LOGIN_TYPE_USERNAME===loginType){
	   query=db.prepareQuery("SELECT USER_NAME,PASSWORD FROM STUD_REG_USER WHERE USER_NAME=?",parameters);
	}else{
	   query=db.prepareQuery("SELECT USER_NAME,PASSWORD FROM STUD_REG_USER WHERE EMAIL_ID=?",parameters);	
	}
	return db.executeQuery(query);
};

exports.createPost=(parameters)=>{
   var query=db.prepareQuery("INSERT INTO STUD_POST(POST_DATA,POST_AUTHOR,POST_TAG,CREATE_DATE) VALUES(?,?,?,?)",parameters);
	return db.executeQuery(query);
};

exports.findAllPosts=(parameters)=>{
  var query="SELECT json_object('POST_ID',P.POST_ID,'POST_DATA',P.POST_DATA,'POST_AUTHOR',P.POST_AUTHOR,'POST_TAG',P.POST_TAG,'CREATE_DATE',P.CREATE_DATE,'COMMENTS',(SELECT json_arrayagg(json_object('COMMENTS',C.COMMENTS))";
  query+=" FROM STUD_COMMENTS C WHERE c.POST_id=P.POST_Id),'VOTES',(SELECT  json_object('VOTE_UP',VOTE_UP,'VOTE_DOWN',VOTE_DOWN) FROM STUD_POST_LIKES where POST_ID=P.POST_ID AND USER_ID=?),'VISITORS',(SELECT json_object('total_likes',total_likes,'total_dislikes',total_dislikes,'total_comments',TOTAL_COMMENTS) FROM ((SELECT count(vote_up) total_likes FROM STUD_POST_LIKES WHERE vote_up=1 AND POST_ID=P.POST_ID) vote_up,(SELECT count(vote_down) total_dislikes from STUD_POST_LIKES WHERE vote_down=1 AND POST_ID=P.POST_ID) vote_down,(SELECT COUNT(*) TOTAL_COMMENTS FROM STUD_COMMENTS WHERE POST_ID=P.POST_ID) tab_comments)))  FROM STUD_POST P";
  query=db.prepareQuery(query,parameters);	
  return db.executeQuery(query);	
};

exports.createComment=(parameters)=>{
   var query=db.prepareQuery("INSERT INTO STUD_COMMENTS(COMMENTS,COMMENT_USER_ID,POST_ID,CREATE_DATE) VALUES(?,?,?,?)",parameters);
   return db.executeQuery(query);
};

exports.findVotesByPostIdAndUserId=(parameters)=>{
	var query=db.prepareQuery("SELECT * FROM STUD_POST_LIKES WHERE POST_ID=? AND USER_ID=?",parameters);
	return db.executeQuery(query);
};

exports.insertVote=(parameters)=>{
    var query=db.prepareQuery("INSERT INTO STUD_POST_LIKES VALUES(?,?,?,?)",parameters);
	return db.executeQuery(query);
};

exports.updateVote=(parameters)=>{
	var query=db.prepareQuery("UPDATE STUD_POST_LIKES SET VOTE_UP=?,VOTE_DOWN=? WHERE POST_ID=? AND USER_ID=?",parameters);
	
};

exports.fetchAllPosts=()=>{
  var query="SELECT json_object('POST_ID',P.POST_ID,'POST_DATA',P.POST_DATA,'POST_AUTHOR',P.POST_AUTHOR,'POST_TAG',P.POST_TAG,'CREATE_DATE',P.CREATE_DATE,'COMMENTS',(SELECT json_arrayagg(json_object('COMMENTS',C.COMMENTS))";
  query+=" FROM STUD_COMMENTS C WHERE c.POST_id=P.POST_Id),'VOTES',(SELECT  json_object('VOTE_UP',VOTE_UP,'VOTE_DOWN',VOTE_DOWN) FROM STUD_POST_LIKES where POST_ID=P.POST_ID),'VISITORS',(SELECT json_object('total_likes',total_likes,'total_dislikes',total_dislikes,'total_comments',TOTAL_COMMENTS) FROM ((SELECT count(vote_up) total_likes FROM STUD_POST_LIKES WHERE vote_up=1 AND POST_ID=P.POST_ID) vote_up,(SELECT count(vote_down) total_dislikes from STUD_POST_LIKES WHERE vote_down=1 AND POST_ID=P.POST_ID) vote_down,(SELECT COUNT(*) TOTAL_COMMENTS FROM STUD_COMMENTS WHERE POST_ID=P.POST_ID) tab_comments)))  FROM STUD_POST P";
  query=db.prepareQuery(query,null);	
  return db.executeQuery(query);	
};

exports.fetchAllPostsByTag=(parameter)=>{
  var query="SELECT json_object('POST_ID',P.POST_ID,'POST_DATA',P.POST_DATA,'POST_AUTHOR',P.POST_AUTHOR,'POST_TAG',P.POST_TAG,'CREATE_DATE',P.CREATE_DATE,'COMMENTS',(SELECT json_arrayagg(json_object('COMMENTS',C.COMMENTS))";
  query+=" FROM STUD_COMMENTS C WHERE c.POST_id=P.POST_Id),'VOTES',(SELECT  json_object('VOTE_UP',VOTE_UP,'VOTE_DOWN',VOTE_DOWN) FROM STUD_POST_LIKES where POST_ID=P.POST_ID),'VISITORS',(SELECT json_object('total_likes',total_likes,'total_dislikes',total_dislikes,'total_comments',TOTAL_COMMENTS) FROM ((SELECT count(vote_up) total_likes FROM STUD_POST_LIKES WHERE vote_up=1 AND POST_ID=P.POST_ID) vote_up,(SELECT count(vote_down) total_dislikes from STUD_POST_LIKES WHERE vote_down=1 AND POST_ID=P.POST_ID) vote_down,(SELECT COUNT(*) TOTAL_COMMENTS FROM STUD_COMMENTS WHERE POST_ID=P.POST_ID) tab_comments)))  FROM STUD_POST P WHERE P.POST_TAG LIKE ?";
  query=db.prepareQuery(query,parameter);	
  return db.executeQuery(query);	
};

exports.fetchUserDetailsByUserId=(parameters)=>{
  var query=db.prepareQuery("SELECT * FROM STUD_REG_USER WHERE USER_NAME=?",parameters);
  return db.executeQuery(query);	
};

exports.updateUserDetailsByUserId=(parameters)=>{
  var query=db.prepareQuery("UPDATE STUD_REG_USER SET FIRST_NAME=?,MIDDLE_NAME=?,LAST_NAME=?,MOBILE_NO=?,GENDER=? WHERE USER_NAME=?",parameters);
  return db.executeQuery(query);	
};