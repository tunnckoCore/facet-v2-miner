# Facet v2 FCT miner

Simple miner to the Facet v2 FCT token, currently mines on Sepolia, but would work when the v2 launches on Mainnet pretty soon.

You can run it locally by installing the binary, or you can deploy it on Fly.io for perpetual mining with stable and fast internet connection.

![image](https://github.com/user-attachments/assets/805c0a22-8b30-4ec5-8bd2-c7ec2ed90a26)

## Usage

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

## Deploy on Fly.io

You should pass your private key on `privkey` field on the `package.json`, or as environment variable on Fly.

```bash
fly secrets set PRIVKEY=yourprivatekey
fly launch
```
