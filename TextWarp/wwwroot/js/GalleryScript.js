$(document).ready(function () {
    var availableNames = [];
    $("#loader").removeClass("d-none");
    $("#loader").addClass("d-flex");

    function init() {
        $.ajax({
            url: "/gallery/getData/",
            type: "post",
            data: "",
            success: function (res) {
                if (res.status == "success") {
                    drawContent(res.saved_svgs);
                    $('#search_input').autocomplete({
                        lookup: availableNames,
                    });

                    $(".check_container").on("click", function (e) {
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

                    $(".gallery-item-overlay").click(function (e) {
                        e.stopPropagation();
                        for (const check of $(".check_container")) {
                            check.children[0].classList.remove("active");
                        }
                        if ($(this).siblings()[0].children[0].classList.contains("active")) {
                            $(this).siblings()[0].children[0].classList.remove("active");
                        }
                        else {
                            $(this).siblings()[0].children[0].classList.add("active");
                        }
                    });

                    $(document).on("click", ".gallery-content", function (e) {
                        e.stopPropagation();
                        if ($("#select_sub_menu")[0].classList.contains("d-flex")) {
                            $("#select_sub_menu").removeClass("d-flex");
                            $(".gallery-item-overlay").removeClass("active");
                            $(".check_container").removeClass('active');
                        }
                    });

                    $(".gallery-content").on("click", ".gallery-item-img", function (e) {
                        e.stopPropagation();
                        var svg_id = this.parentElement.children[0].getAttribute("data-id");
                        window.location.href = "/warp/editor/" + svg_id;
                    })

                    $("#loader").removeClass("d-flex");
                    $("#loader").addClass("d-none");
                }
                else {
                    console.error(res.msg);
                }
            }
        })
    }

    function drawContent(contentData) {
        var container = $(".gallery-content")[0];
        for (let i = 0; i < contentData.length; i++) {
            var svg = contentData[i];
            availableNames.push(svg.workName);
            var newDoc = $(`<div class="gallery-item">
                        <input type="hidden" data-id="`+ svg.id + `" />
                        <div class="gallery-item-img d-flex align-items-center justify-content-center" style="position:relative;">
                        <div class="gallery-item-overlay"></div>
                        <div class="active check_container">
                            <div class="check-icon-container">
                                <div class="check-icon"></div>
                                <i class="fa-solid fa-check" style="color: #fff;font-weight:900;z-index: 101;"></i>
                            </div>
                        </div>
                        <img src="/uploads/`+ svg.svgfileName + `" style="max-width: 100%; max-height:100%; ">
                        </div>
                            <div class="d-flex flex-column align-items-center justify-content-center">
                                <div class="editable-object" data-workName="`+ svg.workName + `" style="color:#dad8dd;font-size: 14px;margin-top: 8px;">` + svg.workName + `</div >
                                <div style="color:#dad8dd;font-size: 14px;">`+ svg.createdAt + `</div>
                            </div>
                        </div>`);
            container.appendChild(newDoc[0]);
        }
    }

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
        var svg_id = -1;
        for (const saved_svg of $(".check_container")) {
            if (saved_svg.children[0].classList.contains("active")) {
                selected_svg = saved_svg.parentElement.parentElement.children[0];
                svg_id = selected_svg.getAttribute("data-id");
            }
        }
        if (svg_id != -1) {
            $("#loader").removeClass("d-none");
            $("#loader").addClass("d-flex");
            $.ajax({
                url: "/gallery/duplicate/" + svg_id,
                type: "get",
                data: {},
                success: function (res) {
                    if (res.status == "success") {
                        var copied_svg = res.copiedSvg;
                        var bodyNode = selected_svg.parentElement;
                        var newDoc = $(`<div class="gallery-item">
                        <input type="hidden" data-id="`+ copied_svg.id + `" />
                        <div class="gallery-item-img d-flex align-items-center justify-content-center" style="position:relative;">
                        <div class="gallery-item-overlay active"></div>
                        <div class="active check_container">
                            <div class="check-icon-container">
                                <div class="check-icon"></div>
                                <i class="fa-solid fa-check" style="color: #fff;font-weight:900;z-index: 101;"></i>
                            </div>
                        </div>
                        <img src="/uploads/`+ copied_svg.svgfileName + `" style="max-width: 100%; max-height:100%; ">
                        </div>
                            <div class="d-flex flex-column align-items-center justify-content-center">
                                <div class="editable-object" data-workName="`+ copied_svg.workName + `" style="color:#dad8dd;font-size: 14px;margin-top: 8px;">` + copied_svg.workName + `</div >
                                <div style="color:#dad8dd;font-size: 14px;">`+ copied_svg.createdAt + `</div>
                            </div>
                        </div>`);
                        newDoc.insertBefore(bodyNode);
                        $("#loader").removeClass("d-flex");
                        $("#loader").addClass("d-none");
                    }
                    else {
                        alert("Raised unkown exceptions on the Database side");
                    }
                },
            });
        }
        else return;
    })

    $("#act_delete").click(function () {
        var selected_svg;
        var svg_id = -1;
        for (const saved_svg of $(".check_container")) {
            if (saved_svg.children[0].classList.contains("active")) {
                selected_svg = saved_svg.parentElement.parentElement.children[0];
                svg_id = selected_svg.getAttribute("data-id");
            }
        }
        if (svg_id != -1) {
            $("#loader").removeClass("d-none");
            $("#loader").addClass("d-flex");
            $.ajax({
                url: "/gallery/delete/" + svg_id,
                type: "get",
                data: {},
                success: function (res) {
                    if (res.status == "success") {
                        selected_svg.parentElement.remove();
                        $("#loader").removeClass("d-flex");
                        $("#loader").addClass("d-none");
                    }
                },
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
                $("#loader").removeClass("d-none");
                $("#loader").addClass("d-flex");
                $.ajax({
                    url: "/gallery/getData/",
                    type: "post",
                    data: {
                        WorkName: event.target.value,
                    },
                    success: function (res) {
                        if (res.status == "success") {
                            let num_child = $(".gallery-content")[0].children.length;
                            for (let i = 1; i < num_child; i++) {
                                let tempNode = $(".gallery-content")[0].children[1];
                                $(".gallery-content")[0].removeChild(tempNode);
                            }
                            if (res.saved_svgs != null) {
                                drawContent(res.saved_svgs);

                                $(".check_container").on("click", function (e) {
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

                                $(".gallery-item-overlay").click(function (e) {
                                    e.stopPropagation();
                                    for (const check of $(".check_container")) {
                                        check.children[0].classList.remove("active");
                                    }
                                    if ($(this).siblings()[0].children[0].classList.contains("active")) {
                                        $(this).siblings()[0].children[0].classList.remove("active");
                                    }
                                    else {
                                        $(this).siblings()[0].children[0].classList.add("active");
                                    }
                                });

                                $(document).on("click", ".gallery-content", function (e) {
                                    e.stopPropagation();
                                    if ($("#select_sub_menu")[0].classList.contains("d-flex")) {
                                        $("#select_sub_menu").removeClass("d-flex");
                                        $(".gallery-item-overlay").removeClass("active");
                                        $(".check_container").removeClass('active');
                                    }
                                });

                                $(".gallery-content").on("click", ".gallery-item-img", function (e) {
                                    e.stopPropagation();
                                    var svg_id = this.parentElement.children[0].getAttribute("data-id");
                                    window.location.href = "/warp/editor/" + svg_id;
                                })
                            }

                            $("#loader").removeClass("d-flex");
                            $("#loader").addClass("d-none");
                        }
                        else {
                            alert(res.msg);
                        }
                    }
                })
            }
        }
        else {

        }
    });

    $("#search_input").on("input", function () {
        if (this.value == "") {
            init();
        }
    });

    init();
});