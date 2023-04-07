$(document).ready(function () {
    
    //end of initialize tagify input

    $("#wordsInput").click(function () {
        var words = $("#warp_words")[0].value;
        window.localStorage.setItem("warp_words", words);
        console.log("test save:", window.localStorage.getItem("warp_words"));
        $("#wordInputView")[0].classList.remove("d-flex");
        $("#wordInputView")[0].classList.add("d-none");
        $("#styleChooseView")[0].classList.remove("d-none");
        $("#styleChooseView")[0].classList.add("d-flex");
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
    });
});