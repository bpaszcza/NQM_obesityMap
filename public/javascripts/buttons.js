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


   