import styled from 'styled-components';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import Client from '@/lib/aptos';
import sendProfile1 from '@/public/images/sendProfile1.png';
import sendProfile2 from '@/public/images/sendProfile2.png';
import dynamic from 'next/dynamic';
import { AptosCoinModal } from '@/components/Common/Modal';
import CoinAptos from '@/public/icons/CoinAptos.svg';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { WalletSelector } from '@/components/Aptos/WalletSelector';
import { useAutoConnect } from '@/components/Aptos/AutoConnectProvider';
import { AptosClient, Types } from 'aptos';
import { truncateAddress } from '@/utils/utils';
import { AppContext } from '@/components/Aptos/AppContext';
interface StaticImageData {
  src: string;
  height: number;
  width: number;
  blurDataURL?: string;
  blurWidth?: number;
  blurHeight?: number;
}
interface StaticRequire {
  default: StaticImageData;
}

declare type StaticImport = StaticRequire | StaticImageData;
interface ProfileProps {
  imgSource: string | StaticImport;
  children: string;
}

interface ButtonProps {
  disabled?: boolean;
}

const ContentContainer = styled.div`
  width: 440px;
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

const Row = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: left;
  align-items: center;

  width: 100%;
  height: max-content;
  gap: 10px;
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 12px;

  align-items: center;
  justify-content: center;
`;

const SummaryBox = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 112px;

  justify-content: center;
  align-items: center;
`;

const DebugText = styled.div`
  color: #ffffff;
`;

const DebugButton = styled.button`
  color: #ffffff;
`;

const ProfileCrop = styled.div`
  width: 72px;
  height: 72px;

  border-radius: 36px;
  overflow: hidden;
`;

const ProfileText = styled.div`
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
`;

const DottedLine = styled.div`
  width: 40px;
  height: 0px;

  border: 1px dashed #ffffff;
`;

const TransactionBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  gap: 12px;

  width: 440px;
  height: 324px;

  border: 1px solid #ffffff;
  border-radius: 8px;
`;

const TransactionTitle = styled.div`
  font-weight: 700;
  font-size: 28px;
  line-height: 38px;

  text-align: left;
  width: 100%;
`;

const TransactionDetailKey = styled.div`
  font-weight: 700;
  font-size: 16px;
  line-height: 22px;
`;

const TransactionDetailValue1 = styled.div`
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;

  flex-grow: 1;
  text-align: left;
`;

const TransactionDetailValue2 = styled.div`
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;

  color: #a1a1a1;
`;

const InteractionButton = styled.button<ButtonProps>`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 8px 12px;
  gap: 10px;

  width: 100%;
  height: 44px;

  font-weight: 400;
  font-size: 16px;
  line-height: 24px;

  background: #5200ff;
  color: #ffffff;
  cursor: pointer;

  &:disabled {
    background: #a1a1a1;
    color: #000000;
    cursor: not-allowed;
  }

  &:connected {
    border: 2px solid #5200ff;
    border-radius: 8px;
  }

  border-radius: 8px;
`;

function Profile({ imgSource, children }: ProfileProps) {
  return (
    <Column>
      <ProfileCrop>
        <Image src={imgSource} width={72} height={72} alt="Profile Image" />
      </ProfileCrop>
      <ProfileText>{children}</ProfileText>
    </Column>
  );
}

const StyledColumn = styled(Column)`
  color: white;
  transition: 0.5s;
  &:hover {
    color: #5200ff;
  }
`;

function Balance({ onClick = () => {} }) {
  return (
    <StyledColumn onClick={onClick} style={{ cursor: 'pointer' }}>
      <CoinAptos fill="currentColor" />
      <div>balance</div>
    </StyledColumn>
  );
}

export default function Coin() {
  const [modalShow, setModalShow] = useState<boolean>(false);
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

  const { autoConnect, setAutoConnect } = useAutoConnect();
  const [successAlertMessage, setSuccessAlertMessage] = useState<string>('');
  const [errorAlertMessage, setErrorAlertMessage] = useState<string>('');

  const [amount, setAmount] = useState('0');
  const [userBalance, setUserBalance] = useState('0');
  const [toAddress, setToAddress] = useState('');

  const client = new Client(walletContext);

  const onSignAndSubmitTransaction = async () => {
    const res = await client.transferApt(
      '0.01',
      //TODO amount
      '0xb30d58ea44961e0d004fa0d7df0459eb2cacfbbe32545dce923048360c518f58',
      //TODO toAddress
    );
    console.log(res.msg);
    alert(res.msg);
    fetchCoins();
  };
  const fetchCoins = async () => {
    const coins = await client.fetchCoins();
    setUserBalance(client.format(coins[0]?.amount.toString(), 8));
  };

  useEffect(() => {
    console.log(walletContext);
    if (wallet) {
      fetchCoins();
    }
  }, [account]);

  //TODO setToAddress with backend
  useEffect(() => {}, []);

  return (
    <ContentContainer>
      <Title>Send Token(coin)</Title>

      <SummaryBox>
        <Profile imgSource={sendProfile1}>LeafCat#4774</Profile>
        <DottedLine />
        <Balance
          onClick={() => {
            if (connected) setModalShow(true);
          }}
        ></Balance>
        <DottedLine />
        <Profile imgSource={sendProfile2}>b_loved_deok#0001</Profile>
      </SummaryBox>

      <TransactionBox>
        <TransactionTitle>Transaction Detail</TransactionTitle>
        <Column>
          <Row>
            <TransactionDetailKey>From</TransactionDetailKey>
            <TransactionDetailValue1>LeafCat#4744</TransactionDetailValue1>
            <TransactionDetailValue2>
              {connected
                ? truncateAddress(account?.address)
                : 'Connect your wallet first'}
            </TransactionDetailValue2>
          </Row>
          <Row>
            <TransactionDetailKey>To</TransactionDetailKey>
            <TransactionDetailValue1>b_loved_deok#0001</TransactionDetailValue1>
            <TransactionDetailValue2>0x5c...48a7</TransactionDetailValue2>
          </Row>
          <Row>
            <TransactionDetailKey>Value</TransactionDetailKey>
            <TransactionDetailValue1>{amount} APT</TransactionDetailValue1>
            <TransactionDetailValue2>
              {connected
                ? `${Number(userBalance).toLocaleString('en-US', {
                    maximumFractionDigits: 4,
                  })} APT`
                : 'Connect your wallet first'}
            </TransactionDetailValue2>
          </Row>
        </Column>
        <Column style={{ marginTop: 'auto' }}>
          <WalletSelector />
          <InteractionButton
            disabled={!connected}
            onClick={onSignAndSubmitTransaction}
          >
            Send
          </InteractionButton>
        </Column>
      </TransactionBox>
      {/* 
      <DebugText>address: {address}</DebugText>
      <DebugText>
        account.authentication_key: {account?.authentication_key}
      </DebugText>
      <DebugText>account.sequence_number: {account?.sequence_number}</DebugText>
      <DebugButton onClick={() => connect()}>conenct wallet</DebugButton> */}
      {modalShow && (
        <AptosCoinModal
          coinTransferInfo={{ from: '', to: '', coin: '', balance: '0' }}
          onClose={() => {
            setModalShow(false);
          }}
          userBalance={userBalance}
          setAmount={setAmount}
        ></AptosCoinModal>
      )}
    </ContentContainer>
  );
}
