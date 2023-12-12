import { generateBaseSlug } from '../helpers/generateSlugHelper'

describe('generateBaseSlug', () => {
    it('returns the expected slug based on the product data', async () => {
      const product = {
        name: 'Product Name',
        manufacturer: { name: 'Manufacturer Name' },
        EAN: '1234567890',
      };
  
      const result = await generateBaseSlug(product);
  
      const expectedSlug = 'product-name-manufacturer-name-1234567890';
      expect(result).toEqual(expectedSlug);
    });
  
    it('returns the expected slug when product name is empty', async () => {
      const product = {
        name: '',
        manufacturer: { name: 'Manufacturer Name' },
        EAN: '1234567890',
      };
  
      const result = await generateBaseSlug(product);
  
      const expectedSlug = '-manufacturer-name-1234567890';
      expect(result).toEqual(expectedSlug);
    });
  
    it('returns the expected slug when manufacturer name is empty', async () => {
      const product = {
        name: 'Product Name',
        manufacturer: { name: '' },
        EAN: '1234567890',
      }
  
      const result = await generateBaseSlug(product)
  
      const expectedSlug = 'product-name-1234567890'
      expect(result).toEqual(expectedSlug)
    })
  
    it('returns the expected slug when both product name and manufacturer name are empty', async () => {
      const product = {
        name: '',
        manufacturer: { name: '' },
        EAN: '1234567890',
      }
  
      const result = await generateBaseSlug(product)
  
      const expectedSlug = '-1234567890'
      expect(result).toEqual(expectedSlug)
    })
  })