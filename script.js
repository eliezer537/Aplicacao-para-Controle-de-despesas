const ulTransactions = document.querySelector('#transactions');
const incomeDisplay = document.querySelector('#money-plus');
const expenseDisplay = document.querySelector('#money-minus');
const totalDisplay = document.querySelector('#balance');
const form = document.querySelector('#form');
const inputTransactionName = document.querySelector('#text');
const inputTransactionAmount = document.querySelector('#amount');

const localStorageTransactions = JSON.parse(localStorage.getItem('transactions'));
let transactions = localStorage.getItem('transactions') !== null ? localStorageTransactions : [];

const removeTransaction = id => {
	transactions = transactions.filter(item => item.id !== id);
	updateLocalStorage();
	init();
};

const addTransactionIntoDom = ({ id, name, amount }) => {
	const operator = amount < 0 ? '-' : '+';
	const cssClass = amount < 0 ? 'minus' : 'plus';
	const amountWithoutOperator = Math.abs(amount);

	const li = document.createElement('li');
	li.classList.add(cssClass);

	li.innerHTML = `
    ${name} 
    <span>${operator} R$ ${amountWithoutOperator}</span>
    <button class='delete-btn' onClick='removeTransaction(${id})'>x</button>
  `;

	ulTransactions.append(li);
};

const getExpenses = transactionsAmount =>
	Math.abs(transactionsAmount.filter(value => value < 0).reduce((acc, value) => acc + value, 0))
		.toFixed(2)
		.replace('.', ',');

const getIncome = transactionsAmount =>
	transactionsAmount
		.filter(value => value > 0)
		.reduce((acc, value) => acc + value, 0)
		.toFixed(2)
		.replace('.', ',');

const getTotal = transactionsAmount =>
	transactionsAmount
		.reduce((acc, transaction) => acc + transaction, 0)
		.toFixed(2)
		.replace('.', ',');

const updateBalanceValues = () => {
	const transactionsAmount = transactions.map(({ amount }) => amount);

	const total = getTotal(transactionsAmount);
	const income = getIncome(transactionsAmount);
	const expense = getExpenses(transactionsAmount);

	incomeDisplay.textContent = `R$ ${income}`;
	expenseDisplay.textContent = `R$ ${expense}`;
	totalDisplay.textContent = `R$ ${total}`;
};

const init = () => {
	ulTransactions.innerHTML = '';
	transactions.forEach(addTransactionIntoDom);
	updateBalanceValues();
};

init();

const updateLocalStorage = () => {
	localStorage.setItem('transactions', JSON.stringify(transactions));
};

const generateID = () => transactions.length + 1;

const addToTransactionArray = (transactionName, transactionAmount) => {
	const transaction = {
		id: generateID(),
		name: transactionName,
		amount: Number(transactionAmount),
	};

	transactions.push(transaction);
};

const cleanInputs = () => {
	inputTransactionName.value = '';
	inputTransactionAmount.value = '';
};

const handleFormSubmit = event => {
	{
		event.preventDefault();

		const transactionName = inputTransactionName.value.trim();
		const transactionAmount = inputTransactionAmount.value.trim();
		const isSomeEmpty = transactionName === '' || transactionAmount === '';

		if (isSomeEmpty) {
			alert('Por favor, preencha o nome e valor da transação');
			return;
		}

		addToTransactionArray(transactionName, transactionAmount);
		init();
		updateLocalStorage();
		cleanInputs();
	}
};

form.addEventListener('submit', handleFormSubmit);
