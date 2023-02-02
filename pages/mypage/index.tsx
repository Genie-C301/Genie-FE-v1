import styled from 'styled-components';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { SignMessagePayload } from '@aptos-labs/wallet-adapter-core';
import { SignMessageResponse } from '@aptos-labs/wallet-adapter-core';
import { truncateAddress } from '@/utils/utils';
import Client from '@/lib/aptos';
import ProfileImage from '@/public/images/ProfileImg.png';
import Aptos from '@/public/icons/Aptos.svg';
import DiscordIcon from '@/public/icons/Discord.svg';
import TwitterIcon from '@/public/icons/Twitter.svg';
import { AddWalletModal } from '@/components/Common/Modal';
import DiscordClient from '@/lib/discord';
enum Networks {
  aptos = 'APTOS',
}

interface WalletAccountProps {
  address: string;
  network: string;
}

const ContentContainer = styled.div`
  width: 920px;
  min-height: calc(100vh - 200px);
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

const Column = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 12px;
`;

const Divider = styled.div`
  width: 100%;
  height: 0px;
  border: 1px solid #ffffff;
`;

const Row = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: left;
  align-items: center;

  width: 100%;
  height: max-content;
  gap: 12px;
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

const DetailTitle = styled.div`
  font-weight: 700;
  font-size: 16px;
  line-height: 22px;

  text-align: left;
`;

const DetailDesc = styled.div`
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  color: #a1a1a1;
`;

const NicknameContainer = styled.div`
  font-weight: 700;
  font-size: 28px;
  line-height: 38px;

  border: 2px solid white;
  border-radius: 12px;
  width: fit-content;
  padding: 0 24px;
`;

const SocialBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;

  flex-grow: 1;
`;

const SocialHandle = styled.div`
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;

  text-align: left;

  flex-grow: 1;
`;

const DiscordButton = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 8px 12px;
  gap: 10px;
  color: #ffffff;
  background: #5a65ea;
  border-radius: 8px;
  height: 44px;
`;

const TwitterButton = styled(DiscordButton)`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 8px 12px;
  gap: 10px;
  color: #ffffff;
  background: #4a99e9;
  border-radius: 8px;
  height: 44px;
`;

const DisconnectButton = styled.button`
  padding: 4px 8px;
  gap: 10px;

  background: transparent;
  border: 1px solid #000000;
  border-radius: 4px;

  color: #000000;
  transition: 0.5s;

  &:hover {
    color: #ffffff;
    border: 1px solid #ffffff;
    background: #1d1f21;
  }

  cursor: pointer;
`;

const WalletInfo = styled.div`
  display: flex;
  flex-direction: row;
  gap: 12px;

  padding: 8px 12px;
  gap: 10px;

  width: 100%;
  height: 44px;

  align-items: center;

  background: #ffffff;
  border-radius: 8px;
`;

const WalletAddress = styled.div`
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  color: #000000;

  text-align: left;
  flex-grow: 1;
`;

const ReceiveSelector = styled.div`
  font-weight: 700;
  font-size: 12px;
  line-height: 18px;
  color: #008f0e;
  flex-grow: 99;
  text-align: left;
`;

const AddWalletButton = styled.button`
  align-items: center;
  padding: 8px 12px;

  font-weight: 700;
  font-size: 20px;
  line-height: 28px;

  width: 920px;
  height: 44px;

  background: #a1a1a1;
  color: #000000;
  border-radius: 8px;

  cursor: pointer;
`;

function WalletAccount({ address, network }: WalletAccountProps) {
  return (
    <WalletInfo>
      <Aptos />
      <WalletAddress>{truncateAddress(address)}</WalletAddress>
      {/* {isReceiveWallet && <ReceiveSelector>Receive Wallet</ReceiveSelector>}
      {!isReceiveWallet && (
        <DisconnectButton>Set Receive Wallet</DisconnectButton>
      )} */}
      <DisconnectButton>Disconnect</DisconnectButton>
    </WalletInfo>
  );
}

const dummyWallets = [
  {
    address: '0x5df5...e75b8e',
    nework: Networks.aptos,
  },
  {
    address: '0x4c87...f8a5ol',
    nework: Networks.aptos,
  },
  {
    address: '0x5df5...e75b8e',
    nework: Networks.aptos,
  },
  {
    address: '0x5df5...e75b8e',
    nework: Networks.aptos,
  },
];

export default function MyPage() {
  const router = useRouter();
  const { fromId, autoVerify = false } = router.query;

  const [showAddWalletModal, setShowAddWalletModal] = useState(
    Boolean(autoVerify),
  );
  const [autoVeifyState, setAutoVerifyState] = useState(autoVerify);

  const [userData, setUserData] = useState<any>();

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
  const discordClient = new DiscordClient();

  const fetchUserData = async () => {
    // getSomethingHere,
    // console.log(String(fromId));
    const res = await discordClient.fetchuserInfo(String(fromId));
    console.log(res);
    setUserData(res);
  };

  useEffect(() => {
    if (fromId) fetchUserData();
  }, [fromId]);

  useEffect(() => {
    //TODO display
    if (connected && autoVerify) {
      const signResponse = signMessage({
        nonce: '0',
        message: 'Genie Wallet Verify',
        address: true,
        application: true,
        chainId: true,
      });
      console.log(signResponse);
    }
  }, [autoVerify]);

  return (
    <ContentContainer>
      <Title>Edit Profile / Wallet</Title>

      <Column>
        <Divider />
        <Row>
          <SectionTitle>User Information</SectionTitle>
          <SectionDesc>Personalize your informations</SectionDesc>
        </Row>
        <Column>
          <Row>
            <DetailTitle>PFP</DetailTitle>
            <DetailDesc>Your PFP image</DetailDesc>
          </Row>
        </Column>
        <Row>
          <Image
            width={200}
            height={200}
            src={userData?.avatar}
            alt="Profile Image"
          ></Image>
          <Column>
            <Row>
              <DetailTitle>Social Layer Account</DetailTitle>
              <DetailDesc>Your Social Layer Account</DetailDesc>
            </Row>
            <Title
              style={{
                textAlign: 'left',
              }}
            >
              {'Abstract Wallet from Aptos'}
            </Title>
            <Row>
              <DetailTitle>UserName</DetailTitle>
              <DetailDesc>Your nickname</DetailDesc>
            </Row>
            <Title
              style={{
                textAlign: 'left',
                fontWeight: '400',
                fontSize: '24px',
                lineHeight: '36px',
              }}
            >
              {userData?.name}
            </Title>
          </Column>
        </Row>
      </Column>
      <Column>
        <Divider />
        <Row>
          <SectionTitle>Social Accounts</SectionTitle>
          <SectionDesc>Connect or disconnect your social media</SectionDesc>
        </Row>
        <Row>
          <SocialBox>
            <DetailTitle>Discord</DetailTitle>
            <DiscordButton>
              <DiscordIcon />
              <SocialHandle>
                {' '}
                {userData?.name + '#' + userData?.discriminator}
              </SocialHandle>
            </DiscordButton>
          </SocialBox>
          <SocialBox>
            <DetailTitle>Twitter</DetailTitle>
            <TwitterButton>
              <TwitterIcon fill="currentColor" />
              <SocialHandle>
                {userData?.name + '#' + userData?.discriminator}
              </SocialHandle>
              <DisconnectButton>Disconnect</DisconnectButton>
            </TwitterButton>
          </SocialBox>
        </Row>
      </Column>
      <Column>
        <Divider />
        <Row>
          <SectionTitle>Manager Wallets </SectionTitle>
          <SectionDesc>Connect or disconnect your wallets</SectionDesc>
        </Row>
        <Column>
          <DetailTitle>Aptos</DetailTitle>

          {
            // @ts-ignore
            userData?.aptosWallets?.map((v, i) => {
              return (
                <WalletAccount address={v.address} network={v.nework} key={i} />
              );
            })
          }
          <AddWalletButton
            onClick={() => {
              console.log('show modal');
              console.log(showAddWalletModal);
              setShowAddWalletModal(true);
            }}
          >
            + Add New Manager Wallet
          </AddWalletButton>
        </Column>
      </Column>
      {showAddWalletModal && (
        <AddWalletModal
          onClose={() => {
            setShowAddWalletModal(false);
          }}
          fromId={String(fromId)}
        ></AddWalletModal>
      )}
    </ContentContainer>
  );
}
