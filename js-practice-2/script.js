let stepCount = 1;
let maximumStepCount = 0;
let maximumStepNumber = 0;
let currentNumber = 0;

function calculateStepCount(number) {
  if (number !== 1) {
    if (number % 2 === 1) {
      //tek
      number = number * 3 + 1;
    } else {
      //çift
      number = number / 2;
    }

    stepCount++;
    calculateStepCount(number);
  } else {
    if (stepCount > maximumStepCount) {
      maximumStepCount = stepCount;
      maximumStepNumber = currentNumber;
    }
  }
}

for (let i = 1; i < 1000000; i++) {
  stepCount = 1;
  currentNumber = i;
  calculateStepCount(i);
}

console.log(
  `En büyük adıma sahip sayı: ${maximumStepNumber} Adım sayısı: ${maximumStepCount}`
);
