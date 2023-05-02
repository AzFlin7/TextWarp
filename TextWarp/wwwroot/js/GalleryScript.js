$(document).ready(function () {
    var searchVar = {
        index: 1,
        count: 30,
        query: ""
    };

    $("#loader").addClass("d-flex");
    function searchDesigns() {
        $("#loader").addClass("d-flex");
        $.get("/gallery/getData?name=" + searchVar.query + "&index=" + searchVar.index + "&count=" + searchVar.count, function (data, status) {
            if (status == "success" && data.msg == "") {
                drawContent(data.savedSvgs);
            }
            else {
                console.error(data.msg);
            }
            $("#loader").removeClass("d-flex");
        });
    }

    $(".gallery-content").on("scroll", function (e) {
        if (Math.round(e.currentTarget.offsetHeight + e.currentTarget.scrollTop) >= e.currentTarget.scrollHeight) {
            searchVar.index++;
            searchDesigns();
        }
    });

    function init() {
        emptyContainer();
        searchDesigns();
    }
    function emptyContainer() {
        $(".gallery-content .gallery-item").remove();
    }
    function drawContent(contentData) {
        var container = $(".gallery-content")[0];
        for (let i = 0; i < contentData.length; i++) {
            var svg = contentData[i];
            var newDoc = $(`<div class="gallery-item" data-media-id="` + svg.mediaId + `" data-words="` + svg.words + `" data-style-index="` + svg.styleIndex +`">
                        <div class="gallery-item-img d-flex align-items-center justify-content-center" style="position:relative;">
                        <div class="gallery-item-overlay"></div>
                        <div class="check_container">
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

    $(document).on("click", ".gallery-content .gallery-item-img", function (e) {
        e.stopPropagation();
        var mediaId = $(this).parent().data("media-id");
        var words = $(this).parent().data("words");
        var styleIndex = $(this).parent().data("styleindex");
        window.location.href = "/warp/editor?mediaId=" + mediaId + "&words=" + words + "&style=" + styleIndex;
    })

    $(document).on("click", ".gallery-item-overlay", function (e) {
        e.stopPropagation();
        $(".check-icon-container").removeClass("active");
        if ($(this).siblings(0).children(0).hasClass("active")) {
            $(this).siblings(0).children(0).removeClass("active");
        }
        else {
            $(this).siblings(0).children(0).addClass("active");
        }
    });

    $(document).on("click", function (e) {
        e.stopPropagation();
        if (e.target.id == "btn_select") return;
        if (selectMode && $(e.target).closest(".gallery-item-overlay").length == 0) {
            selectMode = false;
            $("#select_sub_menu").removeClass("d-flex");
            $(".gallery-item-overlay").removeClass("active");
            $(".check_container").removeClass('active');
        }
    });

    window.addEventListener("change_workname", (e) => {
        $("#loader").addClass("d-flex");
        $.ajax({
            url: "/gallery/rename",
            type: "POST",
            data: {
                mediaId: e.detail.mediaId,
                name: e.detail.name
            },
            success: function (data, status) {
                if (status == "success" && data.msg == "") {
                    $("[data-media-id='" + e.detail.mediaId + "']").find("[data-workName]").html(e.detail.name);
                    $("[data-media-id='" + e.detail.mediaId + "']").find("[data-workName]").attr("data-workName", e.detail.name);
                }
                else {
                    let alertMsg = data.msg;
                    let workNameNode = $("[data-media-id='" + e.detail.mediaId + "']").find("[data-workName]");
                    workNameNode.html(workNameNode.attr("data-workName"));
                    $("#msgWrapper").text(alertMsg);
                    $("#msgWrapper").css("visibility", "visible");
                    setTimeout(() => {
                        $("#msgWrapper")[0].style.visibility = "hidden";
                    }, 2000);
                }
                $("#loader").removeClass("d-flex");
            }
        });
    });
    let selectMode = false;
    $("#btn_select").click(function () {
        $("#select_sub_menu").addClass("d-flex");
        $(".gallery-item-overlay").addClass("active");
        $(".check_container").addClass('active');
        selectMode = true;
        $(this).focus();

    });

    $("#act_duplicate").click(function () {
        var mediaId = $(".check-icon-container.active").closest(".gallery-item").data("media-id");
        if (mediaId) {
            $("#loader").addClass("d-flex");
            searchVar.query = $("#search_input").val();
            $.get("/gallery/duplicate?mediaId=" + mediaId + "&query=" + searchVar.query, function (data, status) {
                if (status == "success") {
                    emptyContainer();
                    drawContent(data.savedSvgs);
                    if ($("#select_sub_menu").hasClass("d-flex")) {
                        $("#select_sub_menu").removeClass("d-flex");
                        $(".gallery-item-overlay").removeClass("active");
                        $(".check-icon-container").removeClass("active");
                    }
                }
                else {
                    console.error(data.msg);
                }
                $("#loader").removeClass("d-flex");
            });
        }
    });

    $("#act_delete").click(function () {
        var mediaId = $(".check-icon-container.active").closest(".gallery-item").data("media-id");
        if (mediaId) {
            $("#loader").addClass("d-flex");
            $.get("/gallery/delete?mediaId=" + mediaId, function (data, status) {
                if (status == "success") $("[data-media-id=" + mediaId + "]").remove();
                else console.error(data.msg);
                if ($("#select_sub_menu").hasClass("d-flex")) {
                    $("#select_sub_menu").removeClass("d-flex");
                    $(".gallery-item-overlay").removeClass("active");
                    $(".check-icon-container").removeClass("active");
                }
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
        let mediaId = $(this).closest(".gallery-item").data("media-id");
        let origin_name = $(this).attr("data-workName");
        if (newname != "" && newname != origin_name) {
            window.dispatchEvent(new CustomEvent("change_workname", { detail: { name: newname, mediaId: mediaId } }));
        }
    });

    $(document).on("blur", "#btn_select", function (e) {
        e.stopPropagation();
        
    })

    $("#search_input").on("input", function (e) {
        if (!selectMode) {
            searchVar.query = e.target.value;
            searchVar.index = 1;
            emptyContainer();
            searchDesigns();
        }
    });

    init();
});