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
    var myDesignIds = [];
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

        $.ajax({
            url: '/warp/getLikes/',
            type: 'get',
            success: function (res) {
                if (res.status == "success" && res.msg == null) {
                    $("#likes").addClass("active");
                    for (let i = 0; i < res.like_svgs.length; i++) {
                        let tempSvg = res.like_svgs[i];
                        var svgUrl = "/uploads/" + tempSvg.svgfileName;
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
                                wrapper.children[0].setAttribute("id", tempSvg.id);
                                wrapper.children[0].classList.add("mw-100");
                                wrapper.children[0].classList.add("mh-100");
                                wrapper.appendChild(btn_close);
                            });
                    }
                }
                else {
                    console.error(res.msg);
                }
            }
        });

        $.ajax({
            url: '/warp/getDesigns/',
            type: 'get',
            success: function (res) {
                if (res.status == "success" && res.msg == null) {
                    for (let i = 0; i < res.design_svgs.length; i++) {
                        let tempSvg = res.design_svgs[i];
                        var svgUrl = "/uploads/" + tempSvg.svgfileName;
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
                                if (currentMyDesignIndex + 1 == res.design_svgs.length) {
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
                    console.error(res.msg);
                }
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
        var data_id = currentSvg.getAttribute("data-id")
        currentSvg.removeAttribute("id");
        currentSvg.removeAttribute("data-id");
        currentSvg.removeAttribute("class");
        if (favouriteIds.length == 0 || (favouriteIds.length > 0  && favouriteIds.indexOf(data_id) == -1)) {
            let blob = new Blob([currentSvg.outerHTML], { type: 'image/svg+xml' });
            var formData = new FormData();
            formData.append("svg_file", blob, 'warp-text.svg');
            formData.append("words", words);
            formData.append("styleIndex", styleIndex);
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
                        favouriteIds.push(data_id);
                        var svgUrl = "/uploads/" + res.saved_svg.svgfileName;
                        fetch(svgUrl)
                            .then(response => response.text())
                            .then(svg => {
                                wrapper.setAttribute("data-id", data_id);
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
        var valueToRemove = parentElement.getAttribute("data-id");
        favouriteIds = favouriteIds.filter(item => item !== valueToRemove);
        var like_id = parentElement.children[0].getAttribute("id");
        $("#loader").addClass("d-flex");
        $.ajax({
            url: '/warp/deleteLike/' + like_id,
            type: 'delete',
            success: function (res) {
                $("#loader").removeClass("d-flex");
                if (res.status == "success") {
                    parentElement.remove();
                }
                else {
                    console.error(res.msg);
                }
            }
        });
        if ($("#like_svgs")[0].children.length == 1) {
            $("#likes").removeClass("active");
        }
    });

    $(document).on("click", ".vcarousel-item .btn-save-design", function () {
        var currentSvg;
        var parentNode;
        if ($(".slick-slide.slick-current.slick-center")[0].children[0].children[0].children[0].tagName == "svg") {
            currentSvg = $(".slick-slide.slick-current.slick-center")[0].children[0].children[0].children[0].cloneNode(true);
            parentNode = this.parentElement.parentElement.parentElement.parentElement;
        }
        else {
            currentSvg = $(".slick-slide.slick-current.slick-center")[0].children[0].children[0].cloneNode(true);
            parentNode = this.parentElement.parentElement.parentElement;

        }
        var data_id = currentSvg.getAttribute("data-id");
        if (myDesignIds.length == 0 || (myDesignIds.length > 0 && myDesignIds.indexOf(data_id) == -1)) {
            if (parentNode.classList.contains("slick-center")) {
                currentSvg.removeAttribute("id");
                currentSvg.removeAttribute("data-id");
                currentSvg.removeAttribute("class");
                let blob = new Blob([currentSvg.outerHTML], { type: 'image/svg+xml' });
                var formData = new FormData();
                formData.append("svg_file", blob, 'warp-text.svg');
                formData.append("words", words);
                formData.append("styleIndex", styleIndex);
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
                            if (data_id != null) {
                                myDesignIds.push(data_id);
                            }
                            var svgUrl = "/uploads/" + res.saved_Design.svgfileName;
                            fetch(svgUrl)
                                .then(response => response.text())
                                .then(svg => {
                                    currentMyDesignIndex++;
                                    var wrapper;
                                    wrapper = document.createElement("div");
                                    wrapper.classList.add("design-item");
                                    wrapper.setAttribute("data-id", data_id);
                                    wrapper.innerHTML = svg;
                                    wrapper.children[0].setAttribute("id", res.saved_Design.id);
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
        }
    });

    $(document).on("click", "#slick-prev", function () {
        $(".myDesign_svgs").slick("slickPrev");
    });

    $(document).on("click", "#slick-next", function () {
        $(".myDesign_svgs").slick("slickNext");
    });

    $(document).on("click", ".design-item>svg", function () {
        let currentId, currentDataId;
        let tempCenterElement = $(".slick-slide.slick-current.slick-center")[0];
        if (tempCenterElement.children[0].tagName == "svg") {
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
        tempNode.children[0].setAttribute("data-id", currentDataId);
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
        let currentDesignId;
        let slick_id = $(".myDesign_svgs").slick("slickCurrentSlide");
        let designDataId;
        if ($(".slick-slide.slick-current.slick-active")[0].children[0].tagName == "svg") {
            currentDesignId = $(".slick-slide.slick-current.slick-active")[0].children[0].getAttribute("id");
            designDataId = $(".slick-slide.slick-current.slick-active")[0].getAttribute("data-id");
        }
        else {
            currentDesignId = $(".slick-slide.slick-current.slick-active")[0].children[0].children[0].children[0].getAttribute("id");
            designDataId = $(".slick-slide.slick-current.slick-active")[0].children[0].children[0].getAttribute("data-id");
        }
        
        myDesignIds = myDesignIds.filter(item => item !== designDataId);
        $("#loader").addClass("d-flex");
        $.ajax({
            url: '/warp/deleteDesign/' + currentDesignId,
            type: 'delete',
            success: function (res) {
                $("#loader").removeClass("d-flex");
                if (res.status == "success" && res.msg == null) {
                    currentMyDesignIndex--;
                    $(".myDesign_svgs").slick("slickRemove", slick_id);
                }
                else {
                    console.error(res.msg);
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
            }
        });
    });
})