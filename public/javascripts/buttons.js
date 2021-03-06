var oGeoMSOA = {};


var hash = 1;
//var maps = require('./maps.js');

function firstLoad(){
   // POPUP WINDOW ON ENTRANCE
   $(window).load(function(){
        $("#welcomeTitle").html("Welcome to the Schools, Fast Foods, and Child Obesity Map!")
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
        $newPanel.find(".ageDropdown").attr("id", String("obesityAge" + hash));
        $newPanel.find(".indexDropdown").attr("id", String("indexChoice" + hash));
        $newPanel.find(".panel-title").attr("id", String("panelTitle" + hash));

        

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

function loadMapColours(map, valAgeDropdown){
    var idLA = map.idLA;
    //console.log(idLA);
	loadGeoData(map, oGeoMSOA[idLA]);
    polygonColors(map, valAgeDropdown);
}

function checkDropdownStatus (mapIndex, nameOfList){
     var element = document.getElementById(String(nameOfList + mapIndex));
        
     var selectedValue = element.value;
     return selectedValue;
}

function featureClick(event, map, mapIndex){
    if (event.feature.getProperty('CTYUA11CD') != undefined) {
        //map.setZoom(11);
        var idLA = event.feature.getProperty('CTYUA11CD');
        var name = event.feature.getProperty('CTYUA11NM');
        map.idLA = idLA;
        //console.log(String("panelTitle" + mapIndex));
        document.getElementById(String("panelTitle"+mapIndex)).innerHTML = name;

        var ageSelected = checkDropdownStatus(mapIndex, "obesityAge");
        var indexSelected = checkDropdownStatus(mapIndex, "indexChoice");
        
        map.data.forEach(function (feature) {
            map.data.remove(feature);
        });

        if(!oGeoMSOA.hasOwnProperty(idLA)){
            $.ajax("/MSOA_map/" + idLA).done(function (res) {
                oGeoMSOA[idLA] = res;
                loadMapColours(map, ageSelected)
                createSchoolMarkers(map, indexSelected);
                zoom(map);
            });
        }else {
            loadMapColours(map, ageSelected);
            createSchoolMarkers(map, indexSelected);
            zoom(map);
        }
    }
}


$(function () { // BACK BUTTON
    $(document).on('click', ".backButton", function () {
        var string = this.id;
        //console.log(string);
        var index = string.substr(10);

        //console.log(index);
        //var map = mapArray[index];
        addMap(index);

        /*clearMarkers(map);
        map.data.forEach(function (feature) {
        map.data.remove(feature);
        });
        loadGeoData(map, topojson.feature(oTopoLA, oTopoLA.objects.geoLAplus));*/
        //zoom(mapArray[index]);
    });
})

$(function () { //ageDropdown
    $(document).on('change', '.ageDropdown', function () {
        var mapIndex = this.id.substr(10);
        var val = $("#obesityAge"+mapIndex).val();
        //console.log(mapIndex + "   " + val);

        polygonColors(mapArray[mapIndex], val);
        
    });
});

$(function () { //indexDropdown
    $(document).on('change', '.indexDropdown', function () {
        var mapIndex = this.id.substr(11);
        var val = $("#indexChoice"+mapIndex).val();
        
        createSchoolMarkers(mapArray[mapIndex], val)
    });
});