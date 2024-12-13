// Tax Switch Functionality

let taxSwitch = document.querySelector("#switch");
let circle = document.querySelector("#circle");
let taxInfo = document.querySelectorAll(".tax-info");

taxSwitch.addEventListener("click", () => {
    circle.classList.toggle("active");
    taxSwitch.classList.toggle("active-switch");
    
    for(info of taxInfo){
        info.classList.toggle("active");
    }
})