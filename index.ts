import { facetSepolia, walletL1FacetActions } from '@0xfacet/sdk/viem';
import { http, createWalletClient, fallback, createPublicClient, formatEther } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { sepolia } from 'viem/chains';
import pkgJson from './package.json';
import { publicActionsL2 } from 'viem/op-stack';

if (!pkgJson.privkey) {
  console.log('no private key provided');
  process.exit(1);
}

const privkey = pkgJson.privkey.replace('0x', '');
const account = privateKeyToAccount(`0x${privkey}`);

const walletClient = createWalletClient({
  account,
  chain: sepolia,
  transport: fallback(pkgJson.rpcs.map((x) => http(x)).concat(http())),
}).extend(walletL1FacetActions);

const publicClient = createPublicClient({
  chain: facetSepolia,
  transport: http(),
}).extend(publicActionsL2());

// 20951 FCT per transaction, per 0.000002121299924744 Sepolia ETH, at 0.001002463 Gwei sepolia gas price
async function mineFCT() {
  // const balanceBefore = await publicClient.getBalance({
  //   address: account.address,
  //   blockTag: 'pending',
  // });

  // console.log('Balance Before:', formatEther(balanceBefore));

  const { l1TransactionHash, facetTransactionHash } =
    await walletClient.sendFacetTransaction({
      to: account.address,
      data: `0x${'2'.repeat(261_800)}`,
      value: 0n,
    });

  const balanceAfter = await publicClient.getBalance({
    address: account.address,
    blockTag: 'pending',
  });

  console.log('Balance:', formatEther(balanceAfter));
  console.log('Layer-1 Transaction Hash:', l1TransactionHash);
  console.log('FacetV2 Transaction Hash:', facetTransactionHash);

  Bun.write(`./txs/${l1TransactionHash}-${facetTransactionHash}`, '');
}

mineFCT();

async function run() {
  while (true) {
    console.log("Mining...")
    await mineFCT();
    console.log('Mined 20951 FCT');
    await Bun.sleep(3000);
  }
}

// run();
