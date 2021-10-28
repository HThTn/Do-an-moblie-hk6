const year = new Date().getFullYear();
const yearList = [];
for (let i = year - 1; i <= year + 1; i++) yearList.push(i);
const facultyList = [
  'computer_science',
  'information_technology',
  'data_science',
  'computer_engineering',
  'information_systems',
  'e_commerce',
  'software_engineering',
  'information_security',
];
const facultyToVN = {
  'computer_science': 'Khoa học máy tính',
  'information_technology': 'Công nghệ thông tin',
  'data_science': 'Khoa học dữ liệu',
  'computer_engineering': 'Kĩ thuật máy tính',
  'information_systems': 'Hệ thống thông tin',
  'e_commerce': 'Thương mại điện tử',
  'software_engineering': 'Công nghệ phầm mềm',
  'information_security': 'An toàn thông tin',
}
const weekdayToVN = {
  'monday': 'Hai',
  'tuesday': 'Ba',
  'wednesday': 'Tư',
  'thursday': 'Năm',
  'friday': 'Sáu',
  'saturday': 'Bảy',
  'sunday': "CN"

}

const getDateMonthYear = (dateString) => {
  const date = new Date(dateString).getDate();
  const month = new Date(dateString).getMonth() + 1;
  const year = new Date(dateString).getFullYear()
  return `${date}/${month}/${year}`
}
const baseUrl = 'http://quocha.xyz'
const apiURL = 'http://quocha.xyz/api';
const authUrl = 'http://quocha.xyz/auth/admin/sign-in';

export {
  yearList, facultyList, apiURL, authUrl, baseUrl, facultyToVN, getDateMonthYear, weekdayToVN
};
