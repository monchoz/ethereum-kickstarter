import web3 from "./web3";
import CampaignFactory from "./build/CampaignFactory.json";

const instance = new web3.eth.Contract(
  JSON.parse(CampaignFactory.interface),
  "0x3FB846Dd8D5E38a1bcF0c3226fd04B0E8D5a1535"
);

export default instance;
