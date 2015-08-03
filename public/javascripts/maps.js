//
var mapArray = [];

function loadGeoData(map, input){
    $('.loading').show();
    map.data.addGeoJson(input)
    $('.loading').hide();
}

function initialize() {
    var mapIndex = 1;
    var map;

    var latlng = new google.maps.LatLng(52.5, -1.2);
    cacheCenter = latlng;
    var mapOptions = {
        zoom: 7,
        center: latlng,
        disableDefaultUI: true,
        zoomControl: true,
        zoomControlOptions: {
            style: google.maps.ZoomControlStyle.LARGE,
            position: google.maps.ControlPosition.TOP_RIGHT

        }
    };
    var canvasAddress = String("#mapCanvas" + mapIndex);
    map = new google.maps.Map($(canvasAddress)[0], mapOptions);
    mapArray[mapIndex] = map;

    var styledMapOptions = {map: map, name: 'county'};
    //var styledMapOptionsLocal = {map: map, name: 'local'};

    /*var sMapType = new google.maps.StyledMapType(mapStyles,styledMapOptions);
    map.mapTypes.set('county', sMapType);
    map.setMapTypeId('county');

    var sMapTypeLocal = new google.maps.StyledMapType(mapStylesLocal,styledMapOptionsLocal);
    map.mapTypes.set('local', sMapTypeLocal);

    google.maps.event.addListener(map, 'zoom_changed', function() {
        zoomChanged()
    });*/

    mapArray[mapIndex].data.addListener('click', function(event) {
        var lat = event.latLng.lat();
        var lng = event.latLng.lng();
        featureClick(event,lat, lng)
    });    
    
    loadGeoData(mapArray[mapIndex], topojson.feature(oTopoLA, oTopoLA.objects.geoLAplus));

	//map.data.setStyle(featureStyle);

    /*setYearOptions()
    addPolygonColors(oDeficiencyData[year]);
    addKeyD3()*/
}

function addMap(mapIndex) {
    var map;

    var latlng = new google.maps.LatLng(52.5, -1.2);
    cacheCenter = latlng;
    var mapOptions = {
        zoom: 7,
        center: latlng,
        disableDefaultUI: true,
        zoomControl: true,
        zoomControlOptions: {
            style: google.maps.ZoomControlStyle.LARGE,
            position: google.maps.ControlPosition.TOP_RIGHT

        }
    };
    var canvasAddress = String("#mapCanvas" + mapIndex);
    map = new google.maps.Map($(canvasAddress)[0], mapOptions);
    mapArray[mapIndex] = map;

    var styledMapOptions = {map: map, name: 'county'};

    mapArray[mapIndex].data.addListener('click', function(event) {
        var lat = event.latLng.lat();
        var lng = event.latLng.lng();
        featureClick(event,lat, lng)
    });    
    
    loadGeoData(mapArray[mapIndex], topojson.feature(oTopoLA, oTopoLA.objects.geoLAplus));
}

google.maps.event.addDomListener(window, 'load', initialize);