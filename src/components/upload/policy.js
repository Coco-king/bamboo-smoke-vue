import http from '@/utils/httpRequest.js'

export function policy(type) {
  return new Promise((resolve, reject) => {
    http({
      url: http.adornUrl('/api/oss/policy'),
      method: 'get',
      params: http.adornParams({type: type})
    }).then(({data}) => {
      resolve(data)
    })
  })
}
