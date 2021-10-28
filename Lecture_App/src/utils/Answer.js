import {apiURL} from '../config/config';
import {headers} from './config';
const getAnswerById = async ({token, id = '', select = false}) => {
  select = select ? `?select=${select}` : '';

  return await fetch(`${apiURL}/answer/lecture/${id}${select}`, {
    method: 'GET',
    headers: headers(token),
  })
    .then(res => res.json())
    .catch(err => console.log('Get Answer by id Error: ', err));
};

const getAllAnswer = async ({
  token,
  limit = false,
  page = false,
  select = false,
  sort = false,
  created_by = false,
  time = false,
  exam_id = false,
}) => {
  limit = limit ? `limit=${limit}` : '';
  page = page ? `&page=${page}` : '';
  select = select ? `&select=${select}` : '';
  sort = sort ? `&sort=${sort}` : '';
  created_by = created_by ? `&created_by=${created_by}` : '';
  time = time ? `&time=${time}` : '';
  exam_id = exam_id ? `&exam_id=${exam_id}` : '';

  let url = `${apiURL}/answer/lecture/?${limit}${page}${select}${sort}${created_by}${time}${exam_id}`;
  return await fetch(url, {
    method: 'GET',
    headers: headers(token),
  })
    .then(res => res.json())
    .catch(err => console.log('Get Answer by id Error: ', err));
};

export {getAnswerById, getAllAnswer};
