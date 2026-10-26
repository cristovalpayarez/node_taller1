const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const fechas = require('fechas-bitacora-cristoval-payarez');

const directorioProyecto = path.join(__dirname, '..');
const directorioDatos = path.join(directorioProyecto, 'data');
const archivoNotas = path.join(directorioDatos, 'notas.json');
const archivoBitacora = path.join(directorioDatos, 'bitacora.log');

function asegurarDirectorioDatos() {
  fs.mkdirSync(directorioDatos, { recursive: true });
}

function leerNotas() {
  asegurarDirectorioDatos();

  if (!fs.existsSync(archivoNotas)) {
    fs.writeFileSync(archivoNotas, '[]\n', 'utf8');
  }

  try {
    const contenido = fs.readFileSync(archivoNotas, 'utf8');
    const notas = JSON.parse(contenido);
    if (!Array.isArray(notas)) {
      throw new Error('El archivo de notas está dañado: el contenido debe ser un arreglo JSON.');
    }
    return notas;
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error(`El archivo de notas está dañado: ${error.message}`);
    }
    throw error;
  }
}

function guardarNotas(notas) {
  asegurarDirectorioDatos();
  fs.writeFileSync(archivoNotas, `${JSON.stringify(notas, null, 2)}\n`, 'utf8');
}

function registrarAccion(comando, resultado, fecha = Date.now()) {
  asegurarDirectorioDatos();
  fs.appendFileSync(archivoBitacora, `${fecha} | ${comando} | ${resultado}\n`, 'utf8');
}

function respaldarNotas(nombreRespaldo) {
  const directorioRespaldos = path.join(directorioProyecto, 'respaldos');
  fs.mkdirSync(directorioRespaldos, { recursive: true });
  if (!fs.existsSync(archivoNotas)) {
    guardarNotas([]);
  }
  const destino = path.join(directorioRespaldos, nombreRespaldo);
  fs.copyFileSync(archivoNotas, destino);
  return destino;
}

function exportarNotas(notas, destinoIndicado) {
  const destinoCarpeta = destinoIndicado || os.homedir();
  if (!path.isAbsolute(destinoCarpeta)) {
    throw new Error('La carpeta de destino debe ser una ruta absoluta.');
  }
  if (!fs.existsSync(destinoCarpeta) || !fs.statSync(destinoCarpeta).isDirectory()) {
    throw new Error(`La carpeta de destino no existe: ${destinoCarpeta}`);
  }

  const directorioSalida = path.join(directorioProyecto, 'salida');
  fs.mkdirSync(directorioSalida, { recursive: true });
  const archivoTemporal = path.join(directorioSalida, 'exportacion.txt');
  const contenido = notas.map((nota) => (
    `[${nota.id}] (${nota.etiqueta}) ${fechas.getLongTime('es-ES', nota.fecha)} — ${nota.texto}`
  )).join('\n');
  fs.writeFileSync(archivoTemporal, `${contenido}${contenido ? '\n' : ''}`, 'utf8');

  const destinoFinal = path.join(destinoCarpeta, 'exportacion.txt');
  try {
    fs.renameSync(archivoTemporal, destinoFinal);
  } catch (error) {
    if (error.code !== 'EXDEV') {
      throw error;
    }
    fs.copyFileSync(archivoTemporal, destinoFinal);
    fs.unlinkSync(archivoTemporal);
  }

  return destinoFinal;
}

module.exports = {
  leerNotas,
  guardarNotas,
  registrarAccion,
  respaldarNotas,
  exportarNotas,
};