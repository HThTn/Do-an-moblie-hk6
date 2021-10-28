import { apiURL } from '../config/config'
import { headers } from './config'
const getExamById = async ({ token, id = '', select = false }) => {
    select = select ? `?select=${select}` : ''

    return await fetch(`${apiURL}/exam/admin/${id}${select}`, {
        method: 'GET',
        headers: headers(token)
    }).then(res => res.json())
        .catch(err => console.log('Get Exam by id Error: ', err))

}

const getAllExam = async ({
    token,
    limit = false,
    page = false,
    select = false,
    sort = false,
    created_by = false,
    time = false,
    type = false,
    class_id = false,
    year = false,
}) => {
    limit = limit ? `limit=${limit}` : '';
    page = page ? `&page=${page}` : '';
    select = select ? `&select=${select}` : '';
    sort = sort ? `&sort=${sort}` : '';
    created_by = created_by ? `&created_by=${created_by}` : '';
    type = type ? `&for=${type}` : '';
    time = time ? `&time=${time}` : '';
    class_id = class_id ? `&class_id=${class_id}` : '';
    year = year ? `&year=${year}` : '';

    let url = `${apiURL}/exam/admin/?${limit}${page}${select}${sort}${created_by}${time}${class_id}${year}${type}`
    return await fetch(url, {
        method: 'GET',
        headers: headers(token)
    }).then(res => res.json())
        .catch(err => console.log('Get Exam by id Error: ', err))

}

const createExam = async ({ token, exam }) => {

    let url = `${apiURL}/exam/admin`
    return await fetch(url, {
        method: 'POST',
        headers: headers(token),
        body: JSON.stringify(exam)
    }).then(res => res.json())
}

const updateExam = async ({ token, id, exam }) => {
    let url = `${apiURL}/exam/admin/${id}`
    return await fetch(url,
        {
            method: 'PUT',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify(exam)
        }).then(res => res.json())
}

const updateExamStatus = async ({ token, id, status }) => {
    let url = `${apiURL}/exam/admin/status/${id}`
    return await fetch(url,
        {
            method: 'PUT',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify({ status: status })
        }).then(res => res.json())
}


export { getExamById, getAllExam, createExam, updateExam, updateExamStatus }