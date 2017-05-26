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
        const query = this.url + "stats/" + 99999;
        // отпраляем запрос на сервер
        let request = new XMLHttpRequest();
        let url = query;
        request.open("GET",url, true);
        request.setRequestHeader("Content-Type","application/json;charset=UTF-8");
        request.send(null);
        // при получении ответа с сервера
        let answerStr = "";
        request.onreadystatechange = function(){
            // если ответ нормальный
            if(request.readyState === 4 && request.status === 200){
                // сохраняем полученную информацию о пользователе в строку
                const answerContent = request.responseText;
                let obj = JSON.parse(answerContent);
                let arr = obj.userProfiles;
                let n = arr.length;
                for(let i = 0; i < n; i++) {
                    let username = arr[i].username;
                    let email = arr[i].email;
                    let wins = arr[i].wins;
                    let losses = arr[i].losses;
                    let draws = arr[i].draws;
                    if(username === loginParam){
                        answerStr = username + "@" + wins + "@" + losses + "@" + draws + "@" + email;
                        break;
                    }
                }
                thisManager.printUserInfo(answerStr);
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
        //this.contentManager.addText("Почта: " + arrInfo[4]);
        this.contentManager.addText("Победы: " + arrInfo[1]);
        this.contentManager.addText("Поражения: " + arrInfo[2]);
        this.contentManager.addText("Ничьи: " + arrInfo[3]);
    }

    // метод для получения информации о пользователе и её вывода на экран
    writeResultsOfUser(loginParam){
        this.sendQueryToServerForGettingUserInfo(loginParam);
    }
}
