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
    let tempWord = window.localStorage.getItem("warp_words");
    tagify.addTags(tempWord.split(" "));
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
    $("#messageWraper").css("visibility", "hidden");
    if (values != "") {
        $("#wordsInput").addClass("active");
        if (values.length == 2) {
            $("#messageWraper").css("visibility", "visible");
            $(".tagify__input").addClass("d-none");
        }
        else {
            $(".tagify__input").removeClass("d-none");
            $(".tagify__input").addClass("d-inline-block");
        }
    }
    else {
        $("#wordsInput").removeClass("active");
        $(".tagify__input")[0].classList.remove("d-none");
        $(".tagify__input")[0].classList.add("d-inline-block");
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
    let selected = this.children[1].classList.contains("d-flex");
    for (const temptab of $(".style-tab")) {
        temptab.children[1].classList.remove("d-flex");
        temptab.children[1].classList.add("d-none");
    }
    if (selected != true) {
        $(this)[0].children[1].classList.remove("d-none");
        $(this)[0].children[1].classList.add("d-flex");
        currentStyleIndex = $(this)[0].getAttribute("data-pathIndex");
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
        $.ajax({
            url: "/warp/addNew/" + words + "/" + currentStyleIndex,
            type: "get",
            data: {},
            success: function (res) {
                if (res.status == "success") {
                    svg_id = res.id;
                    window.location.href = "/warp/index?" + "id=" + svg_id;
                }
                else {
                    alert("Create new document failed.");
                }
            },
        });
    }
});

