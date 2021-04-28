const errorMsg='<div class="tooltip fade bs-tooltip-right show error_msg" role="tooltip" style="position: absolute;top: 0px;left: 0px;will-change: transform;" x-placement="right"><div class="arrow" style="top:6px;"></div><div class="tooltip-inner">Your passwords do not match!</div></div>';

Handlebars.registerHelper('vif', function (value, options) {
    if(value===1) {
        return options.fn(this);
     }else{
        return options.inverse(this);
     }
});

var isValidPassword=(pwd,trypwd)=>{
   if(pwd!=null && trypwd!=null && (pwd===trypwd)){
	  return true;
   }else{
	  return false;
   }	
};
/*Email Validation*/
var isValidEmail=(val)=>{
   var regex=/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/ig;
   console.log("Value:{}",val);	
   if(regex.test(val)){
	   return true;
   }else{
	   return false;
   }	
};
var addError=(id,msg)=>{
	$(id).css("border-right","9px solid red");
	var errorId=id.replaceAll("#",'')+"_error";
	$(id+"_error").remove();
	var posy=$(id).offset().top-$(id).outerHeight()/6;
	var posx=$(window).width()-$(id).offset().left;
	var errorObj=$(errorMsg).attr("id",errorId);
	errorObj.css({"transform": "translate3d("+posx+"px,"+posy+"px,0px)"});
	$("body").append(errorObj);
	$(id+"_error .tooltip-inner").html(msg);
};
var removeError=(id)=>{
	$(id).css("border-right","none");
	$(id+"_error").remove();
}
var ajaxCall=(method,url,data,successCallback,errCallback)=>{
        $.ajax({
				type:method,
				url:url,
				data:data,
			    dataType: 'json', 
				processData:false,
				contentType:"application/json",
				cache: false,
				timeout: 600000,
			    beforeSend:()=>{
				  $(".spinner").css("display","block");	
				},
				success:(resp)=>{
					successCallback(resp);
				},
			    error:(req,status,err)=>{
					errCallback(err);
				},
			    complete:()=>{
					$(".spinner").css("display","none");	
				}
		  });	
};

var loadAllPosts=()=>{
    ajaxCall('GET','api/findAllPosts',null,(resp)=>{
		  $(".section_posts").html(postsTemplate(resp));
	},(err)=>{
		   console.log("errr",err);
	});	
};