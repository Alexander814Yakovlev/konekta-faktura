let pdfDoc = document.querySelector(".document")
let mainWindow = document.querySelector(".main__window")
let settingsButton = document.querySelector(".main__settings")
let settings = document.querySelector(".settings")
let returnButton = document.querySelector(".return__button")
let createPDFButton = document.querySelector(".save-pdf")
let saveSettings = document.querySelector(".save-info")
pdfDoc.hidden = true
settings.hidden = true

let year = new Date().getFullYear()

let myData = {
    firmName: "Albatros",
    myName: "Vasya Vakulenko",
    address: "ul. Bobra 228",
    bankAccount: '12000011112222333344445555',
    nip: 1234567890,
    regon: 123456789,
    tarif: 32,
    apartamentPrice: 160,
    carPrice: 200,
}
myData = localStorage.getItem('fakturaData') ? JSON.parse(localStorage.fakturaData) : myData

// Template constants
let title = pdfDoc.querySelector(".title_name")
let firmName = pdfDoc.querySelector(".firm-name")
let myName = pdfDoc.querySelector(".info_name")
let address = pdfDoc.querySelector(".address")
title.textContent = myData.myName
firmName.textContent = myData.firmName
myName.textContent = myData.myName
address.textContent = myData.address


let bankAccount = pdfDoc.querySelector(".bank-account")
let nip = pdfDoc.querySelector(".nip")
let regon = pdfDoc.querySelector(".regon")
bankAccount.textContent = myData.bankAccount
nip.textContent = myData.nip
regon.textContent = myData.regon

let workTarif = pdfDoc.querySelector(".tarif")
let apartamentRentTarif = pdfDoc.querySelector(".house-tarif")
let carRentTarif = pdfDoc.querySelector(".car-tarif")
workTarif.textContent = `€ ${myData.tarif}`

let brutto = pdfDoc.querySelector(".brutto")

// Template variables
let templateHours = pdfDoc.querySelector(".hours")
let templateFaktureNum = pdfDoc.querySelector(".number-fakture")
let templateWeekNum = pdfDoc.querySelector(".week")

let checkDate = pdfDoc.querySelector(".check-date")
let payDate = pdfDoc.querySelector(".pay-date")


// Main 
let mainName = document.querySelector(".main__name")
let form = document.querySelector('.main__form')

let formHours = form.querySelector("#hours_count")
let formFaktureNum = form.querySelector("#fakture_number")
let formWeekNum = form.querySelector("#week_number")

let formApartametRent = form.querySelector("#apartament_rent")
let formCarRent = form.querySelector("#car_rent")

mainName.textContent = myName.textContent


// Form change events
formHours.oninput = function (e) {
    templateHours.textContent = formHours.value
    brutto.textContent = `€ ${formHours.value * myData.tarif}`
}

formFaktureNum.oninput = function (e) {
    templateFaktureNum.textContent = formFaktureNum.value
}

formWeekNum.oninput = function (e) {
    templateWeekNum.textContent = `usługi spawalnicze w tyg ${formWeekNum.value}`
    checkDate.textContent = createDateString(parseInt(formWeekNum.value) + 1, year)
    payDate.textContent = createDateString(parseInt(formWeekNum.value) + 3, year)
}

formApartametRent.onchange = function (e) {
    if (formApartametRent.checked) {
        let filledRows = Array.from(document.querySelectorAll('.main-row')).filter(x => x.cells.length)
        let lastFilledRow = filledRows[filledRows.length - 1]
        let emptyRows = Array.from(document.querySelectorAll('.main-row')).filter(x => !x.cells.length)
        let firstEmptyRow = emptyRows[0]
        if (!lastFilledRow.classList.contains("gray-bg")) {
            firstEmptyRow.classList.add("gray-bg")
        }
        firstEmptyRow.classList.add("house")
        firstEmptyRow.innerHTML = `
        <td class="main-cell">Koszt zakwaterowania/tyd</td>
        <td class="main-cell"></td>
        <td class="main-cell house-tarif">€ ${myData.apartamentPrice}</td>
        <td class="main-cell house-brutto">€ -${myData.apartamentPrice}</td>`
    } else {
        let row = document.querySelector(".house")
        row.innerHTML = ''
        row.classList.remove("house")
        row.classList.remove("gray-bg")
    }
}

formCarRent.onchange = function (e) {
    if (formCarRent.checked) {
        let filledRows = Array.from(document.querySelectorAll('.main-row')).filter(x => x.cells.length)
        let lastFilledRow = filledRows[filledRows.length - 1]
        let emptyRows = Array.from(document.querySelectorAll('.main-row')).filter(x => !x.cells.length)
        let firstEmptyRow = emptyRows[0]
        console.log(firstEmptyRow)
        if (!lastFilledRow.classList.contains("gray-bg")) {
            firstEmptyRow.classList.add("gray-bg")
        }
        firstEmptyRow.classList.add("car")
        firstEmptyRow.innerHTML = `
        <td class="main-cell">Koszt wynajmu samochodu/tyd</td>
        <td class="main-cell"></td>
        <td class="main-cell car-tarif">€ ${myData.carPrice}</td>
        <td class="main-cell car-brutto">€ -${myData.carPrice}</td>`
    } else {
        let row = document.querySelector(".car")
        row.innerHTML = ''
        row.classList.remove("car")
        row.classList.remove("gray-bg")
    }
}

// Form validate
function isFilled(...requiredFields) {
    for (let field of requiredFields) {
        if (field.value == '') {
            return false
        }
    }
    return true
}

// Dates
function createDateString(week, year) {
    // Cоздаём дату, гарантированно входящую в первую неделю.
    const date = new Date(year, 0, 7);
    // Откатываемся до первого четверга года
    // По ГОСТ ИСО 8601-2001 первая неделя года должна содержать четверг
    date.setDate(date.getDate() - (date.getDay() + 10) % 7);
    // Переходим в нужную неделю
    date.setDate(date.getDate() + (week - 1) * 7);
    // Откатываемся до понедельника
    date.setDate(date.getDate() - 3);
    let day = String(date.getDate()).padStart(2, 0)
    let month = String(date.getMonth() + 1).padStart(2, 0)
    let currYear = String(date.getFullYear())
    return `${day}.${month}.${currYear}`;
}

// Main function
function printPDF() {
    window.jsPDF = window.jspdf.jsPDF;
    let doc = new jsPDF();
    doc.addFont('../fonts/calibri.ttf', 'calibri', 'normal')
    doc.setFont('calibri')

    // Source HTMLElement or a string containing HTML.
    let elementHTML = document.createElement('div');
    elementHTML.className = 'document'
    elementHTML.innerHTML = pdfDoc.innerHTML


    doc.html(elementHTML, {
        callback: function (doc) {
            // Save the PDF
            doc.save('sample-document.pdf');
        },
        x: 0,
        y: 0,
        width: 230, //target width in the PDF document
        windowWidth: 650 //window width in CSS pixels
    });
}

createPDFButton.onclick = function () {
    if (isFilled(formHours, formFaktureNum, formWeekNum)) {
        let netto = document.querySelector(".document_netto")
        let brutto = myData.tarif * formHours.value
        let car = document.querySelector(".car") ? myData.carPrice : 0
        let house = document.querySelector(".house") ? myData.apartamentPrice : 0
        netto.textContent = `€ ${brutto - house - car}`
        printPDF()
        form.reset()
        document.querySelector(".car").innerHTML = ''
        document.querySelector(".house").innerHTML = ''
    } else {
        alert("not OK")
    }
}

// Settings
settingsButton.onclick = function () {
    mainWindow.hidden = true
    settings.hidden = false
}

returnButton.onclick = function () {
    mainWindow.hidden = false
    settings.hidden = true
}

// Settings form
let settingsForm = document.querySelector('.settings_form')

// Settings fields
let firmNameField = document.querySelector("#firm-name")
firmNameField.value = myData.firmName
let fullNameField = document.querySelector("#full-name")
fullNameField.value = myData.myName
let addressField = document.querySelector("#address-field")
addressField.value = myData.address
let bankAccountField = document.querySelector("#bank-account")
bankAccountField.value = myData.bankAccount
let nipField = document.querySelector("#nip-field")
nipField.value = myData.nip
let regonField = document.querySelector("#regon-field")
regonField.value = myData.regon
let tarifField = document.querySelector("#tarif-field")
tarifField.value = myData.tarif
let houseField = document.querySelector("#house-field")
houseField.value = myData.apartamentPrice
let carField = document.querySelector("#car-field")
carField.value = myData.carPrice


bankAccountField.oninput = function () {
    if ([2, 7, 12, 17, 22, 27].includes(bankAccountField.value.length)) {
        bankAccountField.value += " "
    }
    if (bankAccountField.value.length > 32) {
        bankAccountField.value = bankAccountField.value.slice(0, 32)
        return
    }
}


// Save myData
saveSettings.onclick = function () {
    myData = {
        firmName: firmNameField.value,
        myName: fullNameField.value,
        address: addressField.value,
        bankAccount: bankAccountField.value,
        nip: nipField.value,
        regon: regonField.value,
        tarif: tarifField.value,
        apartamentPrice: houseField.value,
        carPrice: carField.value,
    }
    localStorage.setItem('fakturaData', JSON.stringify(myData))
    
    Swal.fire({
        text: "Данные успешно сохранены",
        icon: "success"
    })
}