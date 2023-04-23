$(document).ready(function () {
    var svgFilePath = $("#svg_filePath").attr("data-filePath");
    let currentPaletteIndex = 0;
    let currentGradientIndex = 0;
    const historyColors = [];
    var brightness, contrast, saturation, hue;
    let palettes = [];

    let actionHistory = [];
    let currentActionIndex = -1;

    const gradients = [
        ["#f41d6d", "#57a6c8"],
        ["#f89412", "#f5ee5d"],
        ["#6b6fff", "#bc91c1"],
        ["#0964ff", "#64c7d3"],
        ["#40c7ff", "#c632d9"],
        ["#bf14fd", "#c9fa4d"],
        ["#59f886", "#64c7d3"]
    ];
    let gradient_index = -1;
    let gradient_container = document.getElementById("gradients");

    for (const gradient of gradients) {
        gradient_index++;
        let gradient_row = document.createElement("div");
        gradient_row.classList.add("d-flex");
        gradient_row.classList.add("align-items-center");
        gradient_row.classList.add("gradient");
        let sm_arrow_div_gra = document.createElement("div")
        sm_arrow_div_gra.classList.add("d-flex", "justify-centent-start", "align-items-center", "sm-arrow-div");
        let sm_arrow_gra = document.createElement("img");
        sm_arrow_gra.classList.add("sm-arrow");
        if (gradient_index == currentPaletteIndex) {
            sm_arrow_gra.classList.add("active");
        }
        sm_arrow_gra.src = "/icons/right-arrow.png";
        sm_arrow_gra.style = "";
        sm_arrow_div_gra.appendChild(sm_arrow_gra);

        let gradientBody = document.createElement("div");

        gradientBody.classList.add("d-flex", "flex-grow-1");
        gradientBody.style.borderRadius = "5px";
        gradientBody.style.overflow = "hidden";
        gradientBody.style.height = "100%";
        var gradientColor = "linear-gradient(to right, " + gradient[0] + ", " + gradient[1] + ")";
        gradientBody.style.backgroundImage = gradientColor;
        gradient_row.appendChild(sm_arrow_div_gra);
        gradient_row.appendChild(gradientBody);
        gradient_row.addEventListener("click", selectGradient);
        gradient_row.setAttribute("gradient_id", gradient_index);
        gradient_container.appendChild(gradient_row);
    };

    window.localStorage.setItem("pathSelected", 0);

    if (svgFilePath != "") {
        var svgUrl = "/" + svgFilePath;
        fetch(svgUrl)
            .then(response => response.text())
            .then(svg => {
                $("#svgViewer").html(svg);
                initial();
            });
        $("body>svg").remove();
    }
    else {
        var selectedSvg = window.localStorage.getItem("selectedSvg");
        $("#svgViewer")[0].innerHTML = selectedSvg;
        $("#svgViewer")[0].children[0].setAttribute("id", "svg_container");
        $("#svgViewer")[0].children[0].removeAttribute("data-id");
        initial();
    }

    $("#brightness").on("input", function (e) {
        e.stopPropagation();
        brightness = $(this).val();
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
        var pathSelected = window.localStorage.getItem("pathSelected");
        if (pathSelected == 1) {
            var pathIndex = findRow3($(".currentActivePath")[0]);
            var action = { type:"set_indi_color", pathIndex: pathIndex, fill: color };
            actionHistory.push(action);
            currentActionIndex = actionHistory.length - 1;
            if (currentActionIndex > 0) {
                $("#undo").addClass("active");
            }
            if (currentActionIndex < actionHistory.length - 2) {
                $("#redo").addClass("active");
            }
            $(".currentActivePath")[0].setAttribute("fill", color);
        }
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
        var pathSelected = window.localStorage.getItem("pathSelected");
        
        if (pathSelected == 1) {
            var pathIndex = findRow3($(".currentActivePath")[0]);
            var action = { type:"set_indi_color", pathIndex: pathIndex, fill: color };
            actionHistory.push(action);
            currentActionIndex = actionHistory.length - 1;
            if (currentActionIndex > 0) {
                $("#undo").addClass("active");
            }
            if (currentActionIndex < actionHistory.length - 2) {
                $("#redo").addClass("active");
            }
            $(".currentActivePath")[0].setAttribute("fill", value);
        }
    });

    $('#color-block').on('sliderup', function (e) {
        e.stopPropagation();
        var value = $(this).wheelColorPicker('value');
        $("#color-input").val(value);
        brightness = $(this).wheelColorPicker('color').v;
        var hue = $(this).wheelColorPicker('color').h;
        var saturation = $(this).wheelColorPicker('color').s;
        $("#brightness").val(brightness);
        $("#sli_stroke_brightness").val(brightness * 100);
        $("#sli_stroke_hue").val(hue * 360);
        $("#sli_stroke_saturation").val(saturation * 100);
        var pathSelected = window.localStorage.getItem("pathSelected");
        if (pathSelected == 1) {
            var pathIndex = findRow3($(".currentActivePath")[0]);
            var action = { type: "set_indi_color", pathIndex: pathIndex, fill: value };
            actionHistory.push(action);
            currentActionIndex = actionHistory.length - 1;
            if (currentActionIndex > 0) {
                $("#undo").addClass("active");
            }
            if (currentActionIndex < actionHistory.length - 2) {
                $("#redo").addClass("active");
            }
        }
        historyColors.unshift(value);
        changeHistory();
    });

    $('#color-block').on('colorchange', function (e) {
        e.stopPropagation();
        var value = $(this).wheelColorPicker("value");
        brightness = $("#brightness").val();
        $("#brightness").val(brightness);
        $("#color-previewer").css("background", value);
        var pathSelected = window.localStorage.getItem("pathSelected");
        if (pathSelected == 1) {
            $(".currentActivePath")[0].setAttribute("fill", value);
        }
    });

    $("#generatePalettes").on("click", () => {
        $("#loader").removeClass("d-none");
        $("#loader").addClass("d-flex");
        generatePalettes();
    });

    $("tc-range-slider").on("change", function () {
        let shower_id = "#" + $(this).attr("data-shower-id") + "";
        if ($(this).attr("data-shower-id") != "") {
            var intValue = parseInt($(this)[0].value);
            $(shower_id).text(intValue + "%")
        }
        if (this.id == "sli_stroke_gradientAngle") {
            var gradientDirection = this.value;
            gradientDirection = "rotate(" + parseInt(gradientDirection) + ")";
            $("#sampleGradient").attr("gradientTransform", gradientDirection);
            $("#first_color").attr("stop-color", gradients[currentGradientIndex][0]);
            $("#second_color").attr("stop-color", gradients[currentGradientIndex][1]);

            var gradientImage = "url(#sampleGradient)";

            for (const path of $(".warpedPath")) {
                path.setAttribute("fill", gradientImage);
            }
        }
        if (this.id == "sli_stroke_brightness" || this.id == "sli_stroke_hue" || this.id == "sli_stroke_saturation") {
            brightness = parseInt($("#sli_stroke_brightness")[0].value);
            brightness = brightness / 100;
            hue = parseInt($("#sli_stroke_hue")[0].value);
            hue = hue / 360;
            saturation = parseInt($("#sli_stroke_saturation")[0].value);
            saturation = saturation / 100;
            $("#color-block").wheelColorPicker('setHsv', hue, saturation, brightness);
        }
    });

    $("#undo").click(function () {
        if (this.classList.contains("active")) {
            if (actionHistory.length > 0) {
                currentActionIndex -= 1;
                if (currentActionIndex >= 0) {
                    actionHandler(actionHistory[currentActionIndex]);
                    if (currentActionIndex == 0) {
                        $(this).removeClass("active");
                    }
                    if (currentActionIndex < actionHistory.length - 1) {
                        $("#redo").addClass("active");
                    }
                }
            }
        }
    });

    $("#redo").click(function () {
        if (this.classList.contains("active")) {
            if (actionHistory.length > 0) {
                currentActionIndex += 1;
                if (currentActionIndex < actionHistory.length) {
                    actionHandler(actionHistory[currentActionIndex]);
                    if (currentActionIndex == actionHistory.length - 1) {
                        $(this).removeClass("active");
                    }
                    else {
                        $("#undo").addClass("active");
                    }
                }
            }
        }
    });

    function initial() {
        for (const path of $("#svg_container")[0].children) {
            if (path.tagName == "path") {
                path.classList.add("warpedPath");
            }
        }
        var initailState;
        if ($("#svg_container")[0].children.length == 2) {
            initailState = {
                type: "set_indi_color",
                pathIndex: 1,
                color: $("#svg_container")[0].children[1].getAttribute("fill"),
            }
        }
        else if ($("#svg_container")[0].children.length == 3) {
            initailState = {
                type: "set_palette",
                colors: [$("#svg_container")[0].children[1].getAttribute("fill"), $("#svg_container")[0].children[2].getAttribute("fill")]
            }
        }
        $('#svg_container')[0].classList.add("edit-svg");
        $(".warpedPath").on("click", function () {
            $(".warpedPath").removeClass("currentActivePath");
            $(this).addClass("currentActivePath");
            var color = this.getAttribute("fill");
            color = color.toUpperCase();
            var reg = /^#([0-9A-F]{3}){1,2}$/i;
            if (reg.test(color)) {
                $("#color-block").wheelColorPicker("setValue", color);
                var hue = $("#color-block").wheelColorPicker('color').h;
                var saturation = $("#color-block").wheelColorPicker('color').s;
                $("#sli_stroke_brightness").val(brightness * 100);
                $("#sli_stroke_hue").val(hue * 360);
                $("#sli_stroke_saturation").val(saturation * 100);
            }
            window.localStorage.setItem("pathSelected", 1);
        });
        actionHistory.push(initailState);
    }

    function findRow3(node) {
        var i = 0;
        while (node = node.previousSibling) {
            if (node.nodeType === 1) { ++i }
        }
        return i;
    }

    function actionHandler(action) {
        switch (action.type) {
            case "set_indi_color":
                $("#svg_container")[0].children[action.pathIndex].setAttribute("fill", action.fill);
                break;
            case "set_palette":
                for (let i = 1; i < $("#svg_container")[0].children.length; i++) {
                    $("#svg_container")[0].children[i].setAttribute("fill", action.colors[i-1]);
                }
                break;
            case "set_gradient":
                $("#sampleGradient").attr("gradientTransform", action.rotate);
                $("#first_color").attr("stop-color", action.colors[0]);
                $("#second_color").attr("stop-color", action.colors[1]);
                var gradientImage = "url(#sampleGradient)";
                for (let i = 1; i < $("#svg_container")[0].children.length; i++) {
                    $("#svg_container")[0].children[i].setAttribute("fill", gradientImage);
                }
                break;
        }
    }

    function generatePalettes() {
        $("#palettes")[0].innerHTML = "";
        palettes = [];
        $.ajax({
            url: '/Warp/GeneratePalettes',
            type: 'get',
            success: function (res, data) {
                if (res.status == 200) {
                    for (const field of res.palettes) {
                        var palette = [];
                        palette.push(field.color1);
                        palette.push(field.color2);
                        palette.push(field.color3);
                        palettes.push(palette);
                    }
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
                            colorButton.style.background = color
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
                    $("#loader").removeClass("d-flex");
                    $("#loader").addClass("d-none");
                }
                else {
                    alert(res.message);
                }
            }
        });
    }

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
        showCurrentPalette()
    }

    function selectGradient(e) {
        currentGradientIndex = e.currentTarget.getAttribute("gradient_id");
        $(".sm-arrow").removeClass("active");
        e.currentTarget.children[0].children[0].classList.add("active");
        setCurrentGradient()
    }

    function setCurrentGradient() {
        var gradientDirection = $("#sli_stroke_gradientAngle")[0].value;
        gradientDirection = "rotate(" + parseInt(gradientDirection) +")";
        $("#sampleGradient").attr("gradientTransform", gradientDirection);
        $("#first_color").attr("stop-color", gradients[currentGradientIndex][0]);
        $("#second_color").attr("stop-color", gradients[currentGradientIndex][1]);

        var gradientImage = "url(#sampleGradient)";

        for (const path of $(".warpedPath")) {
            path.setAttribute("fill", gradientImage);
        }

        var action = { type: "set_gradient", rotate: gradientDirection, colors: [gradients[currentGradientIndex][0], gradients[currentGradientIndex][1]] };
        actionHistory.push(action);
        currentActionIndex = actionHistory.length - 1;
        if (currentActionIndex > 0) {
            $("#undo").addClass("active");
        }
        if (currentActionIndex < actionHistory.length - 2) {
            $("#redo").addClass("active");
        }
    }

    function showCurrentPalette() {
        var curPalette = document.getElementById("cur-palette");
        curPalette.innerHTML = "";
        var index = 0;
        for (const color of palettes[currentPaletteIndex]) {
            let colorButton = document.createElement('div');
            colorButton.setAttribute('data-swatchy-color', color);
            colorButton.style.backgroundColor = color;
            colorButton.addEventListener("click", usePalette);
            colorButton.classList.add('swatchy-color-button');
            colorButton.classList.add('col-4');
            curPalette.appendChild(colorButton);
            if ($("#svg_container")[0].children.length > index + 1 && $("#svg_container")[0].children[index + 1].tagName == "path" && $("#svg_container")[0].children.length > 1) {
                $("#svg_container")[0].children[index + 1].setAttribute("fill", color);
            }
            index++;
        }
        var action = { type: "set_palette", colors: [palettes[currentPaletteIndex][0], palettes[currentPaletteIndex][1]] };
        actionHistory.push(action);
        currentActionIndex = actionHistory.length - 1;
        if (currentActionIndex > 0) {
            $("#undo").addClass("active");
        }
        if (currentActionIndex < actionHistory.length - 2) {
            $("#redo").addClass("active");
        }
    };

    function usePalette(e) {
        let color = e.currentTarget.getAttribute('data-swatchy-color');
        historyColors.unshift(color);
        changeHistory();
        $("#color-input").val(color);
        $("#color-previewer").css("background-color", color);
        var pathSelected = window.localStorage.getItem("pathSelected");
        if (pathSelected == 1) {
            var pathIndex = findRow3($(".currentActivePath")[0]);
            var action = { type : "set_indi_color",pathIndex: pathIndex, fill: color };
            actionHistory.push(action);
            currentActionIndex = actionHistory.length - 1;
            $(".currentActivePath")[0].setAttribute("fill", color);
        }
        $("#color-block").wheelColorPicker("setValue", color);
    }

    generatePalettes();
})
