import { version } from '../../package.json';

export const environment = {
  production: true,
  log: true,
  flags: {
    useNewHeader: true,
  },
  labels: {
    titlePage: 'Entorno Producción (PROD)',
  },
  approvalsRequired: {
    biddingRequest: 2,
    clarifyResponse: 3,
    amendmentResponse: 3,
    retainerRequest: 2,
    paymentRequest: 1,
    finalPaymentRequest: 2,
    modifiedContract: 3,
    evaluationReport: 2,
    signedContract: 2,
  },
  pathApis: {
    parameters: 'https://sipac.investhonduras.hn/backend/ms-parameter/',
    security: 'https://sipac.investhonduras.hn/backend/',
    users: 'https://sipac.investhonduras.hn/backend/ms-user/',
    processes: 'https://sipac.investhonduras.hn/backend/ms-solicitude/',
    storage: 'https://sipac.investhonduras.hn/backend/ms-solicitude/',
    notifiy: 'https://sipac.investhonduras.hn/backend/ms-notify/',
  },
  pathWebSockets: {
    auth: 'wss://sipac.investhonduras.hn/ev-user-websocket',
  },
  kaytrust: {
    auth: {
      domainShare: 'https://kaytrust.id/share',
      params: {
        redirect_uri:
          'https://sipac.investhonduras.hn/ws/api/authentication/v1/websocket',
        title: 'Ningún título',
        description: 'Ninguna descripción',
      },
    },
    enroll: {
      scheme_uri: 'kaytrust://authorize-device',
      params: {
        redirect_uri:
          'https://sipac.investhonduras.hn/backend/ms-user/api/v1/user/did/register-did',
        title: 'Fiduciarios Honduras',
        description: 'Ninguna descripción',
      },
    },
  },
  did: 'did:ev:cwML6YqL1r4T4vkV4z5xJHe5uYBqVswvqU3qk',
  VERSION: version,
  timeToRememberSession: 300000, // 5 minutos antes de terminar la sesion
  maxSizeOfFileAsByte: 83886080,
};
