import { apiURL } from '../config/config'
import { headers } from './config'
const getSubjectById = async ({ token, id = '', select = false }) => {
    select = select ? `?select=${select}` : ''
    let url = `${apiURL}/subject/admin/${id}${select}`;
    return await fetch(url, {
        method: 'GET',
        headers: headers(token)
    }).then(res => res.json())
        .catch(err => console.log('Get Subject by id Error: ', err))

}

const getAllSubject = async ({ token, limit = false, faculty = false, page = false, select = false, sort = false }) => {
    faculty = faculty ? `faculty=${faculty}` : '';
    limit = limit ? `&limit=${limit}` : '';
    page = page ? `&page=${page}` : '';
    select = select ? `&select=${select}` : ''
    sort = sort ? `&sort=${sort}` : '';

    let url = `${apiURL}/subject/admin/?${faculty}${limit}${page}${select}${sort}`
    return await fetch(url, {
        method: 'GET',
        headers: headers(token)
    }).then(res => res.json())
        .catch(err => console.log('Get Subject by id Error: ', err))

}

const createSubject = async ({ token, subject }) => {
    let url = `${apiURL}/subject/admin`
    return await fetch(url, {
        method: 'POST',
        headers: headers(token),
        body: JSON.stringify(subject)
    }).then(res => res.json())
}

const updateSubject = async ({ token, id, subject }) => {
    let url = `${apiURL}/subject/admin/${id}`
    return await fetch(url,
        {
            method: 'PUT',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify(subject)
        }).then(res => res.json())
}


export { getSubjectById, getAllSubject, createSubject, updateSubject }