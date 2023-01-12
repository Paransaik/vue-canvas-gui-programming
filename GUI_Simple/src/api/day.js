function calculatedDate (day){

    let date = new Date();
    let dayAtDate = date.getDay();
    let dayDiff = day - dayAtDate - 1;

    if(dayDiff < 0){
        dayDiff = 7 + dayDiff;
    }

    let desiredDate = date.setDate(date.getDate() + dayDiff);

    return new Date(desiredDate);
}

console.log(calculatedDate(1));