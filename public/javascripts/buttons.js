var oGeoMSOA = {};


var hash = 1;
//var maps = require('./maps.js');

function firstLoad(){
   // POPUP WINDOW ON ENTRANCE
   $(window).load(function(){
        $("#welcomeTitle").html("Welcome to the Interactive Housing Affordability Map")
        $(".welcomeInfo").modal("show");
    });
};

firstLoad();

$(function () {//add new panel button
    $(document).on("click",".btn-add-panel", function () {
        var $newPanel = $("#initialTemplate").clone();
        $newPanel.find(".accordion-toggle").attr("href", "#" + (++hash))
             .text("Dynamic panel #" + hash);
        var id = String("newPanel" + hash);
        $newPanel.attr("id", id);

        //add id map canvas, container, 
        $newPanel.find(".panel-body").attr("id", String("panel-body" + hash));
        $newPanel.find(".mapContainer").attr("id", String("mapContainer" + hash));
        $newPanel.find(".mapCanvas").attr("id", String("mapCanvas" + hash));
        $newPanel.find(".backButton").attr("id", String("backButton" + hash));
        $newPanel.find(".btn-add-panel").attr("id", String("btn-add-panel" + hash));

        

        //$newPanel.text("Dynamic panel ID:" + id);
        //var wdth = 1/hash;
        //document.getElementById(id).style.width = '30%';
        //updatePanelsSize();
        $("#accordion").append($newPanel.fadeIn());
        addMap(Number(hash));
    });
});

$(function () {
    //  Force an update by changing the zoom level in the background
    $(document).on('click', '.glyphicon-refresh', function () {
            for (var i = 1; i < mapArray.length; i++){
                 map = mapArray[i];
                var currentZoom = map.getZoom();
                map.setZoom( currentZoom - 1 );
                map.setZoom( currentZoom );   
            }   
        });
});

$(function () {
    $(document).on('click', '.glyphicon-remove-sign', function () {
        $(this).parents('.panel').get(0).remove();
    });

});

function loadMapColours(idLA, map){
	
    console.log(idLA);
	loadGeoData(map, oGeoMSOA[idLA]);
    polygonColors(map, idLA);
}

function featureClick(event, lat, lng, map){
    if (event.feature.getProperty('CTYUA11CD') != undefined) {
        //map.setZoom(11);
        var idLA = event.feature.getProperty('CTYUA11CD');
        var name = event.feature.getProperty('CTYUA11NM');
        //var msoaList = oLookUps[event.feature.getProperty('LMCTY11CD')].msoa;
        //var idLA = oLookUps[event.feature.getProperty('LMCTY11CD')];
        //thisTTW = idTTW;
        map.data.forEach(function (feature) {
            map.data.remove(feature);
        });

        if(!oGeoMSOA.hasOwnProperty(idLA)){
            $.ajax("/MSOA_map/" + idLA).done(function (res) {
                oGeoMSOA[idLA] = res;
                loadMapColours(idLA, map)
                createSchoolMarkers(idLA, map);
                zoom(map);
            });
        }else {
            loadMapColours(idLA, map);
            createSchoolMarkers(idLA, map);
            zoom(map);
        }
    }
}


$(function () { // BACK BUTTON
    $(document).on('click', ".backButton", function () {
        var string = this.id;
        console.log(string);
        var index = string.substr(10);

        console.log(index);
        //var map = mapArray[index];
        addMap(index);

        /*clearMarkers(map);
        map.data.forEach(function (feature) {
        map.data.remove(feature);
        });
        loadGeoData(map, topojson.feature(oTopoLA, oTopoLA.objects.geoLAplus));*/
        zoom(mapArray[index]);
    });
})