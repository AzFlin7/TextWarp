$(document).ready(function () {
    $("#wordsInput").click(function () {
        var words = $("#warp_words")[0].value;
        if (words.split(" ").length == 2) {
            words = words.toUpperCase();
            window.localStorage.setItem("warp_words", words);
            $("#wordInputView")[0].classList.remove("d-flex");
            $("#wordInputView")[0].classList.add("d-none");
            $("#styleChooseView")[0].classList.remove("d-none");
            $("#styleChooseView")[0].classList.add("d-flex");
        }
        else {
            alert("You should input two words.");
        }
    });

    $(".style-tab").on("click", function () {
        for (const temptab of $(".style-tab")) {
            temptab.children[1].classList.remove("d-block");
        }
        $(this)[0].children[1].classList.add("d-block");
        currentPathIndex = $(this)[0].getAttribute("data-pathIndex");
    });

    $("#chooseStyle").click(function () {
        window.localStorage.setItem("pathIndex", currentPathIndex);
    });

    $(".btn_chooseTemplate").on("click",function () {
        $(".btn_chooseTemplate").removeClass("active");
        $(this).addClass("active");
    })

    $("#btn_select").click(function () {
        $("#select_sub_menu").addClass("d-flex");
        $(".gallery-item-overlay").addClass("active");
        $(".check_container").addClass('active');
    });

    $(".check_container").click(function (e) {
        e.stopPropagation();
        if (this.children[0].classList.contains("active")) {
            this.children[0].classList.remove("active");
        }
        else {
            this.children[0].classList.add("active");
        }
    });

    $(".gallery-item-overlay").click(function (e) {
        e.stopPropagation();
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

    $("#createNewWarp").click(function () {
        $.ajax({
            url: "/gallery/createNewWarpedText",
            type: "POST",
            data: {},
            success: function (res) {
                window.location.href = "/gallery/newwarp" + res.id;
            },
        });
    });

});