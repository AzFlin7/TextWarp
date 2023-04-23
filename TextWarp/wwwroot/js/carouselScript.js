$(document).ready(function () {
    var svg_id = $("#svg_id").attr("data-id");
    
    var words = $("#words").attr("data-words");
    var styleIndex = $("#styleIndex").attr("data-styleIndex");
    
    var triggerButton = $("#btn_warpText")[0];
    var warpEndHandler = $("#btn_warpEndHandler")[0];
    var controlPoints_pair = [];
    var initialColorPair = [
        ["#be816c", "#c88087"],
        ["#41badf", "#375152"]
    ];
    var colorPair = [];
    var currentColorIndex = -1;
    var currentWarpIndex = -1;
    var currentSlideIndex = -1;
    var favouriteIds = [];      //not real ID

    warpEndHandler.addEventListener("warpEnded", () => {
        if (currentWarpIndex < 2) {
            currentWarpIndex++;
            currentColorIndex++;
            newWarp();
        }
        else {
            currentSlideIndex = $('.vcarousel').slick('slickCurrentSlide');
            if (currentWarpIndex > 2) {
                $(".vcarousel").slick("slickNext");
            }
            if (currentSlideIndex > 0) {
                $("#up").removeClass("d-none");
                $("#up").addClass("d-flex");
            }
            else {
                $("#up").removeClass("d-flex");
                $("#up").addClass("d-none");
            }
            $("#loader").removeClass("d-flex");
            $("#loader").addClass("d-none");
        }
    });

    function newWarp() {
        var warpedSvg = $("#svg_container")[0].cloneNode(true);
        warpedSvg.setAttribute("data-id", currentWarpIndex);
        var id = "warpedSvg" + currentWarpIndex;
        warpedSvg.setAttribute("id", id);
        warpedSvg.removeAttribute("style");
        warpedSvg.classList.add("mw-100");
        warpedSvg.classList.add("mh-100");
        let colors = [];

        if (currentWarpIndex < 2) {
            var newVcarouselItem = $(".vcarousel-item")[currentWarpIndex];
            colors = initialColorPair[currentColorIndex];
            newVcarouselItem.appendChild(warpedSvg);
        }
        else {
            colors = colorPair[currentColorIndex];
            var newVcarouselItem = document.createElement("div");
            newVcarouselItem.classList.add("vcarousel-item");
            newVcarouselItem.style.width = "100%";
            newVcarouselItem.appendChild(warpedSvg);
            var wrapper = document.createElement("div");
            wrapper.appendChild(newVcarouselItem);
            $(".vcarousel").slick("slickAdd", wrapper);
        }
        var controlPoints;
        if (currentWarpIndex > controlPoints_pair.length - 20) {
            for (var i = 0; i < 30; i++) {
                var temp_controlPoints = splitPath(styleIndex, words);
                controlPoints_pair.push(temp_controlPoints);
            }
        }
        if (currentColorIndex > colorPair.length - 20) {
            $.ajax({
                url: '/Warp/getColors/' + 30,
                type: 'get',
                success: function (res, data) {
                    let tempColors = res.colors.map((item) => {
                        return [item.color1, item.color2];
                    });
                    colorPair.push(...tempColors);
                },
                failure: function (res, data) {
                    alert(res.message);
                }
            });
        }
        controlPoints = controlPoints_pair[currentWarpIndex];
        var event = new CustomEvent("custom-event", {
            'detail': {
                words: words,
                controlPoints: controlPoints,
                container_id: id,
                colors: colors
            }
        });
        triggerButton.dispatchEvent(event);
    }

    function initial() {
        controlPoints_pair = [];
        colorPair = [];
        $("#loader").removeClass("d-none");
        $("#loader").addClass("d-flex");
        for (var i = 0; i < 100; i++) {
            var controlPoints = splitPath(styleIndex, words);
            controlPoints_pair.push(controlPoints);
        }

        $.ajax({
            url: '/Warp/getColors/'+ 100,
            type: 'get',
            success: function (res, data) {
                colorPair = res.colors.map((item) => {
                    return [item.color1, item.color2];
                });
            },
            failure: function (res, data) {
                alert(res.message);
            }
        });
        currentWarpIndex = 0;
        currentColorIndex = 0;

        $("#up").removeClass("d-flex");
        $("#up").addClass("d-none");
        newWarp();
    }

    initial();

    $(".vcarousel").slick({
        vertical: true,
        centerMode: true,
        arrows: false,
        centerPadding: '210px',
        touchMove: true,
        infinite: false,
        draggable: false,
    });

    $("#up").click(function () {
        currentSlideIndex = $('.vcarousel').slick('slickCurrentSlide');
        if (currentSlideIndex == 1) {
            $("#up").removeClass("d-flex");
            $("#up").addClass("d-none");
        }
        $(".vcarousel").slick("slickPrev");
    });

    $("#down").click(function () {
        currentSlideIndex = $('.vcarousel').slick('slickCurrentSlide');
        if (currentSlideIndex + 2 > currentWarpIndex) {
            currentWarpIndex++;
            currentColorIndex++;
            $("#loader").removeClass("d-none");
            $("#loader").addClass("d-flex");
            newWarp();
        }
        else {
            $(".vcarousel").slick("slickNext");
        }
        if (currentSlideIndex == 0) {
            $("#up").removeClass("d-none");
            $("#up").addClass("d-flex");
        }
    });

    $("#edit").click(function () {
        var selectedSvg = "";
        if ($(".slick-slide.slick-current.slick-center")[0].children[0].children[0].children[0].tagName == "svg") {
            selectedSvg = $(".slick-slide.slick-current.slick-center")[0].children[0].children[0].children[0].outerHTML;
        }
        else {
            selectedSvg = $(".slick-slide.slick-current.slick-center")[0].children[0].children[0].outerHTML;
        }
        window.localStorage.setItem("selectedSvg", selectedSvg);
        window.location.href = "/warp/editor?id=" + svg_id;
    });

    $("#editInfo").click(function () {
        window.location.href = "/warp/createnew/";
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

    $("#favourites").on("click", "svg", function () {
        let currentId = $(".slick-current")[0].children[0].children[0].getAttribute("id");
        let tempNode = document.createElement("div");
        tempNode.classList.add("vcarousel-item");
        tempNode.style.width = "100%";
        tempNode.setAttribute("id", currentId);
        tempNode.innerHTML = this.outerHTML;
        $(".slick-current")[0].innerHTML = "";
        $(".slick-current")[0].append(tempNode);
    })
})