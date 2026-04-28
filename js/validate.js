$(document).ready(function () {

    let isValidName = false;
    let isValidPass = false;
    let isValidMail = false;
    let isValidConfirm = false;
    let isValidGender = false;
    let isValidBirth = false;

    function checkRegister() {
        $("#btnRegister").prop("disabled", !(isValidName && isValidMail && isValidPass && isValidConfirm && isValidGender && isValidBirth) );
    }
    function checkLogin() {
        $("#btnLogin").prop("disabled", !(isValidPass && isValidMail));
    }

    $("#hoten").blur(function () {
    let name = $(this).val().trim();
    let nameRegex = /^([A-ZÀ-Ỹ][a-zà-ỹ]*\s)+[A-ZÀ-Ỹ][a-zà-ỹ]*$/
    if (name === "") {
        $("#errten").text("Không được để trống");
        isValidName = false;
    } else if (!nameRegex.test(name)) {
        $("#errten").text("Họ tên không hợp lệ (VD: Nguyễn Văn A)");
        isValidName = false;
    } else {
        $("#errten").text("");
        isValidName = true;
    }
    checkRegister();
});
    $("#password").blur(function (e) {
        let password = $("#password").val().trim();
        if(password === ""){
             $("#errpassword").text("Không được để trống");
             isValidPass = false;
        } else if (password.length < 6) {
            $("#errpassword").text("Mật khẩu phải >= 6 ký tự");
            isValidPass = false;
        }else {
            $("#errpassword").text("");
            isValidPass = true;
        }
        checkLogin();
        checkRegister();
    });
     $("#mailsdt").blur(function () {
        let value = $("#mailsdt").val().trim();
        let emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        let phoneRegex = /^(0[3|5|7|8|9])[0-9]{8}$/;
        if (value === "") {
            $("#errmailsdt").text("Không được để trống");
            isValidMail = false;
        }else if (!emailRegex.test(value) && !phoneRegex.test(value)) {
            $("#errmailsdt").text("Phải là Email hoặc SĐT hợp lệ");
            isValidMail = false;
        }else {
            $("#errmailsdt").text("");
            isValidMail = true;
        }       
        checkLogin();
        checkRegister()
    });
    
    $("#confirm").blur(function () {
        let pass = $("#password").val().trim();
        let confirm = $(this).val().trim();
        if (confirm === "") {
            $("#errconfirm").text("Không được để trống");
            isValidConfirm = false;
        } else if (confirm !== pass) {
            $("#errconfirm").text("Không khớp mật khẩu");
            isValidConfirm = false;
        } else {
            $("#errconfirm").text("");
            isValidConfirm = true;
        }
        checkRegister();
    });

    $("input[name='gioitinh']").change(function () {
        isValidGender = $("input[name='gioitinh']:checked").length > 0;
        if (!isValidGender) {
            $("#errrad").text("Chọn giới tính");
        } else {
            $("#errrad").text("");
        }
        checkRegister();
    });

    $("#birth").change(function () {
    let birth = $(this).val();
    if (birth === "") {
        $("#errbirth").text("Chọn ngày sinh");
        isValidBirth = false;
        checkRegister();
        return;
    }
    let today = new Date();
    let dob = new Date(birth);
    let age = today.getFullYear() - dob.getFullYear();
    let m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
        age--;
    }
    if (age < 16) {
        $("#errbirth").text("Phải từ 16 tuổi trở lên");
        isValidBirth = false;
    } else {
        $("#errbirth").text("");
        isValidBirth = true;
    }
    checkRegister();
});
});