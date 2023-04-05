$(document).ready(function () {
    var warp_words = window.localStorage.getItem("warp_words");
    var pathIndex = window.localStorage.getItem("pathIndex");

    var controlPoints = splitPath(pathIndex, warp_words);

    var triggerButton = $("#btn_warpText")[0];
    var event = new CustomEvent("custom-event", {
        'detail': {
            words: warp_words,
            controlPoints: controlPoints
        }
    });
    triggerButton.dispatchEvent(event);
    
    var warpedSvg = $("#svg_container")[0];
    $("#svgViewer")[0].appendChild(warpedSvg);
    
    $("tc-range-slider").on("change", function () {
        let shower_id = "#" + $(this).attr("data-shower-id") + "";
        if ($(this).attr("data-shower-id") != "") {
            var intValue = parseInt($(this)[0].value);
            $(shower_id).text(intValue + "%")
        }
    });

    $("#spana").click(function (e) {
        $(".toolBox-theme").removeClass("active");
        $("#actionToolBox").addClass("active");
    });

    $("#setting").click(function (e) {
        $(".toolBox-theme").removeClass("active");
        $("#filterToolBox").addClass("active");
    });

    $("#color-previewer").click(function (e) {
        $(".toolBox-theme").removeClass("active");
        $("#colorToolBox").addClass("active");
    });

    $(".colorPanelTab").on("click", function (e) {
        $(".colorPanelTab").removeClass("active");
        var tab_name = $(this).text();
        $(".color-tab").removeClass("active");
        switch (tab_name) {
            case "Colors":
                $("#color_panel").addClass("active");
                break;
            case "Palettes":
                $("#palettes_container").addClass("active");
                break;
        }
        $("#tab_name").text(tab_name);
        $(this).addClass("active");
    });


});