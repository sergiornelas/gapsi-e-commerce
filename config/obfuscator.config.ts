/**
 * Ofuscación del bundle de producción.
 *
 * Vite ya minifica por defecto; esto añade una capa de ofuscación encima:
 * renombra identificadores, extrae las cadenas de texto a un arreglo cifrado en
 * base64 y elimina toda pista legible del código original.
 *
 * Solo se aplica en `build`. En desarrollo estorbaría y haría inútil el
 * depurador. Las opciones son deliberadamente moderadas: `controlFlowFlattening`
 * y `deadCodeInjection` multiplican el tamaño del archivo y degradan el tiempo
 * de ejecución, un precio alto para una aplicación que ya pesa lo suyo.
 *
 * Se ofusca únicamente el código propio. Los fragmentos de dependencias
 * (React, MUI, Apollo, GraphQL) quedan intactos: su código fuente es público y
 * está en npm, así que ofuscarlos no protege nada y llegó a duplicar el peso
 * del bundle comprimido.
 */
// `javascript-obfuscator` es CommonJS: solo expone un export por defecto, así
// que el import nombrado falla al cargarse desde un módulo ESM.
import JavaScriptObfuscator from 'javascript-obfuscator';
import type { Plugin } from 'vite';

/**
 * Un fragmento se ofusca solo si contiene módulos de `src/`.
 *
 * La regla se apoya en el origen real de los módulos y no en el nombre del
 * archivo, lo que deja fuera automáticamente tanto las dependencias como el
 * runtime del empaquetador. Esto último importa: el runtime es el pegamento
 * entre fragmentos y ofuscarlo rompía la aplicación por completo, porque
 * `transformObjectKeys` renombra claves del registro de módulos que los demás
 * fragmentos referencian por nombre.
 */
const contieneCodigoPropio = (idsDeModulos: readonly string[]): boolean =>
  idsDeModulos.some((id) => id.includes('/src/'));

/**
 * Vía de escape para depurar un build de producción: `SIN_OFUSCAR=1 npm run build`
 * genera el mismo bundle minificado pero legible.
 */
const desactivado = process.env.SIN_OFUSCAR === '1';

export function obfuscatorPlugin(): Plugin {
  return {
    name: 'gapsi:obfuscator',
    // Solo en producción, y después de que el resto de plugins haya terminado.
    apply: 'build',
    enforce: 'post',

    /**
     * Se usa `renderChunk` y no `generateBundle` a propósito: este hook corre
     * **antes** de que se calcule el hash del nombre de archivo. En
     * `generateBundle` el código cambiaría pero el nombre no, y los navegadores
     * (y el service worker) seguirían sirviendo la versión anterior en caché.
     */
    renderChunk(codigo, chunk) {
      if (desactivado) return null;

      if (!chunk.fileName.endsWith('.js') || !contieneCodigoPropio(chunk.moduleIds)) {
        return null;
      }

      return {
        code: JavaScriptObfuscator.obfuscate(codigo, {
          compact: true,
          identifierNamesGenerator: 'mangled-shuffled',

          // Las cadenas se extraen a un arreglo y se codifican, que es lo que
          // impide leer textos, rutas y nombres de campos en el bundle.
          stringArray: true,
          // 1 = todas las cadenas van al arreglo cifrado. Con el valor por
          // defecto quedaban literales del dominio legibles en el bundle.
          stringArrayThreshold: 1,
          stringArrayEncoding: ['base64'],
          stringArrayIndexShift: true,
          stringArrayRotate: true,
          stringArrayShuffle: true,

          numbersToExpressions: true,
          simplify: true,
          transformObjectKeys: true,
          unicodeEscapeSequence: false,

          // Descartadas por costo: inflan el archivo y ralentizan el arranque.
          controlFlowFlattening: false,
          deadCodeInjection: false,
          selfDefending: false,
          debugProtection: false,
        }).getObfuscatedCode(),
        // No se generan mapas de origen: publicarlos anularía la ofuscación.
        map: null,
      };
    },
  };
}
