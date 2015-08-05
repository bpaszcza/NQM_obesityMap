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

function featureClick(event, lat, lng){
    if (event.feature.getProperty('TTWA07CD') != undefined) {
        map.setZoom(11);
        map.setCenter(new google.maps.LatLng(lat, lng));
        var id = event.feature.getProperty('TTWA07CD');
        var name = event.feature.getProperty('TTWA07NM');
        var idTTW = oLookUps[event.feature.getProperty('TTWA07CD')];
        thisTTW = idTTW;
        map.data.forEach(function (feature) {
            map.data.remove(feature);
        });
        $.ajax("/LSOA_Sales_map/" + idTTW ).done(function (oDeficiencyDataYear) {
            oDeficiencyData[year] = oDeficiencyDataYear;
            addPolygonColors(oDeficiencyData[year]);
        });
        loadMapColours(idTTW);
    } else { 
        var id = event.feature.getProperty('LSOA11CD');
        var name = event.feature.getProperty('LSOA11NM');
        $("#featureTitle").html(" Housing Sales Price Distribution " + name)
        $(".modal-header").attr("id", id)
        $("#featureIdTitle").html(" This histogram shows the house sales in " + name + " in "+year+". The average for the larger area of " + oTTWName[oLookUps[thisTTW]] + " was £" + d3.format(",")(oAverages['sales'][year][oLookUps[thisTTW]]) + " and the National average house price was " + d3.format(",")(oAverages['sales'][year]['nationalAverage']))
        idTTW = thisTTW;
        $.ajax("/sales_data/" + year + "/" + idTTW + "/" + id ).done(function (oSalesYearTTWID) {
        loadFeatureInfoBox(oSalesYearTTWID);
        })
    }
}

   