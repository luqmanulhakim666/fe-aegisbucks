import LogRocket from 'logrocket'

export default ({ app }) => {
  if (process.client && process.env.NODE_ENV === 'production') {
    LogRocket.init('lpayyg/ridi-app')
    LogRocket.identify('lpayyg/ridi-app', {
      name: app.$config.API_URL || 'anonymous',
      email: 'luqmanulh25@gmail.com'
    })
  }
}
