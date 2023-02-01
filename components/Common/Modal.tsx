import React, { ReactNode, useContext, useEffect, useState } from 'react';
import Link from 'next/link';

import styled from 'styled-components';
import { Row, RowDivider, Portal } from '@/components/Common';
import CoinAptos from '@/public/icons/AptosTicker.svg';
import AngleDown from '@/public/icons/AngleDown.svg';
interface ButtonProps {
  disabled?: boolean;
}

interface ModalProps {
  onClose: () => void;
  children: ReactNode;
}

type CoinTransferInfo = {
  from: string;
  to: string;
  coin: string;
  balance: string;
};

interface AptosCoinModalProps {
  coinTransferInfo: CoinTransferInfo;
  onClose: () => void;
  setAmount: (arg0: string) => void;
  userBalance: string;
}

const CoinText = styled.div`
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;

  color: #000000;
`;

const ModalTitle = styled.div`
  font-weight: 700;
  font-size: 28px;
  line-height: 38px;
  /* identical to box height, or 136% */

  text-align: center;

  color: #ffffff;
`;

const CoinDropdownContainer = styled.div`
  position: absolute;
  left: 0px;
  top: 40px;

  display: none;
  flex-direction: column;
  align-items: flex-start;

  gap: 0;

  transition: 0.5s;
`;

const CoinDropdownElement = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  padding: 8px 12px;
  gap: 8px;
  width: 118px;
  height: 41px;
  background: #ffffff;
`;

const CoinDropdownStyle = styled.div`
  position: relative;

  display: flex;
  flex-direction: row;
  align-items: flex-start;
  padding: 8px 12px;
  gap: 8px;

  width: 118px;
  height: 41px;
  color: #000000;
  background: #ffffff;
  border-radius: 4px;
  &:hover {
    ${CoinDropdownContainer} {
      display: flex;
    }
  }
`;

const CoinAmountField = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  padding: 8px 12px;
  gap: 10px;

  height: 41px;

  background: #ffffff;
  border-radius: 4px;
`;

const CoinAmountInput = styled.input`
  background: transparent;
  border: none;
  outline-style: none;

  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  color: #000000;

  flex-grow: 1;
  ::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  ::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`;

const CoinBalanceText = styled.div`
  width: 100%;

  font-weight: 400;
  font-size: 14px;
  line-height: 20px;

  text-align: right;

  color: #a1a1a1;
`;

const CoinButton = styled.button<ButtonProps>`
  width: 175px;
  height: 40px;

  align-items: center;
  justify-content: center;
  padding: 8px 12px;
  gap: 4px;

  border-radius: 8px;

  cursor: pointer;

  background: #a1a1a1;
  color: #000000;
`;

function CoinDropdown() {
  return (
    <CoinDropdownStyle>
      <CoinAptos />
      <CoinText>APT</CoinText>
      <AngleDown />
      <CoinDropdownContainer>
        <CoinDropdownElement>
          <CoinAptos />
          <CoinText>APT</CoinText>
        </CoinDropdownElement>
      </CoinDropdownContainer>
    </CoinDropdownStyle>
  );
}

export const AptosCoinModal: React.FC<AptosCoinModalProps> = ({
  onClose,
  coinTransferInfo,
  setAmount,
  userBalance,
}) => {
  const { from, to, coin, balance = 100 } = coinTransferInfo;

  const [inputValue, setInputValue] = useState('0');

  return (
    <Modal onClose={onClose}>
      <ModalTitle>Change Value</ModalTitle>
      <Row>
        <CoinDropdown />
        <CoinAmountField>
          <CoinAmountInput
            type="number"
            placeholder="1.0"
            onChange={(e) => {
              setInputValue(e.target.value.toString());
            }}
          />
          <CoinText>APT</CoinText>
        </CoinAmountField>
      </Row>
      <CoinBalanceText>
        Balance:{' '}
        {Number(userBalance).toLocaleString('ko-KR', {
          maximumFractionDigits: 4,
        })}{' '}
        APT
      </CoinBalanceText>
      <RowDivider />
      <Row>
        <CoinButton onClick={onClose}>Cancel</CoinButton>
        <CoinButton
          style={{
            background: '#5200ff',
            color: 'white',
          }}
          onClick={() => {
            setAmount(inputValue);
            onClose();
          }}
        >
          Change Value
        </CoinButton>
      </Row>
    </Modal>
  );
};

const ModalOverlay = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 45;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.7);
`;

const ModalConatiner = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  gap: 12px;
  width: 400px;
  background: #000000;
  border: 2px solid #ffffff;
  border-radius: 8px;
  z-index: 50;
`;

export const Modal: React.FC<ModalProps> = ({ onClose, children }) => {
  useEffect(() => {
    const scrollY = document.body.style.top;
    window.scrollTo(0, parseInt(scrollY || '0', 10) * -1);
    document.body.style.cssText = `
    overflow: hidden;
    `;
    return () => {
      const scrollY = document.body.style.top;
      document.body.style.cssText = 'overflow: visible;';
      window.scrollTo(0, parseInt(scrollY || '0', 10) * -1);
    };
  }, []);
  return (
    <Portal elementId="modal-root">
      <ModalOverlay
        onClick={(event) => {
          if (event.target === event.currentTarget) {
            return onClose();
          }
        }}
      >
        <ModalConatiner>{children}</ModalConatiner>
      </ModalOverlay>
    </Portal>
  );
};
