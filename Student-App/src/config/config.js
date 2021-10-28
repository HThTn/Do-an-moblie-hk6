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

const apiURL = 'http://quocha.xyz/api';
const authUrl = 'http://quocha.xyz/auth/student/sign-in';

export { yearList, facultyList, apiURL, authUrl };
