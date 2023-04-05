$(document).ready(function () {
    var inputElm = $('[name=tags]')[0]; //first word input box
    var contentWords = "";
    var currentPathIndex = -1;
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
            // alert("You can enter only 3 words.");
            $(".tagify__input")[0].classList.add("d-none");
            contentWords = e.target.value;
        }
        else {
            $(".tagify__input")[0].classList.remove("d-none");
            $(".tagify__input")[0].classList.add("d-inline-block");
        }
    }
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
});