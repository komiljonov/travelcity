export interface ITariff {
  id: number;
  name: string;
  name_en: string;
  name_ru: string;
  name_uz: string;
  description: string;
  description_en: string;
  description_ru: string;
  description_uz: string;
  includes: string;
  includes_en: string;
  includes_ru: string;
  includes_uz: string;
  price_formula: string;
  active: boolean;
  tour: number;

  
}
