import styled, { useTheme } from 'styled-components';
import { useState } from 'react';
import { Header } from '@/components/Layout/Header';
import { Footer } from '@/components/Layout/Footer';
interface LayoutProps {
  children: React.ReactNode;
  changeTheme: () => void;
}

const AppContainer = styled.div`
  position: relative;
  width: 100%;
  min-height: 100%;

  display: flex;
  flex-direction: column;
  background-color: #1d1f21;
  align-items: center;
  z-index: 10;
`;

const PageContainer = styled.div`
  position: relative;

  width: 100%;
  text-align: center;
  padding: 40px auto;

  background: #1d1f21;
`;

export const Layout = ({ children, changeTheme }: LayoutProps) => {
  const theme = useTheme();

  return (
    <AppContainer theme={theme}>
      <Header />
      <PageContainer>{children}</PageContainer>
      {/* {children} */}
      <Footer />
    </AppContainer>
  );
};
