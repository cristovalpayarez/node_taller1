function getTimeStamp() {
  return Date.now();
}

function getLongTime(locale = 'es-ES', timestamp = Date.now()) {
  return new Intl.DateTimeFormat(locale, {
    dateStyle: 'full',
    timeStyle: 'medium',
  }).format(timestamp);
}

function getShortDate(locale = 'es-ES', timestamp = Date.now()) {
  return new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(timestamp);
}

module.exports = { getTimeStamp, getLongTime, getShortDate };
