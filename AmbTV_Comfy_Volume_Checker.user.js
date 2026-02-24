// ==UserScript==
// @name        AmbTV Comfy Volume Checker
// @namespace        http://tampermonkey.net/
// @version        0.1
// @description        AbemaTV TEST ユーティリティ
// @author        AbemaTV User
// @match        https://abema.tv/*
// @icon        https://www.google.com/s2/favicons?sz=64&domain=abema.tv
// @grant        none
// @updateURL        https://github.com/personwritep/AmbTV_Comfy/raw/main/AmbTV_Comfy_Volume_Checker.user.js
// @downloadURL        https://github.com/personwritep/AmbTV_Comfy/raw/main/AmbTV_Comfy_Volume_Checker.user.js
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
            clearInterval(interval0);
            clear_disp(); }
        let player=document.querySelector('.c-vod-EpisodePlayerContainer-wrapper'); // player
        if(!player){
            player=document.querySelector('.c-tv-TimeshiftPlayerContainerView'); } // slots playrer
        if(player){
            clearInterval(interval0);
             setTimeout(()=>{
            check_player();
             }, 600); }}



    function check_player(){
        clear_disp();

        let logo=document.querySelector('.com-application-Header__logo');
        let video=document.querySelector('.com-a-Video__video-element');
        if(logo && video){
            let vol=video.volume;
            let v_show=
                '<div class="v_show">'+ vol +
                '<style>.v_show { position: absolute; top: 20px; left: 200px; padding: 2px 6px 0px; '+
                'font: bold 16px Meiryo; color: #fff; border: 1px solid #fff; } </style></div>';
            logo.insertAdjacentHTML('beforeend', v_show);

            if(vol!='0.5'){
                alert("🔴🔴 ボリューム値は 0.5 以外です 🔴🔴"); }}
       else{
           clear_disp(); }

    } // check_player()



    function clear_disp(){
            if(document.querySelector('.v_show')){
            document.querySelector('.v_show').remove(); }}

} // player_env
