import { ListColumn } from '@shared/models/common/classes';

export const COLUMNS_USER: ListColumn[] = [
    { name: 'ID', property: 'id', visible: false, isModelProperty: true, fixed: true },
    { name: 'Nombres', property: 'fullname', visible: true, isModelProperty: true, fixed: true },
    { name: 'Apellidos', property: 'surnames', visible: false, isModelProperty: true, fixed: true },
    { name: 'Correo', property: 'email', visible: true, isModelProperty: true, fixed: true },
    { name: 'Roles', property: 'roles', visible: true, isModelProperty: true, fixed: true },
    { name: 'Estado', property: 'status', visible: false, isModelProperty: true, fixed: false },
    { name: 'Estado', property: 'action-status', visible: true, fixed: true },
    { name: 'Usuario creación', property: 'createdBy', visible: false, isModelProperty: true, fixed: true },
    { name: 'Fecha creación', property: 'createdDate', visible: false, isModelProperty: true, fixed: true },
    { name: 'Usuario actualización', property: 'lastModifiedBy', visible: false, isModelProperty: true, fixed: true },
    { name: 'Fecha actualización', property: 'lastModifiedDate', visible: false, isModelProperty: true, fixed: true },
    { name: 'Ver', property: 'action-view', visible: true, fixed: false },
    { name: 'Editar', property: 'action-edit', visible: true, fixed: false }
];

export const COLUMNS_PROCESS: ListColumn[] = [
    { name: 'Nombre del proceso', property: 'processName', visible: true, isModelProperty: true, fixed: true },
    { name: 'Fecha de ingreso', property: 'entryDate', visible: true, isModelProperty: true, fixed: true },
    { name: 'N de operación', property: 'operationNumber', visible: true, isModelProperty: true, fixed: true },
    { name: 'Estado actual', property: 'status', visible: true, isModelProperty: true, fixed: true },
    { name: 'Usuario creación', property: 'createdBy', visible: false, isModelProperty: true, fixed: true },
    { name: 'Usuario actualización', property: 'lastModifiedBy', visible: false, isModelProperty: true, fixed: true },
    { name: 'Última actualización', property: 'lastModifiedDate', visible: true, isModelProperty: true, fixed: true },
    { name: 'Paso', property: 'step', visible: true, isModelProperty: true, fixed: true },
    { name: 'Solicitud', property: 'action-request', visible: true, fixed: false },
    { name: 'Licitación', property: 'action-process', visible: true, fixed: false },
    { name: 'Pagos', property: 'action-payments', visible: true, fixed: false },
];

export const COLUMNS_EVALUATION_COMMITTEE: ListColumn[] = [
  { name: 'id', property: 'id', isModelProperty: false, visible: false, fixed: false },
  { name: 'Nombre y apellidos', property: 'user', isModelProperty: true, visible: true, fixed: false },
  { name: 'Rol', property: 'rol', visible: true, isModelProperty: true, fixed: false },
  { name: 'Detalle rol', property: 'detailRole', visible: true, isModelProperty: true, fixed: false },
  { name: 'Editar', property: 'action-edit', visible: true, fixed: false },
  { name: 'Eliminar', property: 'action-delete', visible: true, fixed: false },
];
