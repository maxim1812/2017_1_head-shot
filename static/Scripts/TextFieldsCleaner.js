"use strict";

// класс для удаления содержимого всех текстовых полей ввода
export default class TextFieldsCleaner{
    // инициализация полей класса
    constructor(elementFinderParam){
        // создание поля - массива для хранения имён текстовых полей
        this.textFieldsNames = [];
        // вспомогательный объект для поиска элемента
        this.elementFinder = elementFinderParam;
    }
    // добавление текстового поля в массив текстовых полей
    addTextField(textFieldClass){
        // кладём строку с именем класса текстового поля в конец массива
        this.textFieldsNames.push(textFieldClass);
    }
    // удаление содержимого всех текстовых полей
    clearAllTextFields(){
        // пробегаемся по всему массиву
        for(let i = 0; i < this.textFieldsNames.length; i++){
            // получаем объект - текстовое поле
            let textFieldObj = this.elementFinder.getElement(this.textFieldsNames[i]);
            // задаём его содержимое (пустая строка)
            textFieldObj.value = "";
        }
    }
}