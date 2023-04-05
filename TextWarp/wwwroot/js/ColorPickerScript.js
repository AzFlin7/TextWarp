$(document).ready(function () {
    let currentPaletteIndex = 0;
    const historyColors = [];
    const palettes = [
        ["#eeae49", "#d1495c", "#23798c"],
        ["#84ffc9", "#abb2ff", "#eca0ff"],
        ["#f4f1df", "#e07a5f", "#3e405b"],
        ["#9381ff", "#b8b9ff", "#f8f7ff"],
        ["#0d4789", "#427aa1", "#ebf2fb"],
        ["#cb997e", "#ddbfa9", "#fde8d7"],
        ["#f5218b", "#fdd702", "#34b1fe"],
    ];

    let palettes_container = document.getElementById("palettes");
    let index = -1;
    for (const palette of palettes) {
        index++;
        let row = document.createElement("div");
        row.classList.add("d-flex");
        row.classList.add("align-items-center");
        row.classList.add("palette");
        let sm_arrow_div = document.createElement("div")
        sm_arrow_div.classList.add("d-flex", "justify-centent-start", "align-items-center", "sm-arrow-div");
        let sm_arrow = document.createElement("img");
        sm_arrow.classList.add("sm-arrow");
        if (index == currentPaletteIndex) {
            sm_arrow.classList.add("active");
        }
        sm_arrow.src = "/icons/right-arrow.png";
        sm_arrow.style = "";
        sm_arrow_div.appendChild(sm_arrow);

        let paletteBody = document.createElement("div");

        paletteBody.classList.add("d-flex", "flex-grow-1");
        paletteBody.style.borderRadius = "5px";
        paletteBody.style.overflow = "hidden";
        paletteBody.style.height = "100%";
        for (const color of palette) {
            let colorButton = document.createElement('div')
            colorButton.setAttribute('data-swatchy-color', color)
            colorButton.style.backgroundColor = color
            colorButton.classList.add('swatchy-color-button')
            colorButton.classList.add("col-4");
            paletteBody.appendChild(colorButton)
        }
        row.appendChild(sm_arrow_div);
        row.appendChild(paletteBody);
        row.addEventListener("click", selectPalette);
        row.setAttribute("id", index);
        palettes_container.appendChild(row);
    };

    $("#brightness").on("input", function (e) {
        e.stopPropagation();
        var brightness = $(this).val();
        var color = $("#color-block").wheelColorPicker("color");
        $("#color-block").wheelColorPicker('setHsv', parseInt(color.h * 255), parseInt(color.s * 255), brightness);
    });

    $("#clearHistory").click(function () {
        for (let i = 0; i < 10; i++) {
            historyColors.unshift("#fff");
        }
        $(".oldColor").css("background", "#fff");
    });

    $(".oldColor").click(function (e) {
        let color = e.currentTarget.style.backgroundColor;
        historyColors.unshift(color);
        changeHistory();
        $("#color-previewer").css("background-color", color);
        $("#color-block").wheelColorPicker("setValue", color);
    });

    $("#color-input").on("change", function (e) {
        e.stopPropagation();
        let inputcolor = $("#color-input").val();
        $("#color-block").wheelColorPicker("setValue", inputcolor);
        let color = $("#color-block").wheelColorPicker("color");
        let value = $("#color-block").wheelColorPicker("value");
        $("#brightness").val(color.v);
        historyColors.unshift(value);
        changeHistory();
        $("#color-previewer").css("background-color", value);
    });

    function changeHistory(e) {
        let oldColorDivs = document.getElementsByClassName("oldColor");
        let index = -1;
        for (let oldColorDiv of oldColorDivs) {
            index++;
            oldColorDiv.style.backgroundColor = historyColors[index];
        }
    }

    function selectPalette(e) {
        currentPaletteIndex = e.currentTarget.getAttribute("id");
        $(".sm-arrow").removeClass("active");
        e.currentTarget.children[0].children[0].classList.add("active");
    }

    function showCurrentPalette() {
        var curPalette = document.getElementById("cur-palette");
        curPalette.innerHTML = "";
        for (const color of palettes[currentPaletteIndex]) {
            let colorButton = document.createElement('div');
            colorButton.setAttribute('data-swatchy-color', color);
            colorButton.style.backgroundColor = color;
            colorButton.addEventListener("click", usePalette);
            colorButton.classList.add('swatchy-color-button');
            colorButton.classList.add('col-4');
            curPalette.appendChild(colorButton);
        }
    };

    showCurrentPalette();

    function usePalette(e) {
        let color = e.currentTarget.getAttribute('data-swatchy-color');
        historyColors.unshift(color);
        changeHistory();
        $("#color-input").val(color);
        $("#color-previewer").css("background-color", color);
        $("#color-block").wheelColorPicker("setValue", color);
    }

    $(".colorPanelTab").on("click", function (e) {
        $(".colorPanelTab").removeClass("active");
        var tab_name = $(this).text();
        $(".color-tab").removeClass("active");
        switch (tab_name) {
            case "Colors":
                $("#color_panel").addClass("active");
                showCurrentPalette();
                break;
            case "Palettes":
                $("#palettes_container").addClass("active");
                showCurrentPalette();
                break;
        }
        $("#tab_name").text(tab_name);
        $(this).addClass("active");
    });
    $('#color-block').on('sliderup', function (e) {
        e.stopPropagation();
        var value = $(this).wheelColorPicker('value');
        $("#color-input").val(value);
        var brightness = $(this).wheelColorPicker('color').v;
        $("#brightness").val(brightness);
        historyColors.unshift(value);
        changeHistory();
    });

    $('#color-block').on('colorchange', function (e) {
        e.stopPropagation();
        var red = $(this).wheelColorPicker("color").r * 255;
        var green = $(this).wheelColorPicker("color").g * 255;
        var blue = $(this).wheelColorPicker("color").b * 255;
        var brightness = $("#brightness").val();
        var rgba = "rgba(" + parseInt(red) + "," + parseInt(green) + "," + parseInt(blue) + "," + brightness + ")";
        $("#color-previewer").css("background-color", rgba);
    });
})
