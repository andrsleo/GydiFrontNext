/**
 * Collaborations feature barrel export
 */

export * from './types';
export * from './hooks';
export * from './components';
export { collaborationsApi } from './api/collaborations.api';
export type { CreatePitchInput, CreateCounterOfferInput } from './api/collaborations.api';
export { pitchSchema } from './schemas/pitch.schema';
export type { PitchFormData } from './schemas/pitch.schema';
export { counterOfferSchema } from './schemas/counter-offer.schema';
export type { CounterOfferFormData } from './schemas/counter-offer.schema';
