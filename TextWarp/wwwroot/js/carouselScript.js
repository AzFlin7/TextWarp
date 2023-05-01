$(document).ready(function () {
    var words = $("#words").val();
    var styleIndex = $("#styleIndex").val();
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
    var likeMediaIds = [];      //not real ID
    var myDesignMediaIds = [];
    var currentMyDesignIndex = -1;

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
            }
            else {
                $("#up").addClass("d-none");
            }
            $("#loader").removeClass("d-flex");
        }
    });

    function newWarp() {
        var warpedSvg = $("#svg_container")[0].cloneNode(true);
        warpedSvg.setAttribute("data-id", currentWarpIndex);
        warpedSvg.setAttribute("data-media-id", mediaIdGenerator("WARP"));

        var id = "warpedSvg" + currentWarpIndex;
        warpedSvg.setAttribute("id", id);
        warpedSvg.removeAttribute("style");
        warpedSvg.classList.add("mw-100");
        warpedSvg.classList.add("mh-100");
        let colors = [];
        var btn_save_wrapper = document.createElement("div");
        btn_save_wrapper.classList.add("btn-save-wrapper");
        var btn_save_design = document.createElement("div");
        btn_save_design.classList.add("btn-save-design");
        
        btn_save_design.innerHTML = "Save this design";
        btn_save_wrapper.append(btn_save_design);

        if (currentWarpIndex < 2) {
            var newVcarouselItem = $(".vcarousel-item")[currentWarpIndex];
            colors = initialColorPair[currentColorIndex];
            newVcarouselItem.appendChild(warpedSvg);
            newVcarouselItem.append(btn_save_wrapper);
        }
        else {
            colors = colorPair[currentColorIndex];
            var newVcarouselItem = document.createElement("div");
            newVcarouselItem.classList.add("vcarousel-item");
            newVcarouselItem.style.width = "100%";
            newVcarouselItem.appendChild(warpedSvg);
            newVcarouselItem.append(btn_save_wrapper);
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
        $("#loader").addClass("d-flex");
        for (var i = 0; i < 100; i++) {
            var controlPoints = splitPath(styleIndex, words);
            controlPoints_pair.push(controlPoints);
        }

        $.get('/Warp/getColors/' + 100, function (data, status) {
            if (status == "succss") {
                colorPair = data.colors.map((item) => {
                    return [item.color1, item.color2];
                });
            }
        });

        $.get('/warp/getLikes/', function (data, status) {
            if (status == "success" && data.msg == "") {
                $("#likes").addClass("active");
                for (let i = 0; i < data.like_svgs.length; i++) {
                    let tempSvg = data.like_svgs[i];
                    var svgUrl = "/uploads/" + tempSvg.svgfileName;
                    likeMediaIds.push(tempSvg.mediaId);
                    fetch(svgUrl)
                        .then(response => response.text())
                        .then(svg => {
                            var wrapper = document.createElement("div");
                            wrapper.classList.add("like-item");
                            var btn_close = document.createElement("div");
                            var times_svg = '<svg class="svg-inline--fa fa-xmark" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="xmark" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" data-fa-i2svg=""><path fill="#fff" d="M310.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L160 210.7 54.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L114.7 256 9.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L160 301.3 265.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L205.3 256 310.6 150.6z"></path></svg>'
                            btn_close.classList.add("delete-like");
                            btn_close.innerHTML = times_svg;
                            wrapper.innerHTML = svg;
                            $("#like_svgs")[0].appendChild(wrapper);
                            wrapper.children[0].setAttribute("media", tempSvg.id);
                            wrapper.children[0].classList.add("mw-100");
                            wrapper.children[0].classList.add("mh-100");
                            wrapper.appendChild(btn_close);
                        });
                }
            }
            else {
                console.error(data.msg);
            }
        });

        $.get('/warp/getDesigns/', function (data, status) {
        if (status == "success" && data.msg == "") {
            for (let i = 0; i < data.design_svgs.length; i++) {
                let tempSvg = data.design_svgs[i];
                var svgUrl = "/uploads/" + tempSvg.svgfileName;
                myDesignMediaIds.push(tempSvg.mediaId);
                    fetch(svgUrl)
                        .then(response => response.text())
                        .then(svg => {
                            currentMyDesignIndex++;
                            var wrapper = document.createElement("div");
                            wrapper.classList.add("design-item");
                            wrapper.innerHTML = svg;
                            $(".myDesign_svgs")[0].appendChild(wrapper);
                            wrapper.children[0].setAttribute("id", tempSvg.id);
                            wrapper.children[0].classList.add("mw-100");
                            wrapper.children[0].classList.add("mh-100");
                            if (currentMyDesignIndex + 1 == data.design_svgs.length) {
                                $(".myDesign_svgs").slick({
                                    slidesToShow: 1,
                                    arrows: false,
                                    infinite: true
                                });
                                $(".delete-design").addClass("d-flex");
                                if (currentMyDesignIndex > 0) {
                                    $("#slick-prev").addClass("d-flex");
                                    $("#slick-next").addClass("d-flex");
                                }
                                $("#myDesign").addClass("active");
                            }
                        })
                }
            }
            else {
                console.error(data.msg);
            }
        });
        
        currentWarpIndex = 0;
        currentColorIndex = 0;

        $("#up").addClass("d-none");
        newWarp();
    }

    initial();

    $(".vcarousel").slick({
        vertical: true,
        centerMode: true,
        arrows: false,
        touchMove: true,
        infinite: false,
        draggable: false,
        slidesToShow: 1,
        centerMode: true,
        centerPadding: '0px',
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
        let svgElt = $(".slick-slide.slick-current.slick-center").find(".vcarousel-item>svg");
        if (svgElt.length > 0) {
            let mediaId = svgElt.data("media-id");
            let selectedSvg = svgElt[0].outerHTML;
            window.localStorage.setItem("selectedSvg", selectedSvg);
            window.location.href = "/warp/editor?mediaId=" + mediaId + "&words=" + words + "&style=" + styleIndex;
        }
    });

    $("#addFavourite").click(function () {
        var wrapper = document.createElement("div");
        wrapper.classList.add("like-item");

        var btn_close = document.createElement("div");
        var times_svg = '<svg class="svg-inline--fa fa-xmark" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="xmark" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" data-fa-i2svg=""><path fill="#fff" d="M310.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L160 210.7 54.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L114.7 256 9.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L160 301.3 265.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L205.3 256 310.6 150.6z"></path></svg>'
        btn_close.classList.add("delete-like");
        btn_close.innerHTML = times_svg;

        var currentSvg 
        if ($(".slick-slide.slick-current.slick-center")[0].children[0].children[0].children[0].tagName == "svg") {
            currentSvg = $(".slick-slide.slick-current.slick-center")[0].children[0].children[0].children[0].cloneNode(true);
        }
        else {
            currentSvg = $(".slick-slide.slick-current.slick-center")[0].children[0].children[0].cloneNode(true);
        }
        var data_id = currentSvg.getAttribute("data-id");
        var mediaId = currentSvg.getAttribute("data-media-id");

        currentSvg.removeAttribute("id");
        currentSvg.removeAttribute("data-id");
        currentSvg.removeAttribute("class");
        if (likeMediaIds.indexOf(mediaId) == -1) {
            let blob = new Blob([currentSvg.outerHTML], { type: 'image/svg+xml' });
            var formData = new FormData();
            formData.append("svg_file", blob, 'warp-text.svg');
            formData.append("words", words);
            formData.append("styleIndex", styleIndex);
            formData.append("mediaId", mediaId);
            
            $("#loader").addClass("d-flex");
            $.ajax({
                url: "/warp/saveLike/",
                type: "POST",
                data: formData,
                processData: false,
                contentType: false,
                success: function (res) {
                    $("#loader").removeClass("d-flex");
                    if (res.status == "success") {
                        likeMediaIds.push(mediaId);
                        var svgUrl = "/uploads/" + res.saved_svg.svgfileName;
                        fetch(svgUrl)
                            .then(response => response.text())
                            .then(svg => {
                                wrapper.setAttribute("data-id", data_id);
                                wrapper.setAttribute("data-media-id", mediaId);
                                
                                wrapper.innerHTML = svg;
                                $("#like_svgs")[0].appendChild(wrapper);
                                wrapper.children[0].setAttribute("id", res.saved_svg.id);
                                wrapper.children[0].classList.add("mw-100");
                                wrapper.children[0].classList.add("mh-100");
                                wrapper.appendChild(btn_close);
                                $("#likes").addClass("active");
                            });
                    }
                    else {
                        console.error(res.msg);
                    }
                },
            });
        }
    });

    $("#like_svgs").on("click", ".like-item>svg", function () {
        let currentId, currentDataId;
        let tempCenterElement = $(".slick-slide.slick-current.slick-center")[0];
        if (tempCenterElement.children[0].children[0].tagName == "svg") {
            currentId = tempCenterElement.children[0].children[0].getAttribute("id");
            currentDataId = tempCenterElement.children[0].children[0].getAttribute("data-id");
        }
        else {
            currentId = tempCenterElement.children[0].children[0].children[0].getAttribute("id");
            currentDataId = tempCenterElement.children[0].children[0].children[0].getAttribute("data-id");
        }
        let tempNode = document.createElement("div");
        tempNode.classList.add("vcarousel-item");
        tempNode.style.width = "100%";
        tempNode.innerHTML = this.outerHTML;
        tempNode.children[0].setAttribute("id", currentId);
        var btn_save_wrapper = document.createElement("div");
        btn_save_wrapper.classList.add("btn-save-wrapper");
        var btn_save_design = document.createElement("div");
        btn_save_design.classList.add("btn-save-design");

        btn_save_design.innerHTML = "Save this design";
        btn_save_wrapper.append(btn_save_design);
        tempNode.append(btn_save_wrapper);
        tempCenterElement.innerHTML = "";
        tempCenterElement.append(tempNode);
    })

    $("#like_svgs").on("click", ".like-item>.delete-like", function () {
        var parentElement = this.parentElement;
        var mediaId = $(parentElement).find("svg").data("media-id");
        likeMediaIds = likeMediaIds.filter(item => item !== mediaId);
        $("#loader").addClass("d-flex");
        $.get('/warp/deleteLike/' + mediaId, function (data, status) {
            $("#loader").removeClass("d-flex");
            if (status == "success") {
                parentElement.remove();
            }
            else {
                console.error(data.msg);
            }
        });
        if ($("#like_svgs")[0].children.length == 1) {
            $("#likes").removeClass("active");
        }
    });

    $(document).on("click", ".vcarousel-item .btn-save-design", function () {
        var currentSvg;
        var parentNode;
        
        parentNode = $(this).closest(".slick-slide.slick-current")
        currentSvg = parentNode.find("svg")[0].cloneNode(true);
        parentNode = parentNode[0].cloneNode(true);

        let mediaId = currentSvg.getAttribute("data-media-id");

        if (myDesignMediaIds.indexOf(mediaId) == -1) {
            currentSvg.removeAttribute("class");
            let blob = new Blob([currentSvg.outerHTML], { type: 'image/svg+xml' });
            var formData = new FormData();
            formData.append("svg_file", blob, 'warp-text.svg');
            formData.append("words", words);
            formData.append("styleIndex", styleIndex);
            formData.append("mediaId", mediaId);

            $("#loader").addClass("d-flex");
            $.ajax({
                url: "/warp/saveDesign/",
                type: "POST",
                data: formData,
                processData: false,
                contentType: false,
                success: function (res) {
                    $("#loader").removeClass("d-flex");
                    if (res.status == "success") {
                        myDesignMediaIds.push(mediaId);

                        var svgUrl = "/uploads/" + res.saved_Design.svgfileName;
                        fetch(svgUrl)
                            .then(response => response.text())
                            .then(svg => {
                                currentMyDesignIndex++;
                                var wrapper;
                                wrapper = document.createElement("div");
                                wrapper.classList.add("design-item");
                                wrapper.setAttribute("data-media-id", mediaId);
                                wrapper.innerHTML = svg;
                                wrapper.children[0].classList.add("mw-100");
                                wrapper.children[0].classList.add("mh-100");
                                if (currentMyDesignIndex == 0) {
                                    $(".myDesign_svgs")[0].append(wrapper);
                                    $(".myDesign_svgs").slick({
                                        slidesToShow: 1,
                                        arrows: false,
                                        infinite: true
                                    });
                                    $("#myDesign").addClass("active");
                                    $(".delete-design").addClass("d-flex");
                                }
                                else {
                                    $(".myDesign_svgs").slick("slickAdd", wrapper);
                                    $(".btn-slick-cnt").addClass("d-flex");
                                    $(".myDesign_svgs").slick("slickGoTo", currentMyDesignIndex);
                                }
                            });
                    }
                    else {
                        console.error(res.msg);
                    }
                },
            });
        }
    });

    $(document).on("click", "#slick-prev", function () {
        $(".myDesign_svgs").slick("slickPrev");
    });

    $(document).on("click", "#slick-next", function () {
        $(".myDesign_svgs").slick("slickNext");
    });

    $(document).on("click", ".design-item>svg", function () {
        let tempCenterElement = $(".slick-slide.slick-current.slick-center").find(".vcarousel-item");
        let mediaId = $(this).data("media-id");
        let tempNode = document.createElement("div");
        tempNode.classList.add("vcarousel-item");
        tempNode.style.width = "100%";
        tempNode.innerHTML = this.outerHTML;
        tempNode.children[0].setAttribute("data-media-id", mediaId);
        var btn_save_wrapper = document.createElement("div");
        btn_save_wrapper.classList.add("btn-save-wrapper");
        var btn_save_design = document.createElement("div");
        btn_save_design.classList.add("btn-save-design");
        btn_save_design.innerHTML = "Save this design";
        btn_save_wrapper.append(btn_save_design);
        tempNode.append(btn_save_wrapper);
        tempCenterElement.innerHTML = "";
        tempCenterElement.append(tempNode);
    });

    $(document).on("click", ".myDesign-container>.delete-design", function () {
        let slick_id = $(".myDesign_svgs").slick("slickCurrentSlide");
        let currentSVG = $(".slick-slide.slick-current.slick-active").find("svg");
        let mediaId = currentSVG.data("media-id");

        myDesignMediaIds = myDesignMediaIds.filter(item => item !== mediaId);
        $("#loader").addClass("d-flex");
        $.get('/warp/deleteDesign?mediaId=' + mediaId, function (data, status) {
            $("#loader").removeClass("d-flex");
            if (status == "success" && data.msg != null) {
                currentMyDesignIndex--;
                $(".myDesign_svgs").slick("slickRemove", slick_id);
            }
            else {
                console.error(data.msg);
            }
            if (currentMyDesignIndex == 0) {
                $(".btn-slick-cnt").removeClass("d-flex");
            }
            if (currentMyDesignIndex < 0) {
                $(".myDesign_svgs")[0].innerHTML = "";
                $(".myDesign_svgs").removeClass("slick-initialized");
                $(".myDesign_svgs").removeClass("slick-slider");
                $("#myDesign").removeClass("active");
            }
        });
    });

    $("#save_send").click(function () {
        var currentSVG = $(".slick-slide.slick-current.slick-center").find(".vcarousel-item>svg");
        let mediaId = currentSVG.data("media-id");
        var svg_data = currentSVG[0].outerHTML;
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
                    console.error("Save failed.");
                }
            },
        });
    });
})