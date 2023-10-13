import ky from 'ky'
import type { KyInstance } from 'node_modules/ky/distribution/types/ky'

import pinia from '@/stores'
import { useUserStore } from '@/stores/user'

export const baseURL = 'https://api.losos.ayarayarovich.tech'

// const a = axios.create({
//   baseURL,
//   withCredentials: true,
//   headers: { 'Access-Control-Allow-Origin': 'https://api.losos.ayarayarovich.tech' }
// })

export default ky.extend({
  mode: 'cors',
  prefixUrl: baseURL,
  retry: 0,
  hooks: {
    beforeRequest: [
      request => {
        const userStore = useUserStore(pinia)
        if (userStore.isAuthenticated) {
				  request.headers.set('Authorization', `Bearer ${userStore.accessToken}`);
        }
        else {
          userStore.signOut()
        }
			}
    ],
    afterResponse: [
      async (request, options, response) => {
        if (response.status === 403 || response.status === 401) {
          const userStore = useUserStore(pinia)
          userStore.signOut()
        }
      }
    ]
  }
})

