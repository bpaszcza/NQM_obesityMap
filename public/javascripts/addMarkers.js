// If you're adding a number of markers, you may want to drop them on the map
// consecutively rather than all at once. This example shows how to use
// window.setTimeout() to space your markers' animation.

var schoolIMGurl = "/images/school1_24px.png";
var aPNGSchoolMarkers = [
    "/images/school1_24px_0.png",
    "/images/school1_24px_1.png",
    "/images/school1_24px_2.png",
    "/images/school1_24px_3.png",
    "/images/school1_24px_4.png",
    "/images/school1_24px_5.png",
    "/images/school1_24px_6.png",
    "/images/school1_24px.png"
]; 
/*var aLatLong = [
  {lat: 52.511, lng: 13.447},
  {lat: 52.549, lng: 13.422},
  {lat: 52.497, lng: 13.396},
  {lat: 52.517, lng: 13.394}
];*/

function selectMarkerColor(n){ //this neeeds tuuuuning!!!!
    if (isNaN(n)){return aPNGSchoolMarkers[7]};
    if(n < 0.005){return aPNGSchoolMarkers[0]};
    if(n < 0.01 && n >= 0.005){return aPNGSchoolMarkers[1]};
    if(n < 0.016 && n >= 0.01){return aPNGSchoolMarkers[2]};
    if(n < 0.025 && n >= 0.016){return aPNGSchoolMarkers[4]};
    if(n < 0.045 && n >= 0.025){return aPNGSchoolMarkers[5]};
    if(n >= 0.045){return aPNGSchoolMarkers[6]};
}

function createSchoolMarkers(idLA, map) {
    map.schoolMarkers = [];
    var aSchoolLatLong = [];
    var aSchoolID = oLookUps[idLA]["schools"];

    for (var a = 0; a < aSchoolID.length; a++ ) {
        var schID = aSchoolID[a];
        var address = {};
        address.lat = oSchoolsData[schID].coordinates.lat;
        address.lng = oSchoolsData[schID].coordinates.lng;
        address.schID = schID;

        aSchoolLatLong.push(address);
    }
    drop(map, aSchoolLatLong);
}

function createFastfoodMarkers(schID, map) {
    map.ffMarkers = [];
    var aFastfoodLatLong = [];
    var aSchoolID = oSchoolsData[schID]["nearby_fastfoods"];

    for (var a = 0; a < aSchoolID.length; a++ ) {
        var ffID = aSchoolID[a]["_id"];
        if (aSchoolID[a].geoCode.mDistance2school < 1000) {
            var address = {};
            address.lat = aSchoolID[a].geoCode.lat;
            address.lng = aSchoolID[a].geoCode.lng;
            address.ffID = ffID;

            aFastfoodLatLong.push(address);
        }
    }
    drop(map, aFastfoodLatLong);
}



function drop(map, aLatLong) {
  var schoolMarkers = [];
  for (var i = 0; i < aLatLong.length; i++) {
      if(aLatLong[i].schID){ //for schools
          var schID = aLatLong[i].schID;
           var ffIndex = oSchoolsData[schID].index.fastfoods;
            addMarkerWithTimeout(aLatLong[i], i * 15, map, ffIndex);
      } else { //for fastfoods
        var ffID = aLatLong[i].ffID;
        addMarkerWithTimeout(aLatLong[i], i * 15, map, 9999);
      }
      
  }
}

function addMarkerWithTimeout(position, timeout, map, ffIndex) {
    
    if(ffIndex == 9999){
        var schoolIMG = {
            url: "/images/fastfood.png"
        };
        var objectName = "fastfood";
        var id = position.ffID;

    } else {
       var pngURL = selectMarkerColor(ffIndex);
        var schoolIMG = {
            url: pngURL
        };
        var id = position.schID;
        var objectName = oSchoolsData[id].name;
         
    }

    window.setTimeout(function () {
        var marker = new google.maps.Marker({
            position: position,
            map: map,
            icon: schoolIMG,
            animation: google.maps.Animation.DROP,
            title: objectName,
            schID: id
        });

        if (ffIndex != 9999) {
            google.maps.event.addListener(marker, 'click', function () {
                //alert("I am marker " + marker.schID);
                displaySchoolInfo(map, marker);
            });
            map.schoolMarkers.push(marker);
        } else {
            map.ffMarkers.push(marker);
        }

    }, timeout);
}

function displaySchoolInfo(map, marker) {
    var schID = marker.schID;

    $.ajax("/marker/" + schID).done(function (res) {
        var schInfo = res;
        var infoString = '<div id="content">' +
        '<div id="siteNotice">' +
        '</div>' +
        '<h2 id="firstHeading" class="firstHeading">' + schInfo.name + '</h2>' +
        '<div id="bodyContent">' +
        '<p><b>Address: </b>' + schInfo.address.street + ', ' + schInfo.address.postcode + ', ' + schInfo.address.city +
        '<br>Number of pupils: ' + schInfo.schoolInfo.numberOfPupils +
        '<br>Percentage of Free School Meals: ' + schInfo.schoolInfo.percentageFreeSchoolMeals +
        '</p>' +
        '<p>Webiste: <a href=' + schInfo.schoolInfo.websiteURL + '>' +
        schInfo.schoolInfo.websiteURL + '</a> </p>' +
        '</div>' +
        '</div>';

        var infowindow = new google.maps.InfoWindow({
            content: infoString
        });

        infowindow.open(map, marker);
        map.setCenter(marker.getPosition());
        //console.log(marker.getPosition());
        clearffMarkers(map);
        createFastfoodMarkers(schID, map);
    });
    //show nearby fastfoods.    
}

function clearffMarkers(map) {
    if (map.ffMarkers) {

        for (var i = 0; i < map.ffMarkers.length; i++) {
            map.ffMarkers[i].setMap(null);
        }
    }
    map.ffMarkers = [];
}

