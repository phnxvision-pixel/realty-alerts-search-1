import { Apartment } from '@/types';


const apartmentImages = [
  'https://d64gsuwffb70l.cloudfront.net/69070b8626239a76108fff59_1762069433897_fa4fa39f.webp',
  'https://d64gsuwffb70l.cloudfront.net/69070b8626239a76108fff59_1762069436807_ca7500da.webp',
  'https://d64gsuwffb70l.cloudfront.net/69070b8626239a76108fff59_1762069438562_e9378dd6.webp',
  'https://d64gsuwffb70l.cloudfront.net/69070b8626239a76108fff59_1762069440338_5f446057.webp',
  'https://d64gsuwffb70l.cloudfront.net/69070b8626239a76108fff59_1762069442118_9f907d04.webp',
  'https://d64gsuwffb70l.cloudfront.net/69070b8626239a76108fff59_1762069443865_398cf69e.webp',
  'https://d64gsuwffb70l.cloudfront.net/69070b8626239a76108fff59_1762069445649_f3915a18.webp',
  'https://d64gsuwffb70l.cloudfront.net/69070b8626239a76108fff59_1762069447403_8ced4246.webp',
  'https://d64gsuwffb70l.cloudfront.net/69070b8626239a76108fff59_1762069449260_ee1a077a.webp',
  'https://d64gsuwffb70l.cloudfront.net/69070b8626239a76108fff59_1762069449992_2aef09ec.webp',
  'https://d64gsuwffb70l.cloudfront.net/69070b8626239a76108fff59_1762069452257_67e8ba3d.webp',
  'https://d64gsuwffb70l.cloudfront.net/69070b8626239a76108fff59_1762069454563_0fcc93ff.webp',
  'https://d64gsuwffb70l.cloudfront.net/69070b8626239a76108fff59_1762069456815_bcd5a002.webp',
  'https://d64gsuwffb70l.cloudfront.net/69070b8626239a76108fff59_1762069458800_491dc8cc.webp',
  'https://d64gsuwffb70l.cloudfront.net/69070b8626239a76108fff59_1762069460815_3e119428.webp',
  'https://d64gsuwffb70l.cloudfront.net/69070b8626239a76108fff59_1762069462722_aa112cb7.webp',
  'https://d64gsuwffb70l.cloudfront.net/69070b8626239a76108fff59_1762069464663_352554cd.webp',
  'https://d64gsuwffb70l.cloudfront.net/69070b8626239a76108fff59_1762069466494_747bef60.webp',
  'https://d64gsuwffb70l.cloudfront.net/69070b8626239a76108fff59_1762069467309_1810125f.webp',
  'https://d64gsuwffb70l.cloudfront.net/69070b8626239a76108fff59_1762069469047_8452110d.webp',
  'https://d64gsuwffb70l.cloudfront.net/69070b8626239a76108fff59_1762069470827_274c598e.webp',
  'https://d64gsuwffb70l.cloudfront.net/69070b8626239a76108fff59_1762069472586_5bfa44b5.webp',
  'https://d64gsuwffb70l.cloudfront.net/69070b8626239a76108fff59_1762069474493_9f207cb5.webp',
  'https://d64gsuwffb70l.cloudfront.net/69070b8626239a76108fff59_1762069476225_cec19427.webp',
];

export const APARTMENTS: Apartment[] = [

  {
    id: '1',
    title: 'Modern 2-Bedroom in Mitte',
    price: 1450,
    size: 75,
    rooms: 2,
    location: 'Mitte, Berlin',
    city: 'Berlin',
    image: 'https://d64gsuwffb70l.cloudfront.net/69070b8626239a76108fff59_1762069433897_fa4fa39f.webp',
    images: ['https://d64gsuwffb70l.cloudfront.net/69070b8626239a76108fff59_1762069433897_fa4fa39f.webp', 'https://d64gsuwffb70l.cloudfront.net/69070b8626239a76108fff59_1762069449992_2aef09ec.webp'],
    description: 'Beautiful apartment in the heart of Berlin with modern amenities.',
    availableFrom: '2025-12-01',
    petsAllowed: true,
    furnished: false,
    balcony: true,
    isNew: true,
    source: 'ImmoScout24',
  },
  {
    id: '2',
    title: 'Luxury Penthouse Munich',
    price: 2800,
    size: 120,
    rooms: 3,
    location: 'Schwabing, Munich',
    city: 'Munich',
    image: 'https://d64gsuwffb70l.cloudfront.net/69070b8626239a76108fff59_1762069436807_ca7500da.webp',
    images: ['https://d64gsuwffb70l.cloudfront.net/69070b8626239a76108fff59_1762069436807_ca7500da.webp'],
    description: 'Stunning penthouse with panoramic city views.',
    availableFrom: '2025-11-15',
    petsAllowed: false,
    furnished: true,
    balcony: true,
    isNew: true,
    source: 'Immowelt',
  },
  {
    id: '3',
    title: 'Cozy Studio Hamburg',
    price: 850,
    size: 35,
    rooms: 1,
    location: 'Altona, Hamburg',
    city: 'Hamburg',
    image: 'https://d64gsuwffb70l.cloudfront.net/69070b8626239a76108fff59_1762069438562_e9378dd6.webp',
    images: ['https://d64gsuwffb70l.cloudfront.net/69070b8626239a76108fff59_1762069438562_e9378dd6.webp'],
    description: 'Perfect for students or young professionals.',
    availableFrom: '2025-11-01',
    petsAllowed: false,
    furnished: true,
    balcony: false,
    isNew: false,
    source: 'WG-Gesucht',
  },
];

import { MORE_APARTMENTS } from './moreApartments';
import { EVEN_MORE_APARTMENTS } from './evenMoreApartments';
import { FINAL_APARTMENTS } from './finalApartments';
import { EXTRA_APARTMENTS } from './extraApartments';
import { MORE_EXTRA_APARTMENTS } from './moreExtraApartments';
import { LAST_APARTMENTS } from './lastApartments';
import { FINAL_THREE_APARTMENTS } from './finalThreeApartments';

export const ALL_APARTMENTS = [
  ...APARTMENTS,
  ...MORE_APARTMENTS,
  ...EVEN_MORE_APARTMENTS,
  ...FINAL_APARTMENTS,
  ...EXTRA_APARTMENTS,
  ...MORE_EXTRA_APARTMENTS,
  ...LAST_APARTMENTS,
  ...FINAL_THREE_APARTMENTS,
];

