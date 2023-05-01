$(document).ready(function () {
    var availableNames = [];
    $("#loader").addClass("d-flex");

    function searchDesigns(name) {
        $("#loader").addClass("d-flex");
        $.get("/gallery/getData?name=" + name, function (data, status) {
            if (status == "success" && data.msg == "") {
                drawContent(data.saved_svgs);
                $('#search_input').autocomplete({
                    lookup: availableNames,
                });
            }
            else {
                console.error(data.msg);
            }
            $("#loader").removeClass("d-flex");
        });
    }

    function init() {
        searchDesigns('');
    }

    function drawContent(contentData) {
        var container = $(".gallery-content")[0];
        for (let i = 0; i < contentData.length; i++) {
            var svg = contentData[i];
            availableNames.push(svg.workName);
            var newDoc = $(`<div class="gallery-item">
                        <input type="hidden" data-mediaid="`+ svg.mediaId + `" />
                        <input type="hidden" data-words="`+ svg.words + `" />
                        <input type="hidden" data-styleindex="`+ svg.styleIndex + `" />
                        <div class="gallery-item-img d-flex align-items-center justify-content-center" style="position:relative;">
                        <div class="gallery-item-overlay"></div>
                        <div class="active check_container">
                            <div class="check-icon-container">
                                <div class="check-icon"></div>
                                <i class="fa-solid fa-check" style="color: #fff;font-weight:900;z-index: 101;"></i>
                            </div>
                        </div>
                        <img src="/uploads/`+ svg.svgfileName + "?v=" + svg.version + `" style="max-width: 100%; max-height:100%; ">
                        </div>
                            <div class="d-flex flex-column align-items-center justify-content-center">
                                <div class="editable-object" data-workName="`+ svg.workName + `" style="color:#dad8dd;font-size: 14px;margin-top: 8px;">` + svg.workName + `</div >
                                <div style="color:#dad8dd;font-size: 14px;">`+ svg.createdAt + `</div>
                            </div>
                        </div>`);
            container.appendChild(newDoc[0]);
        }
    }

    $(document).on("click", ".gallery-content", function (e) {
        e.stopPropagation();
        if ($("#select_sub_menu")[0].classList.contains("d-flex")) {
            $("#select_sub_menu").removeClass("d-flex");
            $(".gallery-item-overlay").removeClass("active");
            $(".check_container").removeClass('active');
        }
    });

    $(document).on("click", ".gallery-content .gallery-item-img", function (e) {
        e.stopPropagation();
        var mediaId = $(this).siblings().eq(0).data("mediaid");
        var words = $(this).siblings().eq(1).data("words");
        var styleIndex = $(this).siblings().eq(2).data("styleindex");
        window.location.href = "/warp/editor?mediaId=" + mediaId + "&words=" + words + "&style=" + styleIndex;
    })

    $(document).on("click", ".check_container", function (e) {
        e.stopPropagation();
        for (const check of $(".check_container")) {
            check.children[0].classList.remove("active");
        }
        if (this.children[0].classList.contains("active")) {
            this.children[0].classList.remove("active");
        }
        else {
            this.children[0].classList.add("active");
        }
    });

    $(document).on("click", ".gallery-item-overlay", function (e) {
        e.stopPropagation();
        for (const check of $(".check_container")) {
            check.children[0].classList.remove("active");
        }
        if ($(this).siblings(0).children(0).hasClass("active")) {
            $(this).siblings(0).children(0).removeClass("active");
        }
        else {
            $(this).siblings(0).children(0).addClass("active");
        }
    });

    window.addEventListener("change_workname", (e) => {
        $.ajax({
            url: "/gallery/rename",
            type: "POST",
            data: {
                id: e.detail.id,
                name: e.detail.name
            },
            dataType: "json",
            success: function (res) {
                if (res.status == "success") {
                    $("[data-id='" + e.detail.id + "']").parent().find("[data-workName]")[0].innerHTML = e.detail.name;
                    $("[data-id='" + e.detail.id + "']").parent().find("[data-workName]")[0].setAttribute("data-workName", e.detail.name);
                }
                else {
                    let alertMsg = "This name is already exist.";
                    let workNameNode = $("[data-id='" + e.detail.id + "']").parent().find("[data-workName]")[0];
                    workNameNode.innerHTML = workNameNode.getAttribute("data-workName");
                    $("#msgWrapper").text(alertMsg);
                    $("#msgWrapper")[0].style.visibility = "visible";
                    setTimeout(() => {
                        $("#msgWrapper")[0].style.visibility = "hidden";
                    }, 2000);
                }
            }
        });
    });
    
    $("#btn_select").click(function () {
        $("#select_sub_menu").addClass("d-flex");
        $(".gallery-item-overlay").addClass("active");
        $(".check_container").addClass('active');
    });

    $("#act_duplicate").click(function () {
        var selected_svg;
        var mediaId = -1;
        for (const saved_svg of $(".check_container")) {
            if (saved_svg.children[0].classList.contains("active")) {
                selected_svg = saved_svg.parentElement.parentElement.children[0];
                mediaId = selected_svg.getAttribute("data-mediaid");
            }
        }
        if (mediaId != -1) {
            $("#loader").addClass("d-flex");
            $.get("/gallery/duplicate?mediaId=" + mediaId, function (data, status) {
                if (status == "success") {
                    var copied_svg = data.copiedSvg;
                    var bodyNode = selected_svg.parentElement;
                    var newDoc = $(`<div class="gallery-item">
                        <input type="hidden" data-mediaid="`+ copied_svg.mediaId + `" />
                        <input type="hidden" data-words="`+ copied_svg.words + `" />
                        <input type="hidden" data-styleindex="`+ copied_svg.styleIndex + `" />
                        <div class="gallery-item-img d-flex align-items-center justify-content-center" style="position:relative;">
                        <div class="gallery-item-overlay active"></div>
                        <div class="active check_container">
                            <div class="check-icon-container">
                                <div class="check-icon"></div>
                                <i class="fa-solid fa-check" style="color: #fff;font-weight:900;z-index: 101;"></i>
                            </div>
                        </div>
                        <img src="/uploads/`+ copied_svg.svgfileName + "?v=" + copied_svg.version + `" style="max-width: 100%; max-height:100%; ">
                        </div>
                            <div class="d-flex flex-column align-items-center justify-content-center">
                                <div class="editable-object" data-workName="`+ copied_svg.workName + `" style="color:#dad8dd;font-size: 14px;margin-top: 8px;">` + copied_svg.workName + `</div >
                                <div style="color:#dad8dd;font-size: 14px;">`+ copied_svg.createdAt + `</div>
                            </div>
                        </div>`);
                    newDoc.insertBefore(bodyNode);
                    $("#loader").removeClass("d-flex");
                }
                else {
                    console.error(data.msg);
                }
            });
        }
    });

    $("#act_delete").click(function () {
        var selected_svg;
        var mediaid = -1;
        for (const saved_svg of $(".check_container")) {
            if (saved_svg.children[0].classList.contains("active")) {
                selected_svg = saved_svg.parentElement.parentElement.children[0];
                mediaid = selected_svg.getAttribute("data-mediaid");
            }
        }
        if (mediaid != -1) {
            $("#loader").addClass("d-flex");
            $.get("/gallery/delete?mediaId=" + mediaid, function (data, status) {
                if (status == "success") selected_svg.parentElement.remove();
                else console.error(data.msg);
                $("#loader").removeClass("d-flex");
            });
        }
        else {
            return;
        }
    })

    function createNewWarpedText() {
        window.location.href = "/warp/createnew/"
    }

    $("#createNewWarp").click(function (e) {
        e.stopPropagation();
        createNewWarpedText();
    });

    $("#newWarpedText").click(createNewWarpedText);

    let lastClickTime = 0;
    $(document).on("touchstart", ".editable-object", function (event) {
        const currentTime = new Date().getTime();
        const tapLength = currentTime - lastClickTime;
        if (tapLength < 500 && tapLength > 0) {
            event.preventDefault();
            $(this).trigger("dblclick");
        }
        lastClickTime = currentTime;
    });

    $(document).on("dblclick", ".editable-object", function () {
        $(this).attr("spellcheck", "false");
        $(this).attr("contenteditable", "true");
        $(this).focus();
        document.execCommand("selectAll", false, null);
    });

    $(document).on("keydown", ".editable-object", function (e) {
        e.stopPropagation();
        if (e.keyCode == 13) {
            e.preventDefault();
            $(this).attr("contenteditable", "false");
        }
    });

    $(document).on("blur", ".editable-object", function (e) {
        $(this).attr("contenteditable", "false");
        let newname = $(this).text();
        let svg_id = this.parentElement.parentElement.children[0].getAttribute("data-id");
        let origin_name = this.getAttribute("data-workName");
        if (newname != "" && newname != origin_name) {
            window.dispatchEvent(new CustomEvent("change_workname", { detail: { name: newname, id: svg_id } }));
        }
        else {
            this.innerHTML = this.getAttribute("data-workName");
        }
    });

    $("#search_input").on("keyup", function (event) {
        if (event.target.value != "") {
            if (event.keyCode === 13) {
                searchDesigns(e.target.value);
            }
        }
    });

    init();
});