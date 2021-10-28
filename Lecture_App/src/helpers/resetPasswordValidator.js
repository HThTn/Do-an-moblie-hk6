export function resetPasswordValidator(newPassword, password) {
    if (!newPassword) return "Vui lòng nhập mật khẩu mới";
    if (newPassword.length < 5) return 'Mật khẩu phải có ít nhất 5 kí tự';
    if(newPassword == password){
        return "Mật khẩu mới không được trùng với mật khẩu cũ";
    }
    return '';
}

