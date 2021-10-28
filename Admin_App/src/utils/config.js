const headers = (token) => {
    return {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
    }
}

export { headers }