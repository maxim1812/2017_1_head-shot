"use strict";

// класс для управления отображением игрового поля
export default class CanvasManager{
    // конструктор
    // инициализация полей класса
    constructor(elementFinder,canvasClassName){
        // инициализируем поля класса вспомогательными объектами
        this.elementFinder = elementFinder;
        // создаём объект - холст для рисования
        this.holst = this.elementFinder.getElement(canvasClassName).getContext('2d');
        // задаём используемые для отображения картинки
        this.imgEmpty = new Image();
        this.imgEmpty.src = "Images/fieldEmpty.png";
        this.imgCircle = new Image();
        this.imgCircle.src = "Images/fieldCircle.png";
        this.imgKrest = new Image();
        this.imgKrest.src = "Images/fieldKrest.png";
        // инициализируем карту клеточного поля
        // @ - пустая клетка
        // X - клетка занята крестиком
        // 0 - клетка занята ноликом
        let k = 2;

        this.map = [
            {type: "@", x: 0 * k, y: 0 * k},
            {type: "@", x: 80 * k, y: 0 * k},
            {type: "@", x: 160 * k, y: 0 * k},
            {type: "@", x: 0 * k, y: 80 * k},
            {type: "@", x: 80 * k, y: 80 * k},
            {type: "@", x: 160 * k, y: 80 * k},
            {type: "@", x: 0 * k, y: 160 * k},
            {type: "@", x: 80 * k, y: 160 * k},
            {type: "@", x: 160 * k, y: 160 * k}
        ];
        // задаём параметры рисования
        this.holst.lineWidth = 3;
        this.holst.strokeStyle = '#000000';
    }

    // получить содержимое клеточного поля в виде строки
    getStringContentOfMap(){
        let mapString = "";
        // пробегаемся по всему массиву клеток
        for(let i = 0; i < this.map.length; i++){
            // добавляем к результирующей строке тип клетки
            mapString += this.map[i].type;
        }
        // возвращаем результирующую строку
        return mapString;
    }

    // задать содержимое ВСЕГО клеточного поля
    setStringContentOfMap(mapString){
        // пробегаемся по всей строке с содержимым клеточного поля
        for(let i = 0; i < mapString.length; i++){
            // задаём каждой клетке определённый тип
            this.map[i].type = mapString.charAt(i);
        }
    }

    // метод для задания типа элемента клеточного поля
    setElementOfMap(number,type){
        // задаём клетке под номером NUMBER тип TYPE
        this.map[number].type = type;
    }

    // получаем объект - клетку под номером NUMBER
    getElementOfMap(number){
        // возвращаем объект - клетку
        return this.map[number];
    }

    // делаем все клетки клеточного поля пустыми
    clearField(){
        // пробегамся по всем клеткам
        for(let i = 0; i < this.map.length; i++){
            // задаём клетке тип ПУСТАЯ КЛЕТКА
            this.setElementOfMap(i,"@");
        }
    }

    // вывод всего клеточного поля на экран
    renderMap(){
        let k = 2;
        // очищаем содержимое холста
        this.holst.clearRect(0,0,480,480);
        // пробегаемся по всем клеткам
        for(let i = 0; i < this.map.length; i++){
            // получаем тип клетки под номером i
            const type = this.map[i].type;
            // в зависимости от типа клетки рисуем определённую картинку в ячейке клетки
            switch(type){
                // для пустой клетки
                case "@":
                    this.holst.drawImage(this.imgEmpty,this.map[i].x,this.map[i].y,80 * k,80 * k);
                    break;
                // для клетки хранящей нолик
                case "0":
                    this.holst.drawImage(this.imgCircle,this.map[i].x,this.map[i].y,80 * k,80 * k);
                    break;
                // для клетки хранящей крестик
                case "X":
                    this.holst.drawImage(this.imgKrest,this.map[i].x,this.map[i].y,80 * k,80 * k);
                    break;
            }
        }
        // рисуем контур холста
        //this.holst.strokeRect(0,0,240,240);
    }
}