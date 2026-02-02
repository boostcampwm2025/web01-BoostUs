import Image from 'next/image';

interface UserProfileProps {
  imageSrc: string;
  nickname: string;
  cohort?: number;
  size?: 'small' | 'medium' | 'big';
}

const BigUserProfile = ({ imageSrc, nickname, cohort }: UserProfileProps) => {
  return (
    <div className="flex flex-row items-center justify-start gap-2">
      <Image
        src={imageSrc}
        alt={`${nickname} 유저의 프로필 이미지`}
        className="h-8 w-8 rounded-full"
        width={32}
        height={32}
      />
      <div className="flex flex-col">
        <span className="text-body-14 text-neutral-text-default">
          {nickname}
        </span>
        {cohort && (
          <span className="text-body-12 text-neutral-text-weak">
            {cohort}기
          </span>
        )}
      </div>
    </div>
  );
};

const MediumUserProfile = ({ imageSrc, nickname }: UserProfileProps) => {
  return (
    <div className="flex flex-row items-center justify-center gap-2">
      <Image
        src={imageSrc}
        alt={`${nickname}'의 프로필 사진`}
        className="object-cover rounded-full"
        width={24}
        height={24}
      />
      <span className="text-string-16 text-neutral-text-default">
        {nickname}
      </span>
    </div>
  );
};

const SmallUserProfile = ({ imageSrc, nickname }: UserProfileProps) => {
  return (
    <div className="flex flex-row items-center justify-center gap-1">
      <div className="relative w-4 h-4">
        <Image
          src={imageSrc}
          alt={`${nickname}'의 프로필 사진`}
          className="object-cover rounded-full"
          fill
        />
      </div>
      <span className="text-body-12 text-neutral-text-weak">{nickname}</span>
    </div>
  );
};

const UserProfile = ({
  imageSrc,
  nickname,
  cohort,
  size = 'big',
}: UserProfileProps) => {
  if (size === 'big') {
    return (
      <BigUserProfile imageSrc={imageSrc} nickname={nickname} cohort={cohort} />
    );
  }

  if (size === 'medium') {
    return <MediumUserProfile imageSrc={imageSrc} nickname={nickname} />;
  }

  if (size === 'small') {
    return <SmallUserProfile imageSrc={imageSrc} nickname={nickname} />;
  }
};

export default UserProfile;
