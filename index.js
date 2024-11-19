import { walletL1FacetActions } from '@0xfacet/sdk/viem';
import { http, createWalletClient, fallback, formatEther, toHex } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { sepolia } from 'viem/chains';

const RPCS = [
  "https://sepolia.drpc.org",
  "https://1rpc.io/sepolia",
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

// ~20951 FCT per transaction, per 0.000002121299924744 Sepolia ETH, at 0.001002463 Gwei sepolia gas price
async function mineFCT() {
  const { l1TransactionHash, facetTransactionHash, fctMintAmount, fctMintRate } =
    await walletClient.sendFacetTransaction({
      to: account.address,
      data: toHex('Ethereum Recyphered. Foo bar baz, the bigger the more FCT is minted. Human society shall be enciphered.'),
      value: 0n,
    });

  console.log('Minted amount:', formatEther(fctMintAmount));
  console.log('Layer-1 Transaction Hash:', l1TransactionHash);
  console.log('FacetV2 Transaction Hash:', facetTransactionHash);

  Bun.write(`./txs/${l1TransactionHash}-${facetTransactionHash}`, '');
}

// mineFCT();

async function run() {
  while (true) {
    console.log("Mining...")
    await mineFCT();
    await Bun.sleep(5000);
  }
}

run();
