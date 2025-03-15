// Tax Switch Functionality

let taxSwitch = document.querySelector("#switch");
let circle = document.querySelector("#circle");
let taxInfo = document.querySelectorAll(".tax-info");

taxSwitch.addEventListener("click", () => {
  circle.classList.toggle("active");
  taxSwitch.classList.toggle("active-switch");

  for (info of taxInfo) {
    info.classList.toggle("active");
  }
});

// Filters Functionality
let filters = document.querySelectorAll(".filter");
for (let filter of filters) {
  filter.addEventListener("click", async function (e) {
    console.log(this.children[1].innerText);
    location.assign(`/listings?filter=${this.children[1].innerText}`);
    await fetch(`/listings?filter=${this.children[1].innerText}`);
  });
}
