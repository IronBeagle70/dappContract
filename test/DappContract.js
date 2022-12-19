const DappContract = artifacts.require("DappContract");

contract("DappContract", () =>{

    before(async () => {
        this.dappContract = await DappContract.deployed();
    });

    it('migrate deployed successfully', async () => {
        const address = this.dappContract.address;

        assert.notEqual(address,null); 
        assert.notEqual(address,undefined); 
        assert.notEqual(address,0x0); 
        assert.notEqual(address,""); 
    });

    it('get Item list', async () => {
        const itemCounter = await this.dappContract.idCounter();
        const item = await this.dappContract.items(itemCounter);

        assert.equal(item.id.toNumber(), itemCounter);
        assert.equal(item.title, "first item");
        assert.equal(item.description, "first description");
        assert.equal(item.checked, false);
        assert.equal(itemCounter, 1);
    });

    it('item created succesfully', async () => {
        const result = await this.dappContract.createItem("some item", "some description");
        const dappEvent = await result.logs[0].args;
        const itemCounter = await this.dappContract.idCounter();

        assert.equal(itemCounter, 2);
        assert.equal(dappEvent.id.toNumber(),2);
        assert.equal(dappEvent.title,"some item");
        assert.equal(dappEvent.description,"some description");
        assert.equal(dappEvent.checked,false);
    });

    it('item toggle checked', async () => {
        const result = await this.dappContract.toggleChecked(1);
        const dappEvent = await result.logs[0].args;
        const item = await this.dappContract.items(1);

        assert.equal(item.checked, true);
        assert.equal(dappEvent.checked, true);
        assert.equal(dappEvent.id, 1);
    });

});