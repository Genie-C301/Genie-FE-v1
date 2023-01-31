import styled from 'styled-components';
import { useAptos } from '@/lib/useAptos';

import { useEffect } from 'react';

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;

  margin-top: 60px;
  margin-bottom: 60px;

  width: 100%;
  min-height: calc(100% - 120px);
`;

const DebugText = styled.div`
  color: #ffffff;
`;

const DebugButton = styled.button`
  color: #ffffff;
`;

export default function Coin() {
  const { connect, address, account } = useAptos();

  useEffect(() => {
    connect();
  }, []);

  return (
    <ContentContainer>
      <DebugText>address: {address}</DebugText>
      <DebugText>
        account.authentication_key: {account?.authentication_key}
      </DebugText>
      <DebugText>account.sequence_number: {account?.sequence_number}</DebugText>
      <DebugButton onClick={() => connect()}>conenct wallet</DebugButton>
    </ContentContainer>
  );
}
