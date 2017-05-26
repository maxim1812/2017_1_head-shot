"use strict";

// класс для сохранения результатов игры в базу данных
export default class GameResultSaver{
    // конструктор
    // инициализация полей класса
    constructor(url){
        // сохранение в поле класса адреса сервера
        this.url = url;
    }

    // метод для отправки информации о логине пользователя и результате игры на сервер
    sendResultToServer(loginParam,typeParam){
        // создаём объект JSON для передачи данных
        let myObjJSON = {
            username: loginParam,
            gameResult: typeParam
        };
        let body = JSON.stringify(myObjJSON);
        // создаём строку - запрос
        const query = this.url + "user/update";
        // отправка запроса на сервер
        let request = new XMLHttpRequest();
        request.open("POST",query, true);
        request.setRequestHeader("Content-Type","application/json;charset=UTF-8");
        request.send(body);
        console.log(query);
        console.log(body);
        // при получении ответа
        request.onreadystatechange = function(){
            // если ответ нормальный
            if(request.readyState === 4 && request.status === 200){
                console.log("Got answer");
            }
        }
    }

    // метод для добавление в БД победы
    saveWin(loginParam){
        this.sendResultToServer(loginParam,"WIN");
    }

    // метод для добавления в БД поражения
    saveLose(loginParam){
        this.sendResultToServer(loginParam,"LOSE");
    }

    // метод для добавления в БД ничьи
    saveNichia(loginParam){
        this.sendResultToServer(loginParam,"DRAW");
    }
}
