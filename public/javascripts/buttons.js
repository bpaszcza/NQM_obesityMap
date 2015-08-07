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
    $(".btn-add-panel").on("click", function () {
        var $newPanel = $("#initialTemplate").clone();
        $newPanel.find(".accordion-toggle").attr("href", "#" + (++hash))
             .text("Dynamic panel #" + hash);
        var id = String("newPanel" + hash);
        $newPanel.attr("id", id);

        //add id map canvas, container, 
        $newPanel.find(".panel-body").attr("id", String("panel-body" + hash));
        $newPanel.find(".mapContainer").attr("id", String("mapContainer" + hash));
        $newPanel.find(".mapCanvas").attr("id", String("mapCanvas" + hash));

        

        //$newPanel.text("Dynamic panel ID:" + id);
        //var wdth = 1/hash;
        //document.getElementById(id).style.width = '30%';
        //updatePanelsSize();
        $("#accordion").append($newPanel.fadeIn());
        addMap(Number(hash));
    });
})

$(function () {
    $(document).on('click', '.glyphicon-remove', function () {
        $(this).parents('.panel').get(0).remove();
    });
});

function loadMapColours(idLA){
	
	//loop over all msoa's for given LA, from dictionary
	for(;;){
		loadGeoData(topojson.feature(oLSOAarea[idLA], oLSOAarea[idLA]['objects'][idLA])); 
	}
	
    //addPolygonColors(oDeficiencyData[year]);
}

function featureClick(map, event, lat, lng){
    if (event.feature.getProperty('LMCTY11CD') != undefined) {
        map.setZoom(11);
        var id = event.feature.getProperty('LMCTY11CD');
        var name = event.feature.getProperty('LMCTY11NM');
        var idLA = oLookUps[event.feature.getProperty('LMCTY11CD')];
        //thisTTW = idTTW;
        map.data.forEach(function (feature) {
            map.data.remove(feature);
        });
        $.ajax("/MSOA_map/" + idLA ).done(function () {
            //oDeficiencyData[year] = oDeficiencyDataYear;
            //addPolygonColors(oDeficiencyData[year]);
        });
        loadMapColours(idLA);
        zoom(map);
    } else { 
        var id = event.feature.getProperty('LSOA11CD');
        var name = event.feature.getProperty('LSOA11NM');
        /*
        $.ajax("/sales_data/" + year + "/" + idTTW + "/" + id ).done(function (oSalesYearTTWID) {
        loadFeatureInfoBox(oSalesYearTTWID;

        })
        */
    }
}

   