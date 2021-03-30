export class TitularContactData {

    num_fono: string;
    email: string;
    cod_nacionalidad: string;
    cod_departamento: string;
    cod_provincia: string;
    cod_distrito: string;
    direccion: string;
    ind_pep: string;

    constructor(
        num_fono: string,
        email: string,
        cod_nacionalidad: string,
        cod_departamento: string,
        cod_provincia: string,
        cod_distrito: string,
        direccion: string,
        ind_pep: string
    ) {
        this.num_fono = num_fono;
        this.email = email;
        this.cod_nacionalidad = cod_nacionalidad;
        this.cod_departamento = cod_departamento;
        this.cod_provincia = cod_provincia;
        this.cod_distrito = cod_distrito;
        this.direccion = direccion;
        this.ind_pep = ind_pep;
    }
}
