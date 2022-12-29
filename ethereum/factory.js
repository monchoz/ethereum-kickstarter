import web3 from "./web3";
import CampaignFactory from "./build/CampaignFactory.json";

const instance = new web3.eth.Contract(
  CampaignFactory.abi,
  "0x80d255bEF3Db308abBA40AB64f44fc0709D45EA3"
);

export default instance;
