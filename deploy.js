const { ethers } = require("ethers");
const fs = require("fs-extra");
require("dotenv").config();

async function main() {
  const provider = new ethers.providers.JsonRpcProvider(process.env.RPC);
  const wallet = new ethers.Wallet(process.env.METAMASK_PRIVATE_KEY, provider);

  const abi = fs.readFileSync("./SimpleStorage_sol_SimpleStorage.abi", "utf-8");
  const binary = fs.readFileSync(
    "./SimpleStorage_sol_SimpleStorage.bin",
    "utf-8"
  );
  const contractFactory = new ethers.ContractFactory(abi, binary, wallet);
  const contract = await contractFactory.deploy();
  await contract.deployTransaction.wait(1);

  let currentFavoriteNumber = await contract.retrieve();
  console.log(currentFavoriteNumber.toString());

  let transactionResponse = await contract.store(7);
  let transactionReceipt = await transactionResponse.wait();
  let currentFavoriteNumber2 = await contract.retrieve();
  console.log(currentFavoriteNumber2.toString());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
