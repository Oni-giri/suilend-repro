# suilend-repro
.env file:

PRIVATE_KEY=<Your key>
NETWORK=mainnet

Steps to reproduce:

`sui move build` -> should compile (ignore the warnings)

then go to the publish folder:

`npm i`
Add a .env file with the network and a (funded) private key

then: `npx tsx publish/publish_suilend_test.ts`

It should revert.

If you remove the suilend import in the .move file, it should work. 
