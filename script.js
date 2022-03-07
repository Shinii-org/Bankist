'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
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

const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUsernames(accounts);

const updateUI = function (curAccount) {
  ballanceCal(curAccount);
  // Display summary
  calcDisplaySummary(curAccount);
  // Display movements
  displayMovement(curAccount.movements);
};

const displayMovement = function (movements, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? `deposit` : `withdrawal`;
    const html = ` <div class="movements__row">
    <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
    <div class="movements__value">${mov} EUR</div>
  </div>`;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};
let curAccount;
const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes}EUR`;
  const outcomes = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(outcomes)}EUR`;
  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(mov => (mov * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      return int >= 1;
    })
    .reduce((acc, mov) => acc + mov, 0);
  labelSumInterest.textContent = `${interest}EUR`;
};

const ballanceCal = function (acc) {
  const ballance = acc.movements.reduce((accu, cur) => accu + cur, 0);
  acc.ballance = ballance;
  labelBalance.innerHTML = `${ballance}EUR`;
};

// Event handler
btnLogin.addEventListener('click', function (e) {
  e.preventDefault();
  curAccount = accounts.find(acc => acc.username === inputLoginUsername.value);

  if (curAccount?.pin === Number(inputLoginPin.value)) {
    // Display UI and welcome message
    containerApp.style.opacity = 100;
    labelWelcome.innerHTML = `Welcome back, ${curAccount.owner.split(' ')[0]}`;
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();
    // Update UI
    updateUI(curAccount);
  }
});

// Transfer
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const transferMovement = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  if (
    transferMovement > 0 &&
    receiverAcc &&
    transferMovement <= curAccount.ballance &&
    receiverAcc !== curAccount
  ) {
    // Doing the transfer
    receiverAcc.movements.push(transferMovement);
    curAccount.movements.push(-transferMovement);
    // Update the UI
    updateUI(curAccount);
    inputTransferTo.value = inputTransferAmount.value = '';
    inputTransferAmount.blur();
  }
});
// Request loan

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const loan = Number(inputLoanAmount.value);
  if (loan > 0 && curAccount.movements.some(mov => mov > loan * 0.1)) {
    curAccount.movements.push(loan);
    updateUI(curAccount);
  }
  inputLoanAmount.value = '';
  inputLoanAmount.blur();
});

// Close account
btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    curAccount.username === inputCloseUsername.value &&
    curAccount.pin === Number(inputClosePin.value)
  ) {
    const index = accounts.findIndex(
      acc => acc.username === curAccount.username
    );
    alert('Deleted successful');
    accounts.splice(index, 1);
    containerApp.style.opacity = 0;
  }
  inputClosePin.value = inputCloseUsername.value = '';
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovement(curAccount.movements, !sorted);
  sorted = !sorted;
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////

// let arr = ['a', 'b', 'c', 'd', 'e'];

// SLICE (doesn't change the original array)
// console.log(arr.slice(2));
// console.log(arr.slice(0, 2));
// console.log(arr.slice(-2));
// console.log(arr.slice(1, -2));
// console.log(arr.slice());
// console.log([...arr]);

// SPLICE (mutate the original array)
// console.log(arr.splice(2));
// arr.splice(-1);
// console.log(arr);
// arr.splice(1, 2);
// console.log(arr);

// REVERSE (mutate the original array)
// const arr2 = ['j', 'i', 'h', 'g', 'f'];
// console.log(arr2.reverse());
// console.log(arr2);

// //CONCAT (doesn't change the original array)
// const letters = arr.concat(arr2);
// console.log(letters);
// console.log([...arr, ...arr2]);

// // JOIN (transfer array to string)
// console.log(letters.join(' - '));

// AT METHOD
// const arr = [23, 11, 64];
// console.log(arr[0]);
// console.log(arr.at(0));

// // Getting last element of the array
// console.log(arr[arr.length - 1]);
// console.log(arr.slice(-1)[0]);
// console.log(arr.at(-1));

// console.log('Shin'.at(0));
// console.log('Shin'.at(-1));

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// for (const [i, movement] of movements.entries()) {
//   if (movement > 0) console.log(`Movement ${i + 1}: You deposited ${movement}`);
//   else {
//     console.log(`Movement ${i + 1}: You withdrew ${Math.abs(movement)}`);
//   }
// }

// console.log(' -------FOR EACH----------');
// movements.forEach(function (mov, i, arr) {
//   if (mov > 0) console.log(`Movement ${i + 1}: You deposited ${mov}`);
//   else {
//     console.log(`Movement ${i + 1}: You withdrew ${Math.abs(mov)}`);
//   }
// });

// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);

// // forEach with map
// currencies.forEach(function (value, key, map) {
//   console.log(`${key}: ${value}`);
// });

// // forEach with SET

// const currenciesUnique = new Set(['USD', 'EUR', 'GBP', 'EUR', 'USD', 'GBP']);
// console.log(currenciesUnique);
// currenciesUnique.forEach(function (value, _, map) {
//   console.log(`${value}: ${value}`);
// });

///////////////////////////////////////
// Coding Challenge #1

/* 
Julia and Kate are doing a study on dogs. So each of them asked 5 dog owners about their dog's age, and stored the data into an array (one array for each). For now, they are just interested in knowing whether a dog is an adult or a puppy. A dog is an adult if it is at least 3 years old, and it's a puppy if it's less than 3 years old.

Create a function 'checkDogs', which accepts 2 arrays of dog's ages ('dogsJulia' and 'dogsKate'), and does the following things:

1. Julia found out that the owners of the FIRST and the LAST TWO dogs actually have cats, not dogs! So create a shallow copy of Julia's array, and remove the cat ages from that copied array (because it's a bad practice to mutate function parameters)
2. Create an array with both Julia's (corrected) and Kate's data
3. For each remaining dog, log to the console whether it's an adult ("Dog number 1 is an adult, and is 5 years old") or a puppy ("Dog number 2 is still a puppy 🐶")
4. Run the function for both test datasets

HINT: Use tools from all lectures in this section so far 😉

TEST DATA 1: Julia's data [3, 5, 2, 12, 7], Kate's data [4, 1, 15, 8, 3]
TEST DATA 2: Julia's data [9, 16, 6, 8, 3], Kate's data [10, 5, 6, 1, 4]

GOOD LUCK 😀
*/

// const dogsJulia = [3, 5, 2, 12, 7];
// const dogsKate = [4, 1, 15, 8, 3];

// const checkDogs = function (dogsJulia, dogsKate) {
//   const newDogsJulia = dogsJulia.slice(1, -1);
//   newDogsJulia.splice(-1);
//   const newDogsAge = [...newDogsJulia, ...dogsKate];
//   console.log(newDogsAge);
//   newDogsAge.forEach(function (age, i) {
//     console.log(
//       `Dog number ${i + 1} is ${
//         age >= 3 ? `an adult and is ${age} years old` : `still a puppy🐶`
//       }`
//     );
//   });
// };
// checkDogs(dogsJulia, dogsKate);
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
///////////
// MAP METHOD
/////////////////
// const eurToUSD = 1.1;
// // const movementsUSD = movements.map(function (mov) {
// //   return mov * eurToUSD;
// // });
// const movementsUSD = movements.map(mov => mov * eurToUSD);
// console.log(movements);
// console.log(movementsUSD);

// const movementsUSDfor = [];
// for (const mov of movements) movementsUSDfor.push(mov * eurToUSD);
// console.log(movementsUSDfor);

// const movementsDescriptions = movements.map(
//   (mov, i) =>
//     `Movement ${i + 1}: You ${mov > 0 ? 'deposited' : 'withdrew'} ${Math.abs()}`
// );
// console.log(movementsDescriptions);

//////////////
// FILTER METHOD
////////////////
// const deposits = movements.filter(mov => mov > 0);
// const withdrawals = movements.filter(mov => mov < 0);
// console.log(deposits);
// console.log(withdrawals);

////////////////////
// REDUCE METHOD
///////////////////

// const balance = movements.reduce(function (accu, cur, i, arr) {
//   console.log(`Iteration ${i}: ${accu}`);
//   return accu + cur;
// }, 0);

// const balance = movements.reduce((accu, cur) => accu + cur, 0);
// console.log(balance);

// Maximum value
// const maxValue = movements.reduce(
//   (acc, cur) => (acc > cur ? acc : cur),
//   movements[0]
// );
// console.log(maxValue);

// Coding Challenge #2

/* 
Let's go back to Julia and Kate's study about dogs. This time, they want to convert dog ages to human ages and calculate the average age of the dogs in their study.

Create a function 'calcAverageHumanAge', which accepts an arrays of dog's ages ('ages'), and does the following things in order:

1. Calculate the dog age in human years using the following formula: if the dog is <= 2 years old, humanAge = 2 * dogAge. If the dog is > 2 years old, humanAge = 16 + dogAge * 4.
2. Exclude all dogs that are less than 18 human years old (which is the same as keeping dogs that are at least 18 years old)
3. Calculate the average human age of all adult dogs (you should already know from other challenges how we calculate averages 😉)
4. Run the function for both test datasets

TEST DATA 1: [5, 2, 4, 1, 15, 8, 3]
TEST DATA 2: [16, 6, 10, 5, 6, 1, 4]

GOOD LUCK 😀
*/

// const calcAverageHumanAge = ages => {
//   // 1 Calculate humanAge

//   const humanAge = ages.map(dogAge =>
//     dogAge <= 2 ? 2 * dogAge : 16 + dogAge * 4
//   );
//   console.log(humanAge);
//   // 2 Exclude all human years < 18
//   const newHumanAge = humanAge.filter((age, i) => age >= 18);
//   console.log(newHumanAge);
//   // 3 Calculate average
//   const average =
//     //   newHumanAge.reduce((acc, age) => acc + age, 0) / newHumanAge.length;
//     // console.log(average);
//     newHumanAge.reduce((acc, age, i, arr) => acc + age / arr.length, 0);
//   console.log(average);
//   return average;
// };
// const average1 = calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]);
// const average2 = calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4]);

// const eurToUSD = 1.1;

// PIPELINE
// const totalDepositUSD = movements
//   .filter(mov => mov < 0)
//   .map((mov, i, arr) => {
//     console.log(arr);
//     return mov * eurToUSD;
//   })
//   .reduce((acc, mov) => acc + mov, 0);
// console.log(totalDepositUSD);

// Coding Challenge #3

/* 
Rewrite the 'calcAverageHumanAge' function from the previous challenge, but this time as an arrow function, and using chaining!

TEST DATA 1: [5, 2, 4, 1, 15, 8, 3]
TEST DATA 2: [16, 6, 10, 5, 6, 1, 4]

GOOD LUCK 😀
*/

// const calcAverageHumanAge = movements => {
//   const average = movements
//     .filter(age => age > 2)
//     .map(dogAge => 16 + dogAge * 4)
//     .reduce((acc, age, i, arr) => acc + age / arr.length, 0);
//   const youngster = movements.filter(age => age <= 2).map(dogAge => dogAge * 2);
//   return average;
// };
// console.log(calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]));
////////////////////

// FIND METHOD
// const firstWithdrawal = movements.find(mov => mov < 0);
// console.log(movements);
// console.log(firstWithdrawal);

// console.log(accounts);

// // const account = accounts.find(acc => acc.owner === 'Jessica Davis');
// // console.log(account);

// const account = function (accounts) {
//   const acc = accounts.filter(acc => acc.owner === 'Jessica Davis');
//   return acc;
// };
// console.log(account(accounts));

// // EQUALITY
// console.log(movements.includes(-130));

// // SOME: CONDITION
// console.log(movements.some(mov => mov === -130));

// const anyDeposits = movements.some(mov => mov > -130);
// console.log(anyDeposits);

// // EVERY:
// console.log(movements.every(mov => mov > 0));
// console.log(account4.movements.every(mov => mov > 0));

// // Separate callback
// const deposit = mov => mov > 0;
// console.log(movements.some(deposit));
// console.log(movements.every(deposit));
// console.log(movements.filter(deposit));

// const arr = [[1, 2, 3], [4, 5, 6], 7, 8];
// console.log(arr.flat());

// const arrDep = [[[1, 2], 3], [[4, 5], 6], 7, 8];
// console.log(arrDep.flat(2));

// // flat
// const overallBalance = accounts
//   .map(mov => mov.movements)
//   .flat()
//   .reduce((acc, mov, i, arr) => acc + mov / arr.length, 0);
// console.log(overallBalance);

// // flat map
// const overallBalance2 = accounts
//   .flatMap(mov => mov.movements)
//   .reduce((acc, mov, i, arr) => acc + mov / arr.length, 0);
// console.log(overallBalance);

// Strings

// const owners = ['Jonas', 'Shin', 'Ran', 'Hattory'];
// console.log(owners.sort());

// console.log(movements);

// // return < 0 A, B (keep order)
// // return > 0 B, A (switch order)

// //Ascending
// // movements.sort((a, b) => {
// //   if (a > b) return 1;
// //   if (b > a) return -1;
// // });
// movements.sort((a, b) => a - b);
// console.log(movements);

// // Descending
// // movements.sort((a, b) => {
// //   if (a > b) return -1;
// //   if (b > a) return 1;
// // });

// movements.sort((a, b) => b - a);
// console.log(movements);

/// Array

// const arr = [1, 2, 3, 4, 5, 6, 7];
// const x = new Array(7);
// console.log(x);
// x.fill(1, 3, 5);
// console.log(x);

// arr.fill(23, 2, 6);
// console.log(arr);

// // Array.from
// const y = Array.from({ length: 7 }, () => 1);
// console.log(y);

// const z = Array.from({ length: 7 }, (_, i) => i + 1);
// console.log(z);

// const randomArr = Array.from({ length: 100 }, () =>
//   Math.trunc(Math.random() * 100 + 1)
// );
// console.log(randomArr);

// labelBalance.addEventListener('click', function () {
//   const movementsUI = Array.from(
//     document.querySelectorAll('.movements__value'),
//     el => el.textContent.replace('EUR', '').replace(' ', '')
//   );
//   console.log(movementsUI);
//   const movementsUI2 = [...document.querySelectorAll('.movements__value')];
//   console.log(movementsUI2);
// });

/////////////////////
// Array Method Practise

// 1.
// const bankDepositAverage = accounts
//   .flatMap(mov => mov.movements)
//   .filter(mov => mov > 0)
//   .reduce((acc, mov, _, arr) => acc + mov / arr.length, 0);
// console.log(bankDepositAverage);
// // 2.

// const numDeposit1000 = accounts
//   .flatMap(mov => mov.movements)
//   .filter(mov => mov >= 1000).length;
// console.log(numDeposit1000);

// const reduceDeposit1000 = accounts
//   .flatMap(mov => mov.movements)
//   // .reduce((acc, mov, i, arr) => (mov >= 1000 ? acc + 1 : acc), 0);
//   .reduce((acc, mov, i, arr) => (mov >= 1000 ? ++acc : acc), 0);
// console.log(reduceDeposit1000);

// // Prefixed ++
// let a = 10;
// // console.log(a++);
// console.log(++a);
// console.log(a);

// // 3.
// const { deposits, withdrawals } = accounts
//   .flatMap(acc => acc.movements)
//   .reduce(
//     (sums, curr) => {
//       // curr > 0 ? (sums.deposits += curr) : (sums.withdrawals += curr);
//       sums[curr > 0 ? 'deposits' : 'withdrawals'] += curr;
//       return sums;
//     },
//     { deposits: 0, withdrawals: 0 }
//   );
// console.log(deposits, withdrawals);
// console.log('////////////////////////////////////////');
// // 4.
// // this is a nice title -> This Is a Nice Title
// const convertTitleCase = function (title) {
//   const capitalize = str => str[0].toUpperCase() + str.slice(1);
//   const exceptions = ['a', 'an', 'the', 'and', 'with', 'but', 'or', 'on', 'in'];
//   const titleCase = title
//     .toLowerCase()
//     .split(' ')
//     .map(word => (exceptions.includes(word) ? word : capitalize(word)))
//     .join(' ');
//   return capitalize(titleCase);
// };

// console.log(convertTitleCase('this is a nice title'));
// console.log(convertTitleCase('this is a LONG title but not too long'));
// console.log(convertTitleCase('and here is another title with an EXAMPLE'));

///////////////////////
// Coding Challenge #4

/* 
Julia and Kate are still studying dogs, and this time they are studying if dogs are eating too much or too little.
Eating too much means the dog's current food portion is larger than the recommended portion, and eating too little is the opposite.
Eating an okay amount means the dog's current food portion is within a range 10% above and 10% below the recommended portion (see hint).

1. Loop over the array containing dog objects, and for each dog, calculate the recommended food portion and add it to the object as a new property. Do NOT create a new array, simply loop over the array. Forumla: recommendedFood = weight ** 0.75 * 28. (The result is in grams of food, and the weight needs to be in kg)
2. Find Sarah's dog and log to the console whether it's eating too much or too little. HINT: Some dogs have multiple owners, so you first need to find Sarah in the owners array, and so this one is a bit tricky (on purpose) 🤓
3. Create an array containing all owners of dogs who eat too much ('ownersEatTooMuch') and an array with all owners of dogs who eat too little ('ownersEatTooLittle').
4. Log a string to the console for each array created in 3., like this: "Matilda and Alice and Bob's dogs eat too much!" and "Sarah and John and Michael's dogs eat too little!"
5. Log to the console whether there is any dog eating EXACTLY the amount of food that is recommended (just true or false)
6. Log to the console whether there is any dog eating an OKAY amount of food (just true or false)
7. Create an array containing the dogs that are eating an OKAY amount of food (try to reuse the condition used in 6.)
8. Create a shallow copy of the dogs array and sort it by recommended food portion in an ascending order (keep in mind that the portions are inside the array's objects)

HINT 1: Use many different tools to solve these challenges, you can use the summary lecture to choose between them 😉
HINT 2: Being within a range 10% above and below the recommended portion means: current > (recommended * 0.90) && current < (recommended * 1.10). Basically, the current portion should be between 90% and 110% of the recommended portion.

TEST DATA:
const dogs = [
  { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
  { weight: 8, curFood: 200, owners: ['Matilda'] },
  { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
  { weight: 32, curFood: 340, owners: ['Michael'] }
];

GOOD LUCK 😀
*/

//recommendedFood = weight ** 0.75 * 28.
const dogs = [
  { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
  { weight: 8, curFood: 200, owners: ['Matilda'] },
  { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
  { weight: 32, curFood: 340, owners: ['Michael'] },
];
// 1.
dogs.forEach(
  cur => (cur['recommendedFood'] = Math.trunc(cur.weight ** 0.75 * 28))
);
console.log(dogs);

// 2.
// dogs
//   .filter(cur => cur.owners.includes('Sarah'))
//   .map(cur =>
//     cur.curFood < 0.9 * cur.recommendedFood
//       ? console.log('Too little')
//       : console.log('Too much')
//   );

const dogSarah = dogs.find(dog => dog.owners.includes('Sarah'));
console.log(dogSarah);
console.log(
  `Sarah's dog is eating ${
    dogSarah.curFood > 1.1 * dogSarah.recommendedFood
      ? `too much`
      : `too little`
  }`
);

// 3.
// const ownersEatTooMuch = [];
// const ownersEatTooLittle = [];
// dogs.filter(cur =>
//   cur.curFood < 0.9 * cur.recommendedFood
//     ? ownersEatTooMuch.push(cur.owners)
//     : ownersEatTooLittle.push(cur.owners)
// );
const ownersEatTooMuch = dogs
  .filter(dog => dog.curFood > 1.1 * dog.recommendedFood)
  .flatMap(dog => dog.owners);

const ownersEatTooLittle = dogs
  .filter(dog => dog.curFood < 0.9 * dog.recommendedFood)
  .flatMap(dog => dog.owners);

console.log(ownersEatTooMuch);
console.log(ownersEatTooLittle);

// 4.
// "Matilda and Alice and Bob's dogs eat too much!"
console.log(`${ownersEatTooLittle.join(' and ')}'s dogs eat too little!`);
console.log(`${ownersEatTooMuch.join(' and ')}'s dogs eat too much!`);
// 5.
console.log(dogs.some(cur => cur.curFood === cur.recommendedFood));
// 6.
// console.log(
//   dogs.some(
//     cur =>
//       cur.curFood < cur.recommendedFood * 1.1 &&
//       cur.curFood > cur.recommendedFood * 0.9
//   )
// );

const checkEatOkay = dog =>
  dog.curFood < dog.recommendedFood * 1.1 &&
  dog.curFood > dog.recommendedFood * 0.9;

console.log(dogs.some(checkEatOkay));

// 7.
// const okayArr = dogs.filter(
//   cur =>
//     cur.curFood < cur.recommendedFood * 1.1 &&
//     cur.curFood > cur.recommendedFood * 0.9
// );
// console.log(okayArr);
console.log(dogs.filter(checkEatOkay));

// 8.
// sort it by recommended food portion in an ascending order
const dogsCopy = dogs
  .slice()
  .sort((a, b) => a.recommendedFood - b.recommendedFood);
console.log(dogsCopy);
