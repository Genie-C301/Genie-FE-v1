import styled, { useTheme } from 'styled-components';
import { useState } from 'react';
import Link from 'next/link';
import GenieLogo from '@/public/images/GenieLogo.svg';

import { Profile } from '@/components/Layout/Profile';
import { useRouter } from 'next/router';
interface HeaderProps {}

const HeaderContainer = styled.div`
  display: fixed;
  flex-direction: row;
  align-items: center;
  padding: 0px 36px;

  position: sticky;
  width: 100vw;
  height: 60px;
  left: 0px;
  top: 0px;
  gap: 40px;

  z-index: 25;
  background: #2b2d32;
`;

const HeaderRouteContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  padding: 0px;
  gap: 20px;

  flex-grow: 1;
`;

const HeaderRouteButton = styled(Link)`
  font-weight: 700;
  font-size: 24px;
  line-height: 34px;
  transition: 0.5s;
  &:hover {
    color: #5200ff;
  }
`;

export const Header = ({}: HeaderProps) => {
  const router = useRouter();
  const { fromId } = router.query;

  return (
    <HeaderContainer>
      <Link href={'/'}>
        <GenieLogo />
      </Link>
      <HeaderRouteContainer>
        <HeaderRouteButton href={`/documents?fromId=${fromId}`}>
          Documents
        </HeaderRouteButton>
        <HeaderRouteButton href={`/dashboard?fromId=${fromId}`}>
          Dashboard
        </HeaderRouteButton>
        {/* <HeaderRouteButton href={'/inbox'}>Inbox</HeaderRouteButton> */}
        {/* <HeaderRouteButton href={'/mypage'}>MyPage</HeaderRouteButton> */}
      </HeaderRouteContainer>
      <Profile />
    </HeaderContainer>
  );
};
