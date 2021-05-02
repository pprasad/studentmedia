//use path module
const path=require("path");

//handling api & ui rendering
const express=require("express");

//Templates renderning
const exphbs=require("express-handlebars");

const Handlebars = require('handlebars');

//content response payload as a json
const bodyparser=require("body-parser");

/*Cookies & session For tracking user session*/
var cookieParser = require('cookie-parser');

var session = require('express-session');

const UI_ROUTER=require("./routers/uirouters.js");

const API_ROUTER=require("./routers/apirouters.js");

const app=express();

app.use(bodyparser.json({limit: '50mb'}));// for parsing application/json

app.use(bodyparser.urlencoded({limit: '50mb',extended:true}));//For parsing application/x-www-from-urlencoded


app.use(cookieParser());

app.use(session({
    key: 'user_sid',
    secret: 'studmedia',
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 600000
    }
}));

//app.set("views",path.join(__dirname,"views")); //Not mandatory we can use different name for views folder. Handlebar always look for views under views folder

app.use(express.static(path.join(__dirname,"public")));

Handlebars.registerHelper("hbs-template", function(key, options){
    var source = options.fn().replace("\\{{", "{{");
    var ret =
    '<script>\n' + 
        key + ' = function(opt){\n' +
            'return Handlebars.template(' +Handlebars.precompile(source) + ')(opt);\n' +
        '}\n' + 
    '</script>';
    return ret;
});
Handlebars.registerHelper("transform",(obj,key,options)=>{
	if(obj && (obj.hasOwnProperty(key.toUpperCase()))){
	   return obj[key.toUpperCase()];
	}else{
	  return obj[key.toLocaleLowerCase()];  					  
	}
});

Handlebars.registerHelper('vif', function (value, options) {
    if(value===1) {
        return options.fn(this);
     }else{
        return options.inverse(this);
     }
});

Handlebars.registerHelper('select', function(selected,key,option) {
    if(typeof(selected)==='object'){
		selected=selected[key.toUpperCase()];
	}
    return (selected == option) ? 'selected="selected"' : '';
});

app.engine('.html', exphbs({extname: '.html',handlebars:Handlebars}));

app.set('view engine', '.html');

app.use((req, res, next) => {
    if(req.cookies.user_sid && !req.session.user) {
        res.clearCookie('user_sid');        
    }
    next();
});

app.use('/api/',API_ROUTER);

app.use('/',UI_ROUTER);

var PORT=process.env.PORT||3000

app.listen(PORT,()=>{
	 console.log(`server running on port ${PORT}`);
})
