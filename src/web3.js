import Web3 from "web3";

// window is the global object in the browser
// create a new instance of web3 using the browser's provider injected by metamask

window.ethereum.request({ method: "eth_requestAccounts" });

const web3 = new Web3(window.ethereum);

export default web3;
