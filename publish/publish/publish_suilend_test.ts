import { getFullnodeUrl, SuiClient } from '@mysten/sui/client';
import { publish } from '../utils/publish';
import { useAccount } from '../utils/useAccount';
import { checkSuiBalance } from '../utils/checkSuiBalance';

async function main() {
    console.log("start")

    const client = new SuiClient({ url: getFullnodeUrl(process.env.NETWORK as any) });
    const keypair = useAccount(process.env.PRIVATE_KEY as string);
    await checkSuiBalance(client, keypair);
    console.log("sender", keypair.getPublicKey().toSuiAddress());
    await publish(client, keypair);
}

main().catch(console.error);