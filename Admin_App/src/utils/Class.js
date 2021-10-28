import { apiURL } from '../config/config'
import { headers } from './config'
const getClassById = async ({ token, id = '', select = false }) => {
    select = select ? `?select=${select}` : ''
    let url = `${apiURL}/class/admin/${id}${select}`;

    return await fetch(url, {
        method: 'GET',
        headers: headers(token)
    }).then(res => res.json())
        .catch(err => console.log('Get Class by id Error: ', err))

}

const getAllClass = async ({ token, limit = false, faculty = false, page = false, select = false, year = false, sort = false }) => {
    faculty = faculty ? `faculty=${faculty}` : '';
    limit = limit ? `&limit=${limit}` : '';
    page = page ? `&page=${page}` : '';
    select = select ? `&select=${select}` : ''
    year = year ? `&year=${year}` : '';
    sort = sort ? `&sort=${sort}` : '';

    let url = `${apiURL}/class/admin/?${faculty}${limit}${page}${select}${year}${sort}`
    return await fetch(url, {
        method: 'GET',
        headers: headers(token)
    }).then(res => res.json())
        .catch(err => console.log('Get Class by id Error: ', err))

}

const createClass = async ({ token, Class }) => {
    let url = `${apiURL}/class/admin`
    return await fetch(url, {
        method: 'POST',
        headers: headers(token),
        body: JSON.stringify(Class)
    }).then(res => res.json())
}

const updateClass = async ({ token, id, Class }) => {
    let url = `${apiURL}/class/admin/${id}`
    console.log(Class);
    return await fetch(url,
        {
            method: 'PUT',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify(Class)
        }).then(res => res.json())
}


export { getClassById, getAllClass, createClass, updateClass }