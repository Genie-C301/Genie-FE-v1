import styled, { useTheme } from 'styled-components';
import { useContext, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import DiscordIcon from '@/public/icons/Discord.svg';
import ProfileImage from '@/public/images/ProfileImg.png';
import UserIcon from '@/public/icons/User.svg';
import LogoutIcon from '@/public/icons/Logout.svg';
import DiscordClient from '@/lib/discord';

interface ProfileProps {}

const ProfileButtonStyle = styled.button`
  position: relative;

  max-width: 175px;
  height: 40px;

  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 8px 12px;
  gap: 4px;

  border-radius: 8px;

  cursor: pointer;

  z-index: 30;
`;

const DiscordLogin = styled(ProfileButtonStyle)`
  background: #5a65ea;
`;

const DropdownContainer = styled.div`
  position: absolute;

  top: 40px;

  display: none;
  flex-direction: column;
  align-items: flex-start;
  padding: 8px 12px;
  gap: 12px;

  background: #000000;
  border: 1px solid #ffffff;
  border-radius: 8px;

  transition: 0.5s;

  &:hover {
    display: flex;
  }
`;

const DropdownElement = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;

  font-weight: 400;
  font-size: 16px;
  line-height: 24px;

  padding: 0px;
  gap: 4px;

  width: 151px;
  height: 25px;
  color: #ffffff;

  transition: 0.5s;

  &:hover {
    color: #5200ff;
  }
`;

const DiscordProfile = styled(ProfileButtonStyle)`
  border: 1px solid #ffffff;
  background: transparent;

  transition: 0.5s;
  &:hover {
    ${DropdownContainer} {
      display: flex;
    }
  }
`;

// Discord Login
// Discord Profile
// onClick => Profile Dropdown

export const Profile = ({}: ProfileProps) => {
  const router = useRouter();

  const { fromId } = router.query;

  const [userData, setUserData] = useState<any>();

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
  // if logged in
  return (
    <DiscordProfile>
      <Image
        width={24}
        height={24}
        src={userData?.avatar}
        alt={'Discord Profile Image'}
      />
      {userData?.name + '#' + userData?.discriminator}
      <DropdownContainer>
        <Link href={`/mypage?fromId=${fromId}`}>
          <DropdownElement>
            <UserIcon fill="currentColor" />
            Edit Profile / Wallet
          </DropdownElement>
        </Link>
        <DropdownElement
          onClick={() => {
            console.log('logout');
          }}
        >
          <LogoutIcon fill="currentColor" />
          Logout
        </DropdownElement>
      </DropdownContainer>
    </DiscordProfile>
  );

  return <></>;
};
