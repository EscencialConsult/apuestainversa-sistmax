/**
 * Descarga un string como archivo .txt con BOM UTF-8.
 * El prefijo BOM (U+FEFF) garantiza compatibilidad con Microsoft Word y Excel
 * cuando el usuario abre el archivo directamente.
 */
export function descargarTxt(nombre, contenido) {
  const blob = new Blob(['﻿' + contenido], { type: 'text/plain;charset=utf-8' })
  const url  = URL.createObjectURL(blob)
  const a    = document.createElement('a')
  a.href     = url
  a.download = nombre
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
