// ==UserScript==
// @name        AmbTV Comfy Ajax Test
// @namespace        http://tampermonkey.net/
// @version        0.1
// @description        AbemaTV ユーティリティ
// @author        AbemaTV User
// @match        https://abema.tv/*
// @icon        https://www.google.com/s2/favicons?sz=64&domain=abema.tv
// @grant        none
// @updateURL        https://github.com/personwritep/AmbTV_Comfy/raw/main/AmbTV_Comfy_Ajax_Test.user.js
// @downloadURL        https://github.com/personwritep/AmbTV_Comfy/raw/main/AmbTV_Comfy_Ajax_Test.user.js
// ==/UserScript==



if(!is_atv()){ // 通常の画面
    disp_list(); }


function is_atv(){
    let q=window.location.search;
    if(q && q.includes('atv_if')){
        return true; }}



function disp_list(){ //「配信リスト表示」
    document.addEventListener('click', function(event){
        if(event.ctrlKey){
            event.preventDefault(); }});


    document.addEventListener('mouseup', function(event){
        let elem=document.elementFromPoint(event.clientX, event.clientY);
        let link_elem=elem.closest('a');
        if(link_elem){
            if(event.ctrlKey){
                //    set_if(link_elem); } // 🟥🟥🟥🟥🟥🟥🟥🟥🟥
                set_f_ajax(link_elem); }
            else{
                setTimeout(()=>{
                    if_close(); }, 100); }} // 🟥🟥🟥🟥🟥🟥🟥🟥🟥
        else{
            if(location.pathname.includes('/timetable')){ // 番組表の一覧を選択した場合
                if(event.ctrlKey){
                    disp_ssd(0);
                    let table_item=elem.closest('.com-timetable-TimetableItem');
                    if(table_item){
                        setTimeout(()=>{
                            let ssd_wrap=document.querySelectorAll(
                                '.com-timetable-TimeTableSideSlotDetail__side-slot-detail-wrapper');
                            for(let k=0; k<ssd_wrap.length; k++){
                                if(ssd_wrap[k].style.zIndex=='2'){
                                    let list_link=ssd_wrap[k].querySelector('.com-a-Button--primary-dark');
                                    if(list_link){
                                        let close=
                                            ssd_wrap[k].querySelector('.com-timetable-SideSlotDetail__close');
                                        if(close){
                                            close.click(); }
                                        let url=list_link.getAttribute('href');
                                        url=url+'?atv_if';
                                        creat_iframe(url); // 🟥🟥🟥🟥🟥🟥
                                        creat_f_ajax(url); }}}
                        }, 100); }}
                else{
                    disp_ssd(1); }}
            else if(!location.pathname.includes('/timetable')){
                if(!location.pathname.includes('/video/title/')){
                    if(event.ctrlKey){ // 動画再生中でリンクが無いリスト項目から配信リストを表示する
                        let li_elem=elem.closest('.com-contentlist-ItemListForContentlistContent__item');
                        if(!li_elem){ // 🔵2種クラス名　通常動画・ニュース
                            li_elem=elem.closest('.com-contentlist-ItemListForVideoSeriesProgram__item'); }
                        if(li_elem){
                            let url=location.href;
                            if(url.includes('?')){
                                url=url+'&atv_if'; }
                            else{
                                url=url+'?atv_if'; }
                            //    creat_iframe(url);  // 🟥🟥🟥🟥🟥🟥
                            creat_f_ajax(url); }}}}}


        function disp_ssd(n){
            let ssd_wrap=document.querySelectorAll(
                '.com-timetable-TimeTableSideSlotDetail__side-slot-detail-wrapper');
            if(n==0){
                for(let k=0; k<ssd_wrap.length; k++){
                    ssd_wrap[k].style.display='none'; }}
            else{
                for(let k=0; k<ssd_wrap.length; k++){
                    ssd_wrap[k].style.display='block'; }}}
    });

} // disp_list()



function if_close(){ // 🟥🟥🟥🟥🟥🟥
    let if_wrap=document.querySelector('#if_wrap');
    if(if_wrap){
        if_wrap.remove(); }

    let ajx_wap=document.querySelector('.ajx_wap')
    if(ajx_wap){
        ajx_wap.remove(); }}




// ************ Ajax ****************************************




function set_area(){
    let ajx_wap=
        '<div class="ajx_wap"><div id="area"></div>'+
        '<style>'+
        '.ajx_wap { position: fixed; top: 0; left: 0; width: 480px; height: 100%; '+
        'background: #fff; border: 1px solid #aaa; z-index: 100; } '+
        '#area { width: 100%; height: 100%; padding: 6px; overflow-x: hidden; } '+
        '</style></div>';

    if(document.querySelector('.ajx_wap')){
        document.querySelector('.ajx_wap').remove(); }
    document.body.insertAdjacentHTML('beforeend', ajx_wap);

    let area=document.querySelector('#area'); // 表示先
    return area;

} // set_area();



function set_f_ajax(link_elem){
    let url=link_elem.getAttribute('href');
    creat_f_ajax(url); }



function creat_f_ajax(url){
    let area=set_area();

    let xhr=new XMLHttpRequest();
    xhr.open("GET", url, true); // リクエストURL

    //    xhr.onreadystatechange=function(){
    xhr.addEventListener('readystatechange', function(){
        if(xhr.readyState===XMLHttpRequest.DONE && xhr.status===200){
            let parser=new DOMParser();
            let htmlDoc=parser.parseFromString(xhr.responseText, "text/html");

            //         let elements=htmlDoc.querySelectorAll('.c-application-DesktopAppContainer__content');
            //         let elements=htmlDoc.querySelectorAll('.com-content-list-ContentList');
            let elements=htmlDoc.querySelectorAll(
            //        '.com-content-list-ContentList, .com-contentlist-ContentlistContainer'); // 表示させる要素
                       '.com-contentlist-ContentlistSection, .com-contentlist-ContentlistContainer'); // 表示させる要素
            if(area){
                for (var i=0; i<elements.length; i++){
                    area.appendChild(elements[i].cloneNode(true)); }}
        }});

    xhr.send();

} // set_f_ajax(link_elem)






// ****************************************************



function set_if(target){
    let url=target.getAttribute('href');

    if(!location.pathname.includes('/timetable')){
        if(url.includes('/video/episode/') || url.includes('/video/title/') ||
           (url.includes('/channels/') && url.includes('/slots/')) ||
           url.includes('/live-event/') || url.includes('/slot-group/')){
            if(url.includes('?')){
                url=url+'&atv_if'; }
            else{
                url=url+'?atv_if'; }
            creat_iframe(url); }
        else{ // 上記以外のリンクの場合
            if_close(); }}
    else{
        if(url.includes('/now-on-air/')){
            on_air(target); }
        else{
            if(url.includes('/slots/')){
                url=url+'?atv_if';
                creat_iframe(url); }}}


    function on_air(target){
        let parent=target.closest('.com-timetable-SideSlotDetail');
        if(parent){
            let list_link=parent.querySelector('.com-a-Button--primary-dark');
            let url=list_link.getAttribute('href');
            url=url+'?atv_if';
            creat_iframe(url); }}

} //set_if()



function creat_iframe(url){
} // creat_iframe()
