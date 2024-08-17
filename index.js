import { StakeWiseSDK, Network } from '@stakewise/v3-sdk'
import { ethers } from "ethers";

// Ethers providers
const ethProvider = 
    new ethers.JsonRpcProvider("https://eth-mainnet.g.alchemy.com/v2/JTXUw4DQJ0PEVskCBSsadhBnk3rkd4vN")
const realProvider = new ethers.JsonRpcProvider("https://tangible-real.gateway.tenderly.co/29G4PChJRVFiAJiyQg1FnC")

const sdk = new StakeWiseSDK({ 
    network: Network.Mainnet, 
    provider: ethProvider
})

const inputEl = document.getElementById("input-el")
const updateBtn = document.getElementById("update-btn")
const saveBtn = document.getElementById("save-btn")
const stakewiseBal = document.getElementById("stakewise-bal")
const genesisOSETHBal = document.getElementById("genesis-oseth-bal")
const chorusOneBal = document.getElementById("chorus-one-bal")
const chorusOneOSETHBal = document.getElementById("chorus-one-oseth-bal")
const walletOSETHBal = document.getElementById("wallet-oseth-bal")
const eigenlayerOETHBal = document.getElementById("eigenlayer-oeth-bal")
const altlayerAltBal = document.getElementById("altlayer-alt-bal")
const realDaiBal = document.getElementById("real-dai-bal")
const ustbBal = document.getElementById("real-ustb-bal")
const arcusdBal = document.getElementById("arcana-arcusd-bal")
const ukreBal = document.getElementById("real-ukre-bal")
const realEthBal = document.getElementById("real-eth-bal")
const realRWABal = document.getElementById("real-rwa-bal")

// Contract addresses and ABIs
const genesisAddress = "0xac0f906e433d58fa868f936e8a43230473652885"
const chorusOneAddress = "0xe6d8d8aC54461b1C5eD15740EEe322043F696C08"
const stakewiseABI = 
[
    // Some details about the contract
    "function vaultId() view returns (bytes32)",
    "function version() view returns (uint8)",
    // Functions to get vault balance for a wallet
    "function getShares(address) view returns (uint256)",
    "function convertToAssets(uint256) view returns (uint256)",
    // Function to get minted osETH shares for a user
    "function osTokenPositions(address) view returns (uint256)" 
]

// osETH Contract
const osETHAddress = "0xf1C9acDc66974dFB6dEcB12aA385b9cD01190E38"
const osETHABI = 
[
    // Some details about the contract
    "function name() view returns (string)",
    "function decimals() view returns (uint8)",
    // Function to get balance of address
    "function balanceOf(address) view returns (uint256)"
]

// EigenLayer OETH pool
const eigenlayerPoolAddress = "0xa4C637e0F704745D182e4D38cAb7E7485321d059"
const eigenlayerABI = 
[
    // Functions to get pool balance for a wallet
    "function shares(address) view returns (uint256)",
    "function sharesToUnderlyingView(uint256) view returns (uint256)"  
]

// reALT Contract
const reALTAddress = "0xF96798F49936EfB1a56F99Ceae924b6B8359afFb"
const reALTABI = 
[
  // Some details about the contract
  "function name() view returns (string)",
  "function decimals() view returns (uint8)",
  // Function to get balance of address
  "function balanceOf(address) view returns (uint256)",
  // Function to get balance of ALT tokens
  "function convertToAssets(uint256) view returns (uint256)"
]

// re.al ETH rewards contract
const realEthAddress = "0xf4e03D77700D42e13Cd98314C518f988Fd6e287a"
const realEthABI =
[
    "function claimable(address) view returns (uint256, uint256[], uint256[], uint256, uint256)"
]

// re.al RWA rewards contract
const realRWAAddress = "0x9D146A1C099adEE2444aFD629c04B4cbb5eE1539"
const realRWAABI =
[
    "function claimable(address) view returns (uint256)"
]

// Ethers contract objects
const genesisContract = new ethers.Contract(genesisAddress, stakewiseABI, ethProvider)
const chorusOneContract = new ethers.Contract(chorusOneAddress, stakewiseABI, ethProvider)
const osethContract = new ethers.Contract(osETHAddress, osETHABI, ethProvider)
const eigenlayerPoolContract = new ethers.Contract(eigenlayerPoolAddress, 
                                                    eigenlayerABI, ethProvider)
const reALTContract = new ethers.Contract(reALTAddress, reALTABI, ethProvider)
const realEthContract = new ethers.Contract(realEthAddress, realEthABI, realProvider)
const realRWAContract = new ethers.Contract(realRWAAddress, realRWAABI, realProvider)

// Default wallet address
const cookie = getCookie("defaultAddress")
if (cookie != "") {
    const defaultAddress = cookie.split('=')
    inputEl.value = defaultAddress[1]
} 

updateBtn.addEventListener("click", getBalances)
saveBtn.addEventListener("click", saveAddress)

async function getOsethPosition(userAddr, vaultAddr) {
    let output

    output = await sdk.osToken.getBaseData()
    const thresholdPercent = output.thresholdPercent

    output = await sdk.vault.getStakeBalance({
        userAddress: userAddr,
        vaultAddress: vaultAddr
    })
    const stakeBalance = output.assets

    output = await sdk.osToken.getPosition({
        userAddress: userAddr,
        vaultAddress: vaultAddr,
        stakedAssets: stakeBalance,
        thresholdPercent: thresholdPercent
   })
   return output
}

async function getBalances () {
    let shares
    let assets
    let balanceWei = 0
    let balanceEth = 0
    let output
    let daiWei = 0
    let ustbWei = 0
    let arcusdWei = 0
    let ukreWei = 0
    let daiEth = 0
    let ustbEth = 0
    let arcusdEth = 0
    let ukreEth = 0
    
    try {
        output = await sdk.vault.getStakeBalance({
            userAddress: inputEl.value,
            vaultAddress: genesisAddress
        })
        balanceEth = ethers.formatEther(output.assets)
        stakewiseBal.textContent = balanceEth
    } catch (error) {
        console.log(error)
    }

    shares = await genesisContract.osTokenPositions(inputEl.value)
    balanceEth = ethers.formatEther(shares)
    genesisOSETHBal.textContent = balanceEth

    try {
        output = await sdk.vault.getStakeBalance({
            userAddress: inputEl.value,
            vaultAddress: chorusOneAddress
        })
        balanceEth = ethers.formatEther(output.assets)
        chorusOneBal.textContent = balanceEth
    } catch (error) {
        console.log(error)
    }

    shares = await chorusOneContract.osTokenPositions(inputEl.value)
    balanceEth = ethers.formatEther(shares)
    chorusOneOSETHBal.textContent = balanceEth

    balanceWei = await osethContract.balanceOf(inputEl.value)
    balanceEth = ethers.formatEther(balanceWei)
    walletOSETHBal.textContent = balanceEth

    shares = await eigenlayerPoolContract.shares(inputEl.value)
    assets = await eigenlayerPoolContract.sharesToUnderlyingView(shares)
    balanceEth = ethers.formatEther(assets)
    eigenlayerOETHBal.textContent = balanceEth

    shares = await reALTContract.balanceOf(inputEl.value)
    assets = await reALTContract.convertToAssets(shares)
    balanceEth = ethers.formatEther(assets)
    altlayerAltBal.textContent = balanceEth

    try {
        const res = await fetch(`https://explorer.re.al/api/v2/addresses/${inputEl.value}/token-balances`)
        if (!res.ok) {
            throw new Error(`${res.status} ${res.statusText}`)
        }
        const results = await res.json()

        // console.log(results)

        results.forEach(item => {
            if (item.token.symbol === "DAI") {
                daiWei = item.value
            } else if (item.token.symbol === "USTB") {
                ustbWei = item.value
            } else if (item.token.symbol === "arcUSD") {
                arcusdWei = item.value
            } else if (item.token.symbol === "UKRE") {
                ukreWei = item.value
            }
        })
        daiWei > 0 ? daiEth = ethers.formatEther(daiWei) : 0
        realDaiBal.textContent = daiEth
        ustbWei > 0 ? ustbEth = ethers.formatEther(ustbWei) : 0
        ustbBal.textContent = ustbEth
        arcusdWei > 0 ? arcusdEth = ethers.formatEther(arcusdWei) : 0
        arcusdBal.textContent = arcusdEth
        ukreWei > 0 ? ukreEth = ethers.formatEther(ukreWei) : 0
        ukreBal.textContent = ukreEth
    } catch (error) {
        console.log(error)
    }

    let balWei
    let balEth
    const result = await realEthContract.claimable(inputEl.value)
    balWei = result[0]
    balEth = ethers.formatEther(balWei)
    realEthBal.textContent = balEth
    balWei = await realRWAContract.claimable(inputEl.value)
    balEth = ethers.formatEther(balWei)
    realRWABal.textContent = balEth
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


