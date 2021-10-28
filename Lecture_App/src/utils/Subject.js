import {apiURL} from '../config/config';
import {headers} from './config';
const getSubjectById = async ({token, id = '', select = false}) => {
  select = select ? `?select=${select}` : '';
  let url = `${apiURL}/subject/admin/${id}${select}`;
  return await fetch(url, {
    method: 'GET',
    headers: headers(token),
  })
    .then(res => res.json())
    .catch(err => console.log('Get Subject by id Error: ', err));
};

const getAllSubject = async ({
  token,
  limit = false,
  year = false,
  class_id = false,
  page = false,
  select = false,
}) => {
  class_id = class_id ? `class_id=${class_id}` : '';
  year = year ? `&year=${year}` : '';
  limit = limit ? `&limit=${limit}` : '';
  page = page ? `&page=${page}` : '';
  select = select ? `&select=${select}` : '';

  let url = `${apiURL}/subject/admin/?${class_id}${year}${limit}${page}${select}`;
  return await fetch(url, {
    method: 'GET',
    headers: headers(token),
  })
    .then(res => res.json())
    .catch(err => console.log('Get Subject by id Error: ', err));
};

const createSubject = async ({token, subject}) => {
  let url = `${apiURL}/subject/admin`;
  return await fetch(url, {
    method: 'POST',
    headers: headers(token),
    body: JSON.stringify(subject),
  }).then(res => res.json());
};

const updateSubject = async ({token, id, status}) => {
  let url = `${apiURL}/subject/admin/${id}`;
  return await fetch(url, {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token,
    },
    body: JSON.stringify({status: status}),
  }).then(res => res.json());
};

export {getSubjectById, getAllSubject, createSubject, updateSubject};
