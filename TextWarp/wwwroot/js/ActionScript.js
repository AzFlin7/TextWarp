$(document).ready(function () {
    $("#save_send").click(function () {
        if (this.classList.contains("active")) {
            $(this).removeClass("active");
            this.children[1].style.rotate = "0deg";
            $("#send_actions").hide();
        }
        else {
            $(this).addClass("active");
            this.children[1].style.rotate = "180deg";
            $("#send_actions").show();
        }
    });
    $("#btn_finalize").click(function () {
        alert("test");
    });
})