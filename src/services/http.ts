import axios from 'axios'

export const http = axios.create({
  paramsSerializer: {
    indexes: null
  }
})

export default http
