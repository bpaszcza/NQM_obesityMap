/* the main file for obesity map */

// TODO: CHECK DEPENDENCIES USED, RECYCLE REST.

var express = require("express");
var jade = require("jade");
var bodyParser = require("body-parser");
var app = express();
//var aMapStyles = require("./public/stylesheets/styledMap.json");

var oTopoLA = require("./data/topoCTYUA.json");
var oGeoMSOA = require("./data/geoMSOA_onested.json"); 
var oLookUps = require("./data/LAtoMSOAdictionary.json");
var oMSOAData = require("./data/MSOA_object.json");
var oSchoolsData = require("./data/objSchools.json");

app.set("views", __dirname + "/views");
app.set("view engine","jade");
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json({limit: (5*1024*1000) }));

/* here comes the code */

app.get('/references', function(req, res){
    res.render('references');
})

app.get("/marker/:schID", function(req, res) {
	var schID = req.params["schID"];
	
	res.json(oSchoolsData[schID]);
})

app.get("/MSOA_map/:idLA/", function(req, res){
    
    var idLA = req.params["idLA"];

    res.json(oGeoMSOA[idLA]);
});

app.get('/', function(req, res){
    res.render('index', {
                        title: "Housing"
						, topoLA: oTopoLA
						//, geoMSOA: oGeoMSOA
						, LookUps: oLookUps
						, msoaData: oMSOAData
						, schoolsData: oSchoolsData
                        }
    );
});


app.listen(3000);