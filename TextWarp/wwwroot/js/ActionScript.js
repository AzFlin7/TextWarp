$(document).ready(function () {
    $("#save_send").click(function () {
        if (this.classList.contains("active")) {
            $(this).removeClass("active");
            this.children[1].style.rotate = "0deg";
            $("#send_actions").hide();
        }
        else {
            $(this).addClass("active");
            this.children[1].style.rotate = "180deg";
            $("#send_actions").show();
        }
    });
    $("#btn_finalize").click(function () {
        let currentSVG = getCurrentWarpSvg();
        if (currentSVG == null) {
            console.error("can't get svg element");
            return;
        }
        let cloneElt = currentSVG.clone();
        cloneElt.removeAttr("class").removeAttr("id").removeAttr("width").removeAttr("height");
        $("#div_current_svg").empty().append(cloneElt);
        $(".partial-finalize").addClass("active");
    });
    $("#btn_back_eidtor_view").click(function () {
        $(".partial-finalize").removeClass("active");
    });
    $("#btn_finalize_download").click(function () {
        let currentSVG = getCurrentWarpSvg();
        if (currentSVG == null) {
            console.error("can't get svg element");
            return;
        }
        $("#loader").show();
        var serializer = new XMLSerializer();
        var source = serializer.serializeToString(currentSVG[0]);
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
        $("#loader").hide();
    });
    function getCurrentWarpSvg() {
        let currentSlick = $(".slick-slide.slick-current.slick-center");
        let svgContainer = $("#svg_container");
        let currentSVG = null;
        if (svgContainer.length > 0)
            currentSVG = svgContainer;
        if (currentSlick.length > 0)
            currentSVG = currentSlick.find("svg");

        return currentSVG;
    }
    $("#btn_goto_tdt").click(function () {
        let currentSVG = getCurrentWarpSvg();
        let self = $(this);
        if (currentSVG == null) {
            console.error("can't get svg element");
            return;
        }

        let mediaId = currentSVG.data("media-id");
        var svg_data = currentSVG[0].outerHTML;
        let blob = new Blob([svg_data], { type: 'image/svg+xml' });
        var formData = new FormData();
        formData.append("svgFile", blob, 'warp-text.svg');
        formData.append("words", words);
        formData.append("styleIndex", styleIndex);

        $("#loader").show();
        $.ajax({
            url: "/warp/send-to-apparel/" + mediaId,
            type: "POST",
            data: formData,
            processData: false,
            contentType: false,
            success: function (res) {
                $("#loader").hide();
                if (res.status == "failed") {
                    console.error("Save failed.");
                } else {
                    window.location = self.data("href");
                }
            },
        });
    });
})