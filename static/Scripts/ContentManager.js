"use strict";

// класс для вывода сообщений на экран
export default class ContentManager{
    // создание поля класса
    constructor(){
        // полем клааса является объект
        this.element = {};
    }
    // инициализируем элемент, в который будем выводить результат
    initElement(element){
        // присваиваем полю класса значение объекта - параметра
        this.element = element;
    }
    // очищаем содержимое
    clear(){
        // присваимваем содержимому элемента пустую строку
        this.element.innerHTML = "";
    }
    // задаём текстовое содержимое
    setText(text){
        // присваиваем содержимому элемента строку из пераметра
        this.element.innerHTML = text;
    }
    // добавляем текстовое содержимое
    addText(text){
        // прибавляем к содержимому элемента текст из параметра и перенос строки
        this.element.innerHTML += (text + "<br>");
    }
    // получить текстовое содержимое
    getText(){
        return this.element.innerHTML;
    }
}