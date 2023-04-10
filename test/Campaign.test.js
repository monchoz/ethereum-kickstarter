const assert = require("assert");
const ganache = require("ganache-cli");
const Web3 = require("web3");
const web3 = new Web3(ganache.provider());

const compiledFactory = require("../ethereum/build/CampaignFactory.json");
const compiledCampaign = require("../ethereum/build/Campaign.json");

let accounts;
let factory;
let campaignAddress;
let campaign;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();

  factory = await new web3.eth.Contract(compiledFactory.abi)
    .deploy({ data: compiledFactory.evm.bytecode.object })
    .send({ from: accounts[0], gas: "3000000" });

  await factory.methods.createCampaign("100").send({
    from: accounts[0],
    gas: "3000000",
  });

  [campaignAddress] = await factory.methods.getDeployedCampaigns().call();
  campaign = await new web3.eth.Contract(
    compiledCampaign.abi,
    campaignAddress
  );
});

describe("Campaigns", () => {
  it("deploys a factory and a campaign", () => {
    assert.ok(factory.options.address);
    assert.ok(campaign.options.address);
  });

  it("marks caller as the campaign manager", async () => {
    const manager = await campaign.methods.manager().call();
    assert.equal(accounts[0], manager);
  });

  it("allows people to contribute money and marks them as approvers", async () => {
    await campaign.methods.contribute().send({
      value: "200",
      from: accounts[1],
    });
    const isContributor = await campaign.methods.approvers(accounts[1]).call();
    assert(isContributor);
  });

  it("requires a minimum contribution", async () => {
    try {
      await campaign.methods.contribute().send({
        value: "5",
        from: accounts[1],
      });
      // guarantee that the test fails in case the code above passes for some unknown reason
      assert(false);
    } catch (err) {
      assert(err);
    }
  });

  it("allows a manager to make a payment request", async () => {
    await campaign.methods
      .createRequest("Buy batteries", "100", accounts[1])
      .send({
        from: accounts[0],
        gas: "1000000",
      });
    const request = await campaign.methods.requests(0).call();

    assert.equal("Buy batteries", request.description);
  });

  it("processes request", async () => {
    let originalBalance = await web3.eth.getBalance(accounts[1]);
    originalBalance = web3.utils.fromWei(originalBalance, "ether");
    originalBalance = parseFloat(originalBalance);

    await campaign.methods.contribute().send({
      from: accounts[0],
      value: web3.utils.toWei("10", "ether"),
    });

    await campaign.methods
      .createRequest("A", web3.utils.toWei("5", "ether"), accounts[1])
      .send({
        from: accounts[0],
        gas: "1000000",
      });

    await campaign.methods.approveRequest(0).send({
      from: accounts[0],
      gas: "1000000",
    });

    await campaign.methods.finalizeRequest(0).send({
      from: accounts[0],
      gas: "1000000",
    });

    let finalBalance = await web3.eth.getBalance(accounts[1]);
    finalBalance = web3.utils.fromWei(finalBalance, "ether");
    finalBalance = parseFloat(finalBalance);

    assert(finalBalance > originalBalance);
  });

  it("approve required before finalize", async () => {
    await campaign.methods.createRequest("A", "100", accounts[1]).send({
      from: accounts[0],
      gas: "1000000",
    });

    try {
      await campaign.methods.finalizeRequest(0).send({
        from: accounts[0],
        gas: "1000000",
      });
      assert(false);
    } catch (err) {
      assert(err);
    }
  });

  it("only a contributor can approve a request", async () => {
    await campaign.methods.createRequest("A", "100", accounts[1]).send({
      from: accounts[0],
      gas: "1000000",
    });

    try {
      await campaign.methods.approveRequest(0).send({
        from: accounts[0],
        gas: "1000000",
      });
      assert(false);
    } catch (err) {
      assert(err);
    }
  });

  it("only the manager can finalize a request", async () => {
    await campaign.methods.createRequest("A", "100", accounts[1]).send({
      from: accounts[0],
      gas: "1000000",
    });

    try {
      await campaign.methods.finalizeRequest(0).send({
        from: accounts[1],
        gas: "1000000",
      });
      assert(false);
    } catch (err) {
      assert(err);
    }
  });
});
