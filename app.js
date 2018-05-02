//import libraries
var express = require('express');
var app =express();
var bodyParser=require('body-parser');
var request = require('request');
var minify=require('harp-minify');
var cheerio =require('cheerio');
var find=require('cheerio-eq');




app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");
app.use(express.static( __dirname + '/public'));


var stringname="";
 var bodyoutput="";



// program to send in json format
var program = {
    script : JSON.parse(JSON.stringify(stringname)),
    language: "",
    stdin:"",
    versionIndex: "0",
    clientId: "df49663841f0cdcd22d6f7caedc99b1c",
    clientSecret:"c39368c7ff3a9f53396463e350324b42ebced290c77422c1487f62049b4e7c46"
};





// routes 


//render index page
app.get("/",function(req,res){
	res.render("index");
});




// render compiler page

app.get("/compiler",function(req,res){
	res.render("compilerpage");
});
//send data to api and get output and display in html page 
app.post("/compileit",function(req,res){
  program.language=req.body.langname;
  program.script=req.body.inputarea;
  program.stdin=req.body.stdinput;
  var languagename = program.language;
  var stringname = new String(program.script);
  console.log(stringname);
 stringname=stringname.replace("\r","");
  request({
    url: 'https://api.jdoodle.com/execute',
    method: "POST",
    json: program
},
function (error, response, body) {
    console.log('error:', error);
    console.log('statusCode:', response && response.statusCode);
    console.log('body:', body);
     bodyoutput =JSON.parse(JSON.stringify(body.output));

     console.log("bodyoutput "+bodyoutput);  
    });

  res.render("compilerpage1",{
    	bodyoutput:bodyoutput,stringname:stringname,languagename:languagename
});

});




// webscraping codechef



app.get("/contest/:contestsite",function(req,res){
   console.log(req.params.contestsite);

  var site=req.params.contestsite;


  if(site=="codechef")
  {
    console.log("te");

      var url="https://www.codechef.com/contests";
      request(url,function(err,response,html){
        if(!err)
        {
          var $ = cheerio.load(html);
          var allitems = $(".content").children();
          var itemspresent = [];

           for(i=0;i<10;i++)
            {
            var contestcode = $(".dataTable").eq(0).find("tbody").children().eq(i).find("td").eq(0).text();
            var contestname = $(".dataTable").eq(0).find("tbody").children().eq(i).find("td").eq(1).text();
            var conteststart = $(".dataTable").eq(0).find("tbody").children().eq(i).find("td").eq(2).text();  
            var contestend = $(".dataTable").eq(0).find("tbody").children().eq(i).find("td").eq(3).text();  
            var contestlink = "https://www.codechef.com/"+contestcode;
            var object = {contestcode:contestcode,contestname:contestname,conteststart:conteststart,contestend:contestend,contestlink:contestlink};
            console.log("--presentcontest--");
            console.log(contestcode,contestname,conteststart,contestend,contestlink);

              itemspresent.push(object);
           
            }
            


           res.render("contestpagesdetails",{itemspresent:itemspresent,site:site});
        }
                                                 });
 

}

  
  else if(site=="hackerrank")
  {
      console.log("te");

      var url="https://www.hackerrank.com/contests";
      request(url,function(err,response,html){
        if(!err)
        {
          var $ = cheerio.load(html);
          var allitems = $(".content").children();
          var itemspresent= []; 
          var itemsfuture=[];       
           
                  
            var presentcontest =$("#content").children().find('ul[class="contests-active"]').eq(0);

           
              for(var i=0;i<10;i++)
              {
              var result = $("#content").children().find('ul[class="contests-active"]').eq(0).children().eq(i).text();
              result= result.replace("View DetailsSign Up"," ");
              itemspresent.push(result);
            
             }
              console.log(itemspresent);
           
           res.render("contestpagesdetails",{itemspresent:itemspresent,site:site});

        }
  

  });
}

});

// scrape questions on different page
app.get("/contestpage/:contcode/:website",function(req,res){
  if(req.params.website=="codechef")
  {
  var url = "https://www.codechef.com/"+req.params.contcode;

  request(url,function(err,response,html){
    
  });
   var $ = cheerio.load(html);
   console.log($);




  console.log(url);
}
});



















// start server
app.listen(3000,function(){
	console.log("server has started");
});