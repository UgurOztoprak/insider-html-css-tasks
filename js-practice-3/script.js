document.querySelector(".startBtn").addEventListener("click", startCountdown);
document.querySelector(".resetBtn").addEventListener("click", resetCountdown);

let countdown;

function startCountdown() {
  if (countdown) return;

  let value = Number(document.querySelector("#countdown").value);
  document.querySelector(".countdownP").innerHTML = value;

  countdown = setInterval(function () {
    value--;
    if (value >= 0) {
      document.querySelector(".countdownP").innerHTML = value;
    } else {
      clearInterval(countdown);
      countdown = null;
      document.querySelector(".countdownP").innerHTML = `Time's up!`;
    }
  }, 1000);
}

function resetCountdown() {
  if (countdown) {
    clearInterval(countdown);
    countdown = null;
    document.querySelector(".countdownP").innerHTML = `Timer cleared.`;
  }
}
