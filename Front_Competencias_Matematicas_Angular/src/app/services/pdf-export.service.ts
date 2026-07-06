import { Injectable } from '@angular/core';

import jsPDF from 'jspdf';

@Injectable({

    providedIn:'root'

})

export class PdfExportService{

    constructor(){}

    exportarPerfilEstudiante(

        perfil:any,

        profesor:string,

        comparacionCurso:any,

        recomendaciones:any[],

        datosCompetencias:any[],

        datosSubmodulos:any[]

    ){

        const pdf = new jsPDF(

            'p',

            'mm',

            'a4'

        );

        

        this.dibujarEncabezado(

            pdf

        );

        this.dibujarInformacionGeneral(

            pdf,

            perfil,

            profesor

        );

        this.dibujarMetricas(

            pdf,

            perfil

        );

        this.dibujarComparacionCurso(

            pdf,

            comparacionCurso

        );

        this.dibujarRecomendaciones(

            pdf,

            recomendaciones

        );

        this.agregarPaginaGraficos(pdf);

        this.agregarPaginaConclusiones(

            pdf,

            perfil,

            comparacionCurso,

            recomendaciones,

            datosCompetencias,

            datosSubmodulos

        );

        pdf.save(

            `Reporte_${perfil.nombre}.pdf`

        );

    }

    private dibujarEncabezado(

        pdf:jsPDF

    ):void{

        pdf.setFillColor(

            124,

            58,

            237

        );

        pdf.rect(

            0,

            0,

            210,

            38,

            'F'

        );

        pdf.setTextColor(

            255,

            255,

            255

        );

        pdf.setFont(

            'helvetica',

            'bold'

        );

        pdf.setFontSize(

            18

        );

        pdf.text(

            'SISTEMA WEB PARA EL ENTRENAMIENTO',

            105,

            14,

            {

                align:'center'

            }

        );

        pdf.text(

            'DE COMPETENCIAS MATEMÁTICAS',

            105,

            22,

            {

                align:'center'

            }

        );

        pdf.setFontSize(

            14

        );

        pdf.text(

            'REPORTE DE RENDIMIENTO DEL ESTUDIANTE',

            105,

            31,

            {

                align:'center'

            }

        );

    }

    private dibujarInformacionGeneral(

        pdf:jsPDF,

        perfil:any,

        profesor:string

    ):void{

        pdf.setTextColor(

            90,

            90,

            90

        );

        pdf.setFont(

            'helvetica',

            'normal'

        );

        pdf.setFontSize(

            11

        );

        pdf.text(

            `Fecha: ${new Date().toLocaleDateString()}`,

            14,

            50

        );

        pdf.setFont(

            'helvetica',

            'bold'

        );

        pdf.text(

            'Estudiante:',

            14,

            60

        );

        pdf.setFont(

            'helvetica',

            'normal'

        );

        pdf.text(

            perfil.nombre,

            45,

            60

        );

        pdf.setFont(

            'helvetica',

            'bold'

        );

        pdf.text(

            'Profesor:',

            14,

            68

        );

        pdf.setFont(

            'helvetica',

            'normal'

        );

        pdf.text(

            profesor,

            45,

            68

        );

    }

    private dibujarMetricas(

        pdf:jsPDF,

        perfil:any

    ):void{

        pdf.setFont(

            'helvetica',

            'bold'

        );

        pdf.setFontSize(

            15

        );

        pdf.setTextColor(

            40,

            40,

            40

        );

        pdf.text(

            'Resumen General',

            14,

            85

        );

        this.dibujarTarjeta(

            pdf,

            14,

            92,

            'Tests',

            perfil.tests_realizados

        );

        this.dibujarTarjeta(

            pdf,

            62,

            92,

            'Promedio',

            perfil.promedio_general + '%'

        );

        this.dibujarTarjeta(

            pdf,

            110,

            92,

            'Mejor',

            perfil.mejor_puntaje + '%'

        );

        this.dibujarTarjeta(

            pdf,

            158,

            92,

            'Tiempo',

            perfil.tiempo_promedio + ' min'

        );

    }

    private dibujarTarjeta(

        pdf:jsPDF,

        x:number,

        y:number,

        titulo:string,

        valor:string

    ):void{

        pdf.setFillColor(

            248,

            245,

            255

        );

        pdf.setDrawColor(

            124,

            58,

            237

        );

        pdf.roundedRect(

            x,

            y,

            38,

            28,

            3,

            3,

            'FD'

        );

        pdf.setFont(

            'helvetica',

            'bold'

        );

        pdf.setFontSize(

            10

        );

        pdf.setTextColor(

            90,

            90,

            90

        );

        pdf.text(

            titulo,

            x+3,

            y+7

        );

        pdf.setFont(

            'helvetica',

            'bold'

        );

        pdf.setFontSize(

            16

        );

        pdf.setTextColor(

            124,

            58,

            237

        );

        pdf.text(

            String(valor),

            x+3,

            y+19

        );

    }

    private dibujarComparacionCurso(

        pdf:jsPDF,

        comparacion:any

    ):void{

        pdf.setFont(

            'helvetica',

            'bold'

        );

        pdf.setFontSize(

            15

        );

        pdf.setTextColor(

            40,

            40,

            40

        );

        pdf.text(

            'Comparación con el curso',

            14,

            135

        );

        pdf.setFillColor(

            250,

            250,

            250

        );

        pdf.roundedRect(

            14,

            142,

            182,

            42,

            3,

            3,

            'F'

        );

        pdf.setFont(

            'helvetica',

            'normal'

        );

        pdf.setFontSize(

            11

        );

        pdf.setTextColor(

            90,

            90,

            90

        );

        pdf.text(

            'Promedio del estudiante',

            20,

            154

        );

        pdf.text(

            'Promedio del curso',

            80,

            154

        );

        pdf.text(

            'Diferencia',

            140,

            154

        );

        pdf.setFont(

            'helvetica',

            'bold'

        );

        pdf.setFontSize(

            18

        );

        pdf.setTextColor(

            124,

            58,

            237

        );

        pdf.text(

            comparacion.promedio_estudiante + '%',

            20,

            168

        );

        pdf.text(

            comparacion.promedio_curso + '%',

            80,

            168

        );

        if(

            comparacion.diferencia>=0

        ){

            pdf.setTextColor(

                34,

                197,

                94

            );

        }

        else{

            pdf.setTextColor(

                239,

                68,

                68

            );

        }

        pdf.text(

            comparacion.diferencia + '%',

            140,

            168

        );

        pdf.setFont(

            'helvetica',

            'italic'

        );

        pdf.setFontSize(

            11

        );

        pdf.setTextColor(

            70,

            70,

            70

        );

        pdf.text(

            comparacion.mensaje,

            20,

            180

        );

    }

    
    private dibujarRecomendaciones(

        pdf:jsPDF,

        recomendaciones:any[]

    ):void{

        pdf.setFont(

            'helvetica',

            'bold'

        );

        pdf.setFontSize(

            15

        );

        pdf.setTextColor(

            35,

            35,

            35

        );

        pdf.text(

            'Recomendaciones personalizadas',

            14,

            195

        );

        let y=205;

        recomendaciones.forEach(

            recomendacion=>{

                pdf.setFillColor(

                    245,

                    245,

                    250

                );

                pdf.roundedRect(

                    14,

                    y-6,

                    182,

                    18,

                    3,

                    3,

                    'F'

                );

                pdf.setFont(

                    'helvetica',

                    'bold'

                );

                pdf.setFontSize(

                    12

                );

                pdf.setTextColor(

                    124,

                    58,

                    237

                );

                pdf.text(

                    recomendacion.titulo,

                    20,

                    y

                );

                pdf.setFont(

                    'helvetica',

                    'normal'

                );

                pdf.setFontSize(

                    10

                );

                pdf.setTextColor(

                    70,

                    70,

                    70

                );

                pdf.text(

                    recomendacion.descripcion,

                    20,

                    y+6

                );

                y+=24;

            }

        );

    }

    private agregarPaginaGraficos(

        pdf:jsPDF

    ):void{

        pdf.addPage();

        this.dibujarEncabezado(

            pdf

        );

        pdf.setFont(

            'helvetica',

            'bold'

        );

        pdf.setFontSize(

            18

        );

        pdf.setTextColor(

            40,

            40,

            40

        );

        pdf.text(

            'ANÁLISIS GRÁFICO DEL RENDIMIENTO',

            105,

            52,

            {

                align:'center'

            }

        );

        this.insertarGrafico(

            pdf,

            'graficoCompetenciasPerfil',

            'Rendimiento por competencia',

            18,

            65

        );

        this.insertarGrafico(

            pdf,

            'graficoSubmodulos',

            'Rendimiento por submódulo',

            18,

            165

        );

        this.agregarSegundaPaginaGraficos(

            pdf

        );

    }

    private agregarSegundaPaginaGraficos(

        pdf:jsPDF

    ):void{

        pdf.addPage();

        this.dibujarEncabezado(

            pdf

        );

        pdf.setFont(

            'helvetica',

            'bold'

        );

        pdf.setFontSize(

            18

        );

        pdf.text(

            'ANÁLISIS GRÁFICO DEL RENDIMIENTO',

            105,

            52,

            {

                align:'center'

            }

        );

        this.insertarGrafico(

            pdf,

            'graficoTemas',

            'Rendimiento por tema',

            18,

            65

        );

        this.insertarGrafico(

            pdf,

            'graficoEvolucion',

            'Evolución del rendimiento',

            18,

            165

        );

    }

   private insertarGrafico(

        pdf:jsPDF,

        idCanvas:string,

        titulo:string,

        x:number,

        y:number

    ):void{

        const canvas=

        document.getElementById(

            idCanvas

        ) as HTMLCanvasElement;

        if(

            !canvas

        ){

            return;

        }

        pdf.setFont(

            'helvetica',

            'bold'

        );

        pdf.setFontSize(

            14

        );

        pdf.setTextColor(

            55,

            55,

            55

        );

        pdf.text(

            titulo,

            x,

            y-8

        );

        pdf.setDrawColor(

            220,

            220,

            220

        );

        pdf.roundedRect(

            x,

            y,

            175,

            82,

            3,

            3

        );

        const imagen=

        canvas.toDataURL(

            'image/png',

            1.0

        );

        pdf.addImage(

            imagen,

            'PNG',

            x+3,

            y+3,

            169,

            76

        );

    }

    private agregarPaginaConclusiones(

        pdf:jsPDF,

        perfil:any,

        comparacionCurso:any,

        recomendaciones:any[],

        datosCompetencias:any[],

        datosSubmodulos:any[]

    ):void{

        pdf.addPage();

        this.dibujarEncabezado(

            pdf

        );

        

        pdf.setFont(

            'helvetica',

            'bold'

        );

        pdf.setFontSize(

            18

        );

        pdf.text(

            'PRECISIÓN POR DIFICULTAD Y CONCLUSIONES',

            105,

            52,

            {

                align:'center'

            }

        );

        this.insertarGrafico(

            pdf,

            'graficoDificultad',

            'Precisión por dificultad',

            18,

            68

        );

        this.dibujarConclusiones(

            pdf,

            perfil,

            comparacionCurso,

            recomendaciones,

            datosCompetencias,

            datosSubmodulos

        );

    }

    

    private dibujarConclusiones(

        pdf: jsPDF,

        perfil:any,

        comparacionCurso:any,

        recomendaciones:any[],

        datosCompetencias:any[],

        datosSubmodulos:any[]

    ):void{

        pdf.setFillColor(
            245,
            240,
            255
        );

        pdf.roundedRect(
            20,
            185,
            170,
            80,
            5,
            5,
            'F'
        );

        pdf.setFont(
            'helvetica',
            'bold'
        );

        pdf.setFontSize(
            16
        );

        pdf.setTextColor(
            40,
            40,
            40
        );

        pdf.text(
            'Conclusión general',
            25,
            198
        );

        const conclusion = this.generarConclusion(

            perfil,

            comparacionCurso,

            recomendaciones,

            datosCompetencias,

            datosSubmodulos

        );

        pdf.setFont(
            'helvetica',
            'normal'
        );

        pdf.setFontSize(
            11
        );

        const texto = pdf.splitTextToSize(

            conclusion,

            160

        );

        pdf.text(

            texto,

            25,

            210

        );

    }

    private generarConclusion(

        perfil:any,

        comparacionCurso:any,

        recomendaciones:any[],

        datosCompetencias:any[],

        datosSubmodulos:any[]

    ):string{

        const promedio = comparacionCurso.promedio_estudiante;

        const diferencia = comparacionCurso.diferencia;

        let competencia = '';

        let submodulo = '';

        if(datosCompetencias.length){

            const peor = [...datosCompetencias]

            .sort(

                (a,b)=>

                a.promedio-b.promedio

            )[0];

            competencia = peor.competencia;

        }

        if(datosSubmodulos.length){

            const peor = [...datosSubmodulos]

            .sort(

                (a,b)=>

                a.promedio-b.promedio

            )[0];

            submodulo = peor.submodulo;

        }

        let estado='';

        if(diferencia>=10){

            estado='presenta un rendimiento superior al promedio del curso';

        }

        else if(diferencia>=0){

            estado='mantiene un rendimiento similar al promedio del curso';

        }

        else{

            estado='se encuentra por debajo del promedio del curso';

        }

        return `El estudiante ${perfil.nombre} obtuvo un promedio general de ${promedio}% y ${estado}. Se recomienda continuar fortaleciendo la competencia "${competencia}" y reforzar el submódulo "${submodulo}" para mejorar su desempeño académico. Las recomendaciones presentadas en este informe permiten orientar futuras actividades de práctica y seguimiento con el objetivo de incrementar progresivamente el rendimiento del estudiante.`;

    }



}