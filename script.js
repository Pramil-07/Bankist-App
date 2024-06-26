// BANKIST APP

// Data
const account1 = {
    owner: 'Pramil Raj Dhungana',
    movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
    interestRate: 1.2, // %
    pin: 1111,
    };
    
    const account2 = {
    owner: 'Prajwal Dhungana',
    movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
    interestRate: 1.5,
    pin: 2222,
    };
    
    const account3 = {
    owner: 'Bimala Khanal',
    movements: [200, -200, 340, -300, -20, 50, 400, -460],
    interestRate: 0.7,
    pin: 3333,
    };
    
    const account4 = {
    owner: 'Renuka Bhattarai',
    movements: [430, 1000, 700, 50, 90],
    interestRate: 1,
    pin: 4444,
    };
    
    const accounts = [account1, account2, account3, account4];
    
  // Elements
    const labelWelcome = document.querySelector('.welcome');
    const labelDate = document.querySelector('.date');
    const labelBalance = document.querySelector('.balance__value');
    const labelSumIn = document.querySelector('.summary__value--in');
    const labelSumOut = document.querySelector('.summary__value--out');
    const labelSumInterest = document.querySelector('.summary__value--interest');
    const labelTimer = document.querySelector('.timer');
    
    const containerApp = document.querySelector('.app');
    const containerMovements = document.querySelector('.movements');
    
    const btnLogin = document.querySelector('.login__btn');
    const btnTransfer = document.querySelector('.form__btn--transfer');
    const btnLoan = document.querySelector('.form__btn--loan');
    const btnClose = document.querySelector('.form__btn--close');
    const btnSort = document.querySelector('.btn--sort');
    
    const inputLoginUsername = document.querySelector('.login__input--user');
    const inputLoginPin = document.querySelector('.login__input--pin');
    const inputTransferTo = document.querySelector('.form__input--to');
    const inputTransferAmount = document.querySelector('.form__input--amount');
    const inputLoanAmount = document.querySelector('.form__input--loan-amount');
    const inputCloseUsername = document.querySelector('.form__input--user');
    const inputClosePin = document.querySelector('.form__input--pin');

    // Display movements

    const displayMovements = function(movements,sort = false){
        containerMovements.innerHTML= '';
        const movs = sort? movements.slice().sort((a,b)=> a-b): movements;

        movs.forEach(function(mov,i){
            const type = mov > 0 ? 'deposit' : 'withdrawal';

            const html =`
            <div class="movements__row">
                <div class="movements__type movements__type--${type}">${i+1} ${type}</div>
        
                <div class="movements__value">${mov} ₹</div>
            </div>`;
            containerMovements.insertAdjacentHTML('afterbegin',html);
            
        });
    }

    const calcDisplayBalance = function(acc){
        const balance = acc.movements.reduce(function(acc,mov){
            return acc+mov
        },0)
        acc.balance = balance;
        labelBalance.textContent =`${acc.balance} ₹`
    }

    // creating username

    const createUsernames = function(accs){
        accs.forEach(function(acc){

            acc.username = acc.owner.toLocaleLowerCase().split(' ').map(name =>name[0]).join('');
        });
    };
    createUsernames(accounts)


    // display in and out
    const calcDisplaySummery = function(acc){
        const income = acc.movements.filter(function(mov){
            return mov > 0;
        }).reduce(function(acc,mov){
            return acc+mov
        },0)
        labelSumIn.textContent = `${income} ₹`

        const outgoing = acc.movements.filter(function(mov){
            return mov < 0;
        }).reduce(function(acc,mov){
            return acc+mov
        },0)
        labelSumOut.textContent =`${Math.abs(outgoing)} ₹`

        const intrest = acc.movements.filter(function(mov){
            return mov > 0;
        }).map(function(deposit){
            return (deposit*acc.interestRate)/100;
        }).reduce(function(acc,inte){
            return acc+inte;
        },0);
        labelSumInterest.textContent = `${intrest} ₹`
    }

const updateUI = function(acc){
    // Display movements
    displayMovements(acc.movements)
    // Display balance
    calcDisplayBalance(acc);
    // Display summary
    calcDisplaySummery(acc);
};

// event handler  of  login
let currentAccount;
btnLogin.addEventListener('click',function(e){
    // prevent form from submitting
    e.preventDefault();


    currentAccount = accounts.find(acc=> acc.username === inputLoginUsername.value);

inputTransferAmount.value = inputTransferTo.value = ''

    if(currentAccount?.pin === Number(inputLoginPin.value)){

        // display UI
        labelWelcome.textContent = `Welcome Back,${currentAccount.owner.split(' ')[0]}`;
        
        containerApp.style.opacity = 100;

        // Clear input fields
        inputLoginUsername.value = inputLoginPin.value = '';

        inputLoginPin.blur();

        // update ui
        updateUI(currentAccount);
        
    };

});

// Transfer amount

btnTransfer.addEventListener('click',function(e){
    e.preventDefault();
    const amount = Number(inputTransferAmount.value);

    const receiverAcc = accounts.find(acc=> acc.username === inputTransferTo.value) ;
    
    inputTransferAmount.value = inputTransferTo.value = '';

    if(amount >0 && receiverAcc && currentAccount.balance >= amount && receiverAcc?.username !== currentAccount.username ){

        // Doing Transfer
        currentAccount.movements.push(-amount);
        receiverAcc.movements.push(amount);
        console.log('valid transfer');
          // update ui
            updateUI(currentAccount);

    };
});
//Loan 

btnLoan.addEventListener('click',function(e){
    e.preventDefault();
    const amount = Number(inputLoanAmount.value);
    if(amount >0 && currentAccount.movements.some(mov => mov >= amount*0.1)){
        //Add movement 
        currentAccount.movements.push(amount);

        // Update UI
        updateUI(currentAccount);

        
    }
    // clear value
    inputLoanAmount.value = '';
})
// Closing the account 

btnClose.addEventListener('click',function(e){

    e.preventDefault();
    
    if(inputCloseUsername.value === currentAccount.username && Number(inputClosePin.value) === currentAccount.pin){
        const index = accounts.findIndex(acc => acc.username === currentAccount.username);
        console.log(index); 
        // Delete account
        accounts.splice(index,1)

        // hide UI
        containerApp.style.opacity = 0;
    }

    inputCloseUsername.value = inputClosePin.value = ''
})


// sort

let sorted = false;
btnSort.addEventListener('click',function(e){
    e.preventDefault();
    displayMovements(currentAccount.movements,!sorted);

    sorted =!sorted;
})
