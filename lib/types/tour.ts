export interface ILanguage {
  id: number;
  name: string;
  code: string;
}

export interface ITour {
  id: number;
  image: string;
  name: string;
  price_starting: number;
  name_en: string;
  name_ru: string;
  name_uz: string;
  description: string;
  description_en: string;
  description_ru: string;
  description_uz: string;
  duration_title: string;
  duration_title_en: string;
  duration_title_ru: string;
  duration_title_uz: string;
  includes: string;
  includes_en: string;
  includes_ru: string;
  includes_uz: string;
  highlights: string;
  highlights_en: string;
  highlights_ru: string;
  highlights_uz: string;
  languages?: ILanguage[];

  kids_allowed: boolean;
  infants_allowed: boolean;
}
