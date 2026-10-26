const objectHash = require('object-hash');
const fechas = require('fechas-bitacora-cristoval-payarez');
const almacen = require('./almacen');

function agregar(texto, etiqueta = 'general') {
  if (typeof texto !== 'string' || texto.trim() === '') {
    throw new Error('Debes escribir un texto para la nota.');
  }

  const notas = almacen.leerNotas();
  const id = objectHash(texto).slice(0, 8);
  const duplicada = notas.find((nota) => nota.texto === texto);
  if (duplicada) {
    return {
      nota: duplicada,
      duplicada: true,
      mensaje: `Ya existe una nota igual (id ${duplicada.id}). No se guardó.`,
    };
  }

  const nota = {
    id,
    texto,
    etiqueta: etiqueta && etiqueta.trim() ? etiqueta.trim() : 'general',
    fecha: fechas.getTimeStamp(),
  };
  notas.push(nota);
  almacen.guardarNotas(notas);

  return {
    nota,
    duplicada: false,
    mensaje: `Nota guardada [${nota.id}] (${nota.etiqueta}) — ${fechas.getLongTime('es-ES', nota.fecha)}`,
  };
}

function listar(cantidad = 5) {
  const notas = almacen.leerNotas();
  return notas.slice(-cantidad).reverse();
}

function buscar(palabra) {
  if (typeof palabra !== 'string' || palabra.trim() === '') {
    throw new Error('Debes indicar una palabra para buscar.');
  }
  const busqueda = palabra.toLocaleLowerCase('es-ES');
  return almacen.leerNotas().filter((nota) => (
    nota.texto.toLocaleLowerCase('es-ES').includes(busqueda)
  ));
}

function borrar(id) {
  if (typeof id !== 'string' || id.trim() === '') {
    throw new Error('Debes indicar el id de la nota que quieres borrar.');
  }
  const notas = almacen.leerNotas();
  const indice = notas.findIndex((nota) => nota.id === id);
  if (indice === -1) {
    throw new Error(`No existe una nota con el id ${id}.`);
  }
  const [nota] = notas.splice(indice, 1);
  almacen.guardarNotas(notas);
  return nota;
}

module.exports = { agregar, listar, buscar, borrar };