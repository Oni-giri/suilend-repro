import { decodeSuiPrivateKey } from '@mysten/sui/cryptography';
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';
import { config } from 'dotenv';

config(); // Load environment variables from .env file

function useAccount(privateKeyBase64: string): Ed25519Keypair {
    const parsedKeypair = decodeSuiPrivateKey(privateKeyBase64);
    const keypair = Ed25519Keypair.fromSecretKey(parsedKeypair.secretKey);

    console.log(`Generated account address: ${keypair.getPublicKey().toSuiAddress()}`);
    return keypair;
}

export { useAccount };
