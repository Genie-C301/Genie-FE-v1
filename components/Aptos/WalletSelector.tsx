import React, { useState } from 'react';
import { Button, Menu, Modal, Typography } from 'antd';
import {
  useWallet,
  WalletName,
  WalletReadyState,
} from '@aptos-labs/wallet-adapter-react';
// import './styles.css';
import styled from 'styled-components';
import { truncateAddress } from '@/utils/utils';
import CoinAptos from '@/public/icons/CoinAptos.svg';
const { Text } = Typography;

interface ButtonProps {
  disabled?: boolean;
  connected?: boolean;
}

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

  background: ${(props) => (props.connected ? `transparent` : `#5200ff`)};
  border: ${(props) => (props.connected ? `2px solid #5200ff` : `none`)};
  color: #ffffff;
  cursor: pointer;

  &:disabled {
    background: #a1a1a1;
    color: #000000;
    cursor: not-allowed;
  }

  /* &:connected {
    border: 2px solid #5200ff;
    border-radius: 8px;
  } */

  border-radius: 8px;
`;

export function WalletSelector() {
  const [walletSelectorModalOpen, setWalletSelectorModalOpen] = useState(false);
  const { connect, disconnect, account, wallets, connected } = useWallet();

  const onWalletButtonClick = () => {
    if (connected) {
      disconnect();
    } else {
      setWalletSelectorModalOpen(true);
    }
  };

  const onWalletSelected = (wallet: WalletName) => {
    connect(wallet);
    setWalletSelectorModalOpen(false);
    console.log(wallet);
  };

  return (
    <>
      <InteractionButton
        onClick={() => onWalletButtonClick()}
        connected={connected}
      >
        {connected && <CoinAptos fill="currentColor" />}
        {connected ? truncateAddress(account?.address) : 'Connect Aptos Wallet'}
      </InteractionButton>
      <Modal
        title={<div className="wallet-modal-title">Connect Wallet</div>}
        centered
        open={walletSelectorModalOpen}
        onCancel={() => setWalletSelectorModalOpen(false)}
        footer={[]}
        closable={false}
      >
        {!connected && (
          <Menu>
            {wallets.map((wallet) => {
              return (
                <Menu.Item
                  key={wallet.name}
                  onClick={
                    wallet.readyState === WalletReadyState.Installed ||
                    wallet.readyState === WalletReadyState.Loadable
                      ? () => onWalletSelected(wallet.name)
                      : () => window.open(wallet.url)
                  }
                >
                  <div className="wallet-menu-wrapper">
                    <div className="wallet-name-wrapper">
                      <img
                        src={wallet.icon}
                        width={25}
                        style={{ marginRight: 10 }}
                      />
                      <Text className="wallet-selector-text">
                        {wallet.name}
                      </Text>
                    </div>
                    {wallet.readyState === WalletReadyState.Installed ||
                    wallet.readyState === WalletReadyState.Loadable ? (
                      <Button className="wallet-connect-button">
                        <Text className="wallet-connect-button-text">
                          Connect
                        </Text>
                      </Button>
                    ) : (
                      <Text className="wallet-connect-install">Install</Text>
                    )}
                  </div>
                </Menu.Item>
              );
            })}
          </Menu>
        )}
      </Modal>
    </>
  );
}
