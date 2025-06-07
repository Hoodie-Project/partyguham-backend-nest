import { v4 as uuid } from 'uuid';

// user-image-key.util.ts
export function userImageKey(userId: string, originalName: string): string {
  const date = new Date();
  return `users/${userId}/profile/${uuid()}-${originalName}`;
}

// party-image-key.util.ts
export function partyImageKey(partyId: string, originalName: string): string {
  const date = new Date();
  return `parties/${partyId}/${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}/${uuid()}-${originalName}`;
}

// banner-image-key.util.ts
export function bannerImageKey(originalName: string): string {
  const date = new Date();
  return `banners/${uuid()}-${originalName}`;
}
