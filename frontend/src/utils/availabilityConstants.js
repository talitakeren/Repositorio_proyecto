/**
 * Compatibilidad: este archivo era la fuente de los horarios antes de HORALV.
 * Ahora reexporta desde la constante centralizada `constants/timeBlocks.js`
 * para que cualquier import existente siga funcionando.
 */
export {
  TIME_BLOCKS,
  DAYS as AVAILABILITY_DAYS,
  DAY_FULL_LABEL,
  BLOCK_MINUTES,
  slotKey,
  countAvailabilityStats,
} from "../constants/timeBlocks.js";

/**
 * @deprecated Los bloques HORALV duran 44 minutos. Use BLOCK_MINUTES.
 * Se conserva como número aproximado de horas por bloque (≈ 0.73) por si
 * algún componente legacy aún lo requiere.
 */
export const BLOCK_HOURS = 44 / 60;
