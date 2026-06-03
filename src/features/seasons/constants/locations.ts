import type { MultiSelectOption } from '@/components/ui/multi-select';

// ─── Countries (match V103 migration exactly) ─────────────────────────────────

export const SEASON_COUNTRIES: MultiSelectOption[] = [
  // Sudamérica
  { value: 'Colombia',          label: 'Colombia',          category: 'Sudamérica' },
  { value: 'Argentina',         label: 'Argentina',         category: 'Sudamérica' },
  { value: 'Chile',             label: 'Chile',             category: 'Sudamérica' },
  { value: 'Perú',              label: 'Perú',              category: 'Sudamérica' },
  { value: 'Venezuela',         label: 'Venezuela',         category: 'Sudamérica' },
  { value: 'Ecuador',           label: 'Ecuador',           category: 'Sudamérica' },
  { value: 'Bolivia',           label: 'Bolivia',           category: 'Sudamérica' },
  { value: 'Paraguay',          label: 'Paraguay',          category: 'Sudamérica' },
  { value: 'Uruguay',           label: 'Uruguay',           category: 'Sudamérica' },
  // Norteamérica
  { value: 'México',            label: 'México',            category: 'Norteamérica' },
  { value: 'Estados Unidos',    label: 'Estados Unidos',    category: 'Norteamérica' },
  { value: 'Canadá',            label: 'Canadá',            category: 'Norteamérica' },
  // Centroamérica
  { value: 'Costa Rica',        label: 'Costa Rica',        category: 'Centroamérica' },
  { value: 'Panamá',            label: 'Panamá',            category: 'Centroamérica' },
  { value: 'Guatemala',         label: 'Guatemala',         category: 'Centroamérica' },
  { value: 'Honduras',          label: 'Honduras',          category: 'Centroamérica' },
  { value: 'El Salvador',       label: 'El Salvador',       category: 'Centroamérica' },
  { value: 'Nicaragua',         label: 'Nicaragua',         category: 'Centroamérica' },
  // El Caribe
  { value: 'Cuba',              label: 'Cuba',              category: 'El Caribe' },
  { value: 'República Dominicana', label: 'República Dominicana', category: 'El Caribe' },
  { value: 'Puerto Rico',       label: 'Puerto Rico',       category: 'El Caribe' },
  { value: 'Jamaica',           label: 'Jamaica',           category: 'El Caribe' },
  // Europa
  { value: 'España',            label: 'España',            category: 'Europa' },
  { value: 'Francia',           label: 'Francia',           category: 'Europa' },
  { value: 'Alemania',          label: 'Alemania',          category: 'Europa' },
  { value: 'Italia',            label: 'Italia',            category: 'Europa' },
  { value: 'Portugal',          label: 'Portugal',          category: 'Europa' },
  { value: 'Reino Unido',       label: 'Reino Unido',       category: 'Europa' },
  { value: 'Países Bajos',      label: 'Países Bajos',      category: 'Europa' },
  { value: 'Bélgica',           label: 'Bélgica',           category: 'Europa' },
  { value: 'Suiza',             label: 'Suiza',             category: 'Europa' },
  { value: 'Austria',           label: 'Austria',           category: 'Europa' },
  { value: 'Grecia',            label: 'Grecia',            category: 'Europa' },
];

// ─── Subregions per country ────────────────────────────────────────────────────
// Tourism-focused geographic regions, not political subdivisions

export const COUNTRY_SUBREGIONS: Record<string, string[]> = {
  'México':               ['Norte', 'Noroeste', 'Noreste', 'Occidente', 'Bajío', 'Centro / CDMX', 'Pacífico Sur', 'Golfo / Sureste', 'Yucatán / Riviera Maya', 'Baja California'],
  'Colombia':             ['Caribe', 'Andina', 'Pacífico', 'Orinoquía', 'Amazonía', 'Insular'],
  'Argentina':            ['Patagonia', 'Cuyo', 'NOA', 'NEA', 'Pampeana', 'Buenos Aires', 'Centro'],
  'Chile':                ['Norte Grande', 'Norte Chico', 'Zona Central', 'Sur', 'Austral / Patagonia'],
  'Perú':                 ['Lima / Costa Central', 'Costa Norte', 'Costa Sur', 'Sierra Norte', 'Sierra Centro', 'Sierra Sur', 'Selva Alta', 'Selva Baja'],
  'Venezuela':            ['Andes', 'Costa Central', 'Costa Oriental', 'Los Llanos', 'Guayana', 'Amazonía'],
  'Ecuador':              ['Costa', 'Sierra', 'Amazonia', 'Galápagos'],
  'Bolivia':              ['Altiplano', 'Valles', 'Llanos', 'Chiquitanía'],
  'Costa Rica':           ['Pacífico Norte (Guanacaste)', 'Pacífico Central', 'Pacífico Sur (Osa)', 'Caribe', 'Valle Central', 'Norte'],
  'Panamá':               ['Ciudad de Panamá', 'Pacífico Interior', 'Bocas del Toro / Caribe', 'Azuero'],
  'Guatemala':            ['Altiplano / Lago Atitlán', 'Pacífico', 'Caribe / Río Dulce', 'El Petén'],
  'España':               ['Andalucía', 'Cataluña', 'Madrid', 'Comunidad Valenciana', 'País Vasco', 'Baleares', 'Canarias', 'Galicia', 'Castilla', 'Murcia'],
  'Italia':               ['Norte (Milán/Lago)', 'Toscana', 'Roma / Lazio', 'Nápoles / Campania', 'Sicilia', 'Cerdeña', 'Adriático'],
  'Francia':              ['París / Île-de-France', 'Provence / Côte d\'Azur', 'Bretaña', 'Loire', 'Alsacia', 'Borgoña', 'Normandía'],
  'Portugal':             ['Lisboa', 'Algarve', 'Porto / Norte', 'Alentejo', 'Madeira', 'Azores'],
};

// ─── Helper: build subregion MultiSelectOption[] from selected countries ──────

export function getSubregionOptions(selectedCountries: string[]): MultiSelectOption[] {
  return selectedCountries.flatMap((country) => {
    const subs = COUNTRY_SUBREGIONS[country] ?? [];
    return subs.map((sub) => ({
      value: `${country} > ${sub}`,
      label: sub,
      category: country,
    }));
  });
}

// ─── Helper: parse "Country > Subregion" value ────────────────────────────────

export function parseSubregionValue(value: string): { country: string; region: string } {
  const idx = value.indexOf(' > ');
  if (idx === -1) return { country: value, region: '' };
  return { country: value.substring(0, idx), region: value.substring(idx + 3) };
}
