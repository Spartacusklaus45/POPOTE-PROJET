import crypto from 'crypto';

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY!;
const IV_LENGTH = 16;
const SALT_LENGTH = 64;
const KEY_LENGTH = 32;
const ITERATIONS = 100000;
const DIGEST = 'sha512';

export const encrypt = (text: string): string => {
  const salt = crypto.randomBytes(SALT_LENGTH);
  const key = crypto.pbkdf2Sync(ENCRYPTION_KEY, salt, ITERATIONS, KEY_LENGTH, DIGEST);
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  
  const encrypted = Buffer.concat([
    cipher.update(text, 'utf8'),
    cipher.final()
  ]);

  const tag = cipher.getAuthTag();

  return Buffer.concat([salt, iv, tag, encrypted]).toString('base64');
};

export const decrypt = (encryptedText: string): string => {
  const buffer = Buffer.from(encryptedText, 'base64');
  
  const salt = buffer.slice(0, SALT_LENGTH);
  const iv = buffer.slice(SALT_LENGTH, SALT_LENGTH + IV_LENGTH);
  const tag = buffer.slice(SALT_LENGTH + IV_LENGTH, SALT_LENGTH + IV_LENGTH + 16);
  const encrypted = buffer.slice(SALT_LENGTH + IV_LENGTH + 16);
  
  const key = crypto.pbkdf2Sync(ENCRYPTION_KEY, salt, ITERATIONS, KEY_LENGTH, DIGEST);
  const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
  
  decipher.setAuthTag(tag);
  
  return decipher.update(encrypted) + decipher.final('utf8');
};

// Hachage sécurisé des mots de passe
export const hashPassword = async (password: string): Promise<string> => {
  const salt = crypto.randomBytes(16);
  return new Promise((resolve, reject) => {
    crypto.pbkdf2(password, salt, ITERATIONS, 64, DIGEST, (err, derivedKey) => {
      if (err) reject(err);
      resolve(salt.toString('base64') + ':' + derivedKey.toString('base64'));
    });
  });
};

// Vérification des mots de passe
export const verifyPassword = async (password: string, hash: string): Promise<boolean> => {
  const [salt, key] = hash.split(':');
  return new Promise((resolve, reject) => {
    crypto.pbkdf2(password, Buffer.from(salt, 'base64'), ITERATIONS, 64, DIGEST, (err, derivedKey) => {
      if (err) reject(err);
      resolve(derivedKey.toString('base64') === key);
    });
  });
};