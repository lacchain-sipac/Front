export interface IListMaestroRequest {
    maestro: IMaestro;
}


interface IMaestro {
    cod_maestro: string;
    ind_seleccionar: string;
    parametro1: string;
    parametro2: string;
    parametro3: string;
}
