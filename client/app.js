App = {
    contracts: {},
    init: async function(){
        // console.log('loaded');
        await App.loadEthereum();
        await App.loadAccount();
        await App.loadContracts();
        await App.render(); 
        await App.renderItems();
    },
    loadEthereum: async function(){
        if(window.ethereum){
            App.web3Provider = window.ethereum;
            await window.ethereum.request({method: 'eth_requestAccounts'});
        } else if(window.web3) {
            web3 = new Web3(window.web3.currentProvider);
        } else {
            console.log('No ethereum browser is installed. Try it installing Meatamask');
        }
    },
    loadAccount: async function(){
        const accounts = await window.ethereum.request({method: 'eth_requestAccounts'});
        App.account = accounts[0]; 
    },
    loadContracts: async function(){
        const res = await fetch("DappContract.json");
        const dappContractJSON = await res.json();

        App.contracts.DappContract = TruffleContract(dappContractJSON);

        App.contracts.DappContract.setProvider(App.web3Provider);

        App.dappContract = await App.contracts.DappContract.deployed();

    },
    render: async function(){
        document.getElementById('account').innerText = App.account;
    },
    renderItems: async function(){
        const itemCounter = await App.dappContract.idCounter();
        const itemCounterNumber = itemCounter.toNumber();
        // console.log(itemCounterNumber);

        let html = '';

        for(let i=1; i <= itemCounterNumber; i++){
            const item = await App.dappContract.items(i);
            // console.log(item);
            const itemId = item[0];
            const itemTitle = item[1];
            const itemDescription = item[2];
            const itemDone = item[3];
            const itemCreated = item[4];
            let itemElement = `<div class="card bg-dark rounded-0 mb-2">
                <div class="card-header d-flex justify-content-between align-items-center">
                    <span>${itemTitle}</span>
                    <span class= ${itemDone?'text-success':'text-warning'} >${itemDone?'Verified':'Not Verified'}</span>
                    <div class="form-check form-switch">
                        <input class="form-check-input" data-id="${itemId}" type="checkbox" onchange="App.toggleDone(this)" ${
                            itemDone === true && "checked"
                        }>
                    </div>
                </div>
                <div class="card-body">
                    <span>${itemDescription}</span>
                    
                    <p class="text-muted">Item was created ${new Date(
                        itemCreated * 1000
                    ).toLocaleString()}</p>
                </div>
            </div>`;
            html += itemElement;
        };

        document.querySelector('#itemsList').innerHTML = html;


    },
    createItem: async function(title, description){
        const result = await App.dappContract.createItem(title,description,{
            from: App.account
        });
        console.log(result.logs[0].args);
    },
    toggleDone: async function(element){
        const itemId = element.dataset.id;
        await App.dappContract.toggleChecked(itemId,{
            from: App.account
        });

        window.location.reload();
    }
}
