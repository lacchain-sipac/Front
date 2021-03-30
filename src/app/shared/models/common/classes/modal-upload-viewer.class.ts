import { UPLOAD_MODAL_ACTIONS, ACTIONS_THAT_ACCREDIT } from '../../../helpers/constants';

export class ModalUploadViewer {
  textButtonExecution: string;
  textButtonReject: string;
  title: string;
  fileList: FileList;
  documentType: string;
  objectInEdition: string;
  accredited: string;
  idGroup?: string;
  documentTitle?: string;

  constructor(action: string, objectInEdition: string, files: FileList, idGroup?: string, documentTitle?: string) {
    this.textButtonExecution = 'Guardar';
    this.textButtonReject = 'Cancelar';
    this.title = UPLOAD_MODAL_ACTIONS[action].title;
    this.fileList = files;
    this.documentType = UPLOAD_MODAL_ACTIONS[action].documentType;
    this.objectInEdition = objectInEdition;
    this.accredited = ACTIONS_THAT_ACCREDIT.includes(action) ? '1' : '0';
    this.idGroup = idGroup;
    this.documentTitle = documentTitle || UPLOAD_MODAL_ACTIONS[action].documentTitle;
  }
}
