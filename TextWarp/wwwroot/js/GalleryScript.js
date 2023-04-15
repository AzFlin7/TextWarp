$(document).ready(function () {
    var svg_id = -1;
    var selected_svgs = [];
    var inputElm = $('[name=tags]')[0]; //word input box
    var words = "";
    var currentStyleIndex = -1;
    //initialize tagify input
    tagify = new Tagify(inputElm, {
        duplicates: false,
        addTagOnBlur: true,
        originalInputValueFormat: valuesArr => valuesArr.map(item => item.value).join(' ')
    });
    inputElm.addEventListener('change', onChange);
    function onChange(e) {
        // outputs a String
        var values = e.target.value;
        values = values.split(" ");
        if (values.length == 2) {
            $("#messageWraper").html("You can input 2 words now.");
            $(".tagify__input")[0].classList.add("d-none");
        }
        else {
            $("#messageWraper").html("");
            $(".tagify__input")[0].classList.remove("d-none");
            $(".tagify__input")[0].classList.add("d-inline-block");
        }
    }

    $("#wordsInput").click(function () {
        words = $("#warp_words")[0].value;
        if (words != "" && (words.split(" ").length == 1 || words.split(" ").length == 2)) {
            words = words.toUpperCase();
            $("#wordInputView").removeClass("d-flex");
            $("#wordInputView").addClass("d-none");
            $("#styleChooseView").removeClass("d-none");
            $("#styleChooseView").addClass("d-flex");
        }
        else {
            $("#messageWraper").text("You should input any words");
        }
    });

    $(".style-tab").on("click", function () {
        for (const temptab of $(".style-tab")) {
            temptab.children[1].classList.remove("d-block");
        }
        $(this)[0].children[1].classList.add("d-block");
        currentStyleIndex = $(this)[0].getAttribute("data-pathIndex");
    });

    $("#chooseStyle").click(function () {
        if (currentStyleIndex == -1) {
            currentStyleIndex = 0;
        }
        $.ajax({
            url: "/gallery/createNew/" + words + "/" + currentStyleIndex,
            type: "get",
            data: {},
            success: function (res) {
                svg_id = res.id;
                window.location.href = "/warpeditor/index?" + "id=" + svg_id;
            },
        });
    });

    $(".btn_chooseTemplate").on("click", function () {
        $(".btn_chooseTemplate").removeClass("active");
        $(this).addClass("active");
    })

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
                                <div style="color:#dad8dd;font-size: 14px;margin-top: 8px;">`+ copied_svg.workName + `</div >
                                <div style="color:#dad8dd;font-size: 14px;">`+ copied_svg.createdAt + `</div>
                            </div>
                        </div>`);
                        newDoc.insertBefore(bodyNode);
                        $("#loader").removeClass("d-flex");
                        $("#loader").addClass("d-none");
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

    $(".gallery-content").on("click", function (e) {
        e.stopPropagation();
        if ($("#btn_select")[0].classList.contains("active")) {
            $("#btn_select").removeClass("active");
            $("#select_sub_menu").removeClass("d-flex");
            $(".gallery-item-overlay").removeClass("active");
            $(".check_container").removeClass('active');
        }
    });

    function createNewWarpedText() {
        $("#gallery_view").removeClass("d-flex");
        $("#gallery_view").addClass("d-none");
        $("#newWarp_view").removeClass("d-none");
        $("#newWarp_view").addClass ("d-flex");
    }

    $("#createNewWarp").click(createNewWarpedText);

    $("#newWarpedText").click(createNewWarpedText);

    $(".gallery-content").on("click", ".gallery-item", function (e) {
        e.stopPropagation();
        var svg_id = this.children[0].getAttribute("data-id");
        window.location.href = "/warpeditor/editor/" + svg_id;
    })
});