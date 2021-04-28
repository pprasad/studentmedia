const mySqlDB=require("mysql2");

var connection;
//Global Error Handler
var errHandle=(err,result)=>{
	if(err){
		console.log("Query Execution Exception:{}",err);
		return;
	}
	//console.log("Result:{}",result);
}
//configuring database details
connection=mySqlDB.createConnection({
   host:"localhost",
   port:"3306",
   user:"nodeuser",
   password:"nodeuser@1234",
   database:"node"
});

//Making connection with database
connection.connect((err)=>{
	if(err){
		console.log("Unable to establish connection with Database",err);
		return; 
	}
	console.log("Connected as Id",connection.threadId);
});

executeSchema=()=>{
   connection.query("DROP TABLE IF EXISTS STUD_REG_USER;",errHandle);
   connection.query("CREATE TABLE STUD_REG_USER(EMAIL_ID VARCHAR(200) PRIMARY KEY,USER_NAME VARCHAR(200),PASSWORD VARCHAR(200),MOBILE_NO VARCHAR(11));",errHandle);
   connection.query("DROP TABLE IF EXISTS STUD_POST;",errHandle);	
   connection.query("CREATE TABLE STUD_POST(POST_ID INT PRIMARY KEY AUTO_INCREMENT,POST_DATA LONGTEXT,POST_AUTHOR VARCHAR(200),POST_TAG VARCHAR(300),CREATE_DATE DATETIME);",errHandle);
   connection.query("CREATE TABLE STUD_COMMENTS(COMMENT_ID INT PRIMARY KEY AUTO_INCREMENT,COMMENTS VARCHAR(500),COMMENT_USER_ID VARCHAR(500),POST_ID INT,CREATE_DATE DATETIME,FOREIGN KEY(POST_ID) REFERENCES STUD_POST(POST_ID));",errHandle);
   connection.query("CREATE TABLE STUD_POST_LIKES(POST_ID INT,USER_ID VARCHAR(200),VOTE_UP BOOLEAN DEFAULT 0,VOTE_DOWN BOOLEAN DEFAULT 0, PRIMARY KEY(POST_ID,USER_ID));",errHandle);	
};

queryFormat=(query,parameters)=>{
	return mySqlDB.format(query,parameters);
};

executeQuery=(query)=>{
    return new Promise((resolve,reject)=>{ 
	  connection.query(query,(err,result)=>{
		   if(err){
			   reject(err);
		   }else{
			   resolve(result);
		   }
	   });
   });		
};

//Exporting Database Globally
module.exports={conn:connection,prepareQuery:queryFormat,executeQuery:executeQuery,executeSchema:executeSchema};
