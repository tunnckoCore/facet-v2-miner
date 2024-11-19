# Facet v2 FCT miner

Simple miner to the Facet v2 FCT token, currently mines on Sepolia, but would work when the v2 launches on Mainnet pretty soon.

You can run it locally by installing the binary, or you can deploy it on Fly.io for perpetual mining with stable and fast internet connection.

![image](https://github.com/user-attachments/assets/805c0a22-8b30-4ec5-8bd2-c7ec2ed90a26)

## Local usage

You have to have Bun or Nodejs installed.
Go to https://bun.sh for more info. Bun is better, smaller, faster, drop-in replacement for the Nodejs runtime.

For Linux/MacOS

```
curl -fsSL https://bun.sh/install | bash
```

For Windows

```
powershell -c "irm bun.sh/install.ps1 | iex"
```

Then run `bun start`. Make sure to have SepoliaETH funds in the wallet of the given private key.

```
git clone https://github.com/tunnckoCore/facet-v2-miner.git
cd facet-v2-miner
PRIVKEY=your_private_key_hex_here bun start
```

## Usage as CLI

Using `npx` or `pnpm dlx` or `bunx`:

```bash
PRIVKEY=myprivkey npx fct-miner
PRIVKEY=myprivkey bunx fct-miner
```

Or you can install it globally:

```bash
npm install -g fct-miner
# and run
PRIVKEY=myprivkey fct-miner
```

If neither of these work for some reason, just clone the repo and run `bun install` and `bun run start`, or `npm install` and `npm start`.

## Deploy on Fly.io

You should always pass your private key as a secret, and then deploy the app:

```bash
fly secrets set PRIVKEY=yourprivatekey
fly launch
```
