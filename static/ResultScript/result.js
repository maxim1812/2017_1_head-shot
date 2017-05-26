/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 16);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";


// класс для управления авторизацией пользователя
class AuthorizationControl{
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
/* harmony export (immutable) */ __webpack_exports__["a"] = AuthorizationControl;


/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";


// класс для скрытия и показа боксов
class BoxRender{
    // создание полей класса
    constructor(){
        // поле - массив, хранящий имена боксов
        this.arr = [];
    }

    // добавление имени бокса в массив
    addBox(boxClass){
        // кладём имя класса бокса в конец массива
        this.arr.push(boxClass);
    }

    // возврат бокса с определённым классом
    getBox(boxClass){
        // получаем массив боксов с данным именем класса
        let elements = document.getElementsByClassName(boxClass);
        // получаем первый (нулевой) бокс с данным именем класса
        let box = elements[0];
        // возвращаем полученный бокс
        return box;
    }

    // спрятать все боксы
    hideAllBoxes(){
        // пробегаемся по всему массиву с именами боксов
        for(let i = 0; i < this.arr.length; i++){
            // получаем бокс под номером i
            let box = this.getBox(this.arr[i]);
            // прячем бокс
            box.hidden = true;
        }
    }

    // спрятать все боксы и показать только один из них
    showBox(boxClass) {
        // прячем все боксы
        this.hideAllBoxes();
        // получаем бокс под определённым именем
        let box = this.getBox(boxClass);
        // показываем полученный бокс
        box.hidden = false;
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = BoxRender;


/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";


// класс для управления отображением игрового поля
class CanvasManager{
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
/* harmony export (immutable) */ __webpack_exports__["a"] = CanvasManager;


/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";


// класс, отвечающий за регистрацию
class CheckIn{
    // конструктор
    // инициализация полей класса
    constructor(elementFinder,stringController,messageElement){
        // инициализируем поля класса вспомогательными объектами
        this.elementFinder = elementFinder;
        this.stringController = stringController;
        this.message = messageElement;
		
		this.parameterList = ["e-mail","логин","пароль"];
		this.HTMLFieldsList = ["e-mail","login","password"];
		this.requestHandler.bind(this);
    }

    // проверка на корректность логина и пароля
    controlLoginAndPasswordStringsInCheckInForm(){
        // получаем содержимое текстовых полей
        // содержимое строки - логина
		for(let i = 0; i<3; i++){
			//this.elementFinder.getElement(`check-in-box__${this.HTMLFieldsList[i]}-field_black-shadow`).removeClass('error');
		}
        const loginString = this.elementFinder.getElement("check-in-box__login-field_black-shadow").value;
        // содержимое строки - пароля
        const passwordString = this.elementFinder.getElement("check-in-box__password-field_black-shadow").value;
        // содержимое строки - email
        const emailString = this.elementFinder.getElement("check-in-box__email-field_black-shadow").value;
		
		// очищаем окно с сообщениями
        this.message.clear();
        // переменнаая - флаг, отвечающая за то, корректны ли обе строки логина и пароля
        let stringsOK = true;
        // проверка на корректность логина
		const emailResult = this.stringController.isNormalEmail(emailString);
		switch(emailResult){
            // если email - это пустая строка
            case "EMPTY":
                this.message.addText("Поле email пусто.");
                stringsOK = false;
                break;
            // если email некорректен
            case "NO_CORRECT":
                this.message.addText("Введенный email некорректен.");
                stringsOK = false;
                break;
        }
		 
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
		//return true;
    }

    // метод для попытки регистрации пользователя
    registrate(url){
        // проверяем на корректность логин и пароль
        const flag =  this.controlLoginAndPasswordStringsInCheckInForm();
        // если логин и пароль прошли проверку на корректность
        if(flag === true){
            // получаем логин, пароль и email
			const emailString =  this.elementFinder.getElement("check-in-box__email-field_black-shadow").value;
            // получаем логин
            const loginString = this.elementFinder.getElement("check-in-box__login-field_black-shadow").value;
            // получаем пароль
            const passwordString = this.elementFinder.getElement("check-in-box__password-field_black-shadow").value;
            // создаём JSON объект
            let myObjJSON = {
				email: emailString,
                username: loginString,
                password: passwordString
            };
			//Первобразуем в JSON строку с телом запроса
			let strJSON = JSON.stringify(myObjJSON); 
            // объект для вывода сообщений
            let message = this.message;
            // объект для поиска элемента
            let elementFinder = this.elementFinder;
            // отправка данных на сервер
            // создаём строку - запрос
            const query = url + "auth/regirstration";
            // создаём объект для отправки запроса
            let request = new XMLHttpRequest();
            request.open("POST",query);
            request.setRequestHeader("Content-Type","application/json;charset=UTF-8");

			request.send(strJSON);
			// при получении ответа с сервера
			//bind - привязывает данную функцию (обработчик) к зоне видимости данного класса
			
			request.onreadystatechange = (function() {
                let parameterList = ["e-mail", "логин", "пароль"];
                let HTMLFieldsList = ["e-mail", "login", "password"];
                if (request.readyState === 4) {					
					message.clear();
                    let answer = JSON.parse(request.responseText);
                    let keyCode = String(answer.key);

                    if (keyCode !== "777") {
                        for (let i = 0; i < 3; i++) {
                            switch (keyCode.charAt(i)) {
                                case '7':
                                    break;
                                case '1':
                                    message.addText(`Поле ${parameterList[i]} пусто!`);
                                    //this.elementFinder.getElement(`check-in-box__${this.HTMLFieldsList[i]}-field_black-shadow`).addClass('error');
                                    break;
                                case '2':
                                    message.addText(`Данный ${parameterList[i]} уже занят!`);
                                    //this.elementFinder.getElement(`check-in-box__${this.HTMLFieldsList[i]}-field_black-shadow`).addClass('error');
                                    break;
                                case '3':
                                    message.addText(`Поле ${parameterList[i]} содержит запретные символы!`);
                                    //this.elementFinder.getElement(`check-in-box__${this.HTMLFieldsList[i]}-field_black-shadow`).addClass('error');
                                    break;
                            }
                        }
                    }
                    else {
                        //пользователь успешно создан
                        for (let i = 0; i < 3; i++) {
                            //this.elementFinder.getElement(`check-in-box__${this.HTMLFieldsList[i]}-field_black-shadow`).value = "";
                            //elementFinder.getElement(`check-in-box__${this.HTMLFieldsList[i]}-field_black-shadow`).removeClass('error');
                        }
                        message.setText("Регистрация прошла успешно.");
                    }
                }
            });
        }
    }
	
	/*
	Формат ответа:
		"abc", где a - отвечает за логин, b - за емэйл, c - за пароль
	Коды ответа:	
		7 - все верно
		1 - поле пусто
		2 - ник/емэйл занят
		3 - некорректно
	*/	
	requestHandler(request){
		if(request.readyState === 4){
		    let answer = JSON.parse(request.responseText);
			let keyCode = String(answer.key);
			if (keyCode !== "777"){
				for(let i = 0; i<3; i++){
					switch (keyCode.charAt(i)){
						case '7':
							break;
						case '1':
							message.addText(`Поле ${this.parameterList[i]} пусто!`);
							//this.elementFinder.getElement(`check-in-box__${this.HTMLFieldsList[i]}-field_black-shadow`).addClass('error');
							break;
						case '2':
							message.addText(`Данный ${this.parameterList[i]} уже занят!`);
							//this.elementFinder.getElement(`check-in-box__${this.HTMLFieldsList[i]}-field_black-shadow`).addClass('error');
							break;
						case '3':
							message.addText(`Поле ${this.parameterList[i]} содержит запретные символы!`);
							//this.elementFinder.getElement(`check-in-box__${this.HTMLFieldsList[i]}-field_black-shadow`).addClass('error');
							break;									
					}
				}
			}
			else{
				//пользователь успешно создан
				for(let i = 0; i<3; i++){
					this.elementFinder.getElement(`check-in-box__${this.HTMLFieldsList[i]}-field_black-shadow`).value = "";
					//elementFinder.getElement(`check-in-box__${this.HTMLFieldsList[i]}-field_black-shadow`).removeClass('error');
				}
				message.setText("Регистрация прошла успешно.");
			}
		}
	}
}
/* harmony export (immutable) */ __webpack_exports__["a"] = CheckIn;


/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";


// класс для вывода сообщений на экран
class ContentManager{
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
/* harmony export (immutable) */ __webpack_exports__["a"] = ContentManager;


/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";


// класс, позволяющий получить элемент по имени его класса
class ElementFinder{
    // метод получает имя класса элемента и возвращает самый первый элемент с таким классом
    findElementByClassName(elementClass){
        // получаем массив элементов с данным именем класса
        let elementsArray = document.getElementsByClassName(elementClass);
        // возвращаем самый первый (нулевой) элемент данного массива
        return elementsArray[0];
    }
    // метод для возврата объекта - результата
    getElement(elementClass){
        // возвращаем искомой элемент
        return this.findElementByClassName(elementClass);
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = ElementFinder;



/***/ }),
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";


// класс для сохранения результатов игры в базу данных
class GameResultSaver{
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
/* harmony export (immutable) */ __webpack_exports__["a"] = GameResultSaver;



/***/ }),
/* 7 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";


// класс для управления игрой в одиночном режиме
class GameWithComputerManager{
    // конструктор класса
    // передаём в качестве параметров вспомогательные объекты
    constructor(canvasManager,elementFinder,contentManager, gameResultSaver, isAuthorized){
        this.isAuthorized = isAuthorized;
        this.gameResultSaver = gameResultSaver;
        this.elementFinder = elementFinder;
        this.canvasManager = canvasManager;
        this.contentManager = contentManager;
        this.canvasManager.clearField();
        this.canvasManager.renderMap();
        // переменная - флаг, отвечает за то, закончена ли игра
        this.gameNotStopped = true;
        // переменная для обращения к THIS в блоке holstObj.addEventListener
        let thisManager = this;
        // получаем объект - холст для рисования
        let holstObj = this.elementFinder.getElement("game-with-computer-box__holst-for-paint_cursor-pointer");
        // событие при щелчке по холсту
        holstObj.addEventListener("click",function(event){
            // если игра ещё не закончена
            if(thisManager.gameNotStopped === true) {
                // получаем координаты мыши относительно холста
                const xMouse = event.offsetX;
                const yMouse = event.offsetY;
                // получаем координаты клетки, по которой был осуществлён щелчок
                const xKv = Math.floor(xMouse / 160.0);
                const yKv = Math.floor(yMouse / 160.0);
                console.log(xKv + "  " + yKv);
                // переменная - флаг, отвечает за то, выиграл ли кто-нибудь
                let smbWins = false;
                // получаем номер нажатой клетки по её координатам
                let number = thisManager.getNumberOfKvByCoordinats(xKv, yKv);
                // если данная клетка пока пустая
                if (thisManager.canvasManager.getElementOfMap(number).type === "@") {
                    // записываем в клетку крестик
                    thisManager.canvasManager.setElementOfMap(number, "X");
                    // проверяем, выиграли ли крестики после хода
                    const winKrest = thisManager.isKrestWin();
                    // если крестики победили
                    if (winKrest === true){
                        // выводим содержимое поля игры
                        thisManager.canvasManager.renderMap();
                        // говорим, что игра закончена
                        thisManager.gameNotStopped = false;
                        // выводим результат игры на экран
                        thisManager.renderResult("Игра окончена. КРЕСТИКИ победили.");
                        // сохранение результата игры в БД
                        thisManager.gameResultSaver.saveWin(thisManager.isAuthorized.login);
                        // говорим, что кто-то победил
                        smbWins = true;
                    }else{
                        // если же крестики не победили
                        // ход делают нолики
                        thisManager.enemyMakeHodMove();
                        // выводим содержимое игрового поля
                        thisManager.canvasManager.renderMap();
                        // проверяем, выиграли ли нолики
                        const winZero = thisManager.isZeroWin();
                        // если нолики выиграли
                        if(winZero === true){
                            // говорим, что игра закончена
                            thisManager.gameNotStopped = false;
                            // выводим результат игры на экран
                            thisManager.renderResult("Игра окончена. НОЛИКИ победили.");
                            // сохранение результата игры в БД
                            thisManager.gameResultSaver.saveLose(thisManager.isAuthorized.login);
                            // говорим, что кто-то победил
                            smbWins = true;
                        }
                    }
                }
                // выводим содержимое игрового поля на экран
                thisManager.canvasManager.renderMap();
                // если никто пока не победил
                if(smbWins === false){
                    // если все клетки игрового поля заняты
                    if (thisManager.areAllBusy() === true) {
                        // говорим, что игра закончена
                        thisManager.gameNotStopped = false;
                        // выводим результат игры на экран
                        thisManager.renderResult("Игра окончена. НИЧЬЯ.");
                        // сохранение результата игры в БД
                        thisManager.gameResultSaver.saveNichia(thisManager.isAuthorized.login);
                    }
                }
            }
        });
    }

    // метод для проверки, все ли клетки игрового поля заняты
    areAllBusy(){
        // пробегаемся по всем клеткам игрового поля
        for(let i = 0; i < 9; i++){
            // получаем тип клетки под номером i
            const type = this.getType(i);
            // если данная клетка пустая (типу пустой клетки соответствует значение "@")
            if(type === "@"){
                // возвращаем результат, что НЕ все клетки заняты
                return false;
            }
        }
        // если до этого нас не выкинуло из цикла, это значит, что все клетки заняты
        // возвращаем результат проверки
        return true;
    }

    // метод для вывода результата игры на экран
    renderResult(text){
        // получаем объект, в который будем выводить результат
        let resultElement = this.elementFinder.getElement("game-with-computer-box__game-result_color-blue");
        // инициализируем объект, управляющий содержимым объекта для вывода результата
        this.contentManager.initElement(resultElement);
        // выводим результат
        this.contentManager.setText(text);
    }

    // метод для запуска новой игры
    startNewGame(){
        // очищаем игровое поле
        this.canvasManager.clearField();
        // выводим содержимое игрового поля на экран
        this.canvasManager.renderMap();
        // говорим, что игра НЕ закончена
        this.gameNotStopped = true;
        // очищаем объект для вывода результата игры
        this.renderResult("");
    }

    // метод, который реализует ход компьютера (компьютер играет за НОЛИКИ)
    enemyMakeHodMove(){
        // выполняем блок кода 15 раз
        for(let i = 0; i < 15; i++){
            // выбираем случайный номер клетки
            let randomNumber = parseInt(Math.random() * 9);
            // если клетка пустая
            if(this.canvasManager.getElementOfMap(randomNumber).type === "@"){
                // записываем в клетку нолик
                this.canvasManager.setElementOfMap(randomNumber,"0");
                // выходим из метода
                return;
            }
        }
        // если в предыдущем цикле мы не смогли взять подходящую клетку случайным образом
        // будем искать первую подходящую клетку последовательным перебором
        // пробегаемся по всем клеткам
        for(let i = 0; i < 9; i++){
            // если клетка под номером i пустая
            if(this.canvasManager.getElementOfMap(i).type === "@"){
                // записываем в неё нолик
                this.canvasManager.setElementOfMap(i,"0");
                // выходим из метода
                return;
            }
        }
    }

    // метод для получения типа клетки под номером NUMBER
    getType(number){
        // возвращаем тип клетки
        return this.canvasManager.getElementOfMap(number).type;
    }

    // метод для проверки, победи ли Крестики
    isKrestWin(){
        // задаём тип клетки - тип крестик
        let type = "X";
        return this.isManWin(type);
    }

    // метод для проверки, победили ли нолики
    isZeroWin(){
        // задаём тип клетки - тип нолик
        let type = "0";
        return this.isManWin(type);
    }

    isManWin(type){
        let situationWhenWinSmb = [];
        situationWhenWinSmb[0] = (this.getType(0) === type && this.getType(1) === type && this.getType(2) === type);
        situationWhenWinSmb[1] = (this.getType(3) === type && this.getType(4) === type && this.getType(5) === type);
        situationWhenWinSmb[2] = (this.getType(6) === type && this.getType(7) === type && this.getType(8) === type);
        situationWhenWinSmb[3] = (this.getType(0) === type && this.getType(4) === type && this.getType(8) === type);
        situationWhenWinSmb[4] = (this.getType(2) === type && this.getType(4) === type && this.getType(6) === type);
        situationWhenWinSmb[5] = (this.getType(0) === type && this.getType(3) === type && this.getType(6) === type);
        situationWhenWinSmb[6] = (this.getType(1) === type && this.getType(4) === type && this.getType(7) === type);
        situationWhenWinSmb[7] = (this.getType(2) === type && this.getType(5) === type && this.getType(8) === type);
        for(let i = 0; i < situationWhenWinSmb.length; i++){
            if(situationWhenWinSmb[i] === true){
                return true;
            }
        }
        return false;
    }

    // метод для получения номера клетки по её координатам
    getNumberOfKvByCoordinats(xKv,yKv){
        // создаём переменную для сохранения ответа
        let answerNumber = 0;
        // создаём строку и сохраняем в неё координаты клетки, которые разделены символом "_"
        const s = xKv + "_" + yKv;
        // в зависимости от значения данной строки получаем номер клетки - ответ
        switch(s){
            case "0_0":
                answerNumber = 0;
                break;
            case "1_0":
                answerNumber = 1;
                break;
            case "2_0":
                answerNumber = 2;
                break;
            case "0_1":
                answerNumber = 3;
                break;
            case "1_1":
                answerNumber = 4;
                break;
            case "2_1":
                answerNumber = 5;
                break;
            case "0_2":
                answerNumber = 6;
                break;
            case "1_2":
                answerNumber = 7;
                break;
            case "2_2":
                answerNumber = 8;
                break;
        }
        // возвращаем номер искомой клетки
        return answerNumber;
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = GameWithComputerManager;



/***/ }),
/* 8 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";


// класс для проверки возможности соединения с сервером
class HelloToServer{
    // конструктор
    // инициализация полей
    constructor(url){

    }
    // метод отправки запроса на сервер
    sendHello(){
        console.log("Old hello class =)");
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = HelloToServer;


/***/ }),
/* 9 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";


// класс роутер для эмуляции истории переходов
class Router{
    // конструктор класса
    // передаём в качестве параметров вспомогательные объекты
    constructor(textFieldCleaner,boxRender,messageBox,isAuthorized){
        // инициализируем поля класса
        this.textFieldCleaner = textFieldCleaner;
        this.boxRender = boxRender;
        this.messageBox = messageBox;
        this.isAuthorized = isAuthorized;
        // переменная, чтобы обращаться к THIS внутри блока window.addEventListener
        let routerThis = this;
        // добавляем событие при изменении адресной строки
        window.addEventListener("popstate", function(){
            // вызываем метод осуществления перехода между блоками
            routerThis.moveToPage();
        });
    }

    // осуществление перехода между боксами
    moveToPage(){
        // очищаем содержимое текстовых полей и бокса для вывода сообщений
        this.textFieldCleaner.clearAllTextFields();
        // очищаем окно для вывода сообщений
        this.messageBox.clear();
        // сохраняем содержимое адресной строки
        const pathname = window.location.pathname;
        // в зависимости от содержимого адресной строки показываем разные боксы
        switch(pathname){
            // для блока авторизации
            case "/avt":
                this.boxRender.showBox("authorization-box");
                break;
            // для блока регистрации
            case "/reg":
                this.boxRender.showBox("check-in-box");
                break;
            // для блока приветствия
            case "/":
                this.boxRender.showBox("welcome-box");
                break;
            // для блока приветствия
            case "":
                this.boxRender.showBox("welcome-box");
                break;
            // для блока своего профиля
            case "/profile":
                this.boxRender.showBox("my-profile-box");
                break;
            // для блока игры с компьютером (одиночной игры)
            case "/game_with_computer":
                this.boxRender.showBox("game-with-computer-box");
                break;
            // для блока просмотра своих результатов
            case "/my_results":
                this.boxRender.showBox("results-of-user-box");
                break;
            // для блока просмотра достижений самых успешных игроков
            case "/top_of_players":
                this.boxRender.showBox("best-users-results-box");
                break;
            // для блока многопользовательской игры
            case "/two_players_game":
                this.boxRender.showBox("two-players-game-box");
                break;
        }

        // создаём массив страниц, которые могут быть открыты, только если пользователь авторизован
        let arrOfPages = ["/profile","/game_with_computer","/my_results","/top_of_players","/two_players_game"];

        // если пользователь ещё не авторизован
        if(this.isAuthorized.flag === false){
            // сохраняем длину массива, хранящего страницы, которые могут быть открыты, только если пользователь авторизован
            let length = arrOfPages.length;
            // пробегаемся по данному массиву
            for(let i = 0; i < length; i++){
                // если адресная строка совпадает с содержимым ячейки массива
                if(window.location.pathname === arrOfPages[i]){
                    // это означает, что НЕавторизованный пользователь пытается попасть на страницу, которую можно посещать только будучи авторизованным
                    // перекидываем пользователя на страницу авторизации
                    this.setPathName("/avt");
                    return;
                }
            }
        }
    }

    // добавляем переход в историю и меняем бокс
    setPathName(pathname){
        // добавляем переход в историю
        history.pushState({}, "" ,pathname);
        // показываем определённый бокс
        this.moveToPage();
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Router;


/***/ }),
/* 10 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";


class ScreenManager {
    constructor(){
        let interval = 0;
        let thisManager = this;
        interval = setInterval(function(){
            const ww = window.innerWidth;
            const hh = window.innerHeight;
            console.log(ww + " " + hh);
            thisManager.changeStylesOfElements(ww,hh);
        }, 400);
    }

    getAllElementsOfClass(className){
        let elementsArray = document.getElementsByClassName(className);
        return elementsArray;
    }

    changeStylesOfElements(ww,hh){
       this.getAllElementsOfClass("main-box_center-position")[0].style.height = (hh - 100) + "px";
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = ScreenManager;


/***/ }),
/* 11 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";


// класс, который проверяет, может ли данная строка быть логином или паролем
class StringController{
    isNormalString(s){
        let allLength = s.length;
        if(allLength === 0){
            return "EMPTY";
        }
        let charArr = s.match(/[a-z]/g);
        let numberArr = s.match(/[0-9]/g);
        let charLen = 0;
        let numberLen = 0;
        if(charArr !== null){
            charLen = charArr.length;
        }
        if(numberArr !== null){
            numberLen = numberArr.length;
        }
        if(charLen + numberLen !== allLength){
            return "NO_CORRECT";
        }
        return "OK";
    }
	
	isNormalEmail(str){
        if(str.length === 0){
            return "EMPTY";
        }
		if (str.indexOf("@") === -1){
			return "NO_CORRECT";
		}
		return "OK";
	}
}
/* harmony export (immutable) */ __webpack_exports__["a"] = StringController;


/***/ }),
/* 12 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";


// класс для удаления содержимого всех текстовых полей ввода
class TextFieldsCleaner{
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
/* harmony export (immutable) */ __webpack_exports__["a"] = TextFieldsCleaner;


/***/ }),
/* 13 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";


// класс для получения информации о игроках с самыми лучшими результатами
class TopOfPlayersResultsGetter{
    // конструктор
    // инициализация полей класса
    constructor(url,contentManager){
        this.url = url;
        this.contentManager = contentManager;
        this.count = 3;
    }

    // метод для отправки запроса и получении информации о лучших игроках
    getInformationAboutBestUsers(){
        // переменная для доступа к THIS в блоке onreadystatechange
        let thisManager = this;
        // создание строки - запроса
        const query = this.url + "stats/" + this.count;
        // отпраляем запрос на сервер
        let request = new XMLHttpRequest();
        let url = query;
        request.open("GET",url, true);
        request.setRequestHeader("Content-Type","application/json;charset=UTF-8");
        request.send(null);
        let styleString = "<style>td{padding-top: 10px; padding-bottom: 10px; padding-left: 15px; padding-right: 15px;}</style> ";
        let answerTable = styleString + "<table border = '1px'>";
        answerTable += ("<tr> <td><b>Логин</b></td>  <td><b>Разность побед и поражений</b></td> </tr>");
        // при получении ответа с сервера
        request.onreadystatechange = function(){
            // если ответ нормальный
            if(request.readyState === 4 && request.status === 200){
                // сохраняем полученные данные в строку
                const answerContent = request.responseText;

                let obj = JSON.parse(answerContent);
                let arr = obj.userProfiles;
                let n = arr.length;
                for(let i = 0; i < n; i++){
                    let username = arr[i].username;
                    let email = arr[i].email;
                    let wins = arr[i].wins;
                    let losses = arr[i].losses;
                    let draws = arr[i].draws;
                    answerTable += ("<tr>");
                    answerTable += ("<td>" + username + "</td>");
                    //answerTable += ("<td>" + email + "</td>");
                    //answerTable += ("<td>" + wins + "</td>");
                    //answerTable += ("<td>" + losses + "</td>");
                    //answerTable += ("<td>" + draws + "</td>");
                    answerTable += ("<td>" + (parseInt(wins) - parseInt(losses)) + "</td>");
                    answerTable += ("</tr>");
                }
                answerTable += "</table>";
                // вызываем метод вывода данных на экран
                thisManager.printInformationAboutBestUsers(answerTable);
            }
        }
    }

    // метод вывода данных на экран
    printInformationAboutBestUsers(contentText){
        // очищаем блок для вывода данных
        this.contentManager.clear();
        // записываем в блок для вывода данных информацию о лучших игроках
        this.contentManager.setText(contentText);
    }

    // метод для получения информации о лучших игроках и её вывод на экран
    getInfoAboutBestUsersAndRenderIt(){
        this.getInformationAboutBestUsers();
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = TopOfPlayersResultsGetter;



/***/ }),
/* 14 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";


// класс для реализация многопользовательской игры
class TwoPlayersGameManager{
    constructor(url,isAuthorized, message, twoPlayersCanvasManager, elementFinder, gameResultSaver){
        let thisManager = this;
        this.elementFinder = elementFinder;
        this.url = url;
        this.isAuthorized = isAuthorized;
        this.message = message;
        this.twoPlayersCanvasManager = twoPlayersCanvasManager;

        this.gameResultSaver = gameResultSaver;
        this.resultOfGame = "";

        this.message.setText("Ожидание соперника ... ");

        this.twoPlayersCanvasManager.clearField();
        this.twoPlayersCanvasManager.renderMap();

        this.socket = new WebSocket(this.url);
        let socket = this.socket;

        this.loginFirst = "";
        this.loginSecond = "";
        this.field = "";
        this.whoIAm = -1;
        let gotFirstMessage = false;

        let holst = this.elementFinder.getElement("two-players-game-box__holst-for-paint_cursor-pointer");
        holst.addEventListener("click", function(){
            if(gotFirstMessage === true && thisManager.whoIAm === thisManager.whoseTurnNow()){
                const xMouse = event.offsetX;
                const yMouse = event.offsetY;
                // получаем координаты клетки, по которой был осуществлён щелчок
                const xKv = Math.floor(xMouse / 160.0);
                const yKv = Math.floor(yMouse / 160.0);
                console.log(xKv + "  " + yKv);
                let number = thisManager.getNumberOfKvByCoordinats(xKv, yKv);
                if (thisManager.twoPlayersCanvasManager.getElementOfMap(number).type === "@") {
                    if(thisManager.whoIAm === 1){
                        thisManager.twoPlayersCanvasManager.setElementOfMap(number,"X");
                    } else {
                        thisManager.twoPlayersCanvasManager.setElementOfMap(number,"0");
                    }
                    thisManager.twoPlayersCanvasManager.renderMap();
                    let myObjContent = {
                        loginFirst: thisManager.loginFirst,
                        loginSecond: thisManager.loginSecond,
                        field: thisManager.twoPlayersCanvasManager.getStringContentOfMap()
                    };
                    let myObj = {
                        type: 2,
                        content: myObjContent
                    };
                    let query = JSON.stringify(myObj);
                    socket.send(query);
                    console.log("Query:  " + query);
                    console.log("Send it");
                }
            }
        });

        this.interval = "";
        this.interval = setInterval(function(){
            let myObj = {
                type: 999
            };
            let query = JSON.stringify(myObj);
            socket.send(query);
            console.log("We sent 999 to Magamed");
        }, 3000);

        socket.onopen = function() {
            console.log("Соединение установлено");
            let myLogin = thisManager.isAuthorized.login;
            let myObj = {
                type: 1,
                content: myLogin
            };
            let query = JSON.stringify(myObj);
            socket.send(query);
        };

        socket.onclose = function(event) {
            console.log('Соединение закрыто');
            clearInterval(thisManager.interval);
            console.log("Result: " + thisManager.resultOfGame);
            if(thisManager.resultOfGame === "WIN"){
                thisManager.gameResultSaver.saveWin(thisManager.isAuthorized.login);
            }
            if(thisManager.resultOfGame === "LOSE"){
                thisManager.gameResultSaver.saveLose(thisManager.isAuthorized.login);
            }
            if(thisManager.resultOfGame === "NICH"){
                thisManager.gameResultSaver.saveNichia(thisManager.isAuthorized.login);
            }
            //thisManager.socket.close();
        };

        socket.onmessage = function(event) {
            if(gotFirstMessage === false) {
                console.log("Получены самое первое сообщение " + event.data);
                gotFirstMessage = true;
                let answer = decodeURIComponent(event.data);
                let myJSON = JSON.parse(answer);
                thisManager.loginFirst = myJSON.loginFirst;
                thisManager.loginSecond = myJSON.loginSecond;
                thisManager.field = myJSON.field;
                if(thisManager.isAuthorized.login === thisManager.loginFirst){
                    thisManager.whoIAm = 1;
                }else{
                    thisManager.whoIAm = 2;
                }
                let messageString = "Игрок " + thisManager.loginFirst + " против игрока " + thisManager.loginSecond + "<br>";
                console.log(thisManager.loginFirst);
                console.log(thisManager.loginSecond);
                console.log(thisManager.field);
                if(thisManager.whoIAm === 1)
                {
                    messageString += "Вы играете за Крестики";
                }else{
                    messageString += "Вы играете за Нолики";
                }
                thisManager.message.setText(messageString);
            } else {
                console.log("Получены сообщение " + event.data);
                let myObj = JSON.parse(event.data);
                let field = myObj.field;

                if(field !== "KREST" && field !== "ZERO" && field !== "NICH") {
                    thisManager.twoPlayersCanvasManager.setStringContentOfMap(field);
                    thisManager.twoPlayersCanvasManager.renderMap();

                    const krestWin = thisManager.isKrestWin();
                    const zeroWin = thisManager.isZeroWin();

                    if (krestWin === true) {
                        thisManager.message.setText("Игра окончена. Победили Крестики.");
                        thisManager.sendGameEnd("KREST");
                        if(thisManager.whoIAm === 1){
                            thisManager.resultOfGame = "WIN";
                        }
                        if(thisManager.whoIAm === 2){
                            thisManager.resultOfGame = "LOSE";
                        }
                        thisManager.socket.close();
                        return;
                    }
                    else if (zeroWin === true) {
                        thisManager.message.setText("Игра окончена. Победили Нолики.");
                        thisManager.sendGameEnd("ZERO");
                        if(thisManager.whoIAm === 1){
                            thisManager.resultOfGame = "LOSE";
                        }
                        if(thisManager.whoIAm === 2){
                            thisManager.resultOfGame = "WIN";
                        }
                        thisManager.socket.close();
                        return;
                    } else if (thisManager.areAllBusy() === true) {
                        thisManager.message.setText("Игра окончена. Ничья.");
                        thisManager.sendGameEnd("NICH");
                        thisManager.resultOfGame = "NICH";
                        thisManager.socket.close();
                        return;
                    }
                }else{
                    if(field === "KREST"){
                        thisManager.message.setText("Игра окончена. Победили Крестики.");
                        clearInterval(thisManager.interval);
                        if(thisManager.whoIAm === 1){
                            thisManager.resultOfGame = "WIN";
                        }
                        if(thisManager.whoIAm === 2){
                            thisManager.resultOfGame = "LOSE";
                        }
                        thisManager.socket.close();
                    }

                    if(field === "ZERO"){
                        thisManager.message.setText("Игра окончена. Победили Нолики.");
                        clearInterval(thisManager.interval);
                        if(thisManager.whoIAm === 1){
                            thisManager.resultOfGame = "LOSE";
                        }
                        if(thisManager.whoIAm === 2){
                            thisManager.resultOfGame = "WIN";
                        }
                        thisManager.socket.close();
                    }

                    if(field === "NICH"){
                        thisManager.message.setText("Игра окончена. Ничья.");
                        clearInterval(thisManager.interval);
                        thisManager.resultOfGame = "NICH";
                        thisManager.socket.close();
                    }
                }
            }
        };

        socket.onerror = function(error) {
            console.log("Ошибка");
            clearInterval(thisManager.interval);
            thisManager.socket.close();
        };
    }

    sendGameEnd(param){
        let thisManager = this;
        let myObjContent = {
            loginFirst: thisManager.loginFirst,
            loginSecond: thisManager.loginSecond,
            field: param
        };
        let myObj = {
            type: 2,
            content: myObjContent
        };
        let query = JSON.stringify(myObj);
        thisManager.socket.send(query);
        console.log("Query:  " + query);
        console.log("Send it");
    }



    whoseTurnNow(){
        let field = this.twoPlayersCanvasManager.getStringContentOfMap();
        let number = 0;
        for(let i = 0; i < field.length; i++){
            if(field.charAt(i) === "@"){
                number++;
            }
        }
        if(number % 2 === 0){
            return 2;
        }
        return 1;
    }


    // метод для получения номера клетки по её координатам
    getNumberOfKvByCoordinats(xKv,yKv){
        // создаём переменную для сохранения ответа
        let answerNumber = 0;
        // создаём строку и сохраняем в неё координаты клетки, которые разделены символом "_"
        const s = xKv + "_" + yKv;
        // в зависимости от значения данной строки получаем номер клетки - ответ
        switch(s){
            case "0_0":
                answerNumber = 0;
                break;
            case "1_0":
                answerNumber = 1;
                break;
            case "2_0":
                answerNumber = 2;
                break;
            case "0_1":
                answerNumber = 3;
                break;
            case "1_1":
                answerNumber = 4;
                break;
            case "2_1":
                answerNumber = 5;
                break;
            case "0_2":
                answerNumber = 6;
                break;
            case "1_2":
                answerNumber = 7;
                break;
            case "2_2":
                answerNumber = 8;
                break;
        }
        // возвращаем номер искомой клетки
        return answerNumber;
    }

    // метод для получения типа клетки под номером NUMBER
    getType(number){
        // возвращаем тип клетки
        return this.twoPlayersCanvasManager.getElementOfMap(number).type;
    }


    // метод для проверки, победи ли Крестики
    isKrestWin(){
        // задаём тип клетки - тип крестик
        let type = "X";
        return this.isManWin(type);
    }

    // метод для проверки, победили ли нолики
    isZeroWin(){
        // задаём тип клетки - тип нолик
        let type = "0";
        return this.isManWin(type);
    }

    isManWin(type){
        let situationWhenWinSmb = [];
        situationWhenWinSmb[0] = (this.getType(0) === type && this.getType(1) === type && this.getType(2) === type);
        situationWhenWinSmb[1] = (this.getType(3) === type && this.getType(4) === type && this.getType(5) === type);
        situationWhenWinSmb[2] = (this.getType(6) === type && this.getType(7) === type && this.getType(8) === type);
        situationWhenWinSmb[3] = (this.getType(0) === type && this.getType(4) === type && this.getType(8) === type);
        situationWhenWinSmb[4] = (this.getType(2) === type && this.getType(4) === type && this.getType(6) === type);
        situationWhenWinSmb[5] = (this.getType(0) === type && this.getType(3) === type && this.getType(6) === type);
        situationWhenWinSmb[6] = (this.getType(1) === type && this.getType(4) === type && this.getType(7) === type);
        situationWhenWinSmb[7] = (this.getType(2) === type && this.getType(5) === type && this.getType(8) === type);
        for(let i = 0; i < situationWhenWinSmb.length; i++){
            if(situationWhenWinSmb[i] === true){
                return true;
            }
        }
        return false;
    }

    // метод для проверки, все ли клетки игрового поля заняты
    areAllBusy(){
        // пробегаемся по всем клеткам игрового поля
        for(let i = 0; i < 9; i++){
            // получаем тип клетки под номером i
            const type = this.getType(i);
            // если данная клетка пустая (типу пустой клетки соответствует значение "@")
            if(type === "@"){
                // возвращаем результат, что НЕ все клетки заняты
                return false;
            }
        }
        // если до этого нас не выкинуло из цикла, это значит, что все клетки заняты
        // возвращаем результат проверки
        return true;
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = TwoPlayersGameManager;


/***/ }),
/* 15 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";


// класс для получения информации о пользователе (кол-во побед, поражений, ничьих)
class UserResultsGetter{
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
/* harmony export (immutable) */ __webpack_exports__["a"] = UserResultsGetter;



/***/ }),
/* 16 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__BoxRender_js__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__ElementFinder_js__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ContentManager_js__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__StringController_js__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__AuthorizationControl_js__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__CheckIn_js__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__TextFieldsCleaner_js__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__Router_js__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__CanvasManager_js__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__GameWithComputerManager_js__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__GameResultSaver_js__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__UserResultsGetter_js__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__HelloToServer_js__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__TopOfPlayersResultsGetter_js__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__TwoPlayersGameManager_js__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15__ScreenManager_js__ = __webpack_require__(10);


// подключем вспомогательные модули


















// класс для управления взаимодействием между модулями
class Mediator{
    // конструктор
    // инициализация полей класса
    constructor(){
        // строка для хранения адреса сервера (для авторизации и регистрации)
        // this.url = "http://localhost/MaximGameScripts/";
        // this.url = "http://prokm.ru/MaximGameScripts/";
		this.url = "http://dnoteam.herokuapp.com/api/DB/";

		
        // строка для хранения адреса сервера для организации многопользовательской игры
        // this.socketUrl = "http://localhost:4000/";
        this.socketUrl = "ws://dnoteam.herokuapp.com/game";

        // объект, отвечающий за то, авторизован ли пользователь
        this.isAuthorized = {
            flag: false,
            login: ""
        };
        // создание полей класса
        this.gameResultSaver = new __WEBPACK_IMPORTED_MODULE_10__GameResultSaver_js__["a" /* default */](this.url);
        this.boxRender = new __WEBPACK_IMPORTED_MODULE_0__BoxRender_js__["a" /* default */]();
        this.elementFinder = new __WEBPACK_IMPORTED_MODULE_1__ElementFinder_js__["a" /* default */]();
        this.message = new __WEBPACK_IMPORTED_MODULE_2__ContentManager_js__["a" /* default */]();
        this.stringController = new __WEBPACK_IMPORTED_MODULE_3__StringController_js__["a" /* default */]();
        this.authorizationControl = new __WEBPACK_IMPORTED_MODULE_4__AuthorizationControl_js__["a" /* default */](this.elementFinder,this.stringController,this.message,this.boxRender);
        this.checkIn = new __WEBPACK_IMPORTED_MODULE_5__CheckIn_js__["a" /* default */](this.elementFinder,this.stringController,this.message);
        this.textFieldsCleaner = new __WEBPACK_IMPORTED_MODULE_6__TextFieldsCleaner_js__["a" /* default */](this.elementFinder);
        this.router = new __WEBPACK_IMPORTED_MODULE_7__Router_js__["a" /* default */](this.textFieldsCleaner,this.boxRender,this.message,this.isAuthorized);
        this.twoPlayersCanvasManager = new __WEBPACK_IMPORTED_MODULE_8__CanvasManager_js__["a" /* default */](this.elementFinder,"two-players-game-box__holst-for-paint_cursor-pointer");
        this.canvasManager = new __WEBPACK_IMPORTED_MODULE_8__CanvasManager_js__["a" /* default */](this.elementFinder,"game-with-computer-box__holst-for-paint_cursor-pointer");
        this.gameWithComputerManager = new __WEBPACK_IMPORTED_MODULE_9__GameWithComputerManager_js__["a" /* default */](this.canvasManager,this.elementFinder, new __WEBPACK_IMPORTED_MODULE_2__ContentManager_js__["a" /* default */](), this.gameResultSaver, this.isAuthorized);

        let userResultsList = new __WEBPACK_IMPORTED_MODULE_2__ContentManager_js__["a" /* default */]();
        userResultsList.initElement(this.elementFinder.getElement("results-of-user-box__list-of-user-results_color-blue"));
        this.userResultsGetter = new __WEBPACK_IMPORTED_MODULE_11__UserResultsGetter_js__["a" /* default */](userResultsList, this.url);

        let bestUsersResultList = new __WEBPACK_IMPORTED_MODULE_2__ContentManager_js__["a" /* default */]();
        bestUsersResultList.initElement(this.elementFinder.getElement("best-users-results-box__results-list"));
        this.TopOfPlayersResultsGetter = new __WEBPACK_IMPORTED_MODULE_13__TopOfPlayersResultsGetter_js__["a" /* default */](this.url, bestUsersResultList);

        this.twoPlayersMessage = new __WEBPACK_IMPORTED_MODULE_2__ContentManager_js__["a" /* default */]();
        this.twoPlayersMessage.initElement(this.elementFinder.getElement("two-players-game-box__message-text_color-blue"));
    }

    // отправка проверочного запроса
    sendHelloToServer(){
        this.helloToServer = new __WEBPACK_IMPORTED_MODULE_12__HelloToServer_js__["a" /* default */](this.url);
        this.helloToServer.sendHello();
    }

    // метод для добавление тектовых полей в объект, отвечающий за их очистку
    addAllTextFields(){
        this.textFieldsCleaner.addTextField("authorization-box__login-field_black-shadow");
        this.textFieldsCleaner.addTextField("authorization-box__password-field_black-shadow");
        this.textFieldsCleaner.addTextField("check-in-box__login-field_black-shadow");
        this.textFieldsCleaner.addTextField("check-in-box__password-field_black-shadow");
    }

    // метод для запуска игры против компьютера
    startOnePlayerGame(){
        this.gameWithComputerManager.startNewGame();
    }

    // метод для вывода на экран содержимого игрового поля
    renderCanvasHolst(){
        this.canvasManager.renderMap();
    }

    // метод для добавления всех страниц - боксов в объект, отвечающий за их скрытие и показ
    addAllBoxes(){
        this.boxRender.addBox("welcome-box");
        this.boxRender.addBox("authorization-box");
        this.boxRender.addBox("check-in-box");
        this.boxRender.addBox("my-profile-box");
        this.boxRender.addBox("game-with-computer-box");
        this.boxRender.addBox("results-of-user-box");
        this.boxRender.addBox("best-users-results-box");
        this.boxRender.addBox("two-players-game-box");
    }

    // определение страницы (бокса), на котором сейчас находится пользователь
    definePage(){
        this.router.moveToPage();
    }

    // замена содержимого адресной строки и переход на соответствующий бокс
    changePathName(pathname){
        this.router.setPathName(pathname);
    }

    // инициализация бокса, отвечающего за вывод сообщений на экран
    initMessageTextRender(){
        this.message.initElement(this.elementFinder.getElement("message-box__text-of-message_blue"));
        this.message.clear();
    }

    // показать бокс с определённым классом
    showBoxElement(boxClass){
        this.boxRender.showBox(boxClass);
    }

    // метод авторизации пользователя
    authorizeUser(){
        this.authorizationControl.authorize(this.url,this.router,this.isAuthorized);
    }

    // метод регистрации пользователя
    checkInUser(){
        this.checkIn.registrate(this.url);
    }

    // метод для добавления событий к кнопкам
    addListenersToButtons() {
        let mediatorThis = this;

        let avtBtn = this.elementFinder.getElement("welcome-box__sign-in-button_DeepSkyBlue-color");
        avtBtn.addEventListener("click", function() {
            mediatorThis.changePathName("/avt");
        });

        let regBtn = this.elementFinder.getElement("welcome-box__check-in-box-button_DeepSkyBlue-color");
        regBtn.addEventListener("click", function() {
            mediatorThis.changePathName("/reg");
        });

        let avtBackBtn = this.elementFinder.getElement("authorization-box__back-button_DeepSkyBlue-color");
        avtBackBtn.addEventListener("click", function() {
            mediatorThis.changePathName("/");
        });

        let regBackBtn = this.elementFinder.getElement("check-in-box__back-button_DeepSkyBlue-color");
        regBackBtn.addEventListener("click", function() {
            mediatorThis.changePathName("/");
        });

        let avtUserBtn = this.elementFinder.getElement("authorization-box__sign-in-button_DeepSkyBlue-color");
        avtUserBtn.addEventListener("click", function() {
            mediatorThis.authorizeUser();
        });

        let checkInUserBtn = this.elementFinder.getElement("check-in-box__registration-button_DeepSkyBlue-color");
        checkInUserBtn.addEventListener("click", function() {
            mediatorThis.checkInUser();
        });

        let exitFromProfileBtn = this.elementFinder.getElement("my-profile-box__exit-button_DeepSkyBlue-color");
        exitFromProfileBtn.addEventListener("click", function() {
            const query = mediatorThis.url + "auth/signOut";
            // создаём объект для отправки запроса
            let request = new XMLHttpRequest();
            request.open("GET",query);
            request.setRequestHeader("Content-Type","application/json;charset=UTF-8");
            request.send(null);

            mediatorThis.isAuthorized.flag = false;
            mediatorThis.isAuthorized.login = "";
            mediatorThis.changePathName("/");
        });

        let gameWithComputerBtn = this.elementFinder.getElement("my-profile-box__play-with-computer-button_DeepSkyBlue-color");
        gameWithComputerBtn.addEventListener("click", function() {
            mediatorThis.changePathName("/game_with_computer");
            mediatorThis.startOnePlayerGame();
        });

        let myResultsBtn = this.elementFinder.getElement("my-profile-box__my-results-button_DeepSkyBlue-color");
        myResultsBtn.addEventListener("click", function() {
            mediatorThis.changePathName("/my_results");
            mediatorThis.userResultsGetter.writeResultsOfUser(mediatorThis.isAuthorized.login);
        });

        let goToMainMenuBtn = this.elementFinder.getElement("results-of-user-box__go-to-main-menu-button_DeepSkyBlue-color");
        goToMainMenuBtn.addEventListener("click",function(){
            mediatorThis.changePathName("/profile");
        });

        let showResultsOfBestPlayersBtn = this.elementFinder.getElement("my-profile-box__best-players-button_DeepSkyBlue-color");
        showResultsOfBestPlayersBtn.addEventListener("click",function(){
            mediatorThis.changePathName("/top_of_players");
            mediatorThis.TopOfPlayersResultsGetter.getInfoAboutBestUsersAndRenderIt();
        });

        let moveToMainMenuBtn = this.elementFinder.getElement("best-users-results-box__go-to-main-menu-button_DeepSkyBlue-color");
        moveToMainMenuBtn.addEventListener("click",function(){
            mediatorThis.changePathName("/profile");
        });

        let gameWithAnotherPlayerBtn = this.elementFinder.getElement("my-profile-box__play-with-user-button_DeepSkyBlue-color");
        gameWithAnotherPlayerBtn.addEventListener("click",function(){
            mediatorThis.changePathName("/two_players_game");
            mediatorThis.twoPlayersGameManager = new __WEBPACK_IMPORTED_MODULE_14__TwoPlayersGameManager_js__["a" /* default */](mediatorThis.socketUrl,mediatorThis.isAuthorized, mediatorThis.twoPlayersMessage, mediatorThis.twoPlayersCanvasManager, mediatorThis.elementFinder, mediatorThis.gameResultSaver);
        });
    }
}

// создание экземпляра класса медиатор
let mediator = new Mediator();

// при загрузке страницы
window.addEventListener("load", function(){
    mediator.addAllBoxes();
    mediator.addAllTextFields();
    mediator.addListenersToButtons();
    mediator.initMessageTextRender();
    mediator.definePage();
    mediator.renderCanvasHolst();
    mediator.sendHelloToServer();

    let screenManager = new __WEBPACK_IMPORTED_MODULE_15__ScreenManager_js__["a" /* default */]();
});


/***/ })
/******/ ]);