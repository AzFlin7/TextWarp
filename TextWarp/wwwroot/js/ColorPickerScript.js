$(document).ready(function () {
    let currentPaletteIndex = 0;
    let currentGradientIndex = 0;
    const historyColors = [];
    var brightness, contrast, saturation, hue;
    let palettes = [];
    
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
            $(".currentActivePath")[0].setAttribute("fill", value);
        }
    });

    $('#color-block').on('sliderup', function (e) {
        e.stopPropagation();
        var value = $(this).wheelColorPicker('value');
        $("#color-input").val(value);
        brightness = $(this).wheelColorPicker('color').v;
        $("#brightness").val(brightness);
        historyColors.unshift(value);
        changeHistory();
    });

    $('#color-block').on('colorchange', function (e) {
        e.stopPropagation();
        var red = $(this).wheelColorPicker("color").r * 255;
        var green = $(this).wheelColorPicker("color").g * 255;
        var blue = $(this).wheelColorPicker("color").b * 255;
        brightness = $("#brightness").val();
        var rgba = "rgba(" + parseInt(red) + "," + parseInt(green) + "," + parseInt(blue) + "," + brightness + ")";
        $("#color-previewer").css("background-color", rgba);
        var pathSelected = window.localStorage.getItem("pathSelected");
        if (pathSelected == 1) {
            $(".currentActivePath")[0].setAttribute("fill", rgba);
        }
    });

    $("html").on("click", function (e) {
        SvgContainerActivation(e);
    });

    $('#svg_container')[0].classList.add("edit-svg");

    $("#generatePalettes").on("click", (e) => generatePalettes(e));

    $("#sli_stroke_gradientAngle").on("change",setCurrentGradient());

    $("tc-range-slider").on("change", function () {
        let shower_id = "#" + $(this).attr("data-shower-id") + "";
        if ($(this).attr("data-shower-id") != "") {
            var intValue = parseInt($(this)[0].value);
            $(shower_id).text(intValue + "%")
        }
    });
    function generatePalettes(e) {
        $("#palettes")[0].innerHTML = "";
        palettes = [];
        $.ajax({
            url: '/WarpEditor/GeneratePalettes',
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
                    console.log("palettes:", palettes);
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
            if (index + 1 < 3 && $("#svg_container")[0].children.length > 0) {
                $("#svg_container")[0].children[index + 1].setAttribute("fill", color);
            }
            index++;
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
            $(".currentActivePath")[0].setAttribute("fill", color);
        }
        $("#color-block").wheelColorPicker("setValue", color);
    }

    function SvgContainerActivation(e = null) {
        for (const path of $("#svg_container")[0].children) {
            if (path.tagName == "path") {
                path.classList.add("warpedPath");
            }
        }
        $(".warpedPath").on("click", function () {
            console.log('click-wrapped');
            $(".warpedPath").removeClass("currentActivePath");
            $(this).addClass("currentActivePath");
            window.localStorage.setItem("pathSelected", 1);
        });
    }

    generatePalettes(e=null);

    //showCurrentPalette();

})
