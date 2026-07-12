import { Injectable } from '@angular/core';

import ExcelJS from 'exceljs';

import { saveAs } from 'file-saver';

@Injectable({

    providedIn:'root'

})

export class ExcelExportService{

    constructor(){}

    //======================================
    // MÉTODO PRINCIPAL
    //======================================

    exportarPerfilEstudiante(

        perfil:any,

        comparacionCurso:any,

        recomendaciones:any[],

        datosCompetencias:any[],

        datosSubmodulos:any[],

        datosTemas:any[]

    ):void{

        const workbook = new ExcelJS.Workbook();

        workbook.creator='Sistema de Competencias Matemáticas';

        workbook.created=new Date();

        this.crearHojaResumen(

            workbook,

            perfil,

            comparacionCurso

        );

        this.crearHojaCompetencias(

            workbook,

            datosCompetencias

        );

        this.crearHojaSubmodulos(

            workbook,

            datosSubmodulos

        );

        this.crearHojaTemas(

            workbook,

            datosTemas

        );

        this.crearHojaComparacion(

            workbook,

            comparacionCurso

        );

        this.crearHojaRecomendaciones(

            workbook,

            perfil,

            comparacionCurso,

            recomendaciones,

            datosCompetencias,

            datosSubmodulos

        );

        this.guardarArchivo(

            workbook,

            perfil.nombre

        );

    }

    //======================================
    // HOJAS
    //======================================

    private crearHojaResumen(

        workbook:ExcelJS.Workbook,

        perfil:any,

        comparacionCurso:any

    ):void{

        const hoja=

        workbook.addWorksheet(

            'Resumen'

        );

        this.aplicarTitulo(

            hoja,

            'A1:D1',

            'REPORTE DE RENDIMIENTO DEL ESTUDIANTE'

        );

        hoja.addRow([]);

        hoja.addRow([

            'Nombre',

            perfil.nombre

        ]);

        hoja.addRow([

            'Correo',

            perfil.correo

        ]);

        hoja.addRow([

            'Estado',

            perfil.estado

        ]);

        hoja.addRow([

            'Promedio del estudiante',

            comparacionCurso.promedio_estudiante+' %'

        ]);

        hoja.addRow([

            'Promedio del curso',

            comparacionCurso.promedio_curso+' %'

        ]);

        hoja.addRow([

            'Diferencia',

            comparacionCurso.diferencia+' %'

        ]);

        hoja.columns=[

            {

                width:35

            },

            {

                width:45

            }

        ];

        hoja.getColumn(

            1

        ).font={

            bold:true

        };

    }

    private crearHojaCompetencias(

        workbook:ExcelJS.Workbook,

        datosCompetencias:any[]

    ):void{

        const hoja = workbook.addWorksheet(

            'Competencias'

        );

        this.aplicarTitulo(

            hoja,

            'A1:D1',

            'RENDIMIENTO POR COMPETENCIAS'

        );

            hoja.addRow([]);

    hoja.addRow([

        'Competencia',

        'Promedio (%)',

        'Nivel',

        'Estado'

    ]);

    this.aplicarCabecera(

        hoja.getRow(3)

    );

    this.aplicarBordes(

        hoja.getRow(3)

    );

        datosCompetencias.forEach(

        competencia=>{

            const fila = hoja.addRow([

                competencia.competencia,

                competencia.promedio,

                this.obtenerNivel(

                    competencia.promedio

                ),

                competencia.promedio>=70

                ?

                'Fortaleza'

                :

                'Reforzar'

            ]);

            this.aplicarBordes(

                fila

            );

        }

    );

        this.configurarColumnas(

            hoja

            );

                this.configurarColumnas(

            hoja

            );

            const mejor =

            this.obtenerMejorRegistro(

                datosCompetencias

            );

            const peor =

            this.obtenerPeorRegistro(

                datosCompetencias

            );

                hoja.mergeCells(

                'A12:H15'

            );

            hoja.getCell(

                'A12'

            ).value=

            `La competencia con mayor rendimiento fue "${mejor.competencia}" con un promedio de ${mejor.promedio}%. La competencia "${peor.competencia}" obtuvo el menor rendimiento (${peor.promedio}%), por lo que se recomienda reforzar esta área mediante nuevas actividades de práctica.`;

            hoja.getCell(

                'A12'

            ).alignment={

                wrapText:true,

                vertical:'top'

            };

    }

    private crearHojaSubmodulos(

        workbook:ExcelJS.Workbook,

        datosSubmodulos:any[]

    ):void{

        const hoja = workbook.addWorksheet(

            'Submódulos'

        );

        this.aplicarTitulo(

            hoja,

            'A1:D1',

            'RENDIMIENTO POR SUBMÓDULOS'

        );

        hoja.addRow([]);

        hoja.addRow([

            'Submódulo',

            'Promedio (%)',

            'Nivel',

            'Estado'

        ]);

        this.aplicarCabecera(

            hoja.getRow(3)

        );

        this.aplicarBordes(

            hoja.getRow(3)

        );

        datosSubmodulos.forEach(

            submodulo=>{

                const fila = hoja.addRow([

                    submodulo.submodulo,

                    submodulo.promedio,

                    this.obtenerNivel(

                        submodulo.promedio

                    ),

                    submodulo.promedio>=70

                    ?

                    'Fortaleza'

                    :

                    'Reforzar'

                ]);

                this.aplicarBordes(

                    fila

                );

            }

        );

        this.configurarColumnas(

            hoja

        );

        this.insertarGrafico(

            workbook,

            hoja,

            'graficoSubmodulos',

            'F2',

            420,

            240

        );

        const mejor =

        this.obtenerMejorRegistro(

            datosSubmodulos

        );

        const peor =

        this.obtenerPeorRegistro(

            datosSubmodulos

        );

        hoja.mergeCells(

            'A12:H15'

        );

        hoja.getCell(

            'A12'

        ).value=

        `El submódulo con mayor rendimiento fue "${mejor.submodulo}" con un promedio de ${mejor.promedio}%. El submódulo "${peor.submodulo}" presentó el menor rendimiento (${peor.promedio}%), por lo que se recomienda fortalecer los contenidos correspondientes mediante nuevas actividades de práctica.`;

        hoja.getCell(

            'A12'

        ).alignment={

            wrapText:true,

            vertical:'top'

        };

    }

    private crearHojaTemas(

        workbook:ExcelJS.Workbook,

        datosTemas:any[]

    ):void{

        const hoja = workbook.addWorksheet(

            'Temas'

        );

        this.aplicarTitulo(

            hoja,

            'A1:D1',

            'RENDIMIENTO POR TEMAS'

        );

        hoja.addRow([]);

        hoja.addRow([

            'Tema',

            'Promedio (%)',

            'Nivel',

            'Estado'

        ]);

        this.aplicarCabecera(

            hoja.getRow(3)

        );

        this.aplicarBordes(

            hoja.getRow(3)

        );

        datosTemas.forEach(

            tema=>{

                const fila = hoja.addRow([

                    tema.tema,

                    tema.promedio,

                    this.obtenerNivel(

                        tema.promedio

                    ),

                    tema.promedio>=70

                    ?

                    'Fortaleza'

                    :

                    'Reforzar'

                ]);

                this.aplicarBordes(

                    fila

                );

            }

        );

        this.configurarColumnas(

            hoja

        );

        this.insertarGrafico(

            workbook,

            hoja,

            'graficoTemas',

            'F2',

            420,

            240

        );

        const mejor =

        this.obtenerMejorRegistro(

            datosTemas

        );

        const peor =

        this.obtenerPeorRegistro(

            datosTemas

        );

        hoja.mergeCells(

            'A12:H15'

        );

        hoja.getCell(

            'A12'

        ).value=

        `El tema con mejor desempeño fue "${mejor.tema}" con un promedio de ${mejor.promedio}%. El tema "${peor.tema}" presentó el menor rendimiento (${peor.promedio}%), por lo que se recomienda reforzar los contenidos relacionados mediante nuevas actividades de práctica.`;

        hoja.getCell(

            'A12'

        ).alignment={

            wrapText:true,

            vertical:'top'

        };

    }

    private crearHojaComparacion(

        workbook:ExcelJS.Workbook,

        comparacionCurso:any

    ):void{

        const hoja=

        workbook.addWorksheet(

            'Comparación'

        );

        this.aplicarTitulo(

            hoja,

            'A1:H1',

            'COMPARACIÓN CON EL CURSO'

        );

        hoja.addRow([]);

        hoja.addRow([

            'Indicador',

            'Valor'

        ]);

        this.aplicarCabecera(

            hoja.getRow(3)

        );

        this.aplicarBordes(

            hoja.getRow(3)

        );

        const datos=[

            [

                'Promedio del estudiante',

                comparacionCurso.promedio_estudiante+' %'

            ],

            [

                'Promedio del curso',

                comparacionCurso.promedio_curso+' %'

            ],

            [

                'Diferencia',

                comparacionCurso.diferencia+' %'

            ],

            [

                'Estado',

                comparacionCurso.estado

            ]

        ];

        datos.forEach(

            dato=>{

                const fila=

                hoja.addRow(

                    dato

                );

                this.aplicarBordes(

                    fila

                );

            }

        );

        hoja.columns=[

            {

                width:35

            },

            {

                width:22

            }

        ];

        this.insertarGrafico(

            workbook,

            hoja,

            'graficoComparacionCurso',

            'D3',

            350,

            220

        );

        hoja.mergeCells(

            'A11:H17'

        );

        hoja.getCell(

            'A11'

        ).value=

        comparacionCurso.mensaje;

        hoja.getCell(

            'A11'

        ).alignment={

            wrapText:true,

            vertical:'top'

        };

    }

    private crearHojaRecomendaciones(

    workbook:ExcelJS.Workbook,

    perfil:any,

    comparacionCurso:any,

    recomendaciones:any[],

    datosCompetencias:any[],

    datosSubmodulos:any[]

):void{

    const hoja = workbook.addWorksheet(

        'Recomendaciones'

    );

    this.aplicarTitulo(

        hoja,

        'A1:F1',

        'RECOMENDACIONES Y CONCLUSIONES'

    );

    hoja.addRow([]);
    hoja.getCell(

        'A3'

    ).value='Resumen general';

    hoja.getCell(

        'A3'

    ).font={

        bold:true,

        size:14

    };

    hoja.mergeCells(

        'A4:F7'

    );

    hoja.getCell(

        'A4'

    ).value=

    this.generarConclusion(

        perfil,

        comparacionCurso,

        recomendaciones,

        datosCompetencias,

        datosSubmodulos

    );

    hoja.getCell(

        'A4'

    ).alignment={

        wrapText:true,

        vertical:'top'

    };

        hoja.getCell(

        'A9'

    ).value='Recomendaciones personalizadas';

    hoja.getCell(

        'A9'

    ).font={

        bold:true,

        size:14

    };

        let fila=10;

    recomendaciones.forEach(

        recomendacion=>{

            hoja.getCell(

                `A${fila}`

            ).value='• '+recomendacion.titulo;

            hoja.getCell(

                `B${fila}`

            ).value=

            recomendacion.descripcion;

            fila++;

        }

    );

        fila+=2;

    hoja.getCell(

        `A${fila}`

    ).value='Observación final';

    hoja.getCell(

        `A${fila}`

    ).font={

        bold:true,

        size:14

    };

    fila++;

    hoja.mergeCells(

        `A${fila}:F${fila+3}`

    );

    hoja.getCell(

        `A${fila}`

    ).value=

    'Este reporte resume el desempeño del estudiante a partir de las evaluaciones registradas en el sistema. Las recomendaciones aquí presentadas tienen como objetivo orientar el proceso de mejora continua y facilitar el seguimiento académico por parte del docente.';

    hoja.getCell(

        `A${fila}`

    ).alignment={

        wrapText:true,

        vertical:'top'

    };

        hoja.columns=[

            {

                width:28

            },

            {

                width:70

            },

            {

                width:12

            },

            {

                width:12

            },

            {

                width:12

            },

            {

                width:12

            }

        ];

    }

    //======================================
    // ESTILOS
    //======================================

    private aplicarTitulo(

        hoja:ExcelJS.Worksheet,

        rango:string,

        titulo:string

    ):void{

        hoja.mergeCells(

            rango

        );

        const celda = hoja.getCell(

            rango.split(':')[0]

        );

        celda.value = titulo;

        celda.font={

            bold:true,

            size:18,

            color:{argb:'FFFFFFFF'}

        };

        celda.alignment={

            horizontal:'center',

            vertical:'middle'

        };

        celda.fill={

            type:'pattern',

            pattern:'solid',

            fgColor:{argb:'7C3AED'}

        };

    }

    private aplicarCabecera(

        fila:ExcelJS.Row

    ):void{

        fila.font={

            bold:true,

            color:{argb:'000000'}

        };

        fila.alignment={

            horizontal:'center',

            vertical:'middle'

        };

        fila.fill={

            type:'pattern',

            pattern:'solid',

            fgColor:{argb:'EDE9FE'}

        };

    }

    private configurarColumnas(

        hoja:ExcelJS.Worksheet

    ):void{

        hoja.columns=[

            {

                width:38

            },

            {

                width:18

            },

            {

                width:22

            },

            {

                width:18

            }

        ];

    }

    private aplicarBordes(

        fila:ExcelJS.Row

    ):void{

        fila.eachCell(

            celda=>{

                celda.border={

                    top:{

                        style:'thin'

                    },

                    left:{

                        style:'thin'

                    },

                    bottom:{

                        style:'thin'

                    },

                    right:{

                        style:'thin'

                    }

                };

            }

        );

    }

    //======================================
    // UTILIDADES
    //======================================

    private insertarGrafico(

        workbook:ExcelJS.Workbook,

        hoja:ExcelJS.Worksheet,

        idCanvas:string,

        posicion:string,

        ancho:number,

        alto:number

    ):void{

        const canvas=document.getElementById(

            idCanvas

        ) as HTMLCanvasElement;

        if(!canvas){

            return;

        }

        const imagen=

        canvas.toDataURL(

            'image/png'

        );

        const idImagen=

        workbook.addImage({

            base64:imagen,

            extension:'png'

        });

        hoja.addImage(

            idImagen,

            {

                tl:this.obtenerPosicionExcel(

                    posicion

                ),

                ext:{

                    width:ancho,

                    height:alto

                }

            }

        );

    }

    private obtenerPosicionExcel(

        posicion:string

    ):{

        col:number,

        row:number

    }{

        const letra=

        posicion.match(

            /^[A-Z]+/

        )?.[0] || 'A';

        const numero=

        posicion.match(

            /\d+$/

        )?.[0] || '1';

        return{

            col:letra.charCodeAt(

                0

            )-65,

            row:Number(

                numero

            )-1

        };

    }

    private obtenerNivel(

        promedio:number

    ):string{

        if(promedio>=90){

            return 'Excelente';

        }

        if(promedio>=80){

            return 'Muy bueno';

        }

        if(promedio>=70){

            return 'Bueno';

        }

        if(promedio>=60){

            return 'Regular';

        }

        return 'Necesita refuerzo';

    }

    private obtenerMejorRegistro(

        datos:any[]

    ):any{

        if(datos.length===0){

            return null;

        }

        return [...datos].sort(

            (a,b)=>b.promedio-a.promedio

        )[0];

    }

    private obtenerPeorRegistro(

        datos:any[]

    ):any{

        if(datos.length===0){

            return null;

        }

        return [...datos].sort(

            (a,b)=>a.promedio-b.promedio

        )[0];

    }

    private generarConclusion(

        perfil:any,

        comparacionCurso:any,

        recomendaciones:any[],

        datosCompetencias:any[],

        datosSubmodulos:any[]

    ):string{

        return '';

    }

    //======================================
    // EXPORTACIÓN
    //======================================

    private guardarArchivo(

        workbook:ExcelJS.Workbook,

        nombre:string

    ):void{

        workbook.xlsx.writeBuffer()

        .then(buffer=>{

            saveAs(

                new Blob(

                    [buffer]

                ),

                `Reporte_${nombre}.xlsx`

            );

        });

    }

}