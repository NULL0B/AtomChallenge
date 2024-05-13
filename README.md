[![Deploy Frontend to Firebase](https://github.com/NULL0B/AtomChallenge/actions/workflows/frontend-cd.yml/badge.svg)](https://github.com/NULL0B/AtomChallenge/actions/workflows/frontend-cd.yml)
[![Deploy Backend to Firebase](https://github.com/NULL0B/AtomChallenge/actions/workflows/backend-cd.yml/badge.svg)](https://github.com/NULL0B/AtomChallenge/actions/workflows/backend-cd.yml)

# ATOM FE CHALLENGE TEMPLATE - ANGULAR

Este proyecto es una plantilla con lo necesario para comenzar a desarrollar el front-end de la aplicación de la prueba
técnica de Atom. Se base en Angular con la versión 17.3.6.
Se ha realizado la instalación y configuración de varias dependencias necesarias para el desarrollo de la aplicación,
como por ejemplo: Angular Material.

## Instrucciones

Siéntete libre de clonar este repositorio y utilizarlo como base para el desarrollo de la aplicación. Sigue las
indicates de la prueba técnica para completar la aplicación y desarrolla como más te sientas cómodo.

De igual manera puedes documentar dentro de este archivo todo lo que deseas contar sobre tu desarrollo, como por
ejemplo, decisiones de diseño, problemas encontrados, etc.

## Comentarios sobre el desarrollo

En el desarrollo de este challenge se adopto un monorepo basado en NX,
para poder tener un mejor control de dependencias
configuraciones de estilo, lint, run, etc. 
Tambien se desarrollo una plantilla personalizada.

Se crearon dos proyectos, para el frontend se utilizo la plantilla de angular 17 y para el backend una plantilla
personalizada basada en firebase functions + express inversify + esbuild.
Todos y cada uno de los archivos fueron creados y configurados desde cero, exceptuando testing, ya que no se llego a
implementar.

#### El disenno de este proyecto fue basado en la idea de Google Keep.

### Highlights:

- Responsive.
- Inyeccion de dependencias con inversify
- Se corrigieron algunos errores de diseño de inversify-express.
- CI/CD en github actions independientes para frontend y backend.
- Lazy Infinite Scroll basado en Angular CDK.
- Autosave.
- Firebase Auth (por ello los endpoints de users no fueron implementados).
- Firebase Firestore.
- Multi tenancy basado en colecciones nombradas con el uid del usuario.
- Firebase Functions (mediante angular service, se opto por no utilizar callables.)
- Una configuracion personalizada de esbuild fue creada para tener un mejor bundle y hacer mas facil el deploy.
- Configuraciones personalizadas a mano de eslint, prettier, tsconfig, etc.
- Firebase Hosting (con rewtite para los api endpoints)
- Distintas practicas de angular como signals, blocks de flujo, directivas de flujo, reactive forms, template based
  forms, etc.
- Se utilizo angular material provisto para los estilos y componentes, y se modifico un card para que fuera el Task
  Component.
- Se utilizaron varidad de middlewares en express para manejar autenticacion, errores de usuario, etc.
- Se utilizaron interceptores y guardas para manejar errores y autenticacion en el frontend.
- Animaciones en el frontend.
- Enrutamiento compuesto.
- Configuracion de emuladores.
- No se utilizo lib css como tailwind, todo fue hecho a mano.
- Se crearon disimiles targets de nx para apoder tener un mejor control y uso de los proyectos durante el desarrollo, test y deploy.


### Known issues:
- Login Component tiene dos responsabilidades, login y register, se podria separar en dos componentes. 
Se estaria viendo como un como sign in todo en uno ahora.
- La animacion de fade out de angular a veces no se ejecuta correctamente.
- Mas comentarios siempre son bienvenidos, a pesar de que el codigo es simple y continene comentarios en las partes mas
  complejas.

### Problemas encontrados:
- Limitado tiempo debido a otras responsabilidades.

