let btn1 = document.getElementById('btnTask1');

btn1.onclick = function() {
    let a = Number(document.getElementById('sideA').value);
    let b = Number(document.getElementById('sideB').value);
    let c = Number(document.getElementById('sideC').value);
    let resultDiv = document.getElementById('resTask1');
    
    resultDiv.style.display = "block";

    if (a <= 0 || b <= 0 || c <= 0) {
        resultDiv.innerHTML = "Помилка: введіть числа більші за нуль!";
    } else if (a + b > c && a + c > b && b + c > a) {
        let type = "Різносторонній";
        if (a === b && b === c) {
            type = "Рівносторонній";
        } else if (a === b || a === c || b === c) {
            type = "Рівнобедрений";
        }
        resultDiv.innerHTML = "Трикутник існує! Його тип: " + type;
    } else {
        resultDiv.innerHTML = "Трикутник з такими сторонами не існує.";
    }
};

let btn2 = document.getElementById('btnTask2');

btn2.onclick = function() {
    let num = Number(document.getElementById('numPrime').value);
    let resultDiv = document.getElementById('resTask2');
    
    resultDiv.style.display = "block";

    if (num < 1) {
        resultDiv.innerHTML = "Помилка: введіть число більше нуля!";
        return; 
    }

    if (num === 1) {
        resultDiv.innerHTML = "1 не є ні простим, ні складеним.";
        return;
    }

    let isPrime = true;
    for (let i = 2; i < num; i++) {
        if (num % i === 0) {
            isPrime = false;
            break; 
        }
    }

    if (isPrime === true) {
        resultDiv.innerHTML = "Число " + num + " — просте!";
    } else {
        resultDiv.innerHTML = "Число " + num + " — складене.";
    }
};

let btn3 = document.getElementById('btnTask3');

btn3.onclick = function() {
    let num = Number(document.getElementById('numEven').value);
    let resultDiv = document.getElementById('resTask3');
    
    resultDiv.style.display = "block";

    if (num % 2 === 0) {
        resultDiv.innerHTML = "Число " + num + " є парним.";
    } else {
        resultDiv.innerHTML = "Число " + num + " є непарним.";
    }
};