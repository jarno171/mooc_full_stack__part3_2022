import axios from 'axios'
//const baseUrl = '/api/persons'
const baseUrl = process.env.NODE_ENV === 'development' ? 'http://localhost:3001/api/persons' : '/api/persons'

const getAll = () => {
    const request = axios.get(baseUrl)
    return request.then(response => response.data)
}

const create = newObject => {
    const request = axios.post(baseUrl, newObject)
    return request.then(response => response.data)
}

const update = (id, newObject) => {
    const request = axios.post(`${baseUrl}/${id}`, newObject)
    return request.then(response => response.data)
}

const updatePut = (id, newObject) => {
    const request = axios.put(`${baseUrl}/${id}`, newObject)
    return request.then(response => response.data)
}

const remove = (id) => {
    const request = axios.delete(`${baseUrl}/${id}`)
    return request.then(response => response)
}

const createdFunctions = { 
    getAll: getAll, 
    create: create, 
    update : update,
    updatePut: updatePut,
    remove: remove
}

export default createdFunctions