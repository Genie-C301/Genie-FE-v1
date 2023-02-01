import styled from 'styled-components';
import { useAptos } from '@/lib/useAptos';
import Image from 'next/image';
import { useEffect } from 'react';
import sendProfile1 from '@/public/images/sendProfile1.png';
import sendProfile2 from '@/public/images/sendProfile2.png';
import { useState } from 'react';
import { AptosCoinModal } from '@/components/Common/Modal';
import CoinAptos from '@/public/icons/CoinAptos.svg';
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
  const { connect, address, account } = useAptos();
  const [modalShow, setModalShow] = useState<boolean>(false);

  useEffect(() => {
    connect();
  }, []);

  return (
    <ContentContainer>
      <Title>Send Token(coin)</Title>

      <SummaryBox>
        <Profile imgSource={sendProfile1}>LeafCat#4774</Profile>
        <DottedLine />
        <Balance
          onClick={() => {
            setModalShow(true);
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
              Connect your wallet first
            </TransactionDetailValue2>
          </Row>
          <Row>
            <TransactionDetailKey>To</TransactionDetailKey>
            <TransactionDetailValue1>b_loved_deok#0001</TransactionDetailValue1>
            <TransactionDetailValue2>0x5c...48a7</TransactionDetailValue2>
          </Row>
          <Row>
            <TransactionDetailKey>Value</TransactionDetailKey>
            <TransactionDetailValue1>{15.5} APT</TransactionDetailValue1>
            <TransactionDetailValue2>
              Connect your wallet first
            </TransactionDetailValue2>
          </Row>
        </Column>
        <Column style={{ marginTop: 'auto' }}>
          <InteractionButton>Connect Aptos Wallet</InteractionButton>
          <InteractionButton disabled={true}>Send</InteractionButton>
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
        ></AptosCoinModal>
      )}
    </ContentContainer>
  );
}
