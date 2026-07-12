import {

  Component,

  OnInit,

  PLATFORM_ID,

  inject,

  ChangeDetectorRef

} from '@angular/core';

import {

Router

} from '@angular/router';

import {

  CommonModule,

  isPlatformBrowser

} from '@angular/common';

import {

  TopbarProfesorComponent

} from '../../../components/topbar-profesor/topbar-profesor.component';

import {

  SidebarProfesorComponent

} from '../../../components/sidebar-profesor/sidebar-profesor.component';

import {

  EstudianteProfesorService

} from '../../../services/estudiante-profesor.service';

import {

CatalogosService

} from '../../../services/catalogos.service';

import {

ToastComponent

} from '../../../components/toast/toast.component';

import {

FormsModule

} from '@angular/forms';

@Component({

  selector: 'app-estudiante-profesor',

  standalone: true,

  imports: [

    CommonModule,

    TopbarProfesorComponent,

    SidebarProfesorComponent,

    FormsModule,

    ToastComponent

  ],

  templateUrl: './estudiante-profesor.component.html',

  styleUrl: './estudiante-profesor.component.css'

})

export class EstudianteProfesorComponent

implements OnInit{

  private platformId =

    inject(

      PLATFORM_ID

    );

  nombreProfesor='';

  idProfesor=0;

  idNivelProfesor=0;

  esBachillerato=false;

  menuAbierto=false;

  totalEstudiantes='--';

  promedioGeneral='--';

  testRealizados='--';

  mejorPuntaje='--';

  estudiantes:any[]=[];

  estudiantesFiltrados:any[]=[];

  textoBusqueda='';

  mostrarModal = false;

  carreras:any[]=[];

  provincias:any[]=[];

  ciudades:any[]=[];

  tiposInstitucion:any[]=[];

  mostrarToast=false;

  mensajeToast='';

  tipoToast:'success'|'error'='success';

  constructor(

    private estudianteProfesorService:

    EstudianteProfesorService,

    private cdr:ChangeDetectorRef,

    private catalogosService: CatalogosService,

    private router:Router

  ){}

  ngOnInit():void{

    if(

      isPlatformBrowser(

        this.platformId

      )

    ){

      this.nombreProfesor=

      localStorage.getItem(

        'nombre_profesor'

      ) || 'Profesor';

      this.idProfesor=

      Number(

        localStorage.getItem(

          'id_profesor'

        )

      );

      this.idNivelProfesor = Number(

        localStorage.getItem(

            'id_nivel_profesor'

        )

      );

      this.esBachillerato =

      this.idNivelProfesor === 1;

      this.cargarResumen();

      this.cargarEstudiantes();

      this.cargarCatalogos();

    }

  }

  toggleMenu(){

    this.menuAbierto=

    !this.menuAbierto;

  }

  cargarResumen():void{

    this.estudianteProfesorService

    .obtenerResumen(

      this.idProfesor

    )

    .subscribe({

      next:(data)=>{

        this.totalEstudiantes=

        data.total_estudiantes;

        this.promedioGeneral=

        data.promedio_general + '%';

        this.testRealizados=

        data.test_realizados;

        this.mejorPuntaje=

        data.mejor_puntaje + '%';

        this.refrescarVista();

      },

      error:(err)=>{

        console.error(err);

      }

    });

  }

  private refrescarVista():void{

    this.cdr.detectChanges();

  }


    cargarEstudiantes():void{

        this.estudianteProfesorService

        .obtenerEstudiantes(

            this.idProfesor

        )

        .subscribe({

            next:(data)=>{

                this.estudiantes=data;

                this.estudiantesFiltrados=[

                    ...data

                ];

                this.refrescarVista();

            },

            error:(err)=>{

                console.error(err);

            }

        });

    }

    buscarEstudiante():void{

        const texto=

        this.textoBusqueda

        .toLowerCase()

        .trim();

        this.estudiantesFiltrados=

        this.estudiantes.filter(

            (e:any)=>

            e.nombre

            .toLowerCase()

            .includes(texto)

        );

    }


    nuevoEstudiante = {

      nombre_estudiante: '',

      institucion_edu: '',

      id_tipo_institucion: null,

      id_carrera: null,

      id_provincia: null,

      id_ciudad: null,

      correo_estudiante: '',

      password: '',

      confirmarPassword: '',

      estado: true

    };

    abrirModal(): void {

      this.limpiarFormulario();
      
      this.mostrarModal = true;

    }

    cerrarModal(): void {

        this.mostrarModal = false;

    }


    cargarCatalogos():void{

      this.catalogosService

          .obtenerProvincias()

          .subscribe({

              next:(data:any)=>{

                  this.provincias=data;

              }

          });

      if(

          this.esBachillerato

      ){

          this.catalogosService

              .obtenerTiposInstitucion()

              .subscribe({

                  next:(data:any)=>{

                      this.tiposInstitucion=data;

                  }

              });

      }

      else{

          this.catalogosService

              .obtenerCarreras()

              .subscribe({

                  next:(data:any)=>{

                      this.carreras=data;

                  }

              });

      }

  }

  cargarCiudades():void{

      if(

          this.nuevoEstudiante.id_provincia==null

      ){

          this.ciudades=[];

          return;

      }

      this.catalogosService

          .obtenerCiudadesPorProvincia(

              this.nuevoEstudiante.id_provincia

          )

          .subscribe({

              next:(data:any)=>{

                  this.ciudades=data;

              }

          });

  }

  guardarEstudiante():void{

    if(

        this.nuevoEstudiante.password

        !==

        this.nuevoEstudiante.confirmarPassword

    ){

        this.mostrarNotificacion(

            'Las contraseñas no coinciden',

            'error'

        );

        return;

    }

    const datos={

        nombre_estudiante:

        this.nuevoEstudiante.nombre_estudiante,

        institucion_edu:

        this.nuevoEstudiante.institucion_edu,

        id_tipo_institucion:

        this.nuevoEstudiante.id_tipo_institucion,

        id_carrera:

        this.nuevoEstudiante.id_carrera,

        id_provincia:

        this.nuevoEstudiante.id_provincia,

        id_ciudad:

        this.nuevoEstudiante.id_ciudad,

        correo_estudiante:

        this.nuevoEstudiante.correo_estudiante,

        password:

        this.nuevoEstudiante.password,

        estado:

        this.nuevoEstudiante.estado

    };

    this.estudianteProfesorService

    .crearEstudiante(

        this.idProfesor,

        datos

    )

    .subscribe({

        next:()=>{

            this.mostrarNotificacion(

                'Estudiante registrado correctamente',

                'success'

            );

            this.cerrarModal();

            this.cargarEstudiantes();

            this.cargarResumen();

            this.limpiarFormulario();

        },

        error:(err)=>{

            console.error(err);

            this.mostrarNotificacion(

                err.error?.detail ||

                err.error?.error ||

                'Error al registrar el estudiante',

                'error'

            );

        }

    });

  }


  limpiarFormulario():void{

    this.nuevoEstudiante={

        nombre_estudiante:'',

        institucion_edu:'',

        id_tipo_institucion:null,

        id_carrera:null,

        id_provincia:null,

        id_ciudad:null,

        correo_estudiante:'',

        password:'',

        confirmarPassword:'',

        estado:true

    };

    this.ciudades=[];

  }

  mostrarNotificacion(

    mensaje:string,

    tipo:'success'|'error'

    ):void{

        this.mensajeToast = mensaje;

        this.tipoToast = tipo;

        this.mostrarToast = true;

        this.refrescarVista();

        setTimeout(()=>{

            this.mostrarToast = false;

            this.refrescarVista();

        },5000);

  }

  verPerfil(

    id:number

  ):void{

      this.router.navigate([

          '/perfil-estudiante-profesor',

          id

      ]);

  }

}