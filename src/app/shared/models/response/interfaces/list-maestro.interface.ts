import { IRespuesta, IMaestro } from '@shared/models/common/interfaces';

export interface IListMaestroResponse {
    respuesta: IRespuesta;
    maestro: IMaestro[];
}
