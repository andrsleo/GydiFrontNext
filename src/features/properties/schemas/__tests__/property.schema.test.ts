import { describe, it, expect } from 'vitest';
import { createPropertySchema } from '../property.schema';
import { PropertyListingType, PropertyType, Currency } from '../../types';

const baseValid = {
  title: 'Beautiful Beach House with Ocean View',
  description: 'A stunning beachfront property with breathtaking views of the ocean.',
  currency: Currency.COP,
  country: 'Colombia',
  city: 'Cartagena',
  address: '123 Main Street',
  postalCode: '130001',
  amenities: ['WiFi', 'Pool', 'Air Conditioning'],
  bedrooms: 3,
  bathrooms: 2,
  maxGuests: 6,
  propertyType: PropertyType.HOUSE,
  airbnbUrl: 'https://www.airbnb.com/rooms/12345',
};

describe('createPropertySchema — conditional price validation', () => {
  it('accepts SHORT_TERM_RENTAL with only pricePerNight', () => {
    const result = createPropertySchema.safeParse({
      ...baseValid,
      listingType: PropertyListingType.SHORT_TERM_RENTAL,
      pricePerNight: 350000,
    });
    expect(result.success).toBe(true);
  });

  it('rejects SHORT_TERM_RENTAL without pricePerNight', () => {
    const result = createPropertySchema.safeParse({
      ...baseValid,
      listingType: PropertyListingType.SHORT_TERM_RENTAL,
    });
    expect(result.success).toBe(false);
    expect(result.error?.issues.some(i => i.path.includes('pricePerNight'))).toBe(true);
  });

  it('accepts SALE with only salePrice (no pricePerNight)', () => {
    const result = createPropertySchema.safeParse({
      ...baseValid,
      listingType: PropertyListingType.SALE,
      salePrice: 850000000,
    });
    expect(result.success).toBe(true);
  });

  it('rejects SALE without salePrice', () => {
    const result = createPropertySchema.safeParse({
      ...baseValid,
      listingType: PropertyListingType.SALE,
      pricePerNight: 350000,
    });
    expect(result.success).toBe(false);
    expect(result.error?.issues.some(i => i.path.includes('salePrice'))).toBe(true);
  });

  it('accepts BOTH with both prices', () => {
    const result = createPropertySchema.safeParse({
      ...baseValid,
      listingType: PropertyListingType.BOTH,
      pricePerNight: 350000,
      salePrice: 850000000,
    });
    expect(result.success).toBe(true);
  });

  it('rejects BOTH when missing pricePerNight', () => {
    const result = createPropertySchema.safeParse({
      ...baseValid,
      listingType: PropertyListingType.BOTH,
      salePrice: 850000000,
    });
    expect(result.success).toBe(false);
    expect(result.error?.issues.some(i => i.path.includes('pricePerNight'))).toBe(true);
  });
});
