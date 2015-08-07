/* the main file for obesity map */

// TODO: CHECK DEPENDENCIES USED, RECYCLE REST.

var express = require("express");
var jade = require("jade");
var bodyParser = require("body-parser");
var app = express();
//var aMapStyles = require("./public/stylesheets/styledMap.json");

var oTopoLA = require("./data/topoLAplus2.json");
var oTopoMSOA = require("./data/topoMSOA.json"); 

app.set("views", __dirname + "/views");
app.set("view engine","jade");
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json({limit: (5*1024*1000) }));

/* here comes the code */

app.get('/references', function(req, res){
    res.render('references');
})

app.get("/MSOA_map/:idLA/", function(req, res){
    mapFlag = 1;
    var idTTW = req.params["idTTW"];
    thisTTW = idTTW;
    var oDeficiencyData = calculateDeficiency(oLSOASales[year][thisTTW], val);
    res.json(oDeficiencyData[year]);
});

app.get('/', function(req, res){
    res.render('index', {
                        title: "Housing"
						, topoLA: oTopoLA
						, topoMSOA: oTopoMSOA
                        }
    );
});


app.listen(3000);