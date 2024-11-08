/**
 * Génère un hash sécurisé pour le mot de passe
 * Dans un environnement de production, utilisez une bibliothèque comme bcrypt
 */
export async function generateHash(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}