"use strict";

// класс для управления авторизацией пользователя
export default class AuthorizationControl{
    // конструктор
    // инициализация полей класса
    constructor(elementFinder,stringController,messageElement,boxRender){
        // инициализируем поля класса вспомогательными объектами
        this.elementFinder = elementFinder;
        this.stringController = stringController;
        this.message = messageElement;
        this.boxRender = boxRender;
		
		//this.parameterList = ["e-mail","пароль"];
		//this.HTMLFieldsList = ["e-mail","password"];
    }

    // метод для проверки корректности логина и пароля
    controlLoginAndPasswordStringsInAuthorizationForm(){
		for(let i = 0; i<2; i++){
							//elementFinder.getElement(`check-in-box__${this.HTMLFieldsList[i]}-field_black-shadow`).removeClass('error');
						}
        // получаем содержимое логина и пароля
        // получаем логин
        const loginString = this.elementFinder.getElement("authorization-box__login-field_black-shadow").value;
        // получаем пароль
        const passwordString = this.elementFinder.getElement("authorization-box__password-field_black-shadow").value;
        // очищаем элемент для вывода сообщений
        this.message.clear();
        // переменная - флаг, для контроля, обе ли строки логина и пароля корректны
        let stringsOK = true;
        // проверка логина на корректность
        //const loginResult = this.stringController.isNormalString(loginString);
		let loginResult =  true;
		
		if (loginString ==='') {
			loginResult = "EMPTY";
		}
		else {
			loginResult =  true;
		}
        switch(loginResult){
            // если логин - пустая строка
            case "EMPTY":
                this.message.addText("Поле ввода e-mail пусто.");
                stringsOK = false;
                break;
            // если логин содержит некорректные символы
            case "NO_CORRECT":
                this.message.addText("Поле ввода e-mail содержит запретные символы.");
                stringsOK = false;
                break;
        }
        // проверка пароля на корректность
        const passwordResult = this.stringController.isNormalString(passwordString);
        // если пароль - пустая строка
        switch(passwordResult){
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
        // возврат результата проверки
        return stringsOK;
    }

    // метод для попытки авторизации пользователя
    authorize(url,router,isAuthorized){
        // проверяем, корректны ли логин и пароль
        const flag = this.controlLoginAndPasswordStringsInAuthorizationForm();
        // если логин и пароль прошли проверку на корректность
        if(flag === true){
            // получаем логин и пароль
            // получаем логин
            const emailString = this.elementFinder.getElement("authorization-box__login-field_black-shadow").value;
            // получаем пароль
            const passwordString = this.elementFinder.getElement("authorization-box__password-field_black-shadow").value;
            // создаём JSON объект
            let myObjJSON = {
                email: emailString,
                password: passwordString
            };
			//Первобразуем в JSON строку с телом запроса
			let strJSON = JSON.stringify(myObjJSON); 
            // объект для вывода сообщений
            let message = this.message;
            // объект для поиска элемента
            let elementFinder = this.elementFinder;
            // объект для отображения бокса
            let boxRender = this.boxRender;
            // отправка данных на сервер
            // создаём строку - запрос
            const query = url + "auth/login";
            // создаём объект для отправки запроса
            let request = new XMLHttpRequest();
            request.open("POST",query);
            request.setRequestHeader("Content-Type","application/json;charset=UTF-8");
            request.send(strJSON);
            // при получении ответа с сервера
            request.onreadystatechange = function(){
                // если ответ нормальный
                if(request.readyState === 4 ){
                    message.clear();
					let parameterList = ["e-mail","пароль"];
					let HTMLFieldsList = ["e-mail","password"];

				let JSONAnswer = JSON.parse(request.responseText);
				let keyCode = String(JSONAnswer.key);

				if (keyCode === "2" || keyCode === "1"){
					// ошибка авторизации, неверный логин
					message.setText("Пользователя с таким e-mail-ом <br>не существует или был введен <br>некорректный пароль!");
				}
				else{
					if (keyCode !== "777"){
						for(let i = 0; i<2; i++){
							switch (keyCode.charAt(i)){
								case '7':
									break;
								case '1':
									message.addText(`Поле ${parameterList[i]} пусто!`);
									//this.elementFinder.getElement(`check-in-box__${this.HTMLFieldsList[i]}-field_black-shadow`).addClass('error');
									break;
								case '3':
									message.addText(`Поле ${parameterList[i]} содержит запретные символы!`);
									//this.elementFinder.getElement(`check-in-box__${this.HTMLFieldsList[i]}-field_black-shadow`).addClass('error');
									break;									
							}
						}
					}
					else{
							//пользователь успешно создан
							
							// авторизация прошла успешно
								// меняем содержимое полей объекта, отвечающего за авторизованность пользователя
								isAuthorized.flag = true;
								let userName = JSONAnswer.userProfile.username;
								isAuthorized.login = userName;
								// выводим содержимое логина на странице профиля
								elementFinder.getElement("my-profile-box__user-login_big-text").innerHTML = "Логин: " + isAuthorized.login;
								// переходим на страницу профиля
								router.setPathName("/profile");
								message.clear();
						}
					}
				}
			}
		}
	}
}