import {apiURL} from '../config/config';
import {headers} from './config';
const getLectureById = async ({token, id = '', select = false}) => {
  select = select ? `?select=${select}` : '';
  return await fetch(`${apiURL}/lecture/admin/${id}${select}`, {
    method: 'GET',
    headers: headers(token),
  })
    .then(res => res.json())
    .catch(err => console.log('Get Lecture by id Error: ', err));
};

const getAllLecture = async ({
  token,
  limit = false,
  faculty = false,
  page = false,
  select = false,
}) => {
  faculty = faculty ? `faculty=${faculty}` : '';
  limit = limit ? `limit=${limit}` : '';
  page = page ? `page=${page}` : '';
  select = select ? `select=${select}` : '';

  let url = `${apiURL}/lecture/admin/?${faculty}&${limit}&${page}&${select}`;
  return await fetch(url, {
    method: 'GET',
    headers: headers(token),
  })
    .then(res => res.json())
    .catch(err => console.log('Get Lecture by id Error: ', err));
};

const createLecture = async ({token, lecture}) => {
  let url = `${apiURL}/lecture/admin`;
  return await fetch(url, {
    method: 'POST',
    headers: headers(token),
    body: JSON.stringify(lecture),
  }).then(res => res.json());
};

const updateLecture = async ({token, id, lecture}) => {
  let url = `${apiURL}/lecture/admin/${id}`;

  return await fetch(url, {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token,
    },
    body: JSON.stringify(lecture),
  }).then(res => res.json());
};

export {getLectureById, getAllLecture, createLecture, updateLecture};
