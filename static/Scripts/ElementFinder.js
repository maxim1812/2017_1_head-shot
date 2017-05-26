"use strict";

// класс, позволяющий получить элемент по имени его класса
export default class ElementFinder{
    // метод получает имя класса элемента и возвращает самый первый элемент с таким классом
    findElementByClassName(elementClass){
        // получаем массив элементов с данным именем класса
        let elementsArray = document.getElementsByClassName(elementClass);
        // возвращаем самый первый (нулевой) элемент данного массива
        return elementsArray[0];
    }
    // метод для возврата объекта - результата
    getElement(elementClass){
        // возвращаем искомой элемент
        return this.findElementByClassName(elementClass);
    }
}
