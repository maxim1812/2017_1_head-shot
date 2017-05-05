"use strict";

// класс, отвечающий за регистрацию
export default class CheckIn{
    // конструктор
    // инициализация полей класса
    constructor(elementFinder,stringController,messageElement){
        // инициализируем поля класса вспомогательными объектами
        this.elementFinder = elementFinder;
        this.stringController = stringController;
        this.message = messageElement;
    }

    // проверка на корректность логина и пароля
    controlLoginAndPasswordStringsInCheckInForm(){
        // получаем содержимое текстовых полей
        // содержимое строки - логина
        const loginString = this.elementFinder.getElement("check-in-box__login-field_black-shadow").value;
        // содержимое строки - пароля
        const passwordString = this.elementFinder.getElement("check-in-box__password-field_black-shadow").value;
        // очищаем окно с сообщениями
        this.message.clear();
        // переменнаая - флаг, отвечающая за то, корректны ли обе строки логина и пароля
        let stringsOK = true;
        // проверка на корректность логина
        const loginResult = this.stringController.isNormalString(loginString);
        switch(loginResult){
            // если логин - это пустая строка
            case "EMPTY":
                this.message.addText("Поле ввода логина пусто.");
                stringsOK = false;
                break;
            // если логин содержит некорректные символы
            case "NO_CORRECT":
                this.message.addText("Поле ввода логина содержит запретные символы.");
                stringsOK = false;
                break;
        }
        // проверка на корректность пароля
        const passwordResult = this.stringController.isNormalString(passwordString);
        switch(passwordResult){
            // если пароль - пустая строка
            case "EMPTY":
                this.message.addText("Поле ввода пароля пусто.");
                stringsOK = false;
                break;
            // если пароль содержит некорректные символы
            case "NO_CORRECT":
                this.message.addText("Поле ввода пароля содержит запретные символы.");
                stringsOK = false;
                break;
        }
        // возврат результата проверок на корректность
        return stringsOK;
    }

    // метод для попытки регистрации пользователя
    registrate(url){
        // проверяем на корректность логин и пароль
        const flag =  this.controlLoginAndPasswordStringsInCheckInForm();
        // если логин и пароль прошли проверку на корректность
        if(flag === true){
            // получаем логин и пароль
            // получаем логин
            const loginString = this.elementFinder.getElement("check-in-box__login-field_black-shadow").value;
            // получаем пароль
            const passwordString = this.elementFinder.getElement("check-in-box__password-field_black-shadow").value;
            // создаём JSON объект
            let myObjJSON = {
                login: loginString,
                password: passwordString
            };
            // объект для вывода сообщений
            let message = this.message;
            // объект для поиска элемента
            let elementFinder = this.elementFinder;
            // отправка данных на сервер
            // создаём строку - запрос
            const query = url + "scr1.php?content=" + JSON.stringify(myObjJSON);
            // создаём объект для отправки запроса
            let request = new XMLHttpRequest();
            request.open("POST",query);
            request.setRequestHeader("Content-Type","text/plain;charset=UTF-8");
            request.send(null);
            // при получении ответа с сервера
            request.onreadystatechange = function(){
                // если ответ нормальный
                if(request.readyState === 4 && request.status === 200){
                    if(request.responseText === "YES"){
                        // если регистрация прошла успешно
                        // выводим сообщение, что регистрация прошла успешно
                        message.setText("Регистрация прошла успешно.");
                        // очищаем поля ввода логина и пароля
                        elementFinder.getElement("check-in-box__login-field_black-shadow").value = "";
                        elementFinder.getElement("check-in-box__password-field_black-shadow").value = "";
                    }else{
                        // если регистрация НЕ прошла успешно
                        // очищаем элемент для вывода сообщений
                        message.clear();
                        // выводим на экран тектс, что регистрация не была пройдена
                        message.addText("Такой логин уже занят другим пользователем.");
                        message.addText("Придумайте, пожалуйста, другой логин.");
                    }
                }
            }
        }
    }
}