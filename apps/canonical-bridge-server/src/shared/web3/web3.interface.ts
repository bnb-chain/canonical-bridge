export interface ICryptoCurrencyMapPayload {
  listing_status: 'active' | 'inactive' | 'untracked';
  start: number;
  limit: number;
  sort: 'cmc_rank' | 'id';
  symbol: string;
  aux: string;
}

export interface ITokenPlatform {
  id: number;
  name: string;
  symbol: string;
  slug: string;
  token_address: string;
}

export interface ICryptoCurrencyMapEntity {
  id: number;
  rank: number;
  name: string;
  symbol: string;
  slug: string;
  is_active: number;
  first_historical_data: string;
  last_historical_data: string;
  platform: null | ITokenPlatform;
}

export interface ICryptoCurrencyQuoteEntity {
  id: number;
  quote: {
    USD: {
      price: number;
    };
  };
}
