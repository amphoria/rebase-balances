import {ethers} from "ethers";

const inputEl = document.getElementById("input-el")
const updateBtn = document.getElementById("update-btn")
const saveBtn = document.getElementById("save-btn")
const stakewiseBal = document.getElementById("stakewise-bal")
const stablfiBal = document.getElementById("stablfi-bal")

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

const cashAddress = "0x5d066d022ede10efa2717ed3d79f22f949f8c175"
const cashABI =
[
    // Some details about the contract
    "function name() view returns (string)",
    "function decimals() view returns (uint8)",
    // Function to get balance of address
    "function balanceOf(address) view returns (uint256)"
]
const polProvider = 
    new ethers.JsonRpcProvider("https://polygon-mainnet.infura.io/v3/ca1b1cda8d6940e6af90ec7b1b8cf84d")
const cashContract = new ethers.Contract(cashAddress, cashABI, polProvider)

// Default wallet address
const cookie = getCookie("defaultAddress")
if (cookie != "") {
    const defaultAddress = cookie.split('=')
    inputEl.value = defaultAddress[1]
} 

updateBtn.addEventListener("click", getBalances)
saveBtn.addEventListener("click", saveAddress)

async function getBalances () {
    const shares = await poolV2Contract.getShares(inputEl.value)
    const assets = await poolV2Contract.convertToAssets(shares)
    const ethBalance = ethers.formatEther(assets)
    stakewiseBal.textContent = ethBalance

    const balance = await cashContract.balanceOf(inputEl.value)
    const cashBalance = ethers.formatEther(balance)
    stablfiBal.textContent = cashBalance
}

function saveAddress() {
    if (inputEl.value != "") {
        document.cookie = "defaultAddress=" + inputEl.value
    } else {
        console.log("No address entered")
    }
}

function getCookie(caddr) {
    let address = caddr + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(address) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}


