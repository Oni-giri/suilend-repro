import { Transaction } from "@mysten/sui/transactions";
import { SuiClient } from "@mysten/sui/client";
import { execSync } from "child_process";
import path from "path";

import { Ed25519Keypair } from "@mysten/sui/dist/cjs/keypairs/ed25519";
import ObjectDict from './objectDict';

async function publish(
  client: SuiClient,
  keypair: Ed25519Keypair
) {
  // Initialize ObjectDict
  const objectDict = new ObjectDict();

  const sender = keypair.getPublicKey().toSuiAddress();

  let tx = new Transaction();
  tx.setSender(sender);
  // tx.setGasBudget(100000000);

  const [packageUpgradeCap] = tx.publish(
    JSON.parse(
      execSync(
        `sui move build --dump-bytecode-as-base64 --path ../`,
        {
          encoding: "utf-8",
        }
      )
    )
  );

  tx.transferObjects([packageUpgradeCap], sender)

  // Build and sign the transaction
  const result = await client.signAndExecuteTransaction({
    signer: keypair,
    transaction: tx,
    requestType: "WaitForEffectsCert",
    options: {
      showEffects: true,
      showObjectChanges: true,
      showEvents: true
    }
  });


  const publishedPackage = result.objectChanges?.find(change => change.type === 'published');
  if (publishedPackage) {
    console.log(`Published package ${packageName} at ${publishedPackage.packageId}`);
  }

  if (result.objectChanges) {
    const createdObjects = result.objectChanges
      .filter(change => change.type === 'created')
      .filter(obj => {
        // Parse the object type
        const parts = obj.objectType.split('::');
        return parts[parts.length - 1];
      });

    createdObjects.forEach(obj => {
      const parts = obj.objectType.split('::');
      const objectName = parts[parts.length - 1];
      const packageModuleName = parts[parts.length - 2];
      const packageId = parts[0];

      // Add entry 
      objectDict.addEntry(
        process.env.NETWORK as string, // network
        packageName,     // package name 
        packageId,       // package ID
        objectName,      // type name
        obj.objectId     // object ID
      );
      
      console.log(`Saved ${objectName} to ObjectDict:`, obj);
    });
  }

  return result;
}

export { publish };