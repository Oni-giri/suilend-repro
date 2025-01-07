import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';
import { config } from 'dotenv';

config(); // Load environment variables from .env file

function useAccount(privateKeyBase64: string): Ed25519Keypair {
    const privateKey = Buffer.from(privateKeyBase64, 'base64');
    const keypair = Ed25519Keypair.fromSecretKey(privateKey);

    console.log(`Generated account address: ${keypair.getPublicKey().toSuiAddress()}`);
    return keypair;
}

export { useAccount };
