import styled from 'styled-components';
import Image from 'next/image';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { useEffect, useState } from 'react';
import AptosInbox from '@/public/images/AptosInbox.png';
import { Column, Row } from '@/components/Common/Flex';
import Client from '@/lib/aptos';
interface InboxCardProps {}

interface InboxCardTokenProps {
  img: string;
  creator: string;
  name: string;
  collection: string;
}

const InboxCardContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  padding: 8px 12px;
  gap: 10px;

  width: 175px;
  height: 296px;

  background: #ffffff;
  border-radius: 8px;
`;

const ImageContainer = styled.div`
  width: 150px;
  height: 150px;

  border-radius: 4px;
`;

const Text1 = styled.div`
  font-weight: 700;
  font-size: 14px;
  line-height: 20px;
  color: #000000;
`;

const Text2 = styled.div`
  font-weight: 400;
  font-size: 12px;
  line-height: 18px;
  color: #5200ff;
  width: 100%;
  text-align: left;
`;

const Text3 = styled.div`
  font-weight: 400;
  font-size: 10px;
  line-height: 18px;
  color: #000000;
`;

const InboxClaimButton = styled.button`
  padding: 4px 8px;
  gap: 10px;

  font-weight: 700;
  font-size: 14px;
  line-height: 20px;

  width: 100%;
  color: #000000;
  background: #ffffff;

  border: 1px solid #000000;
  border-radius: 4px;

  cursor: pointer;

  &:hover {
    color: #5200ff;

    border: 1px solid #5200ff;
  }

  &:disabled {
    cursor: not-allowed;
  }
`;

export const InboxCardCoin: React.FC<InboxCardProps> = ({}: InboxCardProps) => {
  const [inboxBalance, setInboxBalance] = useState('');

  const walletContext = useWallet();
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

  const fetchCoins = async () => {
    if (account == null) return;
    const coins = await client.fetchCoins(account.address);
    if (coins.success == false) return;
    if (coins.balances == undefined) return;
    try {
      setInboxBalance(client.format(coins.balances[0]?.amount.toString(), 8));
    } catch (err) {
      setInboxBalance('0');
    }
  };

  const claimCoins = async () => {
    if (account == null) return;

    const res = await client.claimCoin(account.address);

    alert(res);
  };

  useEffect(() => {
    console.log(walletContext);
    if (wallet) {
      fetchCoins();
    }
  }, [account]);

  return (
    <InboxCardContainer>
      <ImageContainer>
        <Image
          width={150}
          height={150}
          src={AptosInbox}
          alt="Inbox Image"
        ></Image>
      </ImageContainer>
      <Column
        style={{
          gap: '0',
        }}
      >
        <Text1>{inboxBalance} Aptos</Text1>
        <Text2>APT</Text2>
      </Column>
      <Column
        style={{
          gap: '0',
        }}
      >
        <Row>
          <Text3>From</Text3>
          <Text3>@b_loved_deok#0001</Text3>
        </Row>
        <Row>
          <Text3>Date</Text3>
          <Text3>35 min ago</Text3>
        </Row>
      </Column>
      <InboxClaimButton
        disabled={inboxBalance == '0'}
        onClick={() => {
          claimCoins();
        }}
      >
        Receive this Item
      </InboxClaimButton>
    </InboxCardContainer>
  );
};

export const InboxCardToken: React.FC<InboxCardTokenProps> = ({
  img,
  creator,
  name,
  collection,
}: InboxCardTokenProps) => {
  const [inboxBalance, setInboxBalance] = useState('');

  const walletContext = useWallet();
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

  const claimToken = async () => {
    if (account == null) return;
    const token = await client.claimToken(
      account.address,
      creator,
      collection,
      name,
    );

    alert(token.msg);
  };

  return (
    <InboxCardContainer>
      <ImageContainer>
        <Image width={150} height={150} src={img} alt="Inbox Image"></Image>
      </ImageContainer>
      <Column
        style={{
          gap: '0',
        }}
      >
        <Text1>{name}</Text1>
        <Text2>{collection}</Text2>
      </Column>
      <Column
        style={{
          gap: '0',
        }}
      >
        <Row>
          <Text3>From</Text3>
          <Text3>@b_loved_deok#0001</Text3>
        </Row>
        <Row>
          <Text3>Date</Text3>
          <Text3>35 min ago</Text3>
        </Row>
      </Column>
      <InboxClaimButton
        onClick={() => {
          claimToken;
        }}
      >
        Receive this Item
      </InboxClaimButton>
    </InboxCardContainer>
  );
};
