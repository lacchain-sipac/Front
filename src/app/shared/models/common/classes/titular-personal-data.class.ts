export class TitularPersonalData {
    nombres: string;
    apellido_paterno: string;
    apellido_materno: string;
    genero: string;
    fecha_nacimiento: string;
    talla: string;
    peso: string;

    constructor(
        nombres: string,
        apellido_paterno: string,
        apellido_materno: string,
        genero: string,
        fecha_nacimiento: string,
        talla: string,
        peso: string
    ) {
        this.nombres = nombres;
        this.apellido_paterno = apellido_paterno;
        this.apellido_materno = apellido_materno;
        this.genero = genero;
        this.fecha_nacimiento = fecha_nacimiento;
        this.talla = talla;
        this.peso = peso;
    }
}
