import { IMenu, ITypeResponse } from '@shared/models/common/interfaces';

export const TIMER_REQUEST = 50000;

export const MEMORY_UNITS: string[] = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

export const TYPE_FORM: Array<string> = ['VIEW', 'EDIT', 'NEW', 'UPDATE'];

export const WITHOUT_HEADER_PATH = ['api/v1/solicitude/document/', 'api/v1/process/document/', 'api/v1/execute/document/'];

export const VIEWS_WITH_HIGHT_HEADER = [
  '/home/users',
  '/home/processes',
  '/home/users/new',
  '/home/users/view',
  '/home/users/edit',
  '/home/users/profile',
];

export const PATH_SERVICE_AUTH: Array<string> = [
  'header',
  'footer',
  'inicio'
];

export const PATH_ENDPOINTS_NOTIFY: any = {
  sendEmail: 'api/v1/notify/send-mail'
};

export const PATH_ENDPOINTS_USERS: any = {
  add: 'api/v1/user/',
  get: 'api/v1/user/{0}',
  update: 'api/v1/user/{0}',
  all: 'api/v1/user/find-all',
  search: 'api/v1/user/search',
  password: 'api/v1/user/password/{0}',
  updateStatus: 'api/v1/user/state/{0}',
  getCompanies: 'api/v1/user/find-company',
  getProfile: 'api/v1/user/profile/{0}',
  forgotPassword: 'api/v1/user/forget-password/',
  getState: 'api/v1/user/did/token/',
  registerDid: 'api/v1/user/did/register-did'
};

export const PATH_ENDPOINTS_REQUESTS: any = {
  add: 'api/v1/solicitude/',
  get: 'api/v1/solicitude/find/{0}',
  update: 'api/v1/solicitude/{0}',
  all: 'api/v1/project-invest/find-all',
  accredit: 'api/v1/solicitude/accredit/{0}',
};

export const PATH_ENDPOINTS_PROJECT: any = {
  add: 'api/v1/solicitude/',
  get: 'api/v1/project-invest/find/{0}',
  update: 'api/v1/solicitude/{0}',
  all: 'api/v1/project-invest/find-all',
  accredit: 'api/v1/solicitude/accredit/{0}',
  finish: 'api/v1/project-invest/financial-closure/{0}',
};

export const PATH_ENDPOINTS_PROCESSES: any = {
  updateProcess: 'api/v1/process/{0}',
  deleteUserCommittee: 'api/v1/process/committee/',
  addUserCommittee: 'api/v1/process/committee/{0}',
  updateUserCommittee: 'api/v1/process/committee/{0}',
  get: 'api/v1/process/find/{0}',
  reviewDocument: 'api/v1/process/review/{0}',
  accredit: 'api/v1/process/accredited/{0}'
};

export const PATH_ENDPOINTS_EXECUTION: any = {
  update: 'api/v1/execute/{0}',
  get: 'api/v1/execute/find/{0}',
  reviewDocument: 'api/v1/execute/review/{0}',
  getUsersByRole: 'api/v1/execute/role/{0}',
  createExecution: 'api/v1/execute/{0}',
  accredit: 'api/v1/execute/accredited/{0}'
};

export const PATH_ENDPOINTS_PROCESSES_SECOND_PHASE: any = {
  add: 'api/v1/solicitude/',
  get: 'api/v1/process/find/{0}',
  update: 'api/v1/solicitude/{0}',
  all: 'api/v1/solicitude/find-all',
  accredit: 'api/v1/solicitude/accredit',
};

export const PATH_ENDPOINTS_AUTH: any = {
  auth: 'api/v1/auth/login',
  auth2FA: 'api/v1/auth/login2FA',
  authJwt: 'api/v1/auth/login-jwt',
  logout: 'api/v1/auth/logout',
  refreshToken: 'api/v1/auth/refresh-token',
  autologin: 'api/v1/auth/auto-login',
};

export const PATH_ENDPOINTS_PARAMETERS: any = {
  statusUser: 'api/v1/parameter/state-user',
  roles: 'api/v1/parameter/role',
  byType: 'api/v1/parameter/'
};

export const PATH_ENDPOINTS_STORAGE: any = {
  addDocument: 'api/v1/solicitude/document/{0}',
  deleteDocument: 'api/v1/solicitude/document/',
  downloadDocument: 'api/v1/solicitude/document/{0}'
};

export const PATH_ENDPOINTS_PROCESS_STORAGE: any = {
  addDocument: 'api/v1/process/document/{0}',
  deleteDocument: 'api/v1/solicitude/document/',
  downloadDocument: 'api/v1/process/document/{0}'
};

export const PATH_ENDPOINTS_RULES: any = {
  getRules: 'api/v1/rules/{0}',
  permitionByOption: 'api/v1/rules/option',
  permitionByTypeDocument: 'api/v1/rules/type-document'
};

export const PATH_ENDPOINTS_EXECUTION_STORAGE: any = {
  addDocument: 'api/v1/execute/document/{0}',
  downloadDocument: 'api/v1/execute/document/{0}'
};

export const RESPONSE: ITypeResponse = {
  success: 'success',
  error: 'error',
  warning: 'warning',
  info: 'info'
};

export const MENU_USER: IMenu[] = [
  {
    shortName: 'Mi perfil',
    path: 'profile',
    icon: 'person'
  }
];

export const ROUTES_PROCESSES = [{
  name: 'Solicitudes',
  steps: [
    { name: 'Paso 1', route: 'step-one' },
    { name: 'Paso 2', route: 'step-two' },
    { name: 'Paso 3', route: 'step-three' },
    { name: 'Paso 4', route: 'step-four' },
    { name: 'Paso 5', route: 'step-five' }
  ]
},
{
  name: 'Procesos',
  steps: [
    { name: 'Paso 1', route: 'step-one' },
    { name: 'Paso 2', route: 'step-two' },
    { name: 'Paso 3', route: 'step-three' },
    { name: 'Paso 4', route: 'step-four' },
    { name: 'Paso 5', route: 'step-five' },
    { name: 'Paso 6', route: 'step-six' },
    { name: 'Paso 7', route: 'step-seven' }
  ]
},
{
  name: 'Ejecución',
  steps: [
    { name: 'Paso 1', route: 'step-one' },
    { name: 'Paso 2', route: 'step-two' },
    { name: 'Paso 3', route: 'step-three' },
    { name: 'Paso 4', route: 'step-four' },
    { name: 'Paso 5', route: 'step-five' },
  ],
}];

export const BREADCRUMBS_MAIN = [
  {
    name: 'SOLICITUDES',
    icon: 'requests'
  },
  {
    name: 'PROCESOS',
    icon: 'processes'
  },
  {
    name: 'EJECUCIÓN',
    icon: 'execution'
  }
];

// La correccion de la gramática se debe hacer antes en base de datos para que funcione
export const PROCESS_STATES = {
  I: {
    description: 'Iniciado',
    objectInEdition: 'solicitude',
    phase: 'request',
    phaseCode: '01'
  },
  D: {
    description: 'Disponible',
    objectInEdition: 'solicitude',
    phase: 'request',
    phaseCode: '01'
  },
  R: {
    description: 'Devuelto',
    objectInEdition: 'solicitude',
    phase: 'request',
    phaseCode: '01'
  },
  E: {
    description: 'En ejecucion',
    objectInEdition: 'execution',
    phase: 'execution',
    phaseCode: '03'
  },
  L: {
    description: 'En licitación',
    objectInEdition: 'process',
    phase: 'process',
    phaseCode: '02'
  },
  T: {
    objectInEdition: 'execution',
    description: 'Terminado',
    phaseCode: '03'
  }
};

export const STEPS_ROUTES = {
  1: 'step-one',
  2: 'step-two',
  3: 'step-three',
  4: 'step-four',
  5: 'step-five',
  6: 'step-six',
  7: 'step-seven',
  8: 'step-eight'
};


// TODO: Remover o modificar cuando la lógica del json de validación este lista
export const DOCUMENT_PAYLOADS = {
  supportDocument: {
    phaseCode: 'fase_01',
    codeStep: 'paso_01_04',
    documentType: 'doc_01_04_01'
  },
  biddingDocument: {
    phaseCode: 'fase_02',
    codeStep: 'paso_02_01',
    documentType: 'doc_02_01_01'
  },
  clarificationRequest: {
    phaseCode: 'fase_02',
    codeStep: 'paso_02_01',
    documentType: 'doc_02_01_02'
  },
  clarifyingResponse: {
    phaseCode: 'fase_02',
    codeStep: 'paso_02_01',
    documentType: 'doc_ass_02_01_01_02'
  },
  noObjectionBidding: {
    phaseCode: 'fase_02',
    codeStep: 'paso_02_01',
    documentType: 'doc_ass_02_01_01_01'
  },
  noObjectionResponseBidding: {
    phaseCode: 'fase_02',
    codeStep: 'paso_02_01',
    documentType: 'doc_ass_02_01_01_03'
  },
  openingActDocument: {
    phaseCode: 'fase_02',
    codeStep: 'paso_02_02',
    documentType: 'doc_02_02_01'
  },
  amendmentRequest: {
    phaseCode: 'fase_02',
    codeStep: 'paso_02_01',
    documentType: 'doc_02_01_03'
  },
  amendment: {
    phaseCode: 'fase_02',
    codeStep: 'paso_02_01',
    documentType: 'doc_ass_02_01_03_01'
  },
  amendmentNoObjection: {
    phaseCode: 'fase_02',
    codeStep: 'paso_02_01',
    documentType: 'doc_ass_02_01_03_02'
  },
  amendmentNoObjectionResponse: {
    phaseCode: 'fase_02',
    codeStep: 'paso_02_01',
    documentType: 'doc_ass_02_01_03_03'
  },
  awardResolutionDocument: {
    phaseCode: 'fase_02',
    codeStep: 'paso_02_06',
    documentType: 'doc_02_06_01'
  },
  signedContractDocument: {
    phaseCode: 'fase_02',
    codeStep: 'paso_02_07',
    documentType: 'doc_02_07_01'
  },
  evaluationReport: {
    phaseCode: 'fase_02',
    codeStep: 'paso_02_04',
    documentType: 'doc_02_04_01'
  },
  evaluationReportObj: {
    phaseCode: 'fase_02',
    codeStep: 'paso_02_04',
    documentType: 'doc_ass_02_04_01_01'
  },
  evaluationReportObjResponse: {
    phaseCode: 'fase_02',
    codeStep: 'paso_02_04',
    documentType: 'doc_ass_02_04_01_02'
  },
  proofPayment: {
    phaseCode: 'fase_03',
    codeStep: 'paso_03_03',
    documentType: 'doc_ass_03_03_01_02'
  },
  f01Retainer: {
    phaseCode: 'fase_03',
    codeStep: 'paso_03_03',
    documentType: 'doc_ass_03_03_01_01'
  },
  paymentRequest: {
    phaseCode: 'fase_03',
    codeStep: 'paso_03_03',
    documentType: 'doc_03_03_01'
  },
  estimateRequest: {
    phaseCode: 'fase_03',
    codeStep: 'paso_03_03',
    documentType: 'doc_03_03_02'
  },
  f01Estimate: {
    phaseCode: 'fase_03',
    codeStep: 'paso_03_03',
    documentType: 'doc_ass_03_03_02_01'
  },
  cdpEstimate: {
    phaseCode: 'fase_03',
    codeStep: 'paso_03_03',
    documentType: 'doc_ass_03_03_02_02'
  },
  finalEstimateRequest: {
    phaseCode: 'fase_03',
    codeStep: 'paso_03_03',
    documentType: 'doc_03_03_03'
  },
  finalEstimateF01: {
    phaseCode: 'fase_03',
    codeStep: 'paso_03_03',
    documentType: 'doc_ass_03_03_03_01'
  },
  finalEstimateCdp: {
    phaseCode: 'fase_03',
    codeStep: 'paso_03_03',
    documentType: 'doc_ass_03_03_03_02'
  },
  contractModificationStep3: {
    phaseCode: 'fase_03',
    codeStep: 'paso_03_03',
    documentType: 'doc_03_03_04'
  },
  contractModification: {
    phaseCode: 'fase_03',
    codeStep: 'paso_03_04',
    documentType: 'doc_03_04_01'
  }
};

export const PHASE_CODES = {
  requests: 'fase_01',
  processes: 'fase_02',
  execution: 'fase_03',
};

export const ACTIONS_CODES = {
  createSolicitude: {
    phaseCode: 'fase_01',
    faseOptionCode: 'fase_option_01_01',
  },
  seeRequest: {
    phaseCode: 'fase_01',
    faseOptionCode: 'fase_option_01_02',
  },
  editRequest: {
    phaseCode: 'fase_01',
    faseOptionCode: 'fase_option_01_03',
  },
  accreditRequest: {
    phaseCode: 'fase_01',
    faseOptionCode: 'fase_option_01_04',
  },
  startBidding: {
    phaseCode: 'fase_02',
    faseOptionCode: 'fase_option_02_01',
  },
  seeBidding: {
    phaseCode: 'fase_02',
    faseOptionCode: 'fase_option_02_02',
  },
  editBidding: {
    phaseCode: 'fase_02',
    faseOptionCode: 'fase_option_02_03',
  },
  startPayment: {
    phaseCode: 'fase_03',
    faseOptionCode: 'fase_option_03_01',
  },
  seePayment: {
    phaseCode: 'fase_03',
    faseOptionCode: 'fase_option_03_02',
  },
  editPayment: {
    phaseCode: 'fase_03',
    faseOptionCode: 'fase_option_03_03',
  },
  finishCycle: {
    phaseCode: 'fase_03',
    faseOptionCode: 'fase_option_03_04',
  },
};

export const MENU_REQUEST: IMenu[] = [
  {
    shortName: 'Ver solicitud',
    action: 'SEE_REQUEST',
    path: '/profile',
    icon: 'remove_red_eye',
  },
  {
    shortName: 'Editar solicitud',
    action: 'EDIT_REQUEST',
    path: '/update-password',
    icon: 'edit',
  },
  {
    shortName: 'Acreditar',
    action: 'ACCREDIT',
    path: '/help',
    icon: 'gavel',
  }
];

export const MENU_PROCESS: IMenu[] = [
  {
    shortName: 'Iniciar proceso',
    path: '/profile',
    icon: 'play_arrow',
    action: 'START_BIDDING'
  },
  {
    shortName: 'Ver proceso',
    path: '/update-password',
    icon: 'remove_red_eye',
    action: 'SEE_BIDDING'
  },
  {
    shortName: 'Editar proceso',
    path: '/help',
    icon: 'edit',
    action: 'EDIT_BIDDING'
  }
];

export const MENU_EXECUTION: IMenu[] = [
  {
    shortName: 'Iniciar ejecución',
    path: '/profile',
    icon: 'play_arrow',
    action: 'START_PAYMENT'
  },
  {
    shortName: 'Ver ejecución',
    path: '/update-password',
    icon: 'remove_red_eye',
    action: 'SEE_PAYMENT'
  },
  {
    shortName: 'Editar ejecución',
    path: '/help',
    icon: 'edit',
    action: 'EDIT_PAYMENT'
  },
  {
    shortName: 'Terminar ciclo',
    path: '/help',
    icon: 'highlight_off',
    action: 'FINISH_CYCLE'
  }
];

export const ESTIMATE_REQ_MENU: IMenu[] = [
  {
    shortName: 'Acreditar',
    icon: 'gavel',
    action: 'ACCREDIT_ESTIMATE_REQ'
  },
  {
    shortName: 'Reemplazar',
    icon: 'loop',
    action: 'REPLACE_ESTIMATE_REQ'
  },
  {
    shortName: 'Aprobar',
    icon: 'check_circle',
    action: 'APPROVE'
  },
  {
    shortName: 'Observar',
    icon: 'remove_red_eye',
    action: 'OBSERVE'
  },
  {
    shortName: 'Documento final',
    icon: 'open_in_browser',
    action: 'UPPLOAD_FINAL_ESTIMATE_REQ'
  },
  {
    shortName: 'Descargar',
    icon: 'file_download',
    action: 'SAVE'
  }
];

export const F01_ESTIMATE_MENU: IMenu[] = [
  {
    shortName: 'Reemplazar',
    icon: 'loop',
    action: 'REPLACE_ESTIMATE_F01'
  },
  {
    shortName: 'Descargar',
    icon: 'file_download',
    action: 'SAVE'
  }
];

export const CDP_ESTIMATE_MENU: IMenu[] = [
  {
    shortName: 'Reemplazar',
    icon: 'loop',
    action: 'REPLACE_ESTIMATE_CDP'
  },
  {
    shortName: 'Descargar',
    icon: 'file_download',
    action: 'SAVE'
  }
];

export const FINAL_ESTIMATE_REQ_MENU: IMenu[] = [
  {
    shortName: 'Acreditar',
    icon: 'gavel',
    action: 'ACCREDIT_FINAL_ESTIMATE_REQ'
  },
  {
    shortName: 'Reemplazar',
    icon: 'loop',
    action: 'REPLACE_FINAL_ESTIMATE_REQ'
  },
  {
    shortName: 'Aprobar',
    icon: 'check_circle',
    action: 'APPROVE'
  },
  {
    shortName: 'Observar',
    icon: 'remove_red_eye',
    action: 'OBSERVE'
  },
  {
    shortName: 'Documento final',
    icon: 'open_in_browser',
    action: 'UPPLOAD_FINISH_ESTIMATE_REQ'
  },
  {
    shortName: 'Descargar',
    icon: 'file_download',
    action: 'SAVE'
  }
];

export const F01_FINAL_ESTIMATE_MENU: IMenu[] = [
  {
    shortName: 'Reemplazar',
    icon: 'loop',
    action: 'REPLACE_FINAL_ESTIMATE_F01'
  },
  {
    shortName: 'Descargar',
    icon: 'file_download',
    action: 'SAVE'
  }
];

export const CDP_FINAL_ESTIMATE_MENU: IMenu[] = [
  {
    shortName: 'Reemplazar',
    icon: 'loop',
    action: 'REPLACE_FINAL_ESTIMATE_CDP'
  },
  {
    shortName: 'Descargar',
    icon: 'file_download',
    action: 'SAVE'
  }
];

export const MENU_CLARIFY_REQUEST: IMenu[] = [
  {
    shortName: 'Reemplazar',
    icon: 'loop',
    action: 'REPLACE_REQ_CLARIFY'
  },
  {
    shortName: 'Descargar',
    icon: 'file_download',
    action: 'SAVE'
  }
];

export const EVALUATION_REPORT_MENU: IMenu[] = [
  {
    shortName: 'Acreditar',
    icon: 'gavel',
    action: 'ACCREDIT_EVALUATION'
  },
  {
    shortName: 'Reemplazar',
    icon: 'loop',
    action: 'REPLACE_EVALUATION'
  },
  {
    shortName: 'Aprobar',
    icon: 'check_circle',
    action: 'APPROVE'
  },
  {
    shortName: 'Observar',
    icon: 'remove_red_eye',
    action: 'OBSERVE'
  },
  {
    shortName: 'Documento final',
    icon: 'open_in_browser',
    action: 'UPPLOAD_FINAL_EVALUATION'
  },
  {
    shortName: 'Descargar',
    icon: 'file_download',
    action: 'SAVE'
  }
];

export const NO_OBJ_EVALUATION_MENU: IMenu[] = [
  {
    shortName: 'Reemplazar',
    icon: 'loop',
    action: 'REPLACE_EVALUATION_OBJ'
  },
  {
    shortName: 'Descargar',
    icon: 'file_download',
    action: 'SAVE'
  }
];

export const NO_OBJ_RES_EVALUATION_MENU: IMenu[] = [
  {
    shortName: 'Reemplazar',
    icon: 'loop',
    action: 'REPLACE_EVALUATION_OBJ_RES'
  },
  {
    shortName: 'Descargar',
    icon: 'file_download',
    action: 'SAVE'
  }
];

export const CLARIFY_MENU: IMenu[] = [
  {
    shortName: 'Acreditar',
    icon: 'gavel',
    action: 'ACCREDIT_RES_CLARIFY'
  },
  {
    shortName: 'Reemplazar',
    icon: 'loop',
    action: 'REPLACE_RES_CLARIFY'
  },
  {
    shortName: 'Aprobar',
    icon: 'check_circle',
    action: 'APPROVE'
  },
  {
    shortName: 'Observar',
    icon: 'remove_red_eye',
    action: 'OBSERVE'
  },
  {
    shortName: 'Documento final',
    icon: 'open_in_browser',
    action: 'UPPLOAD_FINAL_RES_CLARIFY'
  },
  {
    shortName: 'Descargar',
    icon: 'file_download',
    action: 'SAVE'
  }
];

export const BIDDING_MENU: IMenu[] = [
  {
    shortName: 'Acreditar',
    icon: 'gavel',
    action: 'ACCREDIT_DOC'
  },
  {
    shortName: 'Reemplazar',
    icon: 'loop',
    action: 'REPLACE_BIDDING'
  },
  {
    shortName: 'Aprobar',
    icon: 'check_circle',
    action: 'APPROVE'
  },
  {
    shortName: 'Observar',
    icon: 'remove_red_eye',
    action: 'OBSERVE'
  },
  {
    shortName: 'Documento final',
    icon: 'open_in_browser',
    action: 'UPPLOAD_FINAL_BIDDING'
  },
  {
    shortName: 'Descargar',
    icon: 'file_download',
    action: 'SAVE'
  }
];

export const OBJECTION_BIDDING_MENU: IMenu[] = [
  {
    shortName: 'Reemplazar',
    icon: 'loop',
    action: 'REPLACE_B_NO_OBJ'
  },
  {
    shortName: 'Descargar',
    icon: 'file_download',
    action: 'SAVE'
  }
];

export const OBJECTION_RES_BIDDING_MENU: IMenu[] = [
  {
    shortName: 'Reemplazar',
    icon: 'loop',
    action: 'REPLACE_B_RESPONSE_NO_OBJ'
  },
  {
    shortName: 'Descargar',
    icon: 'file_download',
    action: 'SAVE'
  }
];

export const AMENDMENT_RESPONSE_MENU: IMenu[] = [
  {
    shortName: 'Acreditar',
    icon: 'gavel',
    action: 'ACCREDIT_AMENDMENT'
  },
  {
    shortName: 'Reemplazar',
    icon: 'loop',
    action: 'REPLACE_AMENDMENT'
  },
  {
    shortName: 'Aprobar',
    icon: 'check_circle',
    action: 'APPROVE'
  },
  {
    shortName: 'Observar',
    icon: 'remove_red_eye',
    action: 'OBSERVE'
  },
  {
    shortName: 'Documento final',
    icon: 'open_in_browser',
    action: 'UPPLOAD_FINAL_AMENDMENT'
  },
  {
    shortName: 'Descargar',
    icon: 'file_download',
    action: 'SAVE'
  }
];

export const PAYMENT_REQUEST_MENU: IMenu[] = [
  {
    shortName: 'Acreditar',
    icon: 'gavel',
    action: 'ACCREDIT_PAYMENT_REQ'
  },
  {
    shortName: 'Reemplazar',
    icon: 'loop',
    action: 'REPLACE_PAYMENT_REQ'
  },
  {
    shortName: 'Aprobar',
    icon: 'check_circle',
    action: 'APPROVE'
  },
  {
    shortName: 'Observar',
    icon: 'remove_red_eye',
    action: 'OBSERVE'
  },
  {
    shortName: 'Documento final',
    icon: 'open_in_browser',
    action: 'UPPLOAD_FINAL_RETAINER'
  },
  {
    shortName: 'Descargar',
    icon: 'file_download',
    action: 'SAVE'
  }
];

export const F01_RETAINER_MENU: IMenu[] = [
  {
    shortName: 'Reemplazar',
    icon: 'loop',
    action: 'REPLACE_F01_RETAINER'
  },
  {
    shortName: 'Descargar',
    icon: 'file_download',
    action: 'SAVE'
  }
];

export const PROFF_PAYMENT_MENU: IMenu[] = [
  {
    shortName: 'Reemplazar',
    icon: 'loop',
    action: 'REPLACE_PROOF_PAYMENT'
  },
  {
    shortName: 'Descargar',
    icon: 'file_download',
    action: 'SAVE'
  }
];

export const AMENDMENT_REQUEST_MENU: IMenu[] = [
  {
    shortName: 'Reemplazar',
    icon: 'loop',
    action: 'REPLACE_AMENDMENT_REQ'
  },
  {
    shortName: 'Descargar',
    icon: 'file_download',
    action: 'SAVE'
  }
];

export const AMENDMENT_OBJECTION_MENU: IMenu[] = [
  {
    shortName: 'Reemplazar',
    icon: 'loop',
    action: 'REPLACE_AMENDMENT_OBJ'
  },
  {
    shortName: 'Descargar',
    icon: 'file_download',
    action: 'SAVE'
  }
];

export const AMENDMENT_OBJECTION_RES_MENU: IMenu[] = [
  {
    shortName: 'Reemplazar',
    icon: 'loop',
    action: 'REPLACE_AMENDMENT_RES_OBJ'
  },
  {
    shortName: 'Descargar',
    icon: 'file_download',
    action: 'SAVE'
  }
];

export const MODIFY_CONTRACT_MENU: IMenu[] = [
  {
    shortName: 'Acreditar',
    icon: 'gavel',
    action: 'ACCREDIT_MODIFY_CONTRACT'
  },
  {
    shortName: 'Reemplazar',
    icon: 'loop',
    action: 'REPLACE_CONTRACT_MODIFY'
  },
  {
    shortName: 'Aprobar',
    icon: 'check_circle',
    action: 'APPROVE'
  },
  {
    shortName: 'Observar',
    icon: 'remove_red_eye',
    action: 'OBSERVE'
  },
  {
    shortName: 'Documento final',
    icon: 'open_in_browser',
    action: 'UPPLOAD_FINAL_MODIFY_CONTRACT'
  },
  {
    shortName: 'Descargar',
    icon: 'file_download',
    action: 'SAVE'
  }
];

export const MODIFY_CONTRACT_MENU_STEP_3: IMenu[] = [
  {
    shortName: 'Acreditar',
    icon: 'gavel',
    action: 'ACCREDIT_MODIFY_CONTRACT_STEP_3'
  },
  {
    shortName: 'Reemplazar',
    icon: 'loop',
    action: 'REPLACE_CONTRACT_MODIFY_STEP_3'
  },
  {
    shortName: 'Aprobar',
    icon: 'check_circle',
    action: 'APPROVE'
  },
  {
    shortName: 'Observar',
    icon: 'remove_red_eye',
    action: 'OBSERVE'
  },
  {
    shortName: 'Documento final',
    icon: 'open_in_browser',
    action: 'UPPLOAD_FINAL_MODIFY_CONTRACT_STEP_3'
  },
  {
    shortName: 'Descargar',
    icon: 'file_download',
    action: 'SAVE'
  }
];

export const SIGNED_CONTRACT_MENU: IMenu[] = [
  {
    shortName: 'Acreditar',
    icon: 'gavel',
    action: 'ACCREDIT_SIGNED_CONTRACT'
  },
  {
    shortName: 'Reemplazar',
    icon: 'loop',
    action: 'REPLACE_SIGNED_CONTRACT'
  },
  {
    shortName: 'Aprobar',
    icon: 'check_circle',
    action: 'APPROVE'
  },
  {
    shortName: 'Observar',
    icon: 'remove_red_eye',
    action: 'OBSERVE'
  },
  {
    shortName: 'Documento final',
    icon: 'open_in_browser',
    action: 'UPPLOAD_FINAL_SIGNED_CONTRACT'
  },
  {
    shortName: 'Descargar',
    icon: 'file_download',
    action: 'SAVE'
  }
];

export const UPLOAD_MODAL_ACTIONS = {
  ACCREDIT_DOC: {
    title: 'Acreditar documento',
    documentType: 'biddingDocument',
    action: 'acreditted',
    documentTitle: 'Documento de licitación'
  },
  REPLACE_BIDDING: {
    title: 'Remplazar documento',
    documentType: 'biddingDocument',
    action: 'upload',
    documentTitle: 'Documento de licitación'
  },
  UPPLOAD_FINAL_BIDDING: {
    title: 'Documento final',
    documentType: 'biddingDocument',
    action: 'upload',
    documentTitle: 'Documento de licitación'
  },
  FINISH_BIDDING: {
    title: 'Documento final',
    documentType: 'biddingDocument',
    action: 'upload',
    documentTitle: 'Documento de licitación'
  },
  REPLACE_B_NO_OBJ: {
    title: 'Remplazar documento',
    documentType: 'noObjectionBidding',
    action: 'upload',
    documentTitle: 'No objeción al documento de licitación'
  },
  REPLACE_B_RESPONSE_NO_OBJ: {
    title: 'Reemplazar documento',
    documentType: 'noObjectionResponseBidding',
    action: 'upload',
    documentTitle: 'Respuesta de la no objeción al documento de licitación'
  },
  REPLACE_REQ_CLARIFY: {
    title: 'Remplazar documento',
    documentType: 'clarificationRequest',
    action: 'upload',
    documentTitle: 'Pedido de aclaratoria'
  },
  REPLACE_RES_CLARIFY: {
    title: 'Remplazar documento',
    documentType: 'clarifyingResponse',
    action: 'upload',
    documentTitle: 'Aclaratoria'
  },
  ACCREDIT_RES_CLARIFY: {
    title: 'Remplazar documento',
    documentType: 'clarifyingResponse',
    action: 'upload',
    documentTitle: 'Aclaratoria'
  },
  UPPLOAD_FINAL_RES_CLARIFY: {
    title: 'Subir documento final',
    documentType: 'clarifyingResponse',
    action: 'upload',
    documentTitle: 'Aclaratoria'
  },
  ACCREDIT_AMENDMENT: {
    title: 'Acreditar documento',
    documentType: 'amendment',
    action: 'acreditted',
    documentTitle: 'Enmienda'
  },
  REPLACE_AMENDMENT_OBJ: {
    title: 'Remplazar documento',
    documentType: 'amendmentNoObjection',
    action: 'upload',
    documentTitle: 'No objeción a la Enmienda'
  },
  REPLACE_AMENDMENT_RES_OBJ: {
    title: 'Remplazar documento',
    action: 'upload',
    documentType: 'amendmentNoObjectionResponse',
    documentTitle: 'Respuesta de la no objeción a la enmienda'
  },
  REPLACE_AMENDMENT_REQ: {
    title: 'Remplazar documento',
    documentType: 'amendmentRequest',
    action: 'upload',
    documentTitle: 'Pedido de Enmienda'
  },
  REPLACE_AMENDMENT: {
    title: 'Remplazar documento',
    documentType: 'amendment',
    action: 'upload',
    documentTitle: 'Enmienda'
  },
  UPPLOAD_FINAL_AMENDMENT: {
    title: 'Subir documento final',
    documentType: 'amendment',
    action: 'upload',
    documentTitle: 'Enmienda'
  },
  REPLACE_EVALUATION: {
    title: 'Remplazar documento',
    documentType: 'evaluationReport',
    action: 'upload',
    documentTitle: 'Informe de evaluación'
  },
  ACCREDIT_EVALUATION: {
    title: 'Remplazar documento',
    documentType: 'evaluationReport',
    action: 'upload',
    documentTitle: 'Informe de evaluación'
  },
  UPPLOAD_FINAL_EVALUATION: {
    title: 'Subir documento final',
    documentType: 'evaluationReport',
    action: 'upload',
    documentTitle: 'Informe de evaluación'
  },
  REPLACE_EVALUATION_OBJ: {
    title: 'Remplazar documento',
    documentType: 'evaluationReportObj',
    action: 'upload',
    documentTitle: 'No objeción al informe de evaluación'
  },
  REPLACE_EVALUATION_OBJ_RES: {
    title: 'Remplazar documento',
    documentType: 'evaluationReportObjResponse',
    action: 'upload',
    documentTitle: 'Respuesta de la no objeción al informe de evaluación'
  },
  REPLACE_PROOF_PAYMENT: {
    title: 'Remplazar documento',
    documentType: 'proofPayment',
    action: 'upload',
    documentTitle: 'Comprobante de pago de anticipo'
  },
  REPLACE_F01_RETAINER: {
    title: 'Remplazar documento',
    documentType: 'f01Retainer',
    action: 'upload',
    documentTitle: 'F01 de anticipo'
  },
  REPLACE_PAYMENT_REQ: {
    title: 'Remplazar solicitud de anticipo de pago',
    documentType: 'paymentRequest',
    action: 'upload',
    documentTitle: 'Solicitud de anticipo'
  },
  UPPLOAD_FINAL_RETAINER: {
    title: 'Subir documento final',
    documentType: 'paymentRequest',
    action: 'upload',
    documentTitle: 'Solicitud de anticipo'
  },
  REPLACE_ESTIMATE_REQ: {
    title: 'Remplazar documento',
    documentType: 'estimateRequest',
    action: 'upload',
    documentTitle: 'Pago de estimación'
  },
  UPPLOAD_FINAL_ESTIMATE_REQ: {
    title: 'Subir documento final',
    documentType: 'estimateRequest',
    action: 'upload',
    documentTitle: 'Pago final'
  },
  REPLACE_ESTIMATE_F01: {
    title: 'Remplazar documento',
    documentType: 'f01Estimate',
    action: 'upload',
    documentTitle: 'F01 de pago de estimación'
  },
  REPLACE_ESTIMATE_CDP: {
    title: 'Remplazar documento',
    documentType: 'cdpEstimate',
    action: 'upload',
    documentTitle: 'CDP de pago de estimación'
  },
  ACCREDIT_ESTIMATE_REQ: {
    title: 'Remplazar documento',
    documentType: 'estimateRequest',
    action: 'acreditted',
    documentTitle: 'Pago de estimación'
  },
  REPLACE_FINAL_ESTIMATE_REQ: {
    title: 'Remplazar documento',
    documentType: 'finalEstimateRequest',
    action: 'upload',
    documentTitle: 'Pago final'
  },
  UPPLOAD_FINISH_ESTIMATE_REQ: {
    title: 'Subir documento final',
    documentType: 'finalEstimateRequest',
    action: 'upload',
    documentTitle: 'Pago final'
  },
  REPLACE_FINAL_ESTIMATE_F01: {
    title: 'Remplazar documento',
    documentType: 'finalEstimateF01',
    action: 'upload',
    documentTitle: 'F01 de pago final'
  },
  ACCREDIT_FINAL_ESTIMATE_REQ: {
    title: 'Remplazar documento',
    documentType: 'finalEstimateRequest',
    action: 'acreditted',
    documentTitle: 'Pago final'
  },
  REPLACE_FINAL_ESTIMATE_CDP: {
    title: 'Remplazar documento',
    documentType: 'finalEstimateCdp',
    action: 'upload',
    documentTitle: 'CDP de pago final'
  },
  ACCREDIT_PAYMENT_REQ: {
    title: 'Acreditar documento',
    documentType: 'paymentRequest',
    action: 'acreditted',
    documentTitle: 'Solicitud de anticipo'
  },
  REPLACE_CONTRACT_MODIFY: {
    title: 'Remplazar contrato',
    documentType: 'contractModification',
    action: 'upload',
    documentTitle: 'Modificación de contrato'
  },
  ACCREDIT_MODIFY_CONTRACT: {
    title: 'Acreditar contrato',
    documentType: 'contractModification',
    action: 'acreditted',
    documentTitle: 'Modificación de contrato'
  },
  UPPLOAD_FINAL_MODIFY_CONTRACT: {
    title: 'Subir documento final',
    documentType: 'contractModification',
    action: 'upload',
    documentTitle: 'Modificación de contrato'
  },
  REPLACE_CONTRACT_MODIFY_STEP_3: {
    title: 'Remplazar contrato',
    documentType: 'contractModificationStep3',
    action: 'upload',
    documentTitle: 'Modificación de contrato'
  },
  ACCREDIT_MODIFY_CONTRACT_STEP_3: {
    title: 'Acreditar contrato',
    documentType: 'contractModificationStep3',
    action: 'acreditted',
    documentTitle: 'Modificación de contrato'
  },
  UPPLOAD_FINAL_MODIFY_CONTRACT_STEP_3: {
    title: 'Subir documento final',
    documentType: 'contractModificationStep3',
    action: 'upload',
    documentTitle: 'Modificación de contrato'
  },
  REPLACE_SIGNED_CONTRACT: {
    title: 'Remplazar contrato',
    documentType: 'signedContractDocument',
    action: 'upload',
    documentTitle: 'Contrato firmado'
  },
  ACCREDIT_SIGNED_CONTRACT: {
    title: 'Acreditar contrato firmado',
    documentType: 'signedContractDocument',
    action: 'acreditted',
    documentTitle: 'Contrato firmado'
  },
  UPPLOAD_FINAL_SIGNED_CONTRACT: {
    title: 'Subir documento final',
    documentType: 'signedContractDocument',
    action: 'upload',
    documentTitle: 'Contrato firmado'
  }
};

export const ACTIONS_THAT_ACCREDIT: string[] = [
  'ACCREDIT_RES_CLARIFY',
  'ACCREDIT_AMENDMENT',
  'ACCREDIT_ESTIMATE_REQ',
  'ACCREDIT_FINAL_ESTIMATE_REQ',
  'ACCREDIT_PAYMENT_REQ',
  'ACCREDIT_MODIFY_CONTRACT',
  'ACCREDIT_MODIFY_CONTRACT_STEP_3',
  'ACCREDIT_SIGNED_CONTRACT',
  'UPPLOAD_FINAL_MODIFY_CONTRACT',
  'UPPLOAD_FINAL_MODIFY_CONTRACT_STEP_3',
  'UPPLOAD_FINAL_BIDDING',
  'UPPLOAD_FINAL_AMENDMENT',
  'UPPLOAD_FINAL_RETAINER',
  'UPPLOAD_FINAL_RES_CLARIFY',
  'UPPLOAD_FINAL_ESTIMATE_REQ',
  'UPPLOAD_FINAL_SIGNED_CONTRACT',
  'UPPLOAD_FINISH_ESTIMATE_REQ',
  'UPPLOAD_FINAL_EVALUATION',
  'REPLACE_B_NO_OBJ',
  'REPLACE_B_RESPONSE_NO_OBJ',
  'REPLACE_REQ_CLARIFY',
  'REPLACE_AMENDMENT_OBJ',
  'REPLACE_AMENDMENT_RES_OBJ',
  'REPLACE_AMENDMENT_REQ',
  'REPLACE_EVALUATION_OBJ',
  'REPLACE_EVALUATION_OBJ_RES',
  'REPLACE_PROOF_PAYMENT',
  'REPLACE_F01_RETAINER',
  'REPLACE_ESTIMATE_F01',
  'REPLACE_ESTIMATE_CDP',
  'REPLACE_FINAL_ESTIMATE_F01',
  'REPLACE_FINAL_ESTIMATE_CDP',
];

export const FILE_PICKER_ACTIONS: string[] = [
  'REPLACE',
  'REPLACE_B_NO_OBJ',
  'REPLACE_B_RESPONSE_NO_OBJ',
  'REPLACE_BIDDING',
  'FINISH_BIDDING',
  'REPLACE_REQ_CLARIFY',
  'REPLACE_RES_CLARIFY',
  'ACCREDIT_RES',
  'REPLACE_AMENDMENT_REQ',
  'REPLACE_AMENDMENT',
  'REPLACE_AMENDMENT_OBJ',
  'REPLACE_AMENDMENT_RES_OBJ',
  'REPLACE_PROOF_PAYMENT',
  'REPLACE_F01_RETAINER',
  'REPLACE_PAYMENT_REQ',
  'REPLACE_EVALUATION',
  'UPPLOAD_FINAL_EVALUATION',
  'REPLACE_EVALUATION_OBJ',
  'REPLACE_EVALUATION_OBJ_RES',
  'REPLACE_ESTIMATE_REQ',
  'UPPLOAD_FINAL_ESTIMATE_REQ',
  'UPPLOAD_FINISH_ESTIMATE_REQ',
  'REPLACE_ESTIMATE_F01',
  'REPLACE_ESTIMATE_CDP',
  'REPLACE_FINAL_ESTIMATE_REQ',
  'REPLACE_FINAL_ESTIMATE_F01',
  'REPLACE_FINAL_ESTIMATE_CDP',
  'REPLACE_CONTRACT_MODIFY',
  'REPLACE_CONTRACT_MODIFY_STEP_3',
  'REPLACE_SIGNED_CONTRACT',
  'UPPLOAD_FINAL_MODIFY_CONTRACT',
  'UPPLOAD_FINAL_MODIFY_CONTRACT_STEP_3',
  'UPPLOAD_FINAL_BIDDING',
  'UPPLOAD_FINAL_AMENDMENT',
  'UPPLOAD_FINAL_RETAINER',
  'UPPLOAD_FINAL_RES_CLARIFY',
  'UPPLOAD_FINAL_SIGNED_CONTRACT',
];

export const CONFIRM_MODAL_PAYLOAD = {
  APPROVE: {
    title: 'APROBAR DOCUMENTO',
    textButtonReject: 'Cancelar',
    textButtonExecution: 'Aprobar',
    description: '¿Está seguro que desea aprobar este documento?',
    objectInEdition: 'process'
  },
  OBSERVE: {
    title: 'OBSERVAR DOCUMENTO',
    textButtonReject: 'Cancelar',
    textButtonExecution: 'Observar',
    description: '¿Está seguro que desea observar este documento?',
    objectInEdition: 'process'
  },
  ACCREDIT: {
    title: 'ACREDITAR DOCUMENTO',
    textButtonReject: 'Cancelar',
    textButtonExecution: 'Acreditar',
    description: '¿Está seguro que desea acreditar este documento?',
    objectInEdition: 'process'
  }
};

export const REQUEST_DETAILS = {
  transactionType: 'Modalidad o Tipo de transacción',
  processName: 'Nombre del proceso',
  fundingSource: 'Fuente de financiamiento',
  associatedComponent: 'Componente(s) asociado(s) (*)',
  operationNumber: 'N° de la operación (*)',
  contribution: 'Organismo financiero',
  pacLine: 'Línea PAC N°',
  quantity: 'Cantidad',
  description: 'Descripción',
  estimatedAmount: 'Monto estimado ($)',
  unit: 'Unidad',
  acquisitionMethod: 'Método de adquisición',
  newMethod: 'Nuevo método',
  contractType: 'Tipo de contrato',
  linkRepository: 'Link del repositorio',
  user: 'Usuario',
  role: 'Rol',
  detailRole: 'Detalle del rol',
  contractor: 'Contratista',
  supervisor: 'Supervisor',
  surnames: 'Apellido',
  fullname: 'Nombre'
};

export const RETRY_SECONDS = 10;
