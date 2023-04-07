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
    
    $("#spana").click(function (e) {
        $(".toolbar-icon").removeClass("active");
        $(this).addClass("active");
        $(".toolBox-theme").removeClass("active");
        $("#actionToolBox").addClass("active");
    });

    $("#setting").click(function (e) {
        $(".toolbar-icon").removeClass("active");
        $(this).addClass("active");
        $(".toolBox-theme").removeClass("active");
        $("#filterToolBox").addClass("active");
    });

    $("#color-previewer").click(function (e) {
        $(".toolbar-icon").removeClass("active");
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
                //showCurrentPalette();
                break;
            case "Palettes":
                $("#palettes_container").addClass("active");
                //showCurrentPalette();
                break;
            case "Gradients":
                $("#gradients_container").addClass("active");
                //showCurrentPalette();
                break;
        }
        $("#tab_name").text(tab_name);
        $(this).addClass("active");
    });

    $("#bodyOverlay").click(function () {
        $(".toolBox-theme").removeClass("active");
        $(".warpedPath").removeClass("currentActivePath");
        window.localStorage.setItem("pathSelected", 0);
    });

    var fabricCanvas = new fabric.Canvas('print_canvas');

    $("#svg_download").click(function () {
        var pathString = "";
        $("#svg_container>path").each(function (i, item) {
            var d = $(item).attr("d");
            pathString += d;
        });

        fabricCanvas.clear();
        var pathElt = new fabric.Path(pathString);

        var pathWidth = pathElt.width;
        var pathHeight = pathElt.height;
        fabricCanvas.setDimensions({
            width: pathWidth,
            height: pathHeight
        });

        fabricCanvas.add(pathElt);
        pathElt.center();
        fabricCanvas.renderAll();

        var theAnchor = $('<a />')
            .attr('href', fabricCanvas.toDataURL())
            .attr('download', "warp-text.png")
            .appendTo('body');

        theAnchor[0].click();
        theAnchor.remove();
    });

    $("#btn_save").click(function () {

    })
});