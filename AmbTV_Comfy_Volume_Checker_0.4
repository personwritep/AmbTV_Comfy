// ==UserScript==
// @name        AmbTV Comfy Volume Checker
// @namespace        http://tampermonkey.net/
// @version        0.4
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
        let video=document.querySelector('.com-a-Video__video-element'); // video
        if(video){
            clearInterval(interval0);
            setTimeout(()=>{
                check_player(video);
            }, 600); }}



    function check_player(video){
        let vol=video.volume;
        let MVolume=Math.round(vol*10)/10

        if(MVolume!='0.8'){
            vol_disp(1, MVolume); }
        else{
            vol_disp(0, MVolume); }


        video.addEventListener('volumechange', ()=>{
            setTimeout(()=>{
                let current_vol=Math.round(video.volume*10)/10;

                if(current_vol!='0.8'){
                    vol_disp(1, current_vol); }
                else{
                    vol_disp(0, current_vol); }
            }, 200); });

    } // check_player()



    function vol_disp(n, vol){
        clear_disp();

        let show;
        if(n==0){
            show='<dialog class="s_vol">'+ vol; }
        else if(n==1){
            show='<dialog class="s_vol">'+ vol +'　🟥🟥 標準値以外です 🟥🟥'; }
        show+=
            '<style>.s_vol { position: fixed; top: 21px; left: 10px; z-index: 20; '+
            'padding: 2px 6px 0; outline: none; border: 1px solid #000; border-radius: 2px; '+
            'background: #fff; } '+
            '</style></dialog>';
        if(!document.querySelector('.s_vol')){
            document.body.insertAdjacentHTML('beforeend', show); }

        let s_vol=document.querySelector('.s_vol');
        if(s_vol){
            s_vol.show(); }

    } // vol_disp(n, vol)



    function clear_disp(){
        if(document.querySelector('.s_vol')){
            document.querySelector('.s_vol').remove(); }}

} // player_env
