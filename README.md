# bitacora-cli

Aplicación de consola para guardar lo que aprendes cada día. Guarda las notas en `data/notas.json`, evita duplicados, registra acciones y permite respaldar o exportar tus notas.

## Instalación

Requiere Node.js 20.12 o superior y npm. En este taller, el paquete `fechas-bitacora-cristoval-payarez` se prueba enlazándolo desde la carpeta hermana del paquete:

```sh
cd ../fechas-bitacora-cristoval-payarez
npm link
cd ../bitacora-cli
npm link fechas-bitacora-cristoval-payarez
npm install
npm start -- ayuda
```

## Comandos

| Comando | Ejemplo |
| --- | --- |
| Agregar una nota | `npm start -- agregar "Hoy aprendí a usar fs" nodejs` |
| Listar las últimas notas | `npm start -- listar 3` |
| Buscar por palabra | `npm start -- buscar fs` |
| Borrar por id | `npm start -- borrar 3f9a1c2e` |
| Crear un respaldo | `npm start -- respaldar` |
| Exportar a una carpeta absoluta | `npm start -- exportar "C:\Users\tu-usuario\Desktop"` |
| Mostrar ayuda | `npm start -- ayuda` |

`listar` muestra cinco notas de forma predeterminada. La etiqueta de `agregar` es opcional y, si se omite, se usa `general`. Los datos y los respaldos se guardan en carpetas ignoradas por Git.

## Reflexión

### 1. ¿Por qué elegiste CommonJS o ES Modules?

Elegí CommonJS porque es sencillo para el proyecto y coincide con el paquete de fechas que se crea en este taller. En `package.json` configuré `"type": "commonjs"` y uso `require()` para importar y `module.exports` para exportar.

### 2. ¿En qué se diferencian los imports y cómo busca Node?

`fs` y `path` son módulos nativos de Node; `object-hash` y el paquete de fechas son dependencias que Node busca en `node_modules`. `./notas` es una ruta relativa a este archivo, no el nombre de una dependencia.

### 3. ¿Por qué cambia la resolución de `data/notas.json`?

Una ruta relativa simple se interpreta desde el directorio actual del proceso, que puede variar según dónde se invoque. Aquí se construye la ruta con `__dirname` para que siempre apunte a `bitacora-cli/data`.

### 4. ¿Por qué no subir `node_modules/` a Git?

Contiene dependencias descargables, ocupa espacio y puede variar por plataforma. Git conserva `package.json` y el archivo de bloqueo; otra persona recupera las versiones instalando con `npm install`.

### 5. ¿Qué diferencia viste al importar el paquete CommonJS?

Como tanto el CLI como el paquete usan CommonJS, se importan con `require()` directamente. Si el consumidor fuera ES Modules, Node permite importar de forma predeterminada el `module.exports` CommonJS; también se puede usar `createRequire` cuando se necesite el acceso de CommonJS desde ESM.