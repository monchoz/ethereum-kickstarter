import web3 from "./web3";
import CampaignFactory from "./build/CampaignFactory.json";

const instance = new web3.eth.Contract(
  CampaignFactory.abi,
  "0xD6258e9B25555F9CF222334EC97a444b642D2b69"
);

export default instance;
