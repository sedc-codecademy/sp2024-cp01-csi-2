const cryptoApi = "https://api.coinlore.net/api/tickers/";

function FetchCryptoData() {
    fetch(cryptoApi)
        .then(response => response.json())
        .then(apiData => {
            console.log(apiData);  // Check the structure of the API response
            const cryptoData = apiData.data;
            InitializeWalletAndUI(cryptoData);
        })
        .catch(error => {
            console.error('Error fetching crypto data:', error);
        });
}

function InitializeWalletAndUI(cryptoData) {
    const activeAccount = JSON.parse(localStorage.getItem('activeAccount'));
    if (!activeAccount) {
        DisplayErrorMessage('Please log in to access your wallet.');
        return;
    }

    const wallet = new CryptoWallet(cryptoData, activeAccount);
    wallet.InitializeBalances();
    SetupCryptoSelect(cryptoData, wallet);
    SetupTransactionButton(wallet);
    UpdateUIForLoggedInUser();
    UpdateTotalBalanceUI(wallet);
    UpdateCryptoHoldingsUI(wallet);
}

function SetupCryptoSelect(cryptoData, wallet) {
    const cryptoSelect = document.getElementById('crypto-select');
    cryptoData.forEach(currency => {
        const option = document.createElement('option');
        option.value = currency.symbol;
        option.textContent = `${currency.name} --- Price: $${currency.price_usd}`;
        cryptoSelect.appendChild(option);
    });

    $('#crypto-select').selectize({
        create: false,
        sortField: 'text'
    });
}

function SetupTransactionButton(wallet) {
    const performTransactionBtn = document.getElementById('perform-transaction');
    performTransactionBtn.addEventListener('click', function() {
        const currencySymbol = document.getElementById('crypto-select').value;
        const transactionType = document.getElementById('transaction-type').value;
        const amount = parseFloat(document.getElementById('amount').value);

        console.log('Performing Transaction:', { currencySymbol, transactionType, amount });

        const activeAccount = JSON.parse(localStorage.getItem('activeAccount'));
        if (!activeAccount) {
            DisplayErrorMessage('Please log in to perform a transaction.');
            return;
        }

        try {
            if (!currencySymbol) {
                throw new Error('No cryptocurrency selected.');
            }
            wallet.PerformTransaction(currencySymbol, transactionType, amount, activeAccount);
            UpdateLocalStorageAccount(wallet, activeAccount);
            UpdateTotalBalanceUI(wallet);
            UpdateCryptoHoldingsUI(wallet);
        } catch (error) {
            DisplayErrorMessage(error.message);
        }
    });
}

function DisplayErrorMessage(message) {
    const errorMessageElement = document.getElementById('error-message');
    errorMessageElement.textContent = message;
}

function UpdateLocalStorageAccount(wallet, activeAccount) {
    const accounts = JSON.parse(localStorage.getItem('accounts'));
    const updatedAccount = accounts.find(acc => acc.email === activeAccount.email);
    updatedAccount.balance = wallet.totalBudget;
    updatedAccount.wallet = wallet.balance;
    localStorage.setItem('accounts', JSON.stringify(accounts));
    localStorage.setItem('activeAccount', JSON.stringify(updatedAccount));
}

class CryptoWallet {
    constructor(cryptoData, activeAccount) {
        this.totalBudget = activeAccount.balance || 100000;
        this.balance = activeAccount.wallet || {};
        this.transactions = [];
        this.prices = {};

        cryptoData.forEach(currency => {
            if (currency.price_usd) {
                this.prices[currency.symbol] = parseFloat(currency.price_usd);
            }
        });

        console.log("Initialized Prices:", this.prices);  // Debugging log
    }

    InitializeBalances() {
        this.UpdateBalanceUI();
    }

    UpdateBalanceUI() {
        const balanceElement = document.getElementById('balance');
        const walletAmount = document.getElementById("wallet-amount");

        const totalValue = Object.keys(this.balance).reduce((total, symbol) => {
            return total + (this.balance[symbol] * this.prices[symbol]);
        }, 0);

        walletAmount.innerHTML = `<p>$${this.totalBudget.toFixed(2)}</p>`;

        balanceElement.innerHTML = Object.keys(this.balance)
            .filter(symbol => this.balance[symbol] > 0)
            .map(symbol => `<div>${symbol}: ${this.balance[symbol]} (${(this.balance[symbol] * this.prices[symbol]).toFixed(2)} USD)</div>`)
            .join('');

        if (Object.values(this.balance).every(balance => balance === 0)) {
            balanceElement.style.display = 'none';
        } else {
            balanceElement.style.display = 'block';
        }
    }

    PerformTransaction(currencySymbol, transactionType, amount, activeAccount) {
        console.log('Transaction Details:', { currencySymbol, transactionType, amount, prices: this.prices[currencySymbol], totalBudget: this.totalBudget });

        if (isNaN(amount) || amount <= 0) {
            throw new Error('Invalid amount entered.');
        }

        if (!this.prices.hasOwnProperty(currencySymbol)) {
            throw new Error(`Invalid cryptocurrency symbol: ${currencySymbol}`);
        }

        const cost = amount * this.prices[currencySymbol];
        console.log('Calculated Cost:', cost);

        if (isNaN(cost)) {
            throw new Error('Error calculating transaction cost.');
        }

        if (transactionType === 'sell' && this.balance[currencySymbol] < amount) {
            throw new Error(`Insufficient balance in '${currencySymbol}' to sell.`);
        }

        if (transactionType === 'buy' && this.totalBudget < cost) {
            throw new Error(`Insufficient budget to buy ${amount} ${currencySymbol}.`);
        }

        if (transactionType === 'buy') {
            this.balance[currencySymbol] += amount;
            this.totalBudget -= cost;
        } else if (transactionType === 'sell') {
            this.balance[currencySymbol] -= amount;
            this.totalBudget += cost;
        }

        const transaction = {
            type: transactionType,
            currency: currencySymbol,
            amount: amount,
            cost: cost,
            timestamp: new Date().toLocaleString()
        };

        this.transactions.unshift(transaction);
        this.UpdateBalanceUI();
        this.UpdateTransactionHistoryUI();
    }

    UpdateTransactionHistoryUI() {
        const transactionListElement = document.getElementById('transaction-list');
        transactionListElement.innerHTML = this.transactions.map(transaction =>
            `<li>${transaction.type.toUpperCase()} ${transaction.amount} ${transaction.currency} - $${transaction.cost.toFixed(2)} - ${transaction.timestamp}</li>`
        ).join('');
    }
}

function UpdateUIForLoggedInUser() {
    const activeAccount = JSON.parse(localStorage.getItem('activeAccount'));
    const loginElement = document.getElementById('login');
    const registerElement = document.getElementById("register")
    if (activeAccount) {
        registerElement.innerHTML = `<span>Welcome, ${activeAccount.email}</span>`;
        loginElement.innerHTML = "";
    }
}

function UpdateTotalBalanceUI(wallet) {
    const totalBalanceElement = document.getElementById('total-balance');
    const totalValue = wallet.totalBudget + CalculateCryptoValue(wallet.balance, wallet.prices);
    if (!isNaN(totalValue)) {
        totalBalanceElement.textContent = `Total Balance: $${totalValue.toFixed(2)}`;
    }
}

function UpdateCryptoHoldingsUI(wallet) {
    const cryptoTableBody = document.getElementById('crypto-table-body');
    cryptoTableBody.innerHTML = Object.keys(wallet.balance)
        .filter(symbol => wallet.balance[symbol] > 0)
        .map(symbol => {
            const valueUSD = wallet.balance[symbol] * wallet.prices[symbol];
            return !isNaN(valueUSD) ? 
                `<tr>
                    <td>${symbol}</td>
                    <td>${wallet.balance[symbol]}</td>
                    <td>${valueUSD.toFixed(2)} USD</td>
                </tr>` : '';
        }).join('');
}

function CalculateCryptoValue(balance, prices) {
    return Object.keys(balance).reduce((total, symbol) => {
        return total + (balance[symbol] * prices[symbol]);
    }, 0);
}

FetchCryptoData();

let refreshIntervalId;
function startRefreshInterval() {
    refreshIntervalId = setInterval(() => {
        FetchCryptoData();
    }, 30000);
}
startRefreshInterval();

function stopRefreshInterval() {
    clearInterval(refreshIntervalId);
}
