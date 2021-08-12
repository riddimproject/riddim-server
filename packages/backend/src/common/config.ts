import envVar from 'env-var'

export const gstInputPort = envVar.get('PORT').default(7001).asPortNumber()
export const wsPort = envVar.get('PORT').default(7002).asPortNumber()
