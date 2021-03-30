export type actionCode = 'SEE_REQUEST' | 'EDIT_REQUEST' | 'ACCREDIT';

export interface IMenu {
    shortName: string;
    path?: string;
    icon: string;
    action?: string;
}
