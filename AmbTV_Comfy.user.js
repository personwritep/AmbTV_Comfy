// ==UserScript==
// @name        AmbTV Comfy
// @namespace        http://tampermonkey.net/
// @version        5.2
// @description        AbemaTV ユーティリティ
// @author        AbemaTV User
// @match        https://abema.tv/*
// @icon        https://www.google.com/s2/favicons?sz=64&domain=abema.tv
// @grant        none
// @updateURL        https://github.com/personwritep/AmbTV_Comfy/raw/main/AmbTV_Comfy.user.js
// @downloadURL        https://github.com/personwritep/AmbTV_Comfy/raw/main/AmbTV_Comfy.user.js
// ==/UserScript==


let help_url='https://ameblo.jp/personwritep/entry-12800867556.html'

if(window.location.search!='?atv'){ // 通常の画面
    let target=document.querySelector('head > title');
    let monitor=new MutationObserver(player_env);
    monitor.observe(target, { childList: true });

    time_table_env();
    disp_list();
    light_box(); }

else{ // 配信リスト iframe内のみ
    list_link_if();
    set_iframe();
    like();
    quiet(); }



function player_env(){
    let once=0; // 動画の切換え時に2回 nextが押されるのを抑止 🔴

    let retry0=0;
    let interval0=setInterval(wait_target0, 20);
    function wait_target0(){
        retry0++;
        if(retry0>100){ // リトライ制限 100回 2secまで
            clearInterval(interval0); }
        let player=document.querySelector(
            '.com-vod-VODRecommendedContentsContainerView__player');
        if(player){
            clearInterval(interval0);
            set_player(player); }}



    let retry1=0;
    let interval1=setInterval(wait_target1, 100);
    function wait_target1(){
        retry1++;
        if(retry1>20){ // リトライ制限 2secまで
            clearInterval(interval1); }
        let CLSButton=document.querySelector('.com-content-list-ContentListSortButton');
        if(CLSButton){
            clearInterval(interval1);
            CLSButton.click(); }}



    function set_player(player){
        let style=
            '<style class="atv_style">'+
            '.c-common-HeaderContainer-header, '+
            '.c-application-SideNavigation, '+
            '.c-application-SideNavigation--collapsed, '+
            '.com-vod-VODRecommendedContentsContainerView__player-aside-recommended'+
            ' { display: none !important; } '+
            '.c-video-EpisodeContainerView-breadcrumb, '+
            '.com-vod-VODRecommendedContentsContainerView__details, '+
            '.com-vod-VODRecommendedContentsContainerView__episode-list, '+
            '.com-feature-area-FeatureRecommendedArea__section, '+
            '.c-video-EpisodeContainerView__page-bottom, '+
            '.c-application-FooterContainer { display: none; } '+
            '.c-application-DesktopAppContainer__content-container { '+
            'align-items: center; height: 100vh; } '+
            '.c-application-DesktopAppContainer__content { min-width: 400px !important; } '+
            '.com-vod-VODResponsiveMainContent { '+
            'margin: 0 !important; padding: 0 !important; overflow: hidden; '+
            '--com-vod-VODResponsiveMainContent--content-min-width: 500 !important; } '+
            '.com-vod-VODResponsiveMainContent__inner { max-width: unset !important; } '+
            '.com-vod-VODRecommendedContentsContainerView__player-and-details '+
            '{ margin-right: 0 !important; } '+
            '.com-vod-VODRecommendedContentsContainerView__player '+
            '{ margin: 6px !important; } '+
            '.com-vod-VODMiniPlayerWrapper:before { display: none !important; } '+
            '.com-vod-VODMiniPlayerWrapper__player--bg { display: none !important; } '+
            '.com-vod-VODMiniPlayerWrapper__player { position: relative !important; '+
            'height: calc(100vh - 12px); } '+
            '.c-vod-EpisodePlayerContainer-inlined:before { display: none !important; } '+
            '.c-vod-EpisodePlayerContainer-wrapper { '+
            'position: relative !important; height: calc(100vh - 12px) !important; } '+
            '.com-vod-VODMiniPlayerWrapper__player--mini { height: 0 !important; } '+
            '.com-vod-FullscreenInBrowserButton__screen-controller { '+
            'display: none !important; } '+
            // slots playrer
            '.c-tv-TimeshiftSlotContainerView-breadcrumb { display: none; } '+
            '.c-tv-TimeshiftPlayerContainerView-outer { padding: 0; '+
            'height: calc(100vh - 12px) !important; } '+
            '</style>'+

            '<style class="atv_style_ex">'+
            '.com-vod-VODScreen__player { '+
            'height: 100% !important; width: 132% !important; margin-left: -16%; } '+
            '</style>'+

            '<style class="atv_style_hide">'+
            '.com-vod-VODScreen-container { cursor: none; } '+
            '.com-vod-VideoControlBar, .com-vod-VODScreen__video-control-bg { '+
            'display: none !important; } '+
            '</style>'+

            '<style class="atv_style_basic">'+
            '.com-vod-VODScreen-container { background: #000 !important; } '+
            '.com-playback-SeekBar__highlighter, .com-playback-SeekBar__marker, '+
            '.com-a-Slider__highlighter { background-color: #2196f3 !important; } '+
            '.com-vod-VODScreen__video-control-bg { '+
            'height: 60px !important; background: rgba(0,0,0,0.5) !important; } '+
            '.com-vod-VODScreen__recommend-content-bg { '+
            'background-image: none !important; } '+
            '.com-vod-VODPlayerNextContentRecommendBase__inner { '+
            'padding: 10px; background: rgb(0 0 0 / 50%); } '+
            '.com-video-EpisodePlayerSectionExternalContent { display: none; }'+ // 🟠 AD
            '</style>';

        if(!player.querySelector('.atv_style')){
            player.insertAdjacentHTML('beforeend', style); }

        let atv_style=player.querySelector('.atv_style');
        if(atv_style){
            if(sessionStorage.getItem('AmbTV_S')!='1'){
                sessionStorage.setItem('AmbTV_S', '0'); // 🔵 通常表示
                atv_style.disabled=true; }
            else{
                sessionStorage.setItem('AmbTV_S', '1'); // 🔵 サブウインドウ表示
                atv_style.disabled=false; }}

        let atv_style_ex=player.querySelector('.atv_style_ex'); // 🟥 拡大表示
        if(atv_style_ex){
            atv_style_ex.disabled=true; }

        let atv_style_hide=player.querySelector('.atv_style_hide'); // 🟩 コントロール非表示
        if(atv_style_hide){
            atv_style_hide.disabled=true; }


        ad_block(player); // ADブロック


        setTimeout(()=>{
            let wrap;
            if(player.querySelector('.c-vod-EpisodePlayerContainer-wrapper')){
                wrap=player.querySelector('.c-vod-EpisodePlayerContainer-wrapper'); }
            else if(player.querySelector('.c-tv-TimeshiftPlayerContainerView')){
                wrap=player.querySelector('.c-tv-TimeshiftPlayerContainerView'); }
            if(wrap){
                let monitor1=new MutationObserver(player_tool); // 機能アイコンを設置
                monitor1.observe(wrap, { childList: true }); }

            let muted_button=player.querySelector(
                '.com-playback-Volume__icon-button[aria-label="音声をオンにする"]');
            if(muted_button){
                muted_button.click(); }
        }, 200);


        setTimeout(()=>{
            let ec_thumbnail=document.querySelector('.c-vod-EpisodePlayerContainer-thumbnail');
            if(ec_thumbnail){
                reset_subw(); } // プレミアムAD表示時に「サブウインドウ表示」をリセット
        }, 200);


        setTimeout(()=>{
            player.oncontextmenu=function(){
                hide_con(player); } // 🟩 動画面の右クリックでコントロールを非表示
        }, 200);


        setTimeout(()=>{
            let play_button=player.querySelector('.com-vod-PlaybackButton');
            if(play_button){
                let tooltip=play_button.querySelector('.com-vod-PlaybackButton__tooltip');
                if(tooltip.textContent=='再生 (space)'){
                    play_button.click(); }} // 動画を連続再生で開いた時に、自動で再生開始する
        }, 2000);

    } // set_player()



    function ad_block(player){
        let retry2=0;
        let interval2=setInterval(wait_target2, 20);
        function wait_target2(){
            retry2++;
            if(retry2>100){ // リトライ制限 100回 2secまで
                clearInterval(interval2); }
            let ad_container=player.querySelector('#videoAdContainer > div');
            if(ad_container){
                clearInterval(interval2);
                ad_container.remove(); }}}



    function reset_subw(){
        let atv_style=document.querySelector('.atv_style');
        if(atv_style){
            if(sessionStorage.getItem('AmbTV_S')!='0'){
                sessionStorage.setItem('AmbTV_S', '0'); // 🔵 通常表示
                atv_style.disabled=true; }}}



    function hide_con(player){
        let atv_style_hide=player.querySelector('.atv_style_hide');
        if(atv_style_hide){
            if(atv_style_hide.disabled==true){
                atv_style_hide.disabled=false; }
            else{
                atv_style_hide.disabled=true; }}}



    function player_tool(){
        let nav_b=document.querySelector('.com-vod-VideoControlBar__playback-rate');
        if(nav_b){
            let help=
                '<a class="atv_help" href="'+ help_url +'" target="_blank">'+
                '<svg width="20" height="24" viewBox="0 -20 150 150">'+
                '<path fill="#fff" d="M66 13C56 15 47 18 39 24C-12 60 18 146 82 137C92 135'+
                ' 102 131 110 126C162 90 128 4 66 13M68 25C131 17 145 117 81 125C16 13'+
                '3 3 34 68 25M69 40C61 41 39 58 58 61C66 63 73 47 82 57C84 60 83 62 81 6'+
                '5C77 70 52 90 76 89C82 89 82 84 86 81C92 76 98 74 100 66C105 48 84 37 6'+
                '9 40M70 94C58 99 66 118 78 112C90 107 82 89 70 94z"></path></svg>'+
                '<style>.atv_help { margin: 0 16px; text-decoration: none; cursor: pointer; '+
                'display: none; }</style></a>';

            if(!document.querySelector('.atv_help')){
                nav_b.insertAdjacentHTML('beforebegin', help); }

            let sw_svg=
                '<svg viewBox="0 0 200 200">'+
                '<path style="fill: #fff;" d="M29 23.7L27.1 24.7L26.2 25.4L25.4'+
                ' 26.2L24.7 27.1L23.7 29L23.4 30L23.2 31L23 33C23 34 23 35 23 36L23 41L'+
                '23 55L23 60L23 63C23 64 23 65 23.1 66L23.4 68L24.2 70L24.7 70.9L25.4 7'+
                '1.8L27.1 73.3L29 74.3L30 74.6L32 74.9L34 74.9L35 74.8L37 74.3L38.9 73.'+
                '3L39.8 72.6L41.3 70.9L42.3 69L42.8 67L43 65L43 61L43 56L43 53L43 52L43'+
                '.1 50L43.2 49L43.4 48L43.7 47.1L44.7 45.4L45.4 44.7L47.1 43.7L49 43.2L'+
                '51 43L54 43L66 43L69 43L71 42.8L73 42.3L74.9 41.3L75.8 40.6L77.3 38.9L'+
                '78.3 37L78.6 36L78.9 34L78.9 32L78.8 31L78.6 30L77.8 28L76.6 26.2L75.8'+
                ' 25.4L74.9 24.7L73 23.7C71.4 23.1 69.7 23.1 68 23L65 23L61 23L40 23L36'+
                ' 23L34 23C32.3 23.1 30.6 23.1 29 23.7M132 23.7L130.1 24.7L129.2 25.4L1'+
                '28.4 26.2L127.2 28L126.4 30L126.2 31L126.1 32L126.1 33L126.2 35L126.4 '+
                '36L127.2 38L127.7 38.9L128.4 39.8L130.1 41.3L132 42.3L134 42.8L136 43L'+
                '139 43L151 43L153 43L155 43.1L156 43.2L157 43.4L157.9 43.7L159.6 44.7L'+
                '160.3 45.4L161.3 47.1L161.8 49L161.9 50C162 51 162 52 162 53L162 56L16'+
                '2 62C162 63.3 162 64.7 162.1 66L162.4 68L163.2 70L164.4 71.8L165.2 72.'+
                '6L167 73.8L168 74.3L169 74.6L171 74.9L173 74.9L174 74.8L176 74.3L177.9'+
                ' 73.3L178.8 72.6L179.6 71.8L180.8 70L181.6 68L181.9 66C182 65 182 64 1'+
                '82 63L182 60L182 54L182 38L182 33L181.8 31L181.3 29L180.8 28L179.6 26.'+
                '2L177.9 24.7L177 24.2L175 23.4L174 23.2L172 23L168 23L144 23L140 23L13'+
                '7 23C135.3 23.1 133.6 23.1 132 23.7M29 99.7L27.1 100.7L26.2 101.4L25.4'+
                ' 102.2L24.2 104L23.4 106L23.1 108C23 109 23 110 23 111L23 114L23 119L2'+
                '3 135L23 138L23 140C23 141 23.1 142 23.2 143C23.5 144.4 23.9 145.7 24.'+
                '7 146.9L26.2 148.6L27.1 149.3L29 150.3L31 150.8L33 151L36 151L45 151L6'+
                '2 151L66 151L68 151C69 151 70 150.9 71 150.8C72 150.6 73 150.3 74 149.'+
                '8C75.6 148.9 76.9 147.6 77.8 146L78.6 144L78.8 143L78.9 142L78.9 141L7'+
                '8.8 139L78.6 138L77.8 136L77.3 135.1L76.6 134.2L75.8 133.4L74 132.2C71'+
                '.5 130.9 68.7 131 66 131L54 131L52 131L50 130.9L49 130.8L48 130.6L47.1'+
                ' 130.3L45.4 129.3L44.7 128.6L43.7 126.9L43.2 125L43.1 124C43 123 43 12'+
                '2 43 121L43 118L43 112C43 110.7 43 109.3 42.9 108L42.6 106L41.8 104L40'+
                '.6 102.2L39.8 101.4L38 100.2L37 99.7L36 99.4L34 99.1L32 99.1L31 99.2L2'+
                '9 99.7M168 99.7L166.1 100.7L165.2 101.4L163.7 103.1L162.7 105L162.2 10'+
                '7L162 109L162 113L162 118L162 121L162 122L161.9 124L161.8 125L161.6 12'+
                '6L161.3 126.9L160.3 128.6L159.6 129.3L157.9 130.3L156 130.8L154 131L15'+
                '1 131L139 131L136 131L134 131.2L132 131.7L130.1 132.7L129.2 133.4L127.'+
                '7 135.1L126.7 137L126.4 138L126.1 140L126.1 142L126.2 143L126.4 144L12'+
                '7.2 146L128.4 147.8L129.2 148.6L130.1 149.3L132 150.3C133.6 150.9 135.'+
                '3 150.9 137 151L139 151L143 151L164 151L168 151L171 151C172.7 150.9 17'+
                '4.4 150.9 176 150.3L177.9 149.3L178.8 148.6L179.6 147.8L180.3 146.9L18'+
                '1.3 145L181.6 144L181.8 143L182 141C182 140 182 139 182 138L182 133L18'+
                '2 119L182 114L182 111C182 110 182 109 181.9 108L181.6 106L180.8 104L18'+
                '0.3 103.1L179.6 102.2L177.9 100.7L176 99.7L175 99.4L173 99.1L171 99.1L'+
                '170 99.2L168 99.7M29 162.7L27.1 163.7L26.2 164.4L25.4 165.2L24.2 167L2'+
                '3.4 169L23.2 170L23.1 171L23.1 173L23.4 175L23.7 176L24.7 177.9L26.2 1'+
                '79.6L27.1 180.3L28 180.8L30 181.6L32 181.9C33 182 34 182 35 182L38 182'+
                'L42 182L65 182L140 182L166 182L169 182L171 182C172 182 173 181.9 174 1'+
                '81.8C175.4 181.5 176.7 181.1 177.9 180.3L179.6 178.8L180.3 177.9L181.3'+
                ' 176L181.8 174L181.9 173L181.9 171L181.6 169L181.3 168L180.3 166.1L178'+
                '.8 164.4L177.9 163.7L177 163.2L176 162.7L174 162.2L172 162L169 162L162'+
                ' 162L140 162L72 162L43 162L38 162L35 162C33 162 30.9 162 29 162.7z">'+
                '</path></svg>';

            let sw=
                '<button type="button" class="atv_sw com-vod-FullscreenButton">'+
                '<div class="com-vod-FullscreenButton__tooltip">'+
                '<div class="atv_tp com-a-Tooltip com-a-Tooltip--arrow-position-center">'+
                '</div></div>'+
                '<span class="atv_icon">'+ sw_svg +'</span></button>'+
                '<style>.atv_icon { width: 24px; height: 24px; } '+
                ':fullscreen .atv_sw { display: none; }</style>';

            if(!document.querySelector('.atv_sw')){
                nav_b.insertAdjacentHTML('afterend', sw); }

            let atv_sw=document.querySelector('.atv_sw');
            let atv_style=document.querySelector('.atv_style');
            let atv_tp=document.querySelector('.atv_tp');
            let atv_help=document.querySelector('.atv_help');
            if(atv_sw && atv_style && atv_tp && atv_help){
                if(sessionStorage.getItem('AmbTV_S')=='1'){ // 🔵 サブウインドウ表示
                    atv_style.disabled=false;
                    atv_tp.textContent='デフォルト表示';
                    atv_help.style.display='inline'; }
                else{
                    atv_style.disabled=true;
                    atv_tp.textContent='サブウインドウ表示';
                    atv_help.style.display='none'; }

                atv_sw.onclick=function(e){
                    e.preventDefault();
                    if(sessionStorage.getItem('AmbTV_S')=='1'){ // 🔵 サブウインドウ表示
                        sessionStorage.setItem('AmbTV_S', '0'); // 🔵 通常表示
                        atv_style.disabled=true;
                        atv_tp.textContent='サブウインドウ表示';
                        atv_help.style.display='none'; }
                    else{
                        sessionStorage.setItem('AmbTV_S', '1'); // 🔵 サブウインドウ表示
                        atv_style.disabled=false;
                        atv_tp.textContent='デフォルト表示';
                        atv_help.style.display='inline'; }}


                let full_sw=document.querySelector('.com-vod-FullscreenButton use');
                if(full_sw){
                    let monitor_sw=new MutationObserver(sw_cont);
                    monitor_sw.observe(full_sw, { attributes: true });
                    function sw_cont(){
                        setTimeout(()=>{
                            if(sessionStorage.getItem('AmbTV_S')=='1'){ // 🔵 サブウインドウ表示
                                sessionStorage.setItem('AmbTV_S', '0'); // 🔵 通常表示
                                atv_style.disabled=true;
                                atv_tp.textContent='サブウインドウ表示';
                                atv_help.style.display='none'; }
                        }, 100); }}

            }} //  if(nav_b)


        reset_mode();
        ex_view();
        end_roll();

    } // player_tool()



    function reset_mode(){
        document.addEventListener('keydown', function(event){
            if(event.keyCode==27){
                reset_subw();

                let atv_style_hide=document.querySelector('.atv_style_hide');
                if(atv_style_hide){
                    if(atv_style_hide.disabled!=true){
                        atv_style_hide.disabled=true; }}}});

    } // reset_mode()



    function ex_view(){ // 🟥 拡大表示
        let full=document.querySelector('.com-vod-FullscreenButton__icon');
        let atv_style_ex=document.querySelector('.atv_style_ex');
        if(full && atv_style_ex){
            full.onclick=(event)=>{
                if(event.ctrlKey){
                    event.preventDefault();
                    event.stopImmediatePropagation();
                    if(atv_style_ex.disabled==true){
                        atv_style_ex.disabled=false;
                        full.style.color='red'; }
                    else{
                        atv_style_ex.disabled=true;
                        full.style.color='#fff';}}}}}



    function end_roll(){
        let CB_icon=document.querySelectorAll('.com-vod-VideoControlBar__icon');
        if(CB_icon[2]){
            if(player_type(0) && player_type(1) && player_type(2) ){
                CB_icon[2].style.boxShadow='10px -6px 0 -7px #fff'; }
            else{
                CB_icon[2].style.boxShadow='0 -7px 0 -4px #FF9800'; }

            if(sessionStorage.getItem('AmbTV_E')=='1'){ // エンドロール表示モード 🔵
                CB_icon[2].style.color='red'; }
            else if(sessionStorage.getItem('AmbTV_E')=='2'){
                CB_icon[2].style.color='#2196f3'; }
            else if(sessionStorage.getItem('AmbTV_E')=='3'){
                CB_icon[2].style.color='#44ff00'; }
            else{
                CB_icon[2].style.color='#fff'; }

            CB_icon[2].onclick=function(event){
                if(sessionStorage.getItem('AmbTV_E')=='1'){ // 🔵
                    sessionStorage.setItem('AmbTV_E', '2');
                    CB_icon[2].style.color='#2196f3'; }
                else if(sessionStorage.getItem('AmbTV_E')=='2'){ // 🔵
                    sessionStorage.setItem('AmbTV_E', '3');
                    CB_icon[2].style.color='#44ff00'; }
                else if(sessionStorage.getItem('AmbTV_E')=='3'){ // 🔵
                    sessionStorage.setItem('AmbTV_E', '0');
                    CB_icon[2].style.color='#fff'; }
                else{
                    sessionStorage.setItem('AmbTV_E', '1'); // 🔵
                    CB_icon[2].style.color='red'; }}}

        let info=player_type(0);
        if(info){
            info_sw();
            let monitor2=new MutationObserver(info_sw); // infoパネルを監視
            monitor2.observe(info, { attributes: true }); }

    } // end_roll()



    function player_type(n){
        let player=document.querySelector(
            '.com-vod-VODRecommendedContentsContainerView__player');

        let cancel;
        if(player){
            let pb=player.querySelectorAll('button');
            for(let k=0; k<pb.length; k++){
                if(pb[k].textContent=='キャンセル'){
                    cancel=pb[k];
                    break; }}}

        let target;
        let next;
        if(cancel){
            target=cancel.parentNode.parentNode.parentNode;
            next=cancel.parentNode.querySelector('.com-a-Link'); }

        let wrap;
        if(target){
            wrap=target.parentNode; }

        if(n==0){
            return target; }
        else if(n==1){
            return cancel; }
        else if(n==2){
            return next; }
        else if(n==3){
            return wrap; }

    } // player_type()



    function info_sw(){
        let player=document.querySelector(
            '.com-vod-VODRecommendedContentsContainerView__player');

        let cancel=player_type(1);
        let next=player_type(2);
        let SeekBar=player.querySelector('.com-playback-SeekBar__highlighter');
        let fll_end=sessionStorage.getItem('AmbTV_E'); // エンドロール表示モード 🔵

        if(cancel && SeekBar){
            let sbw=SeekBar.getAttribute('style').replace(/[^0-9]/g, '').slice(0, 2);
            sbw=parseInt(sbw, 10);
            if(fll_end=='1'){
                if(sbw!=10 && sbw<99 ){ // エンドロールの最初のみキャンセルを押す
                    cancel.click(); }
                else{
                    player_type(3).style.opacity='0';
                    setTimeout(()=>{
                        if(once==0){ // 🔴
                            once+=1;
                            next.click(); }
                    }, 4000); }}
            else if(fll_end=='2'){ // エンドロールの最初と最後でキャンセルを押す
                cancel.click(); }
            else if(fll_end=='3'){ // エンドロールで次のエピソードを押す
                if(sbw>85){
                    player_type(3).style.opacity='0';
                    setTimeout(()=>{
                        if(once==0){ // 🔴
                            once+=1;
                            next.click(); }
                    }, 4000); }}}

    } // info_sw()

} // player_env()



function time_table_env(){
    let style=
        '<style class="tt_style">'+
        '.com-timetable-SideSlotDetail__date { font-size: 14px; } '+
        '.com-timetable-SideSlotDetail__date, '+
        '.com-vod_expiration_date-ExpiredDateText__text--info { color: #a9dbff; } '+

        '.com-a-ProgressBar__bar { background-color: #2196f3; } '+
        '.com-viewng-history-LegacyViewingHistoryProgressBar__shadow { display: none; } '+

        '.com-feature-area-NewestLabel__text, '+
        '.com-feature-area-EpisodeCardItem__title, '+
        '.com-feature-area-SlotCardItem__start-at, '+
        '.com-feature-area-FeatureMyListSlotItem__start-at, '+
        '.com-feature-area-LiveEventCardItem__start-at, '+
        '.com-feature-area-TopNewsItem__elapsed-time { color: #ccc; } '+

        '.com-a-ResponsiveMainContent, .com-vod-VODResponsiveMainContent { '+
        'padding: 0 24px 2px; } '+
        '</style>';

    if(!document.querySelector('.tt_style')){
        document.body.insertAdjacentHTML('beforeend', style); }

} // time_table_env()



function disp_list(){ //「配信リスト表示」
    document.addEventListener('click', function(event){
        if(event.ctrlKey){
            event.preventDefault(); }});


    document.addEventListener('mouseup', function(event){
        let elem=document.elementFromPoint(event.clientX, event.clientY);
        let link_elem=elem.closest('a');
        if(link_elem){
            if(event.ctrlKey){
                set_if(link_elem); }
            else{
                setTimeout(()=>{
                    if_close(); }, 1000); }}
        else{
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
                                    creat_iframe(url); }}}
                    }, 100); }}
            else{
                disp_ssd(1); }}


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



function set_if(target){
    clear_outline();
    disp_outline(target);

    let url=target.getAttribute('href');

    if(!location.pathname.includes('/timetable')){
        if(url.includes('/video/episode/') || url.includes('/video/title/') ||
           url.includes('/channels/') || url.includes('/live-event/') || url.includes('/slot-group/')){
            creat_iframe(url); }
        else{ // 上記以外のリンクの場合
            if_close(); }}
    else{
        if(!url.includes('/now-on-air/')){
            creat_iframe(url); }
        else{
            on_air(target); }}



    function on_air(target){
        let parent=target.closest('.com-timetable-SideSlotDetail');
        if(parent){
            let list_link=parent.querySelector('.com-a-Button--primary-dark');
            let url=list_link.getAttribute('href');
            creat_iframe(url); }}



    function disp_outline(target){
        let List=target.closest('li.com-my-list-MyListBaseItem');
        if(List){
            List.style.outline='2px solid #fff'; }

        let Card=target.closest('.com-feature-area-CardItem');
        if(Card){
            if(!Card.closest('.c-home-HomeContainerView-TvAreaContainer')){
                Card.style.outline='2px solid #fff'; }}

        let Ranking=target.closest('.com-feature-area-FeatureRankingItem');
        if(Ranking){
            Ranking.style.outline='2px solid #fff'; }

        setTimeout(()=>{
            scroll_center(target);
        }, 800); }



    function clear_outline(){
        let lists=document.querySelectorAll('li.com-my-list-MyListBaseItem');
        for(let k=0; k<lists.length; k++){
            lists[k].style.outline=''; }

        let cards=document.querySelectorAll('.com-feature-area-CardItem');
        for(let k=0; k<cards.length; k++){
            cards[k].style.outline=''; }

        let rankings=document.querySelectorAll('.com-feature-area-FeatureRankingItem');
        for(let k=0; k<rankings.length; k++){
            rankings[k].style.outline=''; }}

} //set_if()



function scroll_center(elem){
    let eh=elem.getBoundingClientRect().top;
    let wh=window.innerHeight;
    window.scrollBy( 0, eh - wh/2 + 100); }



function creat_iframe(url){
    let help_SVG=
        '<svg class="atv_help" width="20"  height="30" viewBox="0 -35 150 150">'+
        '<path fill="#fff" d="M66 13C56 15 47 18 39 24C-12 60 18 146 82 137C92 135 10'+
        '2 131 110 126C162 90 128 4 66 13M68 25C131 17 145 117 81 125C16 133 3 34 68 '+
        '25M69 40C61 41 39 58 58 61C66 63 73 47 82 57C84 60 83 62 81 65C77 70 52 90 7'+
        '6 89C82 89 82 84 86 81C92 76 98 74 100 66C105 48 84 37 69 40M70 94C58 99 66 '+
        '118 78 112C90 107 82 89 70 94z"></path></svg>';

    let home_SVG=
        '<svg width="30" height="30" viewBox="0 -5 83 83" style="vertical-align: -5px">'+
        '<path style="fill: #fff" d="M31 52L53 52L53 66L53 68L53 70L53.3 72L53.7 72.9'+
        'L55.1 74.3L56 74.7L57 74.9L58 75L60 75L64 75L66 75L67 75L68 75L70 74.9L71.9 '+
        '74.3L73.3 72.9L73.7 72L73.9 71L74 69L74 67L74 63L74 43L74 40L74 38L73.9 36L7'+
        '3.3 34L71.9 32.1L71 31.2L69 29.6L67 28.1L65 26.6L64 25.9L63 25.1L61 23.6L60 '+
        '22.8L58 21.2L57 20.4L55 18.9L54 18.1L53 17.4L52 16.6L51 15.9L50 15.1L48 13.7'+
        'L46 12.4L44 11.5L43 11.3L42 11.2L41 11.3L40 11.5L38 12.4L36 13.7L34 15.1L33 '+
        '15.9L32 16.6L31 17.4L29 18.9L28 19.6L27 20.4L26 21.1L25 21.9L23 23.4L22 24.2'+
        'L20 25.8L19 26.6L17 28.1L16 28.9L15 29.6L13 31.2L12.1 32.1L10.7 34L10.1 36L1'+
        '0 38L10 39L10 41L10 56L10 64L10 67L10 68L10 69L10.1 71L10.7 72.9L11.3 73.7L1'+
        '2.1 74.3L13 74.7L15 75L17 75L20 75L23 75L25 75L27 74.9L28 74.7L28.9 74.3L29.'+
        '7 73.7L30.3 72.9L30.9 71L31 69L31 68L31 66L31 63L31 52z"></path></svg>';

    let mov_SVG=
        '<svg width="26" height="30" viewBox="0 -5 83 83" style="vertical-align: -5px">'+
        '<path style="fill: #fff" d="M18 49C12 43 9 41 1 41L1 73C9 73 12 71 18 65L18 '+
        '79L72 79L72 54C72 50 71 45 72 41C73 38 76 37 77 35C80 32 82 27 82 23C81 13 7'+
        '3 5 63 6C48 8 40 30 55 37C49 39 42 38 35 38C38 36 40 33 41 30C49 10 19 -3 10'+
        ' 16C9 18 8 21 8 23C8 31 13 33 17 39C19 42 18 46 18 49z"></path></svg>';

    let cross_SVG=
        '<svg width="24" height="30" viewBox="0 0 83 83" style="vertical-align: -5px">'+
        '<path style="fill: #fff" d="M30 43C25.7 47.3 21.3 51.6 17 56C14.8 58.2 12.1 60'+
        '.8 11.5 64C10.7 69.2 16.9 74.8 22 73.2C29 71 36.9 60.8 41 55C45.3 59.3 49.6 63'+
        '.7 54 68C56.2 70.2 58.8 72.9 62 73.5C67.2 74.3 72.8 68.1 71.2 63C69 56 58.8 48'+
        '.1 53 44C57.3 39.7 61.7 35.4 66 31C68.2 28.8 70.9 26.2 71.5 23C72.3 17.8 66.1 '+
        '12.2 61 13.8C54 16 46.1 26.2 42 32C37.7 27.7 33.4 23.3 29 19C26.8 16.8 24.2 14'+
        '.1 21 13.5C15.8 12.7 10.2 18.9 11.8 24C14 31 24.2 38.9 30 43z"></path></svg>';

    let if_elem=
        '<div id="if_wrap">'+
        '<div id="if_cont">'+
        '<a class="if_help" href="'+ help_url +'" target="_blank">'+ help_SVG + '</a>'+
        '<a class="if_link" href="https://abema.tv/">'+ home_SVG +
        '<span class="t"> Abema Home</span></a>'+
        '<a class="mov_link">'+ mov_SVG +
        '<span class="t"> Movie Page</span></a>'+
        '<span class="if_close">'+ cross_SVG +'</span>'+
        '</div>'+
        '<iframe id="notify" scrolling="no" src="'+ url +'?atv"></iframe>'+

        '<style>#if_wrap { position: fixed; z-index: 20; top: 0; left: 0; width: 480px; '+
        'height: calc(100% - 22px); border: 2px solid #fff; background: #000; } '+
        '#if_cont { display: flex; justify-content: space-between; align-items: center; '+
        'color: #fff; height: 40px; padding: 0 20px; background: #a7b8c4; } '+
        '.if_help, .if_link, .mov_link, .if_close { text-decoration: none; cursor: pointer; } '+
        '.if_help { margin: 0 -10px; } '+
        '.t { font: 20px Meiryo; } '+
        '.if_close { padding: 2px 10px 0; margin: 0 -10px 0 -20px; } '+
        '#notify { padding: 0; width: 100%; height: calc(100% - 40px); } '+

        '.c-application-DesktopAppContainer__content { min-width: 600px; } '+
        '.com-a-ResponsiveMainContent__inner--unlimited-max-width { min-width: 552px; } '+

        '.com-timetable-DesktopTimeTableWrapper__channel-content-header-wrapper { '+
        'left: 480px; } '+
        '.com-timetable-TimeTableListTimeAxis { left: 480px; } '+
        '.com-timetable-ArrowButtons__arrow-button-wrapper{ '+
        'left: 480px; width: calc(100% - 480px); } '+
        '.com-timetable-ArrowButtons__arrow-button-left { left: 30px; } '+
        '.c-application-SideNavigation { width: 480px; } '+
        '</style></div>';

    if(document.querySelector('#if_wrap')){
        document.querySelector('#if_wrap').remove(); }
    document.body.insertAdjacentHTML('beforeend', if_elem); // iframe生成


    let if_n=document.querySelector('#notify');
    if_n.onload=function(){
        let retry3=0;
        let interval3=setInterval(wait_target3, 20);
        function wait_target3(){
            retry3++;
            if(retry3>100){ // リトライ制限 2secまで
                clearInterval(interval3); }
            let CLIL=
                if_n.contentWindow.document.querySelector('.com-content-list-ContentListItemList');
            if(CLIL){
                clearInterval(interval3);
                setTimeout(()=>{
                    let CLSB=if_n.contentWindow.document.querySelector(
                        '.com-content-list-ContentListSortButton');
                    CLSB.click();
                }, 800); }}


        setTimeout(()=>{
            let CL=
                if_n.contentWindow.document.querySelector('.com-content-list-ContentList');
            if(!CL){
                let mlb_reset=
                    '<style>'+
                    '.com-my-list-EpisodeMyListCircleButtonWithSelectList__select-list, '+
                    '.com-my-list-SlotMyListCircleButtonWithSelectList__select-list { display: unset; } '+
                    '</style>';
                if_n.contentWindow.document.body.insertAdjacentHTML('beforeend', mlb_reset);
            }}, 2000); // 2sec後
    } // if_n.onload


    let close_button=document.querySelector('.if_close');
    if(close_button){
        close_button.onclick=()=>{
            if_close(); }}

} // creat_iframe()



function if_close(){
    let if_wrap=document.querySelector('#if_wrap');
    if(if_wrap){
        if_wrap.remove();

        setTimeout(()=>{
            let cards=document.querySelectorAll('.com-feature-area-CardItem');
            for(let k=0; k<cards.length; k++){
                let style=cards[k].getAttribute('style');
                if(style && style.includes('2px')){
                    scroll_center(cards[k]); }}
        }, 800); }}



function list_link_if(){
    document.addEventListener('mouseup', function(event){
        let elem=document.elementFromPoint(event.clientX, event.clientY);
        let link_elem=elem.closest('.com-content-list-ContentListItem a');
        if(link_elem){
            let url=link_elem.getAttribute('href');
            if(url){
                window.parent.location.href=url; }}});


    let mov_l=window.parent.document.querySelector('.mov_link');
    if(mov_l){
        mov_l.onclick=()=>{
            let first_link=document.querySelector('.com-content-list-ContentListItem:last-child a');
            if(first_link){
                let m_url=first_link.getAttribute('href');
                if(m_url){
                    window.parent.location.href=m_url; }}}}

} // list_link_if()



function set_iframe(){
    let in_style=
        '<style class="in_style">'+
        '.com-content-list-ContentList, '+
        '.com-slot-group-SlotList, '+
        '.com-vod-VODRecommendedContentsContainerView__player-and-details { '+
        'position: fixed; top: 0; left: 0; z-index: 30; width: 476px; '+
        'height: 100%; overflow-y: scroll; overflow-x: hidden; background: #000; } '+
        '.com-vod-VODRecommendedContentsContainerView__player-and-details { '+
        'top: 15px; margin-left: 8px; } '+
        '.com-content-list-ContentListHeader__group-tab-list-container { '+
        'padding-top: 16px !important; } '+
        '.com-content-list-ContentListHeader__sort-button { margin: 0; } '+
        '.com-content-list-ContentListSortButton__icon-wrapper { '+
        'border: 1px solid #aaa; border-radius: 4px; } '+
        '.com-content-list-ContentListSortButton__text { display: none; } '+

        '.com-content-list-ContentListEpisodeItem, '+
        '.com-content-list-ContentListVideoSeriesEpisodeItem, '+
        '.com-content-list-ContentListSlotItem, '+
        '.com-content-list-ContentListLiveEventItem { overflow: hidden; padding: 8px; } '+
        '.com-content-list-ContentListItem .com-vod-VODLabel__text--dark-free { '+
        'box-shadow: 0 0 0 600px #002e3a; } '+

        '.com-content-list-ContentListEpisodeItem__watching-icon-container, '+
        '.com-content-list-ContentListVideoSeriesEpisodeItem__watching-icon-container, '+
        '.com-content-list-ContentListLiveEventItem__watching-icon-container { '+
        'display: none; } '+
        '.com-content-list-ContentListEpisodeItem__title, '+
        '.com-content-list-ContentListVideoSeriesEpisodeItem__title, '+
        '.com-content-list-ContentListSlotItem__link, '+
        '.com-content-list-ContentListLiveEventItem__link { font-size: 16px; } '+
        '.com-content-list-ContentListEpisodeItem-ContentListEpisodeItemOverview__supplement, '+
        '.com-content-list-ContentListVideoSeriesEpisodeItem-'+
        'ContentListVideoSeriesEpisodeItemOverview__supplement, '+
        '.com-content-list-ContentListSlotItem__date, '+
        '.com-content-list-ContentListLiveEventItem__date, '+
        '.com-content-list-ContentListEpisodeItem__description, '+
        '.com-content-list-ContentListVideoSeriesEpisodeItem__description, '+
        '.com-content-list-ContentListSlotItem__description, '+
        '.com-content-list-ContentListLiveEventItem__description { '+
        'color: #ddd; position: relative; } '+
        '.com-content-list-ContentListEpisodeItem-ContentListEpisodeItemOverview__view-count { '+
        'display: none; } '+
        '.com-vod_expiration_date-ExpiredDateText__text--info { color: #fff; } '+

        '.com-content-list-ContentListEpisodeItem__thumbnail, '+
        '.com-content-list-ContentListLiveEventItem__thumbnail, '+
        '.com-content-list-ContentListVideoSeriesEpisodeItem__thumbnail { margin-right: 8px; } '+
        '.com-viewng-history-LegacyViewingHistoryProgressBar__shadow { display: none; } '+
        '.com-a-ProgressBar__bar { background-color: #8dc9ff; } '+

        '.com-content-list-ContentListEpisodeItem__my-list-button, '+
        '.com-content-list-ContentListVideoSeriesEpisodeItem__my-list-button, '+
        '.com-content-list-ContentListSlotItem__my-list-button, '+
        '.com-content-list-ContentListLiveEventItem__my-list-button { '+
        'margin-left: 0; width: 24px; } '+

        '.com-m-NotificationManager { width: unset; right: 60px; top: 15px; } '+
        '.com-application-NotificationToast { gap: 0; height: 40px; padding: 0 10px; } '+
        '.com-application-NotificationToast__button-wrapper, '+
        '.com-application-NotificationToast__close-button { display: none; } '+
        '.com-my-list-EpisodeMyListCircleButtonWithSelectList__select-list, '+
        '.com-my-list-SlotMyListCircleButtonWithSelectList__select-list { display: none; } '+
        '.like_clone { height: 21px; width: 21px; margin: 10px 12px 10px 4px; '+
        'border-radius: 20px; background: #ffcc00; } '+
        // slot-group
        '.com-my-list-MyListBaseItem { overflow: hidden; } '+
        '.com-my-list-MyListBaseItem__wrapper { margin: 0 8px; } '+
        '.com-my-list-MyListBaseItem__thumbnail { margin: 8px 0; } '+
        '.com-my-list-MyListBaseItem__details { margin-left: 8px; overflow: unset; } '+
        '.com-my-list-SlotListItem__title { font-size: 16px; } '+
        '.com-my-list-SlotListItem__start-at { position: relative; color: #fff; } '+
        '.com-my-list-SlotListItem__expiration .com-vod-VODLabel__text--dark-free { '+
        'box-shadow: 0 0 0 600px #002e3a; } '+
        '</style>';

    document.body.insertAdjacentHTML('beforeend', in_style);

} // set_iframe()



function quiet(){
    let retry4=0;
    let interval4=setInterval(wait4, 40);
    function wait4(){
        mu();
        retry4++;
        if(retry4>50){ // リトライ制限 2secまで
            clearInterval(interval4); }}


    function mu(){
        let video_el=document.querySelector('video');
        if(video_el){
            video_el.muted=true;
            video_el.addEventListener('timeupdate', function(){
                video_el.pause(); }); }}

} // quiet()



function like(){
    let retry5=0;
    let interval5=setInterval(wait_target5, 20);
    function wait_target5(){
        retry5++;
        if(retry5>100){ // リトライ制限 2secまで
            let s_button=document.querySelector('.com-content-list-ContentListSortButton');
            if(s_button){
                clearInterval(interval5);
                like_button(s_button); }}}


    function like_button(s_button){
        let l_c=
            '<button class="like_clone" style="color: transparent">'+
            '<svg viewBox="-4 -5 33 33">'+
            '<path d="m7 7h10v2c0 .45.54.67.85.35l3-3c0-0 0-1 0-1l-3-3a1 1 0 0 0 -1 0v2h-1'+
            '1c-1 0-1 0-1 1v4c0 1 1 1 1 1s1-0 1-1zm10 10h-10v-2c0-0-1-1-1-0l-3 3c-0 0-0 1 '+
            '0 1l3 3a1 1 0 0 0 1-0v-2h11c1 0 1-0 1-1v-4c0-1-0-1-1-1s-1 0-1 1z" '+
            'fill="currentColor" fill-rule="evenodd"></path></svg>'+
            '</button>';

        s_button.insertAdjacentHTML('afterend', l_c);

        let like_clone=document.querySelector('.like_clone');
        let c_button=document.querySelector('.com-my-list-MyListBaseCircleButton__button');
        let select_list=document.querySelector(
            '.com-my-list-EpisodeMyListCircleButtonWithSelectList__select-list');
        let select_list_s=document.querySelector(
            '.com-my-list-SlotMyListCircleButtonWithSelectList__select-list');
        if(like_clone && c_button){
            if(select_list || select_list_s){ // 登録選択の小パネルがある場合（動画プレーヤー画面）
                if(select_list_s){
                    like_clone.style.color='#000'; }

                c_button.click();
                setTimeout(()=>{
                    clone_disp(like_clone);
                }, 20);
                setTimeout(()=>{
                    c_button.click();
                }, 80);

                like_clone.onclick=function(){
                    c_button.click();
                    setTimeout(()=>{
                        if_video();
                    }, 20);
                    setTimeout(()=>{
                        clone_disp(like_clone);
                    }, 200); }}

            else{ // 登録選択の小パネルがない場合（動画タイトル画面）
                clone_disp(like_clone);
                like_clone.onclick=function(){
                    c_button.click();
                    setTimeout(()=>{
                        clone_disp(like_clone);
                    }, 200); }}}



        function if_video(){
            let select_b=
                document.querySelector('.com-my-list-MyListButtonSelectListItem__container');
            if(select_b){
                select_b.click(); }}



        function clone_disp(lc){
            let select_b=
                document.querySelector('.com-my-list-MyListButtonSelectListItem__container');
            if(select_b){ // 動画シリーズのマイリスト登録の場合
                let is_added=select_b.querySelector(
                    '.com-my-list-MyListButtonSelectListItem__left-container--is-added');
                if(is_added){
                    lc.style.background='linear-gradient(#fff 0px, #ffcc00 10px, #e65100 30px)'; }
                else{
                    lc.style.background='#999'; }}

            else{ // 登録選択の小パネルがない場合　毎回追加型にはない
                let outline_active=document.querySelector(
                    '.com-my-list-MyListBaseCircleButton__button-outline--active');
                if(outline_active){
                    lc.style.background='linear-gradient(#fff 0px, #ffcc00 10px, #e65100 30px)'; }
                else{
                    lc.style.background='#999'; }}
        } // clone_disp()

    } // like_button()

} // like()



function light_box(){ // 動画のサムネイルの「暗転拡大表示」
    let html_=document.documentElement;

    box_env();

    document.addEventListener('contextmenu', function(event){
        if(!event.shiftKey && !event.ctrlKey){
            event.preventDefault();
            let elem=document.elementFromPoint(event.clientX, event.clientY);
            let link_elem=elem.closest('a');
            let thum_elem;

            if(elem.closest('.com-m-PortraitThumbnail')){
                thum_elem=elem.closest('.com-m-PortraitThumbnail'); }
            else if(elem.closest('.com-m-Thumbnail')){
                thum_elem=elem.closest('.com-m-Thumbnail'); }
            else if(elem.closest('.com-content-list-ContentListEpisodeItem')){
                thum_elem=elem.closest('.com-content-list-ContentListEpisodeItem'); }
            else if(elem.closest('.com-feature-area-SeriesListItem')){
                thum_elem=elem.closest('.com-feature-area-SeriesListItem'); }
            else if(elem.closest('.com-content-list-ContentListItem')){
                thum_elem=elem.closest('.com-content-list-ContentListItem'); }
            else if(elem.closest('.com-feature-area-EpisodeListItem')){
                thum_elem=elem.closest('.com-feature-area-EpisodeListItem'); }

            if(thum_elem){
                set_link(link_elem);
                set_list(link_elem, thum_elem);
                set_img(thum_elem);
                close(link_elem, thum_elem); }}});



    function box_env(){
        let mov_SVG=
            '<svg width="26" height="32" viewBox="0 3 83 83" style="vertical-align: -9px">'+
            '<path style="fill: #008eff;" d="M18 49C12 43 9 41 1 41L1 73C9 73 12 71 18 '+
            '65L18 79L72 79L72 54C72 50 71 45 72 41C73 38 76 37 77 35C80 32 82 27 82 23'+
            'C81 13 73 5 63 6C48 8 40 30 55 37C49 39 42 38 35 38C38 36 40 33 41 30C49 1'+
            '0 19 -3 10 16C9 18 8 21 8 23C8 31 13 33 17 39C19 42 18 46 18 49z"></path>'+
            '</svg>';

        let list_SVG=
            '<svg width="29" height="32" viewBox="0 0 320 320" style="vertical-align: -9px">'+
            '<path style="fill: #000;" d="M20 21L20 295L286 295L286 21L20 21z"></path>'+
            '<path style="fill: #bbb;" d="M42 37L42 107L148 107L148 3'+
            '7L42 37M166 43L166 59L263 59L263 43L166 43M166 72L166 82L249 82L249 72'+
            'L166 72M166 91L166 101L249 101L249 91L166 91M42 123L42 193L148 193L148'+
            ' 123L42 123M166 129L166 145L263 145L263 129L166 129M166 158L166 168L24'+
            '9 168L249 158L166 158M166 177L166 187L249 187L249 177L166 177M42 209L4'+
            '2 279L148 279L148 209L42 209M166 215L166 231L263 231L263 215L166 215M1'+
            '66 244L166 254L249 254L249 244L166 244M166 263L166 273L249 273L249 263'+
            'L166 263z"></path></svg>';


        let lightbox=
            '<div id="lightbox">'+
            '<a id="photo_link">'+ mov_SVG +' Movie Page</a>'+
            '<span id="video_list">'+ list_SVG +' List Frame</span>'+
            '<img id="box_img">'+
            '<style>'+
            '@keyframes fadeIn { 0% {opacity: 0} 100% {opacity: 1}} '+
            '.fin { animation: fadeIn .5s ease 0s 1 normal; animation-fill-mode: both; } '+
            '@keyframes fadeOut { 0% {opacity: 1} 100% {opacity: 0}} '+
            '.fout { animation: fadeOut .2s ease 0s 1 normal; animation-fill-mode: both; } '+
            '#lightbox { position: fixed; top: 0; left: 0; z-index: 3000; visibility: hidden; '+
            'background: black; width: 100vw; height: 100vh; text-align: center; } '+
            '#photo_link, #video_list { font: bold 21px Meiryo; position: absolute; top: 20px; '+
            'padding: 4px 12px 3px 10px; color: #000; background: #fff; cursor: pointer; '+
            'border: 2px solid #000; border-radius: 6px; text-decoration: none; } '+
            '#photo_link { left: 30px; visibility: hidden; } '+
            '#video_list { left: 230px; visibility: hidden; } '+
            '#photo_link:hover, #video_list:hover { outline: 2px solid #b0bec5; } '+
            '#box_img { width: 100vw; height: 100vh; padding: 2vh 2vw; object-fit: contain; } '+
            '.com-home-ChannelCardLinksPanel { '+
            'grid-template-columns: repeat(auto-fill,minmax(120px,1fr)); } '+
            '.com-home-ChannelCardLink__play, '+
            '.com-home-ChannelListReorderButton { font-size: 20px; } '+
            '</style></div>';

        if(!document.querySelector('#lightbox')){
            document.body.insertAdjacentHTML('beforeend', lightbox); }}



    function set_link(link){
        let photo_link=document.querySelector('#photo_link');
        if(photo_link){
            if(link){
                let url=link.getAttribute('href');
                if(url){
                    photo_link.setAttribute('href', url);
                    photo_link.style.visibility='visible'; }
                else{
                    photo_link.style.visibility='hidden'; }

                photo_link.onclick=function(event){
                    event.stopImmediatePropagation(); }}}}



    function set_list(link, thum){
        let video_list=document.querySelector('#video_list');
        if(video_list){
            if(link){
                video_list.style.visibility='visible'; }
            else{
                let table_item=thum.closest('.com-timetable-TimetableItem');
                if(table_item){
                    video_list.style.visibility='visible'; }
                else{
                    video_list.style.visibility='hidden'; }}

            video_list.onclick=function(event){
                event.preventDefault();
                if(link){
                    set_if(link); }
                else{
                    set_if_t(thum); }}}}



    function set_img(thum){
        let lightbox=document.querySelector('#lightbox');
        let box_img=lightbox.querySelector('#box_img');
        let img=thum.querySelector('img');
        if(lightbox && box_img && img){
            let img_url=img.getAttribute('src').replace(/\?.*$/,"");
            if(img_url){
                box_img.src=img_url;
                html_.style.overflow='hidden';
                lightbox.style.visibility='visible';
                lightbox.classList.remove('fout');
                lightbox.classList.add('fin'); }}}



    function close(){
        let html_=document.querySelector('html');
        let lightbox=document.querySelector('#lightbox');
        let box_img=lightbox.querySelector('#box_img');
        if(lightbox){
            lightbox.onclick=function(event){
                event.preventDefault();
                html_.style.overflow='inherit';
                lightbox.classList.remove('fin');
                lightbox.classList.add('fout');
                setTimeout(()=>{
                    lightbox.style.visibility='hidden';
                    box_img.src='';
                }, 200); }}}



    function set_if_t(thum){
        let table_item=thum.closest('.com-timetable-TimetableItem');
        if(table_item){
            let ssd_wrap=document.querySelectorAll(
                '.com-timetable-TimeTableSideSlotDetail__side-slot-detail-wrapper');
            for(let k=0; k<ssd_wrap.length; k++){
                ssd_wrap[k].style.display='none'; }

            table_item.click();
            setTimeout(()=>{
                for(let k=0; k<ssd_wrap.length; k++){
                    if(ssd_wrap[k].style.zIndex=='2'){
                        let list_link=ssd_wrap[k].querySelector('.com-a-Button--primary-dark');
                        if(list_link){
                            let close=
                                ssd_wrap[k].querySelector('.com-timetable-SideSlotDetail__close');
                            if(close){
                                close.click(); }
                            set_if(list_link); }}}
            }, 100); }

    } // set_if_t()

} //light_box()
