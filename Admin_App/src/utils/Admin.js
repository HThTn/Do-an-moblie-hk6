import { baseUrl } from '../config/config'
import { headers } from './config'
const getAdmin = async ({ token }) => {

    let url = `${baseUrl}/admin/`;
    return await fetch(url, {
        method: 'GET',
        headers: headers(token)
    }).then(res => res.json())
        .catch(err => console.log('Get Admin by id Error: ', err))

}

const updateAdmin = async ({ token, admin }) => {
    let url = `${baseUrl}/admin/`
    return await fetch(url,
        {
            method: 'PUT',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify(admin)
        }).then(res => res.json())
}

const changePassword = async ({ token, admin }) => {
    let url = `${baseUrl}/admin/password`
    return await fetch(url,
        {
            method: 'PUT',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify(admin)
        }).then(res => res.json())
}


export { getAdmin, updateAdmin, changePassword }