"use strict";

// класс для получения информации о пользователе (кол-во побед, поражений, ничьих)
export default class UserResultsGetter{
    // конструктор
    // инициализация полей класса
    constructor(contentManager, url){
        this.contentManager = contentManager;
        this.url = url;
    }

    // метод для отправки запроса на сервер и получения результата
    sendQueryToServerForGettingUserInfo(loginParam){
        // переменная для доступа к THIS внутри блока onreadystatechange
        let thisManager = this;
        // объект JSON для передачи данных
        let myObjJSON = {
            login: loginParam
        };
        // создаём строку - запрос
        const query = this.url + "scr4.php?content=" + JSON.stringify(myObjJSON);
        // посылаем запрос на сервер
        let request = new XMLHttpRequest();
        request.open("POST",query);
        request.setRequestHeader("Content-Type","text/plain;charset=UTF-8");
        request.send(null);
        // при получении ответа с сервера
        request.onreadystatechange = function(){
            // если ответ нормальный
            if(request.readyState === 4 && request.status === 200){
                // сохраняем полученную информацию о пользователе в строку
                const userInfo = request.responseText;
                // вызываем метод вывода информации на экран
                thisManager.printUserInfo(userInfo);
            }
        }
    }

    // метод для вывода информации о пользователе на экран
    printUserInfo(userInfo){
        // создаём вспомогательный массив
        let arrInfo = [];
        // разделяем строку на элементы и сохраняем их в массив
        arrInfo = userInfo.split("@");
        // выводим информацию о пользователе
        this.contentManager.clear();
        this.contentManager.addText("Игрок: " + arrInfo[0]);
        this.contentManager.addText("Победы: " + arrInfo[1]);
        this.contentManager.addText("Поражения: " + arrInfo[2]);
        this.contentManager.addText("Ничьи: " + arrInfo[3]);
    }

    // метод для получения информации о пользователе и её вывода на экран
    writeResultsOfUser(loginParam){
        this.sendQueryToServerForGettingUserInfo(loginParam);
    }
}
