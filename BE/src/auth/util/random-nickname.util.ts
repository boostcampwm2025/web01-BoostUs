import { NICKNAME_ADJECTIVES, NICKNAME_NOUNS } from '../type/nickname.type';

export function generateRandomNickname(): string {
  const adj = NICKNAME_ADJECTIVES[Math.floor(Math.random() * NICKNAME_ADJECTIVES.length)];
  const noun = NICKNAME_NOUNS[Math.floor(Math.random() * NICKNAME_NOUNS.length)];
  const suffix = Math.floor(1000 + Math.random() * 9000);

  return `${adj}${noun}${suffix}`;
}
