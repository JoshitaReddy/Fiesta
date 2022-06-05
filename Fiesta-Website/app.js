//---------NODE MODULES------------
const express = require("express");
const request = require('request');
const http = require("https");

//--------APP CONFIG---------------

const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({extended:true}));

//-------API CONFIG----------------
// const options = {
//     "method": "GET",
//     "hostname": "webcamstravel.p.rapidapi.com",
//     "port": null,
//     "path": "/webcams/list/continent=AS?lang=en&show=webcams%3Aimage%2Clocation",
//     "headers": {
//         "X-RapidAPI-Host": "webcamstravel.p.rapidapi.com",
//         "X-RapidAPI-Key": "2e6ada2105msh6388cf8e7f5a5b4p1c3b08jsn6b339ee3432d",
//         "useQueryString": true
//     }
// };




var flag;

//---------GET STATEMENTS------------

app.get("/",function(req,res){
    res.sendFile(__dirname+"/index.html");
})

app.get("/form.html",function(req,res){
    res.sendFile(__dirname+"/form.html");
})


//---------POST STATEMENTS------------

app.post("/result.html", function(req,res){

    var satlevel = req.body.satisfaction_level_input;
    var lasteval = req.body.last_evaluation_input;
    var nofproj = req.body.number_projects_input;
    var avgmonhrs = req.body.averagemonthlyhours_input;
    var timespentcomp = req.body.timespentcompany_input;
    var workacc = req.body.work_accident_input;
    var promlast5y = req.body.promotionlast5years_input;
    var department = req.body.Departments;
    var salary = req.body.Salary;
    var location = req.body.Location;

    // console.log(satlevel);
    // console.log(nofproj);
    // console.log(salary);
    // console.log(department);
    const options = {
        "method": "GET",
        "hostname": "webcamstravel.p.rapidapi.com",
        "port": null,
        "path": "/webcams/list/continent="+location+"?lang=en&show=webcams%3Aimage%2Clocation",
        "headers": {
            "X-RapidAPI-Host": "webcamstravel.p.rapidapi.com",
            "X-RapidAPI-Key": "2e6ada2105msh6388cf8e7f5a5b4p1c3b08jsn6b339ee3432d",
            "useQueryString": true
        }
    };

    const url1="https://fiesta-ml.herokuapp.com/?satisfaction_level="+satlevel+"&last_evaluation="+lasteval+"&number_project="+nofproj+"&average_montly_hours="+avgmonhrs+"&time_spend_company="+timespentcomp+"&Work_accident="+workacc+"&promotion_last_5years="+promlast5y+"&Departments="+department+"&salary="+salary;
    
    http.get(url1,function(response)
    {
        response.on("data",function(data)
        {
            var markpredictor=JSON.parse(data); 
            console.log(markpredictor.prediction);
            flag=markpredictor.prediction;


            var work;
            if(flag==1)
            {
                work = "OVERWORKED";
            }

            else{
                work = "DOING FINE";
            }

            if(flag==1)
            {
                const req2 = http.get(options, function (res2) {
                    const chunks = [];
                
                    res2.on("data", function (chunk) {
                        chunks.push(chunk);
                    });
                
                    res2.on("end", function () {
                        const body = Buffer.concat(chunks);
                        const PlacesData = JSON.parse(body);
                        
                        var url3 = (PlacesData.result.webcams[0].image.current.thumbnail);
                        var url4 = (PlacesData.result.webcams[1].image.current.thumbnail);
                        var url5 = (PlacesData.result.webcams[2].image.current.thumbnail);

                        var place1 = PlacesData.result.webcams[0].title;
                        var place2 = PlacesData.result.webcams[1].title;
                        var place3 = PlacesData.result.webcams[2].title;

                        // console.log(url3);

                        res.render("index",{
                            name1 : url3,
                            name2 : url4,
                            name3 : url5,
                            work : work,
                            place1 : place1,
                            place2 : place2,
                            place3 : place3,
                        });

                        res.send()
                    });
                    
                });

                req2.end();   
            }

            else
            {
                res.render("index2",{
                    work : work,
                });

                res.send();
            }

    });
    });

})



//-----------LISTEN STATEMENT------------

app.listen(process.env.PORT || 3000,function(){
    console.log("Server is running yaay");
})