"use strict";

export default class ScreenManager {
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