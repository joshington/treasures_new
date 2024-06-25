
import { ethers } from "ethers";
import { newKitFromWeb3 } from "@celo/contractkit";

import Web3 from "web3";
import contractAbi from "../../contracts/DocStorage.abi.json";
import { contractAddress, cUSDContractAddress } from "./constants";


let kit;

const getContractInstance = async () => {
    if (window.celo) {
        try {
            await window.celo.enable();
            const web3 = new Web3(window.celo);
            kit = newKitFromWeb3(web3);
            const contract = new kit.web3.eth.Contract(contractAbi, contractAddress);
            return contract;
        } catch (error) {
            console.error("Failed to get contract instance:", error);
        }
    } else {
        console.log("Please install the celoExtensionWallet.");
    }
}


export const uploadDocument = async (ipfsHash) => {
    const contract = await getContractInstance();
    if (contract) {
        try {
            const accounts = await kit.web3.eth.getAccounts();
            const receipt = await contract.methods
                .uploadDocument(ipfsHash)
                .send({ from: accounts[0] });
            console.log("Document uploaded:", receipt);
        } catch (error) {
            console.error("Failed to uplaod document:", error);
        }
    } else {

    }
}