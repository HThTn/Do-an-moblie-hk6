import {apiURL} from '../config/config';
import {headers} from './config';
const getClassById = async ({token, id = '', select = false}) => {
  select = select ? `?select=${select}` : '';
  let url = `${apiURL}/subject/lecture/${id}`;

  return await fetch(url, {
    method: 'GET',
    headers: headers(token),
  })
    .then(res => res.json())
    .catch(err => console.log('Get Class by id Error: ', err));
};

const getAllClass = async ({
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

  let url = `${apiURL}/subject/lecture/?${faculty}&${limit}&${page}&${select}`;
  return await fetch(url, {
    method: 'GET',
    headers: headers(token),
  })
    .then(res => res.json())
    .catch(err => console.log('Get Class  Error: ', err));
};

const createClass = async ({token, Class}) => {
  let url = `${apiURL}/subject/lecture`;
  return await fetch(url, {
    method: 'POST',
    headers: headers(token),
    body: JSON.stringify(Class),
  }).then(res => res.json());
};

const updateClass = async ({token, id, name}) => {
  let url = `${apiURL}/subject/lecture/${id}`;
  return await fetch(url, {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token,
    },
    body: JSON.stringify({name: name}),
  }).then(res => res.json());
};

export {getClassById, getAllClass, createClass, updateClass};
