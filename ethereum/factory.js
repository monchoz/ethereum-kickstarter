import web3 from "./web3";
import CampaignFactory from "./build/CampaignFactory.json";

const instance = new web3.eth.Contract(
  JSON.parse(CampaignFactory.interface),
  "0x78955FcC7e0Bf06622AB3fC5E7d119447693Dc29"
);

export default instance;
