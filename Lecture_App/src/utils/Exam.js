import {apiURL} from '../config/config';
import {headers} from './config';
const getExamById = async ({token, id = '', select = false}) => {
  select = select ? `?select=${select}` : '';

  return await fetch(`${apiURL}/exam/lecture/${id}${select}`, {
    method: 'GET',
    headers: headers(token),
  })
    .then(res => res.json())
    .catch(err => console.log('Get Exam by id Error: ', err));
};

const getAllExam = async ({
  token,
  limit = false,
  page = false,
  select = false,
}) => {
  faculty = faculty ? `faculty=${faculty}` : '';
  limit = limit ? `limit=${limit}` : '';
  page = page ? `page=${page}` : '';
  select = select ? `select=${select}` : '';
  let url = `${apiURL}/exam/lecture/?${faculty}&${limit}&${page}&${select}`;
  return await fetch(url, {
    method: 'GET',
    headers: headers(token),
  })
    .then(res => res.json())
    .catch(err => console.log('Get Exam by id Error: ', err));
};

const createExam = async ({token, exam}) => {
  let url = `${apiURL}/exam/lecture`;
  return await fetch(url, {
    method: 'POST',
    headers: headers(token),
    body: JSON.stringify(exam),
  }).then(res => res.json());
};

const updateExam = async ({token, id, exam}) => {
  let url = `${apiURL}/exam/lecture/${id}`;
  return await fetch(url, {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token,
    },
    body: JSON.stringify(exam),
  }).then(res => res.json());
};

const updateExamStatus = async ({token, id, status}) => {
  let url = `${apiURL}/exam/lecture/status/${id}`;
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

export {getExamById, getAllExam, createExam, updateExam, updateExamStatus};
