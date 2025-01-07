import { SuiClient } from "@mysten/sui/client";
import { Ed25519Keypair } from "@mysten/sui/dist/cjs/keypairs/ed25519";

async function checkSuiBalance(
  client: SuiClient, 
  keypair: Ed25519Keypair
) {
  // Get the address of the keypair
  const address = keypair.getPublicKey().toSuiAddress();

  try {
    // Fetch all coin objects owned by the address
    const coins = await client.getCoins({
      owner: address,
      coinType: '0x2::sui::SUI'
    });

    // Calculate total balance
    const totalBalance = coins.data.reduce(
      (sum, coin) => sum + BigInt(coin.balance), 
      BigInt(0)
    );

    // Format the balance (Sui has 9 decimal places)
    const formattedBalance = Number(totalBalance) / 1_000_000_000;

    console.log(`Total Sui Balance: ${formattedBalance} SUI`);
    console.log(`Number of Sui Coins: ${coins.data.length}`);

    // Detailed breakdown of coins
    const coinBreakdown = coins.data.map(coin => ({
      coinObjectId: coin.coinObjectId,
      balance: Number(BigInt(coin.balance)) / 1_000_000_000
    }));

    return {
      totalBalance: formattedBalance,
      coinCount: coins.data.length,
      coins: coinBreakdown
    };
  } catch (error) {
    console.error('Error checking Sui balance:', error);
    throw error;
  }
}

export { checkSuiBalance };