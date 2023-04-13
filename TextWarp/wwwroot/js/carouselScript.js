$(document).ready(function () {
    var svgFilePath = $("#svg_filePath").attr("data-filePath");
    var svg_id = $("#svg_id").attr("data-id");
    
    var words = $("#words").attr("data-words");
    var styleIndex = $("#styleIndex").attr("data-styleIndex");
    
    var triggerButton = $("#btn_warpText")[0];
    var warpEndHandler = $("#btn_warpEndHandler")[0];
    var controlPoints_pair = [];
    var currentWarpIndex = -1;
    var i1 = 0;
    var favouriteIds = [];      //not real ID

    warpEndHandler.addEventListener("warpEnded", (e) => {
        currentWarpIndex++;
        if (currentWarpIndex < 2) {
            newWarp(e);
        }
    });

    function newWarp(e = null) {
        var warpedSvg = $("#svg_container")[0].cloneNode(true);
        warpedSvg.setAttribute("data-id", currentWarpIndex);
        var id = "warpedSvg" + currentWarpIndex;
        warpedSvg.setAttribute("id", id);
        warpedSvg.removeAttribute("style");
        warpedSvg.classList.add("mw-100");
        warpedSvg.classList.add("mh-100");

        if (currentWarpIndex < 2) {
            var newVcarouselItem = $(".vcarousel-item")[currentWarpIndex];
            newVcarouselItem.appendChild(warpedSvg);
        }
        else {
            var newVcarouselItem = document.createElement("div");
            newVcarouselItem.classList.add("vcarousel-item");
            newVcarouselItem.style.width = "100%";
            newVcarouselItem.appendChild(warpedSvg);
            var wrapper = document.createElement("div");
            wrapper.appendChild(newVcarouselItem);
            $(".vcarousel").slick("slickAdd", wrapper);
            if ($(".slick-track")[0].children.length > 3) {
                //$(".vcarousel").slick("slickRemove", 0);
            }
        }
        
        var controlPoints = controlPoints_pair[currentWarpIndex];

        var event = new CustomEvent("custom-event", {
            'detail': {
                words: words,
                controlPoints: controlPoints,
                container_id: id
            }
        });
        triggerButton.dispatchEvent(event);
    }

    function initial() {
        for (var i = 0; i < 100; i++) {
            var controlPoints = splitPath(styleIndex, words);
            controlPoints_pair.push(controlPoints);
        }
        currentWarpIndex = 0;
        newWarp();
    }

    initial();

    $(".vcarousel").slick({
        vertical: true,
        centerMode: true,
        arrows: true,
        centerPadding: '210px',
        touchMove: true,
        prevArrow: $("#up"),
        nextArrow: $("#down"),
        infinite: false,
    });

    $("#down").click(function () {
        currentWarpIndex++;
        newWarp();
    });

    $("#edit").click(function () {
        var controlPointsIndex;
        if ($(".slick-slide.slick-current.slick-center")[0].children[0].children[0].children[0].tagName == "svg") {
            controlPointsIndex = $(".slick-slide.slick-current.slick-center")[0].children[0].children[0].children[0].getAttribute("data-id");
        }
        else {
            controlPointsIndex = $(".slick-slide.slick-current.slick-center")[0].children[0].children[0].getAttribute("data-id");
        }
        var currentControlPoints = controlPoints_pair[controlPointsIndex];
        var controlPointString = JSON.stringify(currentControlPoints);
        window.localStorage.setItem("controlPoints", controlPointString);
        window.location.href = "/warpeditor/editor?id=" + svg_id;
    });

    $("#addFavourite").click(function () {
        
        var wraper = document.createElement("div");
        wraper.style.width = "100px";
        wraper.style.height = "100px";
        wraper.style.display = "flex";
        wraper.style.alignItems = "center";
        wraper.style.justifyContent = "center";
        var currentSvg 
        if ($(".slick-slide.slick-current.slick-center")[0].children[0].children[0].children[0].tagName == "svg") {
            currentSvg = $(".slick-slide.slick-current.slick-center")[0].children[0].children[0].children[0].cloneNode(true);
        }
        else {
            currentSvg = $(".slick-slide.slick-current.slick-center")[0].children[0].children[0].cloneNode(true);
        }
        var data_id = currentSvg.getAttribute("data-id")
        if (favouriteIds.length > 0) {
            if (favouriteIds.indexOf(data_id) == -1) {
                currentSvg.classList.add("mx-100");
                currentSvg.classList.add("mh-100");
                wraper.appendChild(currentSvg);
                $("#favourites")[0].appendChild(wraper);
                favouriteIds.push(data_id);
                return;
            }
            return;
        }
        else {
            currentSvg.classList.add("mx-100");
            currentSvg.classList.add("mh-100");
            wraper.appendChild(currentSvg);
            $("#favourites")[0].appendChild(wraper);
            favouriteIds.push(data_id);
            return;
        }
    });
})