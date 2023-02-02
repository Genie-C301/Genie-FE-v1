import styled, { useTheme } from 'styled-components';
import { useState } from 'react';

interface FooterProps {}

const FooterContainer = styled.div`
  display: flex;
  bottom: 0;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 60px;
  background: #000000;
`;

const FooterText = styled.a`
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
`;

const FooterTextBold = styled.span`
  font-weight: 700;
  font-size: 14px;
  line-height: 20px;
`;

export const Footer = ({}: FooterProps) => {
  return (
    <FooterContainer>
      <FooterText>
        <FooterTextBold>GENIE </FooterTextBold>
        for your web3 experience | Powered by ATIV
      </FooterText>
    </FooterContainer>
  );
};
