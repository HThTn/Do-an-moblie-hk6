export function emailValidator(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!email) return 'Vui lòng nhập email';
    if (!re.test(email)) return 'Email sai cú pháp';
    return ''
}

export function passwordValidator(password, length = 6) {
    if (!password) return "Vui lòng nhập mật khẩu";
    if (password.length < length) return `Mật khẩu phải có ít nhất ${length} kí tự`;
    return '';
}
export function retypePassValidator(password, retypePass) {
    if (!retypePass) return "Không được bỏ trống";
    if (password !== retypePass) return "Mật khẩu không khớp";
    return '';
}
export function usernameValidator(username) {
    if (!username) return 'Vui lòng nhập tài khoản';
    return '';
}
export function numberValidator(number) {
    if (!number) return 'Vui lòng nhập số điện thoại';
    const re = /^[0-9]+$/;
    if (!re.test(number)) return 'Số điện thoại sai cú pháp';
    return '';
}