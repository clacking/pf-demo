export const genHash = async (text: string): Promise<string> => {
    const encoded = new TextEncoder().encode(text);
    const hashed = await window.crypto.subtle.digest('SHA-256', encoded);
    const byte = new Uint8Array(hashed);
    const hex = Array.from(byte).map(val => {
        return val.toString(16).padStart(2, '0');
    });
    return hex.join('');
}

