import { facetSepolia, walletL1FacetActions } from '@0xfacet/sdk/viem';
import { http, createWalletClient, fallback, createPublicClient, formatEther, toHex } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { sepolia } from 'viem/chains';
import { publicActionsL2 } from 'viem/op-stack';

const RPCS = [
  "https://sepolia.drpc.org",
  "https://1rpc.io/sepolia",
  "https://sepolia.facet.org"
]

const PRIVKEY = process.env.PRIVKEY || '';
if (!PRIVKEY) {
  console.log('no private key provided');
  process.exit(1);
}

const account = privateKeyToAccount(`0x${PRIVKEY.replace('0x', '')}`);

const walletClient = createWalletClient({
  account,
  chain: sepolia,
  transport: fallback(RPCS.map((x) => http(x)).concat(http())),
}).extend(walletL1FacetActions);

const publicClient = createPublicClient({
  chain: facetSepolia,
  transport: http(),
}).extend(publicActionsL2());

// ~20951 FCT per transaction, per 0.000002121299924744 Sepolia ETH, at 0.001002463 Gwei sepolia gas price
async function mineFCT() {
  const { l1TransactionHash, facetTransactionHash } =
    await walletClient.sendFacetTransaction({
      to: account.address,
      data: toHex('Hello World'),
      value: 0n,
    });

  console.log('Layer-1 Transaction Hash:', l1TransactionHash);
  console.log('FacetV2 Transaction Hash:', facetTransactionHash);

  Bun.write(`./txs/${l1TransactionHash}-${facetTransactionHash}`, '');
}

// mineFCT();

async function run() {
  while (true) {
    console.log("Mining...")
    await mineFCT();
    console.log('Mined 20951 FCT');
    await Bun.sleep(3000);
  }

  while (true) {
    await Bun.sleep(20000);
    const balance = await publicClient.getBalance({
      address: account.address,
      blockTag: 'pending',
    });
    console.log('Balance:', formatEther(balance));
  }
}

run();
