import styled from 'styled-components';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { WalletSelector } from '@/components/Aptos/WalletSelector';
import { Column } from '@/components/Common';
import { truncateAddress } from '@/utils/utils';
import Client from '@/lib/aptos';
import { useEffect, useMemo, useState } from 'react';
const ContentContainer = styled.div`
  min-height: calc(100vh - 200px);
  width: 920px;
  margin: 40px auto;
  align-items: center;

  display: flex;
  flex-direction: column;
  gap: 40px;
`;

const Title = styled.div`
  font-weight: 700;
  font-size: 36px;
  line-height: 46px;

  text-align: center;
`;

const SmallText = styled.div`
  font-weight: 400;
  font-size: 20px;
  line-height: 28px;

  text-align: left;

  width: 100%;
`;

export default function Dashboard() {
  const walletContext = useWallet();

  const [transactions, setTransactions] = useState<Array<any> | null>([]);

  const {
    connected,
    disconnect,
    account,
    network,
    wallet,
    signAndSubmitTransaction,
    signTransaction,
    signMessage,
    signMessageAndVerify,
  } = walletContext;

  const client = new Client(walletContext);

  const fetchTxHistory = async () => {
    const res = await client.accountTransactions();

    if (res.success) {
      setTransactions(res?.transactions);

      console.log(res.transactions);
    } else {
      alert(res.err);
    }
  };

  useMemo(() => {
    if (connected) {
      fetchTxHistory();
    }
  }, [connected, account]);

  return (
    <ContentContainer>
      <Title>Dashboard</Title>

      {connected ? (
        <Column style={{ width: '100%' }}>
          <SmallText>
            Transaction Hiistories of {truncateAddress(account?.address)}
          </SmallText>
          {transactions?.map((v, i) => {
            return <SmallText key={i}>{JSON.stringify(v)}</SmallText>;
          })}
        </Column>
      ) : (
        <Column style={{ width: '100%' }}>
          <SmallText>
            Connect wallet to check your Transaction Histories
          </SmallText>
          <WalletSelector />
        </Column>
      )}
    </ContentContainer>
  );
}
