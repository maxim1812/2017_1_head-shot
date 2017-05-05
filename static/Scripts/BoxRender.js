"use strict";

// класс для скрытия и показа боксов
export default class BoxRender{
    // создание полей класса
    constructor(){
        // поле - массив, хранящий имена боксов
        this.arr = [];
    }

    // добавление имени бокса в массив
    addBox(boxClass){
        // кладём имя класса бокса в конец массива
        this.arr.push(boxClass);
    }

    // возврат бокса с определённым классом
    getBox(boxClass){
        // получаем массив боксов с данным именем класса
        let elements = document.getElementsByClassName(boxClass);
        // получаем первый (нулевой) бокс с данным именем класса
        let box = elements[0];
        // возвращаем полученный бокс
        return box;
    }

    // спрятать все боксы
    hideAllBoxes(){
        // пробегаемся по всему массиву с именами боксов
        for(let i = 0; i < this.arr.length; i++){
            // получаем бокс под номером i
            let box = this.getBox(this.arr[i]);
            // прячем бокс
            box.hidden = true;
        }
    }

    // спрятать все боксы и показать только один из них
    showBox(boxClass) {
        // прячем все боксы
        this.hideAllBoxes();
        // получаем бокс под определённым именем
        let box = this.getBox(boxClass);
        // показываем полученный бокс
        box.hidden = false;
    }
}