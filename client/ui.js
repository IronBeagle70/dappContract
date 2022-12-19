document.addEventListener("DOMContentLoaded", () => {
    App.init();
});

const dappForm = document.querySelector('#dappForm');

dappForm.addEventListener('submit', function(e){
    e.preventDefault();
    console.log(
        dappForm['title'].value,
        dappForm['description'].value
    );
    App.createItem(dappForm['title'].value, dappForm['description'].value);
} );