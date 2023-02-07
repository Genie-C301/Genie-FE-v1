import styled from 'styled-components';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { AptosClient, Types } from 'aptos';
import { useRouter } from 'next/router';
import Client from '@/lib/aptos';
import sendProfile1 from '@/public/images/sendProfile1.png';
import sendProfile2 from '@/public/images/sendProfile2.png';
import { AptosTokenModal } from '@/components/Common/Modal';
import CoinAptos from '@/public/icons/CoinAptos.svg';
import { WalletSelector } from '@/components/Aptos/WalletSelector';
import { useAutoConnect } from '@/components/Aptos/AutoConnectProvider';
import { truncateAddress } from '@/utils/utils';
import { AppContext } from '@/components/Aptos/AppContext';
import DiscordClient from '@/lib/discord';
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
  min-height: calc(100vh - 200px);
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
  height: 370px;

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

const WalletButtons = dynamic(() => import('@/components/Aptos/WalletButtons'));

export const DEVNET_NODE_URL = 'https://fullnode.devnet.aptoslabs.com/v1';

const aptosClient = new AptosClient(DEVNET_NODE_URL, {
  WITH_CREDENTIALS: false,
});

const TokenImage = styled.div`
  width: 40px;
  height: 40px;

  border-radius: 36px;

  overflow: hidden;
`;

export default function SendToken() {
  const router = useRouter();
  const { fromId, toId } = router.query;

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

  const [userData, setUserData] = useState<any>();
  const [receiverData, setReceiverData] = useState<any>();

  const { autoConnect, setAutoConnect } = useAutoConnect();
  const [successAlertMessage, setSuccessAlertMessage] = useState<string>('');
  const [errorAlertMessage, setErrorAlertMessage] = useState<string>('');

  const [token, setToken] = useState<any | null>();

  const client = new Client(walletContext);
  const discordClient = new DiscordClient();

  const onSignAndSubmitTransaction = async () => {
    console.log('sending transaction');
    if (!token) return;
    const res = await client.optInAndTransferToken(
      receiverData.aptosWallets[0].address,
      //TODO toAddress
      token.creator,
      token.collection,
      token.name,
    );
    console.log(res.msg);
    alert(res.msg);
  };

  const fetchUserData = async () => {
    // getSomethingHere,
    // console.log(String(fromId));
    const res1 = await discordClient.fetchuserInfo(String(fromId));
    const res2 = await discordClient.fetchuserInfo(String(toId));
    setUserData(res1);
    res2.aptosWallets = res2.aptosWallets.reverse();
    setReceiverData(res2);
  };

  useEffect(() => {
    if (fromId && toId) fetchUserData();
  }, [fromId, toId]);

  // useEffect(() => {
  //   console.log(walletContext);
  //   if (wallet) {
  //   }
  // }, [account]);

  //TODO setToAddress with backend
  useEffect(() => {}, []);

  return (
    <ContentContainer>
      <Title>Send NFT(token)</Title>

      <SummaryBox>
        <Profile imgSource={userData?.avatar}>
          {userData?.name + '#' + userData?.discriminator}
        </Profile>{' '}
        <DottedLine />
        <Column>
          {token ? (
            <TokenImage>
              <Image
                width={40}
                height={40}
                src={token?.uri}
                alt="Selected Token Image"
              ></Image>
            </TokenImage>
          ) : (
            'Select NFT'
          )}
          <div>{token?.name}</div>
        </Column>
        <DottedLine />
        <Profile imgSource={receiverData?.avatar}>
          {receiverData?.name + '#' + receiverData?.discriminator}
        </Profile>{' '}
      </SummaryBox>

      <TransactionBox>
        <TransactionTitle>Transaction Detail</TransactionTitle>
        <Column>
          <Row>
            <TransactionDetailKey>From</TransactionDetailKey>
            <TransactionDetailValue1>
              {userData?.name + '#' + userData?.discriminator}
            </TransactionDetailValue1>
            <TransactionDetailValue2>
              {connected
                ? truncateAddress(account?.address)
                : 'Connect your wallet first'}
            </TransactionDetailValue2>
          </Row>
          <Row>
            <TransactionDetailKey>To</TransactionDetailKey>
            <TransactionDetailValue1>
              {receiverData?.name + '#' + receiverData?.discriminator}
            </TransactionDetailValue1>
            <TransactionDetailValue2>Inbox</TransactionDetailValue2>
          </Row>
          <Row>
            <TransactionDetailKey>NFT</TransactionDetailKey>
            <TransactionDetailValue1>{token?.name}</TransactionDetailValue1>
          </Row>
        </Column>
        <Column style={{ marginTop: 'auto' }}>
          <WalletSelector />
          <InteractionButton
            disabled={!connected}
            onClick={() => {
              setModalShow(true);
            }}
          >
            Select NFT
          </InteractionButton>
          <InteractionButton
            disabled={!connected}
            onClick={onSignAndSubmitTransaction}
          >
            Send
          </InteractionButton>
        </Column>
      </TransactionBox>

      {modalShow && (
        <AptosTokenModal
          onClose={() => {
            setModalShow(false);
          }}
          userAddress={String(account?.address)}
          setToken={setToken}
        ></AptosTokenModal>
      )}
    </ContentContainer>
  );
}
