const path = require('node:path');
const almacen = require('./almacen');
const notas = require('./notas');
const fechas = require('fechas-bitacora-cristoval-payarez');

const ayuda = `Uso: npm start -- <comando> [argumentos]

Comandos:
  agregar "<texto>" [etiqueta]  Guarda una nota (etiqueta predeterminada: general).
  listar [N]                    Muestra las últimas N notas (predeterminado: 5).
  buscar <palabra>              Busca en el texto de las notas.
  borrar <id>                   Elimina una nota por su id.
  respaldar                     Crea una copia de notas.json en respaldos/.
  exportar [carpeta-destino]    Mueve exportacion.txt a una carpeta absoluta.
  ayuda                         Muestra esta ayuda.`;

function imprimirNotas(lista) {
  if (lista.length === 0) {
    console.log(`No se encontraron notas.`);
    return;
  }
  for (const nota of lista) {
    console.log(`[${nota.id}] (${nota.etiqueta}) ${fechas.getShortDate('es-ES', nota.fecha)} — ${nota.texto}`);
  }
}

function ejecutar(comando, argumentos) {
  switch (comando) {
    case 'agregar': {
      const resultado = notas.agregar(argumentos[0], argumentos[1] || 'general');
      console.log(`${resultado.mensaje}`);
      return resultado.mensaje;
    }
    case 'listar': {
      const textoCantidad = argumentos[0];
      const cantidad = textoCantidad === undefined ? 5 : Number(textoCantidad);
      let cantidadUsada = cantidad;
      let resultado = '';
      if (!Number.isInteger(cantidad) || cantidad <= 0) {
        cantidadUsada = 5;
        resultado = `Cantidad inválida; se mostrarán las últimas 5 notas.`;
        console.log(`${resultado}`);
      }
      const lista = notas.listar(cantidadUsada);
      imprimirNotas(lista);
      return `${resultado || 'Listado de notas'} (${lista.length})`;
    }
    case 'buscar': {
      const lista = notas.buscar(argumentos[0]);
      imprimirNotas(lista);
      return `Búsqueda completada (${lista.length} resultado(s))`;
    }
    case 'borrar': {
      const nota = notas.borrar(argumentos[0]);
      const resultado = `Nota [${nota.id}] eliminada.`;
      console.log(`${resultado}`);
      return resultado;
    }
    case 'respaldar': {
      const marca = new Date().toISOString().replace(/[:.]/g, '-');
      const nombre = `notas_${marca}.json`;
      const destino = almacen.respaldarNotas(nombre);
      const resultado = `Respaldo creado: ${path.relative(process.cwd(), destino)}`;
      console.log(`${resultado}`);
      return resultado;
    }
    case 'exportar': {
      const destino = almacen.exportarNotas(almacen.leerNotas(), argumentos[0]);
      const resultado = `Exportación movida a: ${destino}`;
      console.log(`${resultado}`);
      return resultado;
    }
    case 'ayuda':
    case undefined:
    case '':
      console.log(`${ayuda}`);
      return 'Ayuda mostrada';
    default:
      console.log(`Comando desconocido: ${comando}`);
      console.log(`${ayuda}`);
      return `Comando desconocido: ${comando}`;
  }
}

const argumentos = process.argv.slice(2);
const comando = argumentos[0];
const argumentosComando = argumentos.slice(1);
let resultado;

try {
  resultado = ejecutar(comando, argumentosComando);
} catch (error) {
  resultado = `Error: ${error.message}`;
  console.error(`${resultado}`);
  process.exitCode = 1;
} finally {
  try {
    almacen.registrarAccion(comando || 'ayuda', resultado || 'Ejecución sin resultado', fechas.getTimeStamp());
  } catch (error) {
    console.error(`No se pudo registrar la acción en la bitácora: ${error.message}`);
    process.exitCode = 1;
  }
}