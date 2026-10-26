# fechas-bitacora-cristoval-payarez

Funciones pequeñas para obtener marcas de tiempo y mostrar fechas localizadas.

## Instalación

```sh
npm install fechas-bitacora-cristoval-payarez
```

## Uso

```js
const fechas = require('fechas-bitacora-cristoval-payarez');

const timestamp = fechas.getTimeStamp();
console.log(fechas.getLongTime('es-ES', timestamp));
console.log(fechas.getShortDate('es-ES', timestamp));
```
