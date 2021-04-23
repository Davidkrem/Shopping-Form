const shoppingForm = document.querySelector('.shopping');
const list = document.querySelector('.list');

// array to hold all items "state"

let items = [];

function handleSubmit(event) {
        event.preventDefault();
        console.log('Submitted! Thank You');
        const name = event.currentTarget.item.value;
        // if its empty, don't submit it
        if (!name) {
                return;
        }
        const item = {
                name,
                id: Date.now(),
                complete: false,
        };
        // Push the items into our state
        items.push(item);
        console.log(`There are now ${items.length} in your state.`);
        // clear the form
        event.target.reset();
        // firing custom event to show items have been updated
        list.dispatchEvent(new CustomEvent('itemsUpdated'));
}

function displayItems() {
        console.log(items);
        const html = items
                .map(
                        (item) => `<li class=" shopping-item">
        <input value = "${item.id}"
         type="checkbox"
       ${item.complete ? 'checked' : ''}
         >
        <span class ="itemName">${item.name}</span>
        <button 
        aria-label = "Remove ${item.name}"
        value = "${item.id}"
        >&times;</button> 
        
        </li>`
                )
                .join('');
        console.log(html);
        list.innerHTML = html;
}

function mirrorToLocalStorage() {
        console.info('Saving items to localstorage');
        localStorage.setItem('items', JSON.stringify(items));
}

function restoreFromLocalStorage() {
        console.log('Restoring from local Storage');
        // pull items from local storage
        const lsItems = JSON.parse(localStorage.getItem('items'));
        if (lsItems.length) {
                // lsItems.forEach((item) => items.push(item));
                items.push(...lsItems);
                list.dispatchEvent(new CustomEvent('itemsUpdated'));
        }
}

function deleteItem(id) {
        console.log('DELETING ITEM', id);
        items = items.filter((item) => item.id !== id);
        console.log(items);
        list.dispatchEvent(new CustomEvent('itemsUpdated'));
}

function markAsComplete(id) {
        console.log('Marking item as complete', id);
        const itemRef = items.find((item) => item.id === id);
        console.log(itemRef);
        itemRef.complete = !itemRef.complete;
        list.dispatchEvent(new CustomEvent('itemsUpdated'));
}

shoppingForm.addEventListener('submit', handleSubmit);
list.addEventListener('itemsUpdated', displayItems);
list.addEventListener('itemsUpdated', mirrorToLocalStorage);

restoreFromLocalStorage();
// Event delegation : We listen for the click on the <ul> but then delegate the clickover to the button if that was clicked
list.addEventListener('click', function (event) {
        const id = parseInt(event.target.value);
        if (event.target.matches('button')) {
                deleteItem(id);
        }
        if (event.target.matches('input[type="checkbox"]')) {
                markAsComplete(id);
        }
});
