export function passwordValidator(password) {
    if (!password) return "Vui lòng nhập mật khẩu";
    if (password.length < 5) return 'Mật khẩu phải có ít nhất 5 kí tự';
    return '';
}
export function retypePassValidator(password, retypePass) {
    if (!retypePass) return "Không được bỏ trống";
    if (password !== retypePass) return "mật khẩu không khớp";
    return '';
}