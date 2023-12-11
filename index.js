import {ethers} from "ethers";

const inputEl = document.getElementById("input-el")
const updateBtn = document.getElementById("update-btn")
const stakewiseBal = document.getElementById("stakewise-bal")

const poolV2Address = "0xac0f906e433d58fa868f936e8a43230473652885"
const poolV2ABI = 
[
    // Some details about the contract
    "function vaultId() view returns (bytes32)",
    "function version() view returns (uint8)",
    // Functions to get vault balance for a wallet
    "function getShares(address) view returns (uint256)",
    "function convertToAssets(uint256) view returns (uint256)"
]
const ethProvider = 
    new ethers.JsonRpcProvider("https://mainnet.infura.io/v3/ca1b1cda8d6940e6af90ec7b1b8cf84d")
const poolV2Contract = new ethers.Contract(poolV2Address, poolV2ABI, ethProvider)

// Default address
inputEl.value = "0x2365887bBdb7fF611F54b380573a5055170fAE7D"

updateBtn.addEventListener("click", getBalance)

async function getBalance () {
    const shares = await poolV2Contract.getShares(inputEl.value)
    const assets = await poolV2Contract.convertToAssets(shares)
    const ethBalance = ethers.formatEther(assets)
    stakewiseBal.textContent = ethBalance
}

