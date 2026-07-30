export type AvatarKind = 'emoji' | 'image';

export interface LocalProfile {
  displayName: string;
  avatarKind: AvatarKind;
  avatarEmoji: string;
  /** Downscaled data URL. Only set when avatarKind is 'image'. */
  avatarImage?: string;
  accent: string;
  createdAt: string;
}

export const PROFILE_STORAGE_KEY = 'happy-healthy-human.profile.v1';
const PROFILE_EVENT = 'happy-healthy-human:profile';

export const avatarEmojiOptions = ['🌱', '🪴', '🌘', '🕊️', '🫧', '🍃', '🪞', '🧭', '🔆', '🌊', '🪐', '🧩'];

export const accentOptions = [
  { value: '#2d6a67', label: 'Pine' },
  { value: '#b87444', label: 'Clay' },
  { value: '#4c6ef5', label: 'Ink' },
  { value: '#7c5cbf', label: 'Iris' },
  { value: '#3f7d58', label: 'Fern' },
  { value: '#b5476b', label: 'Rose' },
];

export const defaultProfile: LocalProfile = {
  displayName: '',
  avatarKind: 'emoji',
  avatarEmoji: '🌱',
  accent: accentOptions[0].value,
  createdAt: '',
};

function isBrowser() {
  return typeof window !== 'undefined';
}

export function readProfile(): LocalProfile {
  if (!isBrowser()) {
    return defaultProfile;
  }

  try {
    const raw = window.localStorage.getItem(PROFILE_STORAGE_KEY);
    if (!raw) {
      return defaultProfile;
    }

    const parsed = JSON.parse(raw) as Partial<LocalProfile>;
    return {
      displayName: typeof parsed.displayName === 'string' ? parsed.displayName : '',
      avatarKind: parsed.avatarKind === 'image' ? 'image' : 'emoji',
      avatarEmoji: typeof parsed.avatarEmoji === 'string' && parsed.avatarEmoji ? parsed.avatarEmoji : defaultProfile.avatarEmoji,
      avatarImage: typeof parsed.avatarImage === 'string' ? parsed.avatarImage : undefined,
      accent: typeof parsed.accent === 'string' && parsed.accent ? parsed.accent : defaultProfile.accent,
      createdAt: typeof parsed.createdAt === 'string' ? parsed.createdAt : '',
    };
  } catch {
    return defaultProfile;
  }
}

export function writeProfile(profile: LocalProfile) {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
  window.dispatchEvent(new Event(PROFILE_EVENT));
}

export function clearProfile() {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.removeItem(PROFILE_STORAGE_KEY);
  window.dispatchEvent(new Event(PROFILE_EVENT));
}

export function subscribeToProfile(onStoreChange: () => void) {
  if (!isBrowser()) {
    return () => {};
  }

  const listener = () => onStoreChange();
  window.addEventListener('storage', listener);
  window.addEventListener(PROFILE_EVENT, listener);

  return () => {
    window.removeEventListener('storage', listener);
    window.removeEventListener(PROFILE_EVENT, listener);
  };
}

/**
 * Reads an image file and returns a square, downscaled JPEG data URL.
 * Avatars live in localStorage, so the source file is never stored as-is.
 */
export function fileToAvatarDataUrl(file: File, size = 160): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('Please choose an image file.'));
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    const image = new window.Image();

    image.onload = () => {
      URL.revokeObjectURL(objectUrl);

      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;

      const context = canvas.getContext('2d');
      if (!context) {
        reject(new Error('Could not process that image.'));
        return;
      }

      // Cover-crop the centre square so portraits and landscapes both work.
      const edge = Math.min(image.width, image.height);
      const offsetX = (image.width - edge) / 2;
      const offsetY = (image.height - edge) / 2;
      context.drawImage(image, offsetX, offsetY, edge, edge, 0, 0, size, size);

      resolve(canvas.toDataURL('image/jpeg', 0.85));
    };

    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('Could not read that image.'));
    };

    image.src = objectUrl;
  });
}
