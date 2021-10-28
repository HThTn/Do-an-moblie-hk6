export function checkNewPasswordValidator(reNewPassword, newPassword) {
    if (!reNewPassword){
        return "Vui lòng xác nhận mật khẩu";
    }
    if (reNewPassword.length < 5){
        return 'Mật khẩu phải có ít nhất 5 kí tự';
    }
    if (reNewPassword != newPassword){
        return 'Mật khẩu không khớp'
    }
    return '';
}