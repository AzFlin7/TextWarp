$(document).ready(function () {
    let words = $("#words").val();
    let styleIndex = $("#styleIndex").val();
    let msg = $("#message").val();

    if (msg != "") {
        console.error(msg);
        window.location.href = "/warp/createnew";
    }

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
   
    $("#bodyOverlay").click(function(){
        $(".toolBox-theme").removeClass("active");
        $(".warpedPath").removeClass("currentActivePath");
        window.localStorage.setItem("pathSelected", 0);
    });

    $("#svg_download").click(function () {
        $("#loader").addClass("d-flex");
        var svg = $("#svg_container")[0];
        var serializer = new XMLSerializer();
        var source = serializer.serializeToString(svg);
        if (!source.match(/^<svg[^>]+xmlns="http\:\/\/www\.w3\.org\/2000\/svg"/)) {
            source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
        }
        if (!source.match(/^<svg[^>]+"http\:\/\/www\.w3\.org\/1999\/xlink"/)) {
            source = source.replace(/^<svg/, '<svg xmlns:xlink="http://www.w3.org/1999/xlink"');
        }
        source = '<?xml version="1.0" standalone="no"?>\r\n' + source;
        var url = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(source);
        var theAnchor = $('<a />')
            .attr('href', url)
            .attr('download', "warp-text.svg")
            .appendTo('body');

        theAnchor[0].click();
        theAnchor.remove();
        $("#loader").removeClass("d-flex");
    });

    $("#btn_goto_gallery").click(function () {
        $("#svg_container").find("*").removeClass("currentActivePath");
        let mediaId = $("#svg_container").data("media-id");
        $("#svg_container")[0].removeAttribute("data-media-id");
        var svg_data = document.getElementById("svg_container").outerHTML;
        let blob = new Blob([svg_data], { type: 'image/svg+xml' });
        var formData = new FormData();
        formData.append("svgFile", blob, 'warp-text.svg');
        formData.append("words", words);
        formData.append("styleIndex", styleIndex);

        $("#loader").addClass("d-flex");
        $.ajax({
            url: "/warp/save/" + mediaId,
            type: "POST",
            data: formData,
            processData: false,
            contentType: false,
            success: function (res) {
                $("#loader").removeClass("d-flex");
                if (res.status == "failed") {
                    alert("Save failed.")
                } else {
                    window.location = "/gallery";
                }
            },
        });
    });
});