'use strict'; // Import the functions you need from the SDKs you need
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.9/firebase-app.js';
import {
  getDatabase,
  ref,
  get,
  child,
  update,
  connectDatabaseEmulator,
} from 'https://www.gstatic.com/firebasejs/9.6.9/firebase-database.js';
import {
  getFunctions,
  connectFunctionsEmulator,
} from 'https://www.gstatic.com/firebasejs/9.6.9/firebase-functions.js';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyAVCweEqcYrh3ihMhqE1jxeMXYoYj-O8PI',
  authDomain: 'bank-system-585f7.firebaseapp.com',
  databaseURL: 'https://bank-system-585f7-default-rtdb.firebaseio.com',
  projectId: 'bank-system-585f7',
  storageBucket: 'bank-system-585f7.appspot.com',
  messagingSenderId: '678347194954',
  appId: '1:678347194954:web:97e61ea462fd3a9ada1cb3',
  measurementId: 'G-N35BHRF3KM',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const functions = getFunctions(app);

// ================================== FOR TESTING ONLY ==================================

// Point to the RTDB emulator running on localhost.
// connectDatabaseEmulator(db, 'localhost', 9000);
// connectFunctionsEmulator(functions, 'localhost', 5001);

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  email: 'jonasschmedtman@gmail.com',
  phone: '270-969-7671',
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  email: 'jonasschmedtman@gmail.com',
  phone: '270-969-7671',
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  email: 'jonasschmedtman@gmail.com',
  phone: '270-969-7671',
  pin: 3333,
};

const account4 = {
  owner: 'Heba Ahmed',
  movements: [730, 1000, 800, -500, -90],
  email: 'jonasschmedtman@gmail.com',
  phone: '270-969-7671',
  pin: 4444,
};
const account5 = {
  owner: 'Ray Youssef',
  movements: [500, -400, 1000, 700, 50, 90],
  email: 'jonasschmedtman@gmail.com',
  phone: '270-969-7671',
  pin: 4444,
};
const account6 = {
  owner: 'Mohamed Ali ',
  movements: [430, -1000, 2000, 700, 50, 90],
  email: 'jonasschmedtman@gmail.com',
  phone: '270-969-7671',
  pin: 4444,
};
const account7 = {
  owner: 'Sherif Ibrahim',
  movements: [430, 1000, 700, -50, 90],
  email: 'jonasschmedtman@gmail.com',
  phone: '270-969-7671',
  pin: 4444,
};
const account8 = {
  owner: 'Yassmina Mahmoud',
  movements: [430, 1000, 700, 50, 90],
  email: 'jonasschmedtman@gmail.com',
  phone: '270-969-7671',
  pin: 4444,
};
const account9 = {
  owner: 'Shaimaa Elmorsy',
  movements: [430, 1000, 700, 50, -90],
  email: 'jonasschmedtman@gmail.com',
  phone: '270-969-7671',
  pin: 4444,
};
const account10 = {
  owner: 'Sarah Elsayed',
  movements: [430, 1000, -700, 50, 90],
  email: 'jonasschmedtman@gmail.com',
  phone: '270-969-7671',
  pin: 4444,
};

const accounts = [
  account1,
  account2,
  account3,
  account4,
  account5,
  account6,
  account7,
  account8,
  account9,
  account10,
];

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
const login = document.querySelector('.login');

const btnlogout = document.querySelector('.logout__btn');
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
let inputCloseUsername = document.querySelector('.form__input--user');
let inputClosePin = document.querySelector('.form__input--pin');

const table = document.querySelector('.table');
const name = document.querySelector('.name');
const phone = document.querySelector('.phone');
const email = document.querySelector('.email');
const balance = document.querySelector('.balance');

const add = document.querySelector('.add');
const obj = {};
const obj1 = {};

const displayMovements = function (movement, sort = false) {
  containerMovements.innerHTML = '';
  const movs = sort ? movement.slice().sort((a, b) => a - b) : movement;
  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
        <div class="movements__value">${mov.toFixed(2)}€</div>
      </div>`;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};
// displayMovements(account1.movements);
// console.log(containerMovements.innerHTML);

const calcDisplaySummary = function (account) {
  const incomes = account.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes.toFixed(2)}€`;

  const outcomes = account.movements
    .filter(mov => mov < 0)
    .map(mov => Math.abs(mov))
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${outcomes.toFixed(2)}€`;

  const intrest = account.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * account.interestRate) / 100)
    .filter((int, i, arr) => {
      // console.log(arr);
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${intrest.toFixed(2)}€`;
};
// calcDisplaySummary(account1.movements);

const createUserNames = function (accs) {
  accs.forEach(function (acc) {
    acc.userName = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUserNames(accounts);

const calcDisplayBalance = function (account) {
  account.balance = account.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${account.balance}€`;
};
//----------------------ADD DATA
account10.movements.forEach((number, index) => {
  obj[index] = number;
});

//mov
const dref = ref(db);
get(child(dref, `usrers`))
  .then(snapshot => {
    if (snapshot.exists()) {
      const users = snapshot.val();
      Object.keys(users).forEach(userName => {
        const userBalance = users[userName].move.reduce((a, b) => a + b);
        update(ref(db, `usrers/${userName}`), {
          balance: userBalance,
        });
      });
    } else {
      console.log('No data available');
    }
  })
  .catch(error => {
    console.error(error);
  });

//--------------------- READ
function selectData() {
  const dref = ref(db);
  get(child(dref, `usrers`))
    .then(snapshot => {
      if (snapshot.exists()) {
        const users = snapshot.val();
        Object.keys(users).forEach(userName => {
          document.getElementById('users-table').innerHTML += `
          <tr>
            <td class="name">${userName}</td>
            <td class="email">${users[userName].email}</td>
            <td class="phone">${users[userName].phone}</td>
            <td class="phone">${users[userName].balance}</td>
            <td class="balance"></td>
          </tr>`;
        });
      } else {
        console.log('No data available');
      }
    })
    .catch(error => {
      console.error(error);
    });
}
selectData();

/*
 Gets the User by name
 */
async function getUser(owner) {
  const dbRef = ref(db);
  const snapshot = await get(child(dbRef, `usrers/${owner}`));
  if (snapshot.exists()) {
    return snapshot.val();
  } else {
    console.log('No data available');
  }
}

async function updateUser(userName, data) {
  await update(ref(db, `usrers/${userName}`), data);
}

// calcDisplayBalance(account2);

const updateUI = function (acc) {
  //Display movements
  displayMovements(acc.movements);

  //Display balance
  calcDisplayBalance(acc);

  //Display summary
  calcDisplaySummary(acc);
};

const startLogOutTimer = function () {
  const tick = function () {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);

    //In each call, print the remaing time to UI
    labelTimer.textContent = `${min}:${sec}`;

    //When 0 seconds, stop the timer and log out user
    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = `Log in to get started`;
      containerApp.style.opacity = 0;
    }
    //decrease 1s
    time--;
  };

  //Set time to 5 minutes
  let time = 10;

  //Call the timer every second
  tick();

  const timer = setInterval(tick, 1000);
  return timer;
};

let currentAccount, timer;

//Event handler
btnLogin.addEventListener('click', function (e) {
  //Prevent form from submitting
  e.preventDefault();
  currentAccount = accounts.find(
    acc => acc.userName === inputLoginUsername.value
  );

  const now = new Date();
  const options = {
    hour: 'numeric',
    minute: 'numeric',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    weekday: 'long',
  };
  labelDate.textContent = new Intl.DateTimeFormat(
    currentAccount.locale,
    options
  ).format(now);

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    //Display ui and welcome message
    labelWelcome.textContent = `Welcome back ${
      currentAccount.owner.split(' ')[0]
    }`;

    localStorage.setItem('currentUser', currentAccount.owner);
    console.log('curre' + currentAccount);

    login.style.display = 'none';
    btnlogout.style.display = 'block';

    containerApp.classList.remove('hide');
    containerApp.style.opacity = 100;

    //Clear the inputs feilds
    inputLoginPin.value = inputLoginUsername.value = '';

    //loose blur
    inputLoginPin.blur();

    //remove table
    table.classList.add('hide');

    //Update UI
    updateUI(currentAccount);
  } else {
    alert('Please enter right username and password 😁');
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.userName === inputTransferTo.value
  );

  inputTransferAmount.value = inputTransferTo.value = '';
  inputTransferAmount.blur();

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance > amount &&
    receiverAcc?.userName !== currentAccount.userName
  ) {
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);
    // Update current user balance
    getUser(localStorage.getItem('currentUser')).then(async user => {
      user.move.push(-amount);
      await updateUser(localStorage.getItem('currentUser'), {
        move: user.move,
        balance: user.move.reduce((partialSum, a) => partialSum + a, 0),
      });
    });
    // Update receiver user balance
    getUser(receiverAcc.owner).then(async user => {
      user.move.push(amount);
      await updateUser(receiverAcc.owner, {
        move: user.move,
        balance: user.move.reduce((partialSum, a) => partialSum + a, 0),
      });
    });

    // currentAccount.balance - amount;
    // receiverAcc.balance + amount;

    //Update UI
    updateUI(currentAccount);

    //rest timer
    clearInterval(timer);
    timer = startLogOutTimer();

    alert(`Hi ${currentAccount.owner.split(' ')[0]}😃,
You transfer to ${receiverAcc.owner}: ${amount}€ successfuly👍.`);
  }
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});
btnlogout.addEventListener('click', function (e) {
  e.preventDefault();
  login.style.display = 'block';
  btnlogout.style.display = 'none';

  table.classList.remove('hide');

  containerApp.style.opacity = 0;
  labelWelcome.textContent = `Log in to get started`;
});
