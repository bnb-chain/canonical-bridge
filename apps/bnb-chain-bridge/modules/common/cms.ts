import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { AppDispatch } from '@/core/store/store';
import { cmsClient } from '@/core/utils/client';
import { env } from '@/core/configs/env';

type CmsBridge = {
  discordLink: string;
};

interface InitialState {
  discordLink: string;
}

const initialState: InitialState = {
  discordLink: '',
};

const slice = createSlice({
  name: 'cms',
  initialState,
  reducers: {
    setCmsData(state, { payload }: PayloadAction<InitialState>) {
      const { discordLink } = payload;
      state.discordLink = discordLink;
    },
  },
});

export const { setCmsData } = slice.actions;

export const setupCmsData = () => async (dispatch: AppDispatch) => {
  try {
    const res = await cmsClient.get<{ data: CmsBridge }>(
      `${env.DIRECTUS_API_URL}/items/chain_bridge?fields=*.*`,
    );

    const data = res.data.data;
    if (!data) return;

    const { discordLink } = data;

    dispatch(setCmsData({ discordLink }));
  } catch (error) {}
};

export default slice.reducer;
