//Array to store the data
// If there no data (null) in local storage, set the portfolioData to an empty array (Nullish Coalescing)
let portfolioData = JSON.parse(localStorage.getItem('portfolioData')) ?? [];

//#region Event to add the data from BuyModal to the porfolioData array and update the table when button is clicked (btnConfirmBuy)
document.querySelector('.btnConfirmBuy').addEventListener('click', function() {
    // Retrieve the data from the form/Modal
    let productName = document.getElementById('productName').value;
    let symbol = document.getElementById('symbol').value;
    let exchange = document.getElementById('exchange').value;
    let quantity = document.getElementById('quantity').value;
    let price = document.getElementById('price').value;
    let currency = document.getElementById('currency').value;

    // Create an object to store the data
    let portfolioItem = {
        productName: productName,
        symbol: symbol,
        exchange: exchange,
        quantity: parseFloat(quantity),
        price: parseFloat(price),
        currency: currency,
        totalValue: parseFloat(quantity) * parseFloat(price),
        //Placeholder values for the remaining fields
        BEP: 0,
        PL_Euros: 0,
        PL_Percentage: 0,
        Total_PL: 0
    };

    // Add the object to the array
    portfolioData.push(portfolioItem);

    // Save the array to local storage
    localStorage.setItem('portfolioData', JSON.stringify(portfolioData));
    
    // Update the table
    updatePortfolioTable();

    // Reset the form
    document.getElementById('buyForm').reset();

    // Closes the modal
    let modal = bootstrap.Modal.getInstance(document.getElementById('buyModal'));
    modal.hide();
});
//#endregion

//#region Function to update the table with the portfolioData Array and load the data from local storage when the page loads
function updatePortfolioTable() {
    let totalBalance = 0;

    // Get the table body element
    let tBody = document.getElementById('dashboardTableBody');

    // Clear existing rows before adding portfolioData again
    tBody.innerHTML = '';

    // Loop through portfolioData and create rows for each item
    portfolioData.forEach(function(item) {
        totalBalance += item.totalValue; // Add the total value of each item to the total balance
        
        // Create a new row
        let row = document.createElement('tr');

        // Create and append each cell in the row
        row.innerHTML = `
            <td>${item.productName}</td>
            <td>${item.symbol}</td>
            <td>${item.exchange}</td>
            <td>${item.quantity}</td>
            <td>${item.price}</td>
            <td>${item.currency}</td>
            <td>${item.totalValue.toFixed(2)}</td>
            <td>${item.BEP}</td>
            <td>${item.PL_Euros.toFixed(2)}</td>
            <td>${item.PL_Percentage.toFixed(2)}%</td>
            <td>${item.Total_PL.toFixed(2)}</td>
        `;

        // Append the row to the table body
        tBody.appendChild(row);
    });
    document.getElementById('portfolioBalance').textContent = totalBalance.toFixed(2);
}
// Call the function to update the table when the page loads from local storage, can only be called after the function is defined
updatePortfolioTable();
//#endregion

//#region Function to load Options in the Sell and Update Modals when opened
// Function to update the options in the modal (Sell or Update)
function updateModalOptions(modalType) {
    // Get the select element based on the modal type (sell or update)
    let selectElement;
    if (modalType === 'sell') {
        selectElement = document.getElementById('sellPortfolioItem');
    } else if (modalType === 'update') {
        selectElement = document.getElementById('updatePortfolioItem');
    }

    // Clear existing options
    selectElement.innerHTML = '<option value="" disabled selected>Select a product</option>';

    // Add options for each item in the portfolioData array
    portfolioData.forEach(item => {
        let option = document.createElement('option');
        option.value = item.symbol;  // Uses the symbol as the value
        option.textContent = `${item.productName} (${item.symbol}) - Qty: ${item.quantity}`; // Uses the product name and symbol as the text/option, added quantity in case of multiple items with the same symbol
        selectElement.appendChild(option);
    });
}
// Call the function to update the options in the Sell modal when the modal is shown
document.getElementById('sellModal').addEventListener('show.bs.modal', function() {
    updateModalOptions('sell');
});

// Call the function to update the options in the Update Modal when the modal is shown
document.getElementById('updateModal').addEventListener('show.bs.modal', function() {
    updateModalOptions('update');
});
//#endregion

//#region Event that sells the product when button is clicked (btnConfirmSell)
document.querySelector('.btnConfirmSell').addEventListener('click', function() {
    // Get the selected symbol and quantity from the modal
    let symbol = document.getElementById('sellPortfolioItem').value;
    let quantityToSell = parseFloat(document.getElementById('sellQuantity').value);

    // Find the portfolio item that matches the selected symbol
    let portfolioItem = portfolioData.find(item => item.symbol === symbol);

    // Check if the portfolio item exists, the quantity to sell is valid (above 0 and less than the available quantity)
    if (portfolioItem && quantityToSell > 0 && portfolioItem.quantity >= quantityToSell) {
        // Subtract the sold quantity from the portfolio item
        portfolioItem.quantity -= quantityToSell;

        // If quantity becomes zero, remove the item from portfolioData
        if (portfolioItem.quantity == 0) {
            portfolioData = portfolioData.filter(item => item.symbol !== symbol);
        }

        // Update localStorage with the updated portfolioData
        localStorage.setItem('portfolioData', JSON.stringify(portfolioData));

        // Update the table with the new portfolio data
        updatePortfolioTable();

        // Reset the form
        document.getElementById('sellForm').reset();

        // Close the modal
        let modal = bootstrap.Modal.getInstance(document.getElementById('sellModal'));
        modal.hide();
    } else {
        // If the input is invalid, alert the user
        alert('Invalid quantity or insufficient quantity available.');
    }
});
//#endregion

//#region Event to update the portfolio item when the button is clicked (btnConfirmUpdate) and fill the form with the data of the selected item in the update modal
// Event that resets inputs when opening the modal because it was keeping the previous values
document.getElementById('updateModal').addEventListener('show.bs.modal', function() {
    document.getElementById('updateForm').reset();
});

//Event to fill the form with the data after selecting the item in the dropdown
document.getElementById('updatePortfolioItem').addEventListener('change', function() {
    let selectElement = document.getElementById('updatePortfolioItem');
    let selectedSymbol = selectElement.value; //Get the selected item from the dropdown

    // Find the selected item in the portfolio data
    let selectedItem = portfolioData.find(item => item.symbol === selectedSymbol);

    if (selectedItem) {
        document.getElementById('updateQuantity').value = selectedItem.quantity;
        document.getElementById('updatePrice').value = selectedItem.price;
        document.getElementById('updateCurrency').value = selectedItem.currency;
    }
});

//Event to update the portfolio item when the button is clicked (btnConfirmUpdate)
document.querySelector('.btnConfirmUpdate').addEventListener('click', function() {
    // Get the selected symbol, quantity, price, and currency from the modal
    let symbol = document.getElementById('updatePortfolioItem').value;
    let quantity = parseFloat(document.getElementById('updateQuantity').value);
    let price = parseFloat(document.getElementById('updatePrice').value);
    let currency = document.getElementById('updateCurrency').value;

    // Find the portfolio item that matches the selected symbol
    let portfolioItem = portfolioData.find(item => item.symbol === symbol);

    // Check if the portfolio item exists and the inputs are valid
    if (portfolioItem && quantity > 0 && price > 0 && currency) {
        // Update the portfolio item
        portfolioItem.quantity = quantity;
        portfolioItem.price = price;
        portfolioItem.currency = currency;
        portfolioItem.totalValue = quantity * price; // Update the total value

        // Update localStorage with the updated portfolioData
        localStorage.setItem('portfolioData', JSON.stringify(portfolioData));

        // Update the table with the new portfolio data
        updatePortfolioTable();

        // Reset the form
        document.getElementById('updateForm').reset();

        // Close the modal
        let modal = bootstrap.Modal.getInstance(document.getElementById('updateModal'));
        modal.hide();
    } else {
        // If the input is invalid, alert the user
        alert('Please enter valid data.');
    }
});
//#endregion