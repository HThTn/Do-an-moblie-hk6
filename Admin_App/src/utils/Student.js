import { apiURL } from '../config/config'
import { headers } from './config'
const getStudentById = async ({ token, id = '', select = false }) => {
    select = select ? `?select=${select}` : ''

    let url = `${apiURL}/student/admin/${id}`;
    return await fetch(url, {
        method: 'GET',
        headers: headers(token)
    }).then(res => res.json())
        .catch(err => console.log('Get Student by id Error: ', err))

}

const getAllStudent = async ({ token, limit = false, year = false, class_id = false, page = false, select = false, sort = false }) => {
    class_id = class_id ? `class_id=${class_id}` : '';
    year = year ? `&year=${year}` : ''
    limit = limit ? `&limit=${limit}` : '';
    page = page ? `&page=${page}` : '';
    select = select ? `&select=${select}` : ''
    sort = sort ? `&sort=${sort}` : '';

    let url = `${apiURL}/student/admin/?${class_id}${year}${limit}${page}${select}${sort}`
    return await fetch(url, {
        method: 'GET',
        headers: headers(token)
    }).then(res => res.json())
        .catch(err => console.log('Get Student by id Error: ', err))

}

const createStudent = async ({ token, student }) => {
    let url = `${apiURL}/student/admin`
    return await fetch(url, {
        method: 'POST',
        headers: headers(token),
        body: JSON.stringify(student)
    }).then(res => res.json())
}

const updateStudent = async ({ token, id, student }) => {
    let url = `${apiURL}/student/admin/${id}`
    return await fetch(url,
        {
            method: 'PUT',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify(student)
        }).then(res => res.json())
}


export { getStudentById, getAllStudent, createStudent, updateStudent }