import { CommitteeViewer, RoleSelect } from '@shared/models/common/classes';


export interface IMemberCommitteDialog {
  title: string;
  textButtonReject: string;
  textButtonExecution: string;
  dataRoles?: RoleSelect[];
  memberCommittee?: CommitteeViewer;
  description?: string;
}
