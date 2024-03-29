import { NavBar } from '@/components';
import { PageContainer } from '@ant-design/pro-components';
import { Outlet } from '@umijs/max';
import { GrazProvider, WalletType } from 'graz';
import React from 'react';
import { ChainInfo } from "@keplr-wallet/types";
import { ConfigProvider, message } from 'antd';
import { Bech32Address } from "@keplr-wallet/cosmos";
import { AuthProvider } from '@/hooks/useAuth';
import enUSIntl from 'antd/lib/locale/en_US';

export default () => {
  const cosmoshub: ChainInfo = {
    chainId: "cosmoshub-4",
    chainName: "Cosmos Hub",
    rpc: '',
    rest: '',
    bip44: {
      coinType: 118
    },
    bech32Config: Bech32Address.defaultBech32Config("osmo"),
    currencies: [],
    feeCurrencies: []
  }

  const intlMap = {
    enUSIntl,
  };  

  return (
    <ConfigProvider locale={intlMap['enUSIntl']}>
      <GrazProvider grazOptions={{
        chains: [cosmoshub],
        defaultWallet: WalletType.KEPLR,
      }}>
        <AuthProvider>
          <PageContainer>
            <NavBar />
            <Outlet />
          </PageContainer>
        </AuthProvider>
      </GrazProvider>
      </ConfigProvider>
  );
}