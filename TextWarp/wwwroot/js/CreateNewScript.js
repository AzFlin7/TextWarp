
var inputElm = $('[name=tags]')[0]; //word input box
var words = "";
var currentStyleIndex = -1;
//initialize tagify input

tagify = new Tagify(inputElm, {
    duplicates: false,
    addTagOnBlur: true,
    originalInputValueFormat: valuesArr => valuesArr.map(item => item.value).join(' ')
});

if (window.localStorage.getItem("warp_words") != "" && window.localStorage.getItem("warp_words") != null) {
    let tempWords = window.localStorage.getItem("warp_words");
    tempWords = tempWords.split(" ");
    if (tempWords.length < 3) {
        tagify.addTags(tempWords);
    }
}

if (window.localStorage.getItem("pathType") != null) {
    currentStyleIndex = window.localStorage.getItem("pathType");
}

if (currentStyleIndex > -1) {
    $(".style-tab")[0].parentElement.children[currentStyleIndex].children[1].classList.remove("d-none");
    $(".style-tab")[0].parentElement.children[currentStyleIndex].children[1].classList.add("d-flex");
    $("#chooseStyle").addClass("active");
}

inputElm.addEventListener('change', onChange);
function onChange(e) {
    // outputs a String
    var values = e.target.value;
    values = values.split(" ");
    $("#messageWrapper").css("visibility", "hidden");
    if (e.target.value != "") {
        $("#wordsInput").addClass("active");
        if (values.length == 2) {
            tagify.removeAllTags();
            tagify.addTags(values);
            $("#messageWrapper").css("visibility", "visible");
            $(".tagify__input").addClass("d-none");
        }
        else {
            $(".tagify__input").removeClass("d-none");
            $(".tagify__input").addClass("d-inline-block");
        }
    }
    else {
        $("#wordsInput").removeClass("active");
        $(".tagify__input").removeClass("d-none");
        $(".tagify__input").addClass("d-inline-block");
    }
}

$("#wordsInput").click(function () {
    if (this.classList.contains("active")) {
        words = $("#warp_words")[0].value;
        window.localStorage.setItem("warp_words", words);
        words = words.toUpperCase();
        $("#wordInputView").removeClass("d-flex");
        $("#wordInputView").addClass("d-none");
        $("#styleChooseView").removeClass("d-none");
        $("#styleChooseView").addClass("d-flex");
    }
});

$(".style-tab").on("click", function () {
    let selected = this.children[0].classList.add("d-flex");
    for (const temptab of $(".style-tab")) {
        temptab.children[1].classList.remove("d-flex");
        temptab.children[1].classList.add("d-none");
    }
    if (selected != true) {
        $(this)[0].children[1].classList.remove("d-none");
        $(this)[0].children[1].classList.add("d-flex");
        currentStyleIndex = $(this).attr("data-pathIndex");
        $("#chooseStyle").addClass("active");
    }
    else {
        $(this)[0].children[1].classList.remove("d-flex");
        $(this)[0].children[1].classList.add("d-none");
        currentStyleIndex = -1;
        $("#chooseStyle").removeClass("active");
    }
});

$("#chooseStyle").click(function () {
    if (this.classList.contains("active")) {
        window.localStorage.setItem("pathType", currentStyleIndex);
        window.location.href = "/warp?words=" + window.localStorage.warp_words + "&style=" + currentStyleIndex;
    }
});

