export const generatePIN = (): number => {
    let pin = "";
    for (let i = 0; i < 6; i++) {
      pin += Math.floor(Math.random() * 10);
    }
    console.log("pin==",pin);
    if(pin.length<6){
      generatePIN()
    }
    return parseInt(pin);
  };

  export const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
];