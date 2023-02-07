import styled from 'styled-components';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { WalletSelector } from '@/components/Aptos/WalletSelector';
import { Column, Row, RowDivider } from '@/components/Common';
import { truncateAddress } from '@/utils/utils';
import Client from '@/lib/aptos';
import DiscordClient from '@/lib/discord';
import { InboxCardCoin, InboxCardToken } from '@/components/Common/InboxCard';
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
  font-weight: 700;
  font-size: 16px;
  line-height: 22px;

  text-align: left;
`;

const SectionTitle = styled.div`
  font-weight: 700;
  font-size: 28px;
  line-height: 38px;
`;

const SectionDesc = styled.div`
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  color: #a1a1a1;
`;

const AccountText = styled.div`
  width: 100%;
  font-weight: 700;
  font-size: 40px;
  line-height: 52px;

  text-align: left;
`;

const Text = styled.div`
  width: 176.5px;
  height: 22px;
  font-weight: 700;
  font-size: 16px;
  line-height: 22px;
`;

const TxRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 8px 12px;
  gap: 10px;

  width: 920px;
  height: 60px;

  background: #ffffff;
  border-radius: 8px;
`;

const Txtype = styled.div`
  font-weight: 700;
  font-size: 16px;
  line-height: 22px;
  /* identical to box height, or 138% */

  color: #000000;
`;

const Date = styled.div`
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  /* identical to box height, or 150% */

  color: #000000;
`;

export default function Dashboard() {
  const router = useRouter();
  const { fromId } = router.query;

  const walletContext = useWallet();

  const [userData, setUserData] = useState<any>();
  const [transactions, setTransactions] = useState<Array<any> | null>([]);
  const [tokens, setTokens] = useState<any[]>([]);

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
  const discordClient = new DiscordClient();

  const fetchTokens = async () => {
    if (userData == undefined) return;

    const res = await client.fetchTokens(userData.aptosWallets[0].address);

    console.log(res);
    setTokens(res);
  };

  const fetchUserData = async () => {
    if (fromId == null) return;
    // getSomethingHere,
    // console.log(String(fromId));
    const res = await discordClient.fetchuserInfo(String(fromId));
    res.aptosWallets = res.aptosWallets.reverse();
    setUserData(res);
  };

  useEffect(() => {
    fetchTokens();
    fetchUserData();
  }, [fromId]);

  useEffect(() => {
    fetchTokens();
  }, [userData]);

  // const fetchTxHistory = async () => {
  //   const res = await client.accountTransactions();

  //   if (res.success) {
  //     if (res.transactions === undefined) return;
  //     setTransactions(res?.transactions);

  //     console.log(res.transactions);
  //   } else {
  //     alert(res.err);
  //   }
  // };

  // useMemo(() => {
  //   if (connected) {
  //     fetchTxHistory();
  //   }
  // }, [connected, account]);

  return (
    <ContentContainer>
      <Title>Dashboard</Title>

      <Column style={{ width: '100%' }}>
        <Row>
          <SmallText>Social Layer Account</SmallText>
          <SectionDesc>Your Social Layer Account</SectionDesc>
        </Row>
        <AccountText>
          {truncateAddress(userData?.aptosWallets[0].address)}
        </AccountText>
        <RowDivider />
        {/* <Column style={{ width: '100%' }}>
            <SmallText>
              Transaction Hiistories of {truncateAddress(account?.address)}
            </SmallText>
            {transactions?.map((v, i) => {
              return <SmallText key={i}>{JSON.stringify(v)}</SmallText>;
            })}
          </Column> */}
      </Column>

      <Column style={{ width: '100%' }}>
        <Row>
          <SectionTitle>Your Inbox</SectionTitle>
          <SectionDesc>Claim NFTs in your Inbox</SectionDesc>
        </Row>
        <Row>
          <InboxCardCoin
            address={userData?.aptosWallets[0].address}
          ></InboxCardCoin>
          {tokens.map((v, i) => (
            <InboxCardToken
              address={userData?.aptosWallets[0].address}
              img={v.uri}
              creator={v.creator}
              name={v.name}
              collection={v.collection}
              key={i}
            ></InboxCardToken>
          ))}
        </Row>
        <RowDivider />
      </Column>
      <WalletSelector />

      {/* <Column style={{ width: '100%' }}>
        <Row>
          <SectionTitle>Transaction History</SectionTitle>
          <SectionDesc>Your Transaction History</SectionDesc>
        </Row>

        <Row>
          <Text>TX Type</Text>
          <Text>Item</Text>
          <Text>Date</Text>
          <Text>From, To</Text>
          <Text>View in Explorer</Text>
        </Row>
        <TxRow></TxRow>
      </Column> */}
    </ContentContainer>
  );
}

// (
//   <Column style={{ width: '100%' }}>
//     <SmallText>
//       Connect wallet to check your Inbox & Transaction Histories
//     </SmallText>
//     <WalletSelector />
//   </Column>
// )
