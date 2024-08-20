import { createDirectus, DirectusClient, readItems, rest, RestClient } from '@directus/sdk';
import { escapeRegExp, find, mapValues, omit, omitBy, pick, pickBy } from 'lodash-es';

import { FooterMenuProps } from '../../components';
import { Level1Props } from '../../components/Header/types';

export type { Level1Props };

const defaultLocale = 'en';

const translateFields = (objs: Record<string, string>[], keys: Array<string>, locale: string) => {
  const t1 = find(objs, (t) => t.languages_code === defaultLocale);
  const t2 = find(objs, (t) => t.languages_code === locale);

  if (!t2) return pick(t1, keys);

  return pick(
    mapValues(t2, (v, k) => v || t1?.[k] || ''),
    keys,
  );
};

const translateLink = (link: string, locale: string) => {
  if (!link) return link;
  return link.replace(new RegExp(escapeRegExp('${locale}'), 'ig'), locale);
};

type FooterMenuItemSchema = {
  href: string;
  data_analytics_id: string;
  target: '_self' | '_blank';
  translations: Array<{
    languages_code: string;
    title: string;
  }>;
};

type FooterMenuSchema = {
  id: number;
  translations: Array<{ languages_code: string; menu: string }>;
  items: Array<FooterMenuItemSchema>;
};

const transformFooterMenu = (data: FooterMenuSchema[], locale: string) => {
  return data.map((menu) => {
    const fields = translateFields(menu.translations, ['menu'], locale);
    const items = menu.items.map((i) => {
      const fields = translateFields(i.translations, ['title'], locale);
      return {
        ...omit(i, 'translations'),
        title: fields.title || '',
        href: translateLink(i.href, locale),
        target: i.target,
        'data-analytics-id': i.data_analytics_id,
      };
    });
    return { ...omit(menu, 'translations'), menu: fields.menu || '', items };
  });
};

let menus = Array<FooterMenuSchema>();
let headerMenus = Array<any>();

const getFooterMenus = async (client: DirectusClient<any> & RestClient<any>, locale: string) => {
  const _getMenus = () => {
    // fetch from server
    if (typeof window !== 'undefined') return Promise.resolve([]);
    return client
      .request<FooterMenuSchema[]>(
        // @ts-ignore ts v5
        readItems('footer_nav', {
          fields: ['id', { translations: ['*'] }, { items: ['*', { translations: ['*'] }] }],
        }),
      )
      .then((m) => (menus = m));
  };

  try {
    if (menus.length) {
      _getMenus();
      return transformFooterMenu(menus, locale);
    }

    const result = await _getMenus();
    return transformFooterMenu(result, locale);
  } catch {
    return [];
  }
};

const isObject = (obj: any) => {
  return Object.prototype.toString.call(obj) === '[object Object]';
};

const transformHeaderMenuObject = (obj: Record<string, any>, locale: string, prefix: string) => {
  if (!isObject(obj)) return obj;

  let newObj: Record<string, any> = mapValues(
    pickBy(
      obj,
      (v, k) =>
        ('languages_code' in obj ? true : v !== null) && (k === 'children' ? v?.length > 0 : true),
    ),
    (v) => {
      return typeof v === 'string'
        ? translateLink(v, locale)
        : Array.isArray(v)
        ? v.map((vv) => transformHeaderMenuObject(vv, locale, prefix))
        : isObject(v)
        ? transformHeaderMenuObject(v, locale, prefix)
        : v;
    },
  );

  if (newObj?.image?.filename_disk) {
    newObj.image = `${prefix}/${newObj?.image?.filename_disk}`;
  }

  if (newObj?.icon?.filename_disk) {
    newObj.icon = `${prefix}/${newObj?.icon?.filename_disk}`;
  }

  if (newObj?.src?.filename_disk) {
    newObj.src = `${prefix}/${newObj?.src?.filename_disk}`;
  }

  if (newObj?.thumbnail) {
    newObj = {
      ...omit(newObj, ['thumbnail']),
      ...transformHeaderMenuObject(newObj?.thumbnail, locale, prefix),
    };
  }

  if (newObj?.translations?.length) {
    newObj = {
      ...omit(newObj, ['translations']),
      ...translateFields(
        newObj?.translations,
        Object.keys(
          omitBy(
            newObj?.translations[0],
            (v, k) => k.endsWith('_id') || ['id', 'languages_code'].includes(k),
          ),
        ),
        locale,
      ),
    };
  }

  return newObj;
};

const transformHeaderMenu = (
  data: Record<string, any>[],
  locale: string,
  prefix: string,
): any[] => {
  return data.map((obj) => transformHeaderMenuObject(obj, locale, prefix));
};

const getHeaderMenus = async (
  client: DirectusClient<any> & RestClient<any>,
  locale: string,
  prefix: string,
) => {
  // fetch from server
  if (typeof window !== 'undefined') return Promise.resolve([]);

  const thumbnailImage = ['*.*', { translations: ['*'] }];
  const thumbnailLink = ['*', { translations: ['*'] }];
  const thumbnail = [
    'selfLink',
    'thumbnailAnalyticsId',
    { translations: ['*'] },
    { thumbnailImage },
    { thumbnailLink },
  ];
  const tag = ['link', 'variant', 'target', { translations: ['*'] }];
  const wallet = [
    { options: ['analyticsId', 'chain', 'key', { translations: ['*'] }] },
    { translations: ['*'] },
  ];
  const image = ['*'];
  const button = ['*'];
  const base = [
    'id',
    'key',
    'name',
    'desc',
    image,
    'analyticsId',
    { tag },
    'target',
    { icon: image },
    'link',
    'subLink',
    { wallet },
    'buttonBottom',
    'selfLink',
    'selfAnalyticsId',
    { thumbnail },
    { translations: ['*'] },
    { button },
  ];

  const _getMenus = () => {
    return client.request<any[]>(
      // @ts-ignore ts v5
      readItems('header_nav_level1', {
        fields: [...base, { children: [...base, { children: base }] }],
      }),
    );
  };

  try {
    if (headerMenus.length) {
      _getMenus();
      transformHeaderMenu(headerMenus, locale, prefix);
    }

    const result = await _getMenus();
    return transformHeaderMenu(result, locale, prefix);
  } catch {
    return [];
  }
};

export const getMenus = async (endpoint: string, locale: string, prefix: string) => {
  const client = createDirectus(endpoint).with(rest());
  const headerMenus: Level1Props[] = await getHeaderMenus(client, locale, prefix);
  const footerMenus: FooterMenuProps[] = await getFooterMenus(client, locale);

  return { headerMenus, footerMenus };
};
