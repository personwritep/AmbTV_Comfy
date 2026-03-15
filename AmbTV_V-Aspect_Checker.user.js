// ==UserScript==
// @name        AmbTV V-Aspect Checker
// @namespace        http://tampermonkey.net/
// @version        0.1
// @description        AbemaTV ユーティリティ
// @author        AbemaTV User
// @match        https://abema.tv/*
// @icon        https://www.google.com/s2/favicons?sz=64&domain=abema.tv
// @grant        none
// @updateURL        https://github.com/personwritep/AmbTV_Comfy/raw/main/AmbTV_V-Aspect_Checker.user.js
// @downloadURL        https://github.com/personwritep/AmbTV_Comfy/raw/main/AmbTV_V-Aspect_Checker.user.js
// ==/UserScript==



let target=document.querySelector('head > title');
let monitor=new MutationObserver(player_env);
monitor.observe(target, { childList: true });


function player_env(){

    let retry0=0;
    let interval0=setInterval(wait_target0, 20);
    function wait_target0(){
        retry0++;
        if(retry0>100){ // リトライ制限 100回 2secまで
            clearInterval(interval0); }
        let player=document.querySelector('video'); // player
        if(player){
            clearInterval(interval0);
            set_player(player); }}



    function set_player(video){
        clear_data();

        setTimeout(()=>{
            let width=video.videoWidth;
            let height=video.videoHeight;
            let aspect=width/height;
            show_data(aspect);
        }, 1000);
    } //set_player(player)


    function show_data(data){
        let disp_data=
            '<dialog class="disp_data">'+ data +
            '<style>.disp_data { position: fixed; top: 21px; left: 200px; z-index: 20; '+
            'padding: 2px 6px 0; outline: none; border: 1px solid #000; border-radius: 2px; '+
            'background: #fff; } '+
            '</style></dialog>';

        if(!document.querySelector('.disp_data')){
            document.body.insertAdjacentHTML('beforeend', disp_data); }

        let disp=document.querySelector('.disp_data');
        if(disp){
            disp.show(); }

    } // show_data(data)


    function clear_data(){
        let disp=document.querySelector('.disp_data');
        if(disp){
            disp.remove(); }}

} // player_env()
