import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  cBridge,
  deBridge,
  ICBridgeTransferConfig,
  IChainConfig,
  ICustomizedBridgeConfig,
  IDeBridgeTransferConfig,
  ILayerZeroConfig,
  IMesonTransferConfig,
  IStargateTransferConfig,
  layerZero,
  meson,
  stargate,
} from '@bnb-chain/canonical-bridge-widget';

import { env } from '@/core/env';

export function useTransferConfig() {
  const [transferConfig, setTransferConfig] = useState<ICustomizedBridgeConfig['transfer']>();

  useEffect(() => {
    const initTransferConfig = async () => {
      const [cBridgeRes, deBridgeRes, stargateRes, layerZeroRes, mesonRes, transferRes, chainsRes] =
        await Promise.all([
          axios.get<{ data: ICBridgeTransferConfig }>(
            `${env.SERVER_ENDPOINT}/api/bridge/v2/cbridge`,
          ),
          axios.get<{ data: IDeBridgeTransferConfig }>(
            `${env.SERVER_ENDPOINT}/api/bridge/v2/debridge`,
          ),
          axios.get<{ data: IStargateTransferConfig }>(
            `${env.SERVER_ENDPOINT}/api/bridge/v2/stargate`,
          ),
          axios.get<{ data: ILayerZeroConfig }>(`${env.SERVER_ENDPOINT}/api/bridge/v2/layer_zero`),
          axios.get<{ data: IMesonTransferConfig }>(`${env.SERVER_ENDPOINT}/api/bridge/v2/meson`),

          axios.get<{ data: ICustomizedBridgeConfig['transfer'] }>(
            `${env.SERVER_ENDPOINT}/api/config/transfer`,
          ),
          axios.get<{ data: IChainConfig[] }>(`${env.SERVER_ENDPOINT}/api/config/chains`),
        ]);

      const cBridgeConfig = cBridgeRes.data.data;
      const deBridgeConfig = deBridgeRes.data.data;
      const mesonConfig = mesonRes.data.data;
      const stargateConfig = stargateRes.data.data;
      const layerZeroConfig = layerZeroRes.data.data;

      const transfer = transferRes.data.data;
      const chainConfigs = chainsRes.data.data;

      const providers =
        transfer?.providers?.map((e) => {
          switch (e?.id) {
            case 'cBridge':
              return cBridge({
                ...e,
                config: cBridgeConfig,
              });
            case 'deBridge':
              return deBridge({
                ...e,
                config: deBridgeConfig,
              });
            case 'stargate':
              return stargate({
                ...e,
                config: stargateConfig,
              });
            case 'meson':
              return meson({
                ...e,
                config: mesonConfig,
              });
            case 'layerZero':
              return layerZero({
                ...e,
                config: layerZeroConfig,
              });
          }
        }) ?? [];

      setTransferConfig({
        ...transfer,
        chainConfigs,
        providers,
      });
    };

    initTransferConfig();
  }, []);

  return transferConfig;
}
