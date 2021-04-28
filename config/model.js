const regex=/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/ig;
exports.STATUS_SUCCESS="success";
exports.STATUS_FAILURE="failure";
exports.LOGIN_TYPE_EMAILID="emailId";
exports.LOGIN_TYPE_USERNAME="username";
exports.response={
  "status":"success",
  "message":"UserName Not available"
};

exports.isEmail=(value)=>{
  	if(regex.test(value)){
		return true;
	}else{
		return false;
	}
};