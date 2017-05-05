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
            login: loginParam,
            tip: typeParam
        };
        // создаём строку - запрос
        const query = this.url + "scr3.php?content=" + JSON.stringify(myObjJSON);
        // отправка запроса на сервер
        let request = new XMLHttpRequest();
        request.open("POST",query);
        request.setRequestHeader("Content-Type","text/plain;charset=UTF-8");
        request.send(null);
        // при получении ответа
        request.onreadystatechange = function(){
            // если ответ нормальный
            if(request.readyState === 4 && request.status === 200){
                if(request.responseText === "OK") {
                    // выводим сообщение об успешном сохранении в БД
                    console.log("Result was saved to DB.");
                }
            }
        }
    }

    // метод для добавление в БД победы
    saveWin(loginParam){
        this.sendResultToServer(loginParam,1);
    }

    // метод для добавления в БД поражения
    saveLose(loginParam){
        this.sendResultToServer(loginParam,2);
    }

    // метод для добавления в БД ничьи
    saveNichia(loginParam){
        this.sendResultToServer(loginParam,3);
    }
}
