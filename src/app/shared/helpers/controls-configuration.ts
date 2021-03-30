import {
  ICCLogin,
  ICCUser,
  ICCForgotPassword,
  ICCRequestStepTwo,
  ICCRequestStepOne,
  ICCRequestStepThree,
  ICCRequestStepFive,
  ICCCompletePassword,
  ICCProcessStepThree,
  ICCExecutionStepTwo,
  ICCAccreditDialog
} from '@shared/models/common/interfaces';

export const CC_LOGIN: ICCLogin = {
  username: {
    minlength: 7,
    maxlength: 100,
    error: {
      required: 'Debe ingresar un correo',
      maxlength: 'Máximo de caracteres permitidos: 100',
      minlength: 'Mínimo de caracteres permitidos: 7',
      pattern: 'Formato de correo inválido'
    }
  },
  password: {
    minlength: 8,
    maxlength: 12,
    error: {
      required: 'Debe ingresar una contraseña',
      maxlength: 'Máximo de caracteres permitidos: 12',
      minlength: 'Mínimo de caracteres permitidos: 8',
      pattern: 'Debe contener al menos una mayúscula y un caracter especial (@, #, $, %, &)'
    }
  }
};

export const CC_COMPLETE_PASSWORD: ICCCompletePassword = {
  password: {
    minlength: 8,
    maxlength: 12,
    error: {
      required: 'Debe ingresar una contraseña',
      maxlength: 'Máximo de caracteres permitidos: 12',
      minlength: 'Mínimo de caracteres permitidos: 8',
      pattern: 'Debe contener al menos una mayúscula y un caracter especial (@, #, $, %, &)'
    }
  },
  confirmPassword: {
    minlength: 8,
    maxlength: 12,
    error: {
      required: 'Debe ingresar una contraseña',
      maxlength: 'Máximo de caracteres permitidos: 12',
      minlength: 'Mínimo de caracteres permitidos: 8',
      pattern: 'Debe contener al menos una mayúscula y un caracter especial (@, #, $, %, &)'
    }
  }
};

export const CC_FORGOT_PASSWORD: ICCForgotPassword = {
  email: {
    minlength: 7,
    maxlength: 100,
    error: {
      required: 'Debe ingresar un correo',
      maxlength: 'Máximo de caracteres permitidos: 100',
      minlength: 'Mínimo de caracteres permitidos: 7',
      pattern: 'Formato de correo inválido'
    }
  }
};

export const CC_USER: ICCUser = {
  email: {
    minlength: 7,
    maxlength: 100,
    error: {
      required: 'Debe ingresar un correo',
      maxlength: 'Máximo de caracteres permitidos: 100',
      minlength: 'Mínimo de caracteres permitidos: 7',
      pattern: 'Formato de correo inválido'
    }
  },
  fullname: {
    minlength: 3,
    maxlength: 20,
    error: {
      required: 'Debe ingresar nombres',
      maxlength: 'Máximo de caracteres permitidos: 20',
      minlength: 'Mínimo de caracteres permitidos: 3',
    }
  },
  surnames: {
    minlength: 3,
    maxlength: 30,
    error: {
      required: 'Debe ingresar apellidos',
      maxlength: 'Máximo de caracteres permitidos: 30',
      minlength: 'Mínimo de caracteres permitidos: 3',
    }
  },
  status: {
    minlength: 1,
    maxlength: 12,
    error: {
      required: 'Debe seleccionar un estado',
      maxlength: 'Máximo de caracteres permitidos: 12',
      minlength: 'Mínimo de caracteres permitidos: 1',
    }
  }
};

export const CC_REQUEST_STEP_ONE: ICCRequestStepOne = {
  transactionType: {
    error: {
      required: 'Debe seleccionar la modalidad o el tipo de transacción',
    }
  },
  processName: {
    minlength: 3,
    maxlength: 1000,
    error: {
      required: 'Debe ingresar el nombre del proceso',
      maxlength: 'Máximo de caracteres permitidos: 1000',
      minlength: 'Mínimo de caracteres permitidos: 3',
    }
  },
  contribution: {
    error: {
      required: 'Debe seleccionar una opción',
    }
  },
  operationNumber: {
    error: {
      required: 'Debe seleccionar un número de operación'
    }
  },
  associatedComponent: {
    error: {
      required: 'Debe seleccionar un componente asociado'
    }
  },
  fundingSource: {
    error: {
      required: 'Debe seleccionar una fuente de financiamiento'
    }
  }
};

export const CC_REQUEST_STEP_TWO: ICCRequestStepTwo = {
  pacLine: {
    minlength: 7,
    maxlength: 30,
    error: {
      required: 'Debe ingresar un número',
      maxlength: 'Máximo de caracteres permitidos: 30',
      minlength: 'Mínimo de caracteres permitidos: 7',
    }
  },
  quantity: {
    minlength: 1,
    maxlength: 20,
    maxLimitNumber: 999999999999,
    error: {
      maxLimitNumber: 'El número de tener como máximo 12 digitos en la parte entera.',
      required: 'Debe ingresar una cantidad',
      maxlength: 'Máximo de caracteres permitidos: 20',
      minlength: 'Mínimo de caracteres permitidos: 1',
    }
  },
  unit: {
    error: {
      required: 'Debe seleccionar la unidad',
    }
  },
  description: {
    minlength: 1,
    maxlength: 1000,
    error: {
      required: 'Debe ingresar una descripción',
      maxlength: 'Máximo de caracteres permitidos: 1000',
      minlength: 'Mínimo de caracteres permitidos: 1',
    }
  },
  estimatedAmount: {
    minlength: 1,
    maxlength: 20,
    maxLimitNumber: 999999999999,
    error: {
      required: 'Debe ingresar un monto',
      maxLimitNumber: 'El número de tener como máximo 12 digitos en la parte entera.',
      maxlength: 'Máximo de caracteres permitidos: 20',
      minlength: 'Mínimo de caracteres permitidos: 1',
    }
  }
};

export const CC_REQUEST_STEP_THREE: ICCRequestStepThree = {
  acquisitionMethod: {
    error: {
      required: 'Debe seleccionar un método de adquisición',
    }
  },
  contractType: {
    error: {
      required: 'Debe seleccionar un tipo de contrato',
    }
  },
  newMethod: {
    minlength: 3,
    maxlength: 100,
    error: {
      required: 'Debe describir el método',
      maxlength: 'Máximo de caracteres permitidos: 100',
      minlength: 'Mínimo de caracteres permitidos: 3',
    }
  }
};

export const CC_REQUEST_STEP_FIVE: ICCRequestStepFive = {
  budgetStructure: {
    minlength: 3,
    maxlength: 300,
    error: {
      required: 'Debe ingresar una estructura presupuestaria',
      maxlength: 'Máximo de caracteres permitidos: 300',
      minlength: 'Mínimo de caracteres permitidos: 3',
    }
  },
  additionalComment: {
    minlength: 3,
    maxlength: 100,
    error: {
      maxlength: 'Máximo de caracteres permitidos: 100',
      minlength: 'Mínimo de caracteres permitidos: 3',
    }
  }
};

export const CC_PROCESS_STEP_THREE: ICCProcessStepThree = {
  rolName: {
    minlength: 3,
    maxlength: 13,
    error: {
      required: 'Debe seleccionar un rol',
    }
  },
  detailRole: {
    minlength: 3,
    maxlength: 100,
    error: {
      maxlength: 'Máximo de caracteres permitidos: 100',
      minlength: 'Mínimo de caracteres permitidos: 3',
    }
  },
  userName: {
    minlength: 3,
    maxlength: 100,
    error: {
      required: 'Debe ingresar un nombre',
      maxlength: 'Máximo de caracteres permitidos: 100',
      minlength: 'Mínimo de caracteres permitidos: 3',
    }
  }
};

export const CC_EXECUTION_STEP_TWO: ICCExecutionStepTwo = {
  contractor: {
    error: {
      required: 'Debe seleccionar uno o más de un contratista',
    }
  },
  supervisor: {
    error: {
      required: 'Debe seleccionar uno o más de un supervisor',
    }
  }
};

export const CC_ACCREDIT_DIALOG: ICCAccreditDialog = {
  observation: {
    error: {
      required: 'Debe ingresar una observación',
    }
  }
};
