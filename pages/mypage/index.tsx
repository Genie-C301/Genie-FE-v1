import styled from 'styled-components';
import ProfileImage from '@/public/images/ProfileImg.png';
import Image from 'next/image';

import DiscordIcon from '@/public/icons/Discord.svg';
import TwitterIcon from '@/public/icons/Twitter.svg';
import Aptos from '@/public/icons/Aptos.svg';
import { truncateAddress } from '@/utils/utils';
enum Networks {
  aptos = 'APTOS',
}

interface WalletAccountProps {
  isReceiveWallet: boolean;
  address: string;
  network: string;
}

const ContentContainer = styled.div`
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

function WalletAccount({
  isReceiveWallet,
  address,
  network,
}: WalletAccountProps) {
  return (
    <WalletInfo>
      <Aptos />
      <WalletAddress>{truncateAddress(address)}</WalletAddress>
      {isReceiveWallet && <ReceiveSelector>Receive Wallet</ReceiveSelector>}
      {!isReceiveWallet && (
        <DisconnectButton>Set Receive Wallet</DisconnectButton>
      )}
      <DisconnectButton>Disconnect</DisconnectButton>
    </WalletInfo>
  );
}

const dummyWallets = [
  {
    isReceiveWallet: false,
    address: '0x5df5...e75b8e',
    nework: Networks.aptos,
  },
  {
    isReceiveWallet: true,
    address: '0x4c87...f8a5ol',
    nework: Networks.aptos,
  },
  {
    isReceiveWallet: false,
    address: '0x5df5...e75b8e',
    nework: Networks.aptos,
  },
  {
    isReceiveWallet: false,
    address: '0x5df5...e75b8e',
    nework: Networks.aptos,
  },
];

export default function MyPage() {
  return (
    <ContentContainer>
      <Title>Edit Profile / Wallet</Title>

      <Column>
        <Divider />
        <Row>
          <SectionTitle>User Information</SectionTitle>
          <SectionDesc>Personalize your informations</SectionDesc>
        </Row>
        <Row>
          <DetailTitle>PFP</DetailTitle>
          <DetailDesc>Your PFP image</DetailDesc>
        </Row>
        <Image
          width={200}
          height={200}
          src={ProfileImage}
          alt="Profile Image"
        ></Image>
        <Row>
          <DetailTitle>UserName</DetailTitle>
          <DetailDesc>Your nickname</DetailDesc>
        </Row>
        <NicknameContainer>LeafCat</NicknameContainer>
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
              <SocialHandle>LeafCat#4774</SocialHandle>
            </DiscordButton>
          </SocialBox>
          <SocialBox>
            <DetailTitle>Twitter</DetailTitle>
            <TwitterButton>
              <TwitterIcon fill="currentColor" />
              <SocialHandle>@0xleafcat</SocialHandle>
              <DisconnectButton>Disconnect</DisconnectButton>
            </TwitterButton>
          </SocialBox>
        </Row>
      </Column>
      <Column>
        <Divider />
        <Row>
          <SectionTitle>Wallets </SectionTitle>
          <SectionDesc>Connect or disconnect your wallets</SectionDesc>
        </Row>
        <Column>
          <DetailTitle>Aptos</DetailTitle>
          {dummyWallets.map((v, i) => {
            return (
              <WalletAccount
                isReceiveWallet={v.isReceiveWallet}
                address={v.address}
                network={v.nework}
                key={i}
              />
            );
          })}
        </Column>
      </Column>
    </ContentContainer>
  );
}
