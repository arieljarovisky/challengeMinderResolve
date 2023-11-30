# Ejercicio técnico frontend - Minder

## Consigna
A partir del código de este repositorio, crear una aplicación web (SPA) utlizando React que sirva para realizar un seguimiento de tareas pendientes (To-Do List).

### Formato de entrega
Se debe subir la solución a un repositorio de código a elección (puede ser GitHub, GitLab o Bitbucket entre otros) y enviar el link a dicho repositorio.

### Paquetes a utilizar
Es obligatorio el uso de MUI como biblioteca de componentes. El archivo ```/package.json``` ya tiene una serie de paquetes incluídos para facilitar el desarrollo. Se pueden agregar nuevos paquetes en el caso de considerarse necesario.

### Historias de usuario
Las siguientes historias de usuario definen los requerimientos de la aplicación:

- Las tareas tienen título, descripción, categoría y estado. El estado puede ser "Pendiente" o "Terminada".
- Como usuario quiero ver un listado de mis tareas pendientes y terminadas con el siguiente diseño: [diseño en Figma](https://www.figma.com/file/4Zwx6CXgKhV8yRGaIBnQK9/To-Do-List?type=design&node-id=0%3A1&mode=design&t=vOfS9v6wmkyCJvcF-1). Cada una de las tareas listadas muestra si está terminada o no, su título, descripción y categoría.
- Como usuario puedo marcar una tarea pendiente como tarea terminada haciendo click en el checkbox de la tarea. Luego de marcada como terminada, la tarea se lista bajo la sección de tareas terminadas.
- Como usuario puedo desmarcar una tarea terminada y volverla al estado pendiente haciendo click en el checkbox de la tarea. Luego de marcada como pendiente, la tarea se lista bajo la sección tareas pendientes.
- Como usuario veo el fondo de cada una de las tareas de acuerdo al color asignado a la categoría. Si el color de la categoría es ```null```, se utiliza el color por defecto (blanco).
- Como usuario abro el formulario "Nueva tarea" desde el botón "+" de la esquina inferior derecha (FAB).
- Como usuario puedo crear una nueva tarea completando el formulario "Nueva tarea" con los siguientes campos y luego haciendo click en el botón "Crear":
  - Título: obligatorio, máximo 40 caracteres.
  - Descripción: opcional, máximo 100 caracteres.
  - Categoría: obligatorio, dropdown con opciones obtenidas desde la API REST.
- Como usuario puedo cerrar el formulario "Nueva tarea" haciendo click en el botón "Cancelar" o haciendo click por fuera del formulario.
- Como usuario quiero que las tareas que creo y modifico queden guardadas en una base de datos. Para acceder a la base de datos se utilizará una API REST. Ver sección [Persistencia de datos](#persistencia-de-datos).

### Persistencia de datos
A fines de facilitar el desarrollo de la aplicación, se creó una API REST utilizando json-server a partir del archivo ```/db.json```. Algunos de los endpoints que se pueden utilizar:

- ```GET localhost:3000/tasks```
- ```GET localhost:3000/tasks/{id}```
- ```PUT localhost:3000/tasks/{id}```
- ```POST localhost:3000/tasks```
- ```GET localhost:3000/categories```

Para más información acerca de json-server, visitar [https://www.npmjs.com/package/json-server](https://www.npmjs.com/package/json-server).

### Alcance
Queda fuera del alcance de este ejercicio el manejo de usuarios: la aplicación podrá ser utilizada por un único usuario y no necesitará loguearse.

### ¿Cómo ejecutar?
Para iniciar la API REST (json-server) ejecutar ```npm run db```.

Para inciar la aplicación ejecutar ```npm run dev```.
