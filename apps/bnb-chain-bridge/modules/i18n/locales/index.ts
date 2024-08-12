import { messages } from '@bnb-chain/space';

import { en as defaultMessages } from './en';

export const en = {
  ...messages.en,
  ...defaultMessages,
};

export const DEFAULT_LOCALE = 'en';

export const SUPPORTED_LOCALES = [
  'en',
  'es-LA',
  'fr-FR',
  'id-ID',
  'ko-KR',
  'pt-BR',
  'ru-RU',
  'tr-TR',
  'vi-VN',
  'zh-CN',
  'zh-TW',
];
