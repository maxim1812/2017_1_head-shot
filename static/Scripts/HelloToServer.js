"use strict";

// класс для проверки возможности соединения с сервером
export default class HelloToServer{
    // конструктор
    // инициализация полей
    constructor(url){
        this.url = url;
    }
    // метод отправки запроса на сервер
    sendHello(){
        const url = this.url;
        // создание строки - запроса
        const query = url + "scr10.php";
        // посылаем запрос на сервер
        let request = new XMLHttpRequest();
        request.open("POST",query);
        request.setRequestHeader("Content-Type","text/plain;charset=UTF-8");
        request.send(null);
        // при получении ответа с сервера
        request.onreadystatechange = function(){
            // если ответ нормальный
            if(request.readyState === 4 && request.status === 200){
                // выводим полученное сообщение в консоль
                const messageString = request.responseText;
                console.log(messageString);
            }
        }
    }
}