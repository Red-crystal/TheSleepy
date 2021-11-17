let currentPlaying; // 현재 재생되고 있는 리스트 아이템의 index
let currentAudio; // 현재 재생되는 있는 리스트 아이템의 audio 태그

$(function(){
    $('#pause').click(function(){
        $(this).toggleClass('playstop')

          if($(this).hasClass('playstop')){
            $('.play-btn').fadeOut(300);
            $('.stop-btn').fadeIn(300);
          }else{
            $('.play-btn').fadeIn(300);
            $('.stop-btn').fadeOut(300);
          }
    });

    $('#lyrics').click(function(){
        $(this).parents().find('.blur').fadeIn(300);
        $(this).parents().find('#close').fadeIn(300);

        $(this).parents().find('#lyrics_contents').fadeIn(300);
    });

    $('#close').click(function(){
        $(this).parents().find('.blur').fadeOut(300);
        $(this).fadeOut(300);
        $(this).parents().find('#lyrics_contents').fadeOut(300);
    });
    
    // ===== List 생성하기 =====
    addItem('CLOSE TO YOU', 'THE CARPENTERS', './music-play-list/00.png', './music-play-list/00.mp3');
    addItem('WORLD TOUR', 'CLAIRE ROSINKRANZ', './music-play-list/01.png', './music-play-list/01.mp3');
    addItem('PHOTOGRAPH', 'REILEY', './music-play-list/02.png', './music-play-list/02.mp3');
    addItem('HEATHER', 'OLIVIA RODRINGO', './music-play-list/03.png', './music-play-list/03.mp3');
    addItem('PAUL', 'QUINN XCII', './music-play-list/04.png', './music-play-list/04.mp3');
    addItem('DRUNK', 'ARIANA GRANDE', './music-play-list/05.png', './music-play-list/05.mp3');
    addItem('FALLING', 'BENNY BLANCO', './music-play-list/06.png', './music-play-list/06.mp3');
    addItem('SILVER LININGS', 'BIRDY', './music-play-list/07.png', './music-play-list/07.mp3');
    addItem('HAPPY BIRTHDAY', 'CARLY RAE JEPSEN', './music-play-list/08.png', './music-play-list/01.mp3');
    addItem('VINTAGE ADVERTISEMENT', 'FIN ARGUS', './music-play-list/09.png', './music-play-list/02.mp3');
    addItem('ROSEN', 'OWL CITY', './music-play-list/10.png', './music-play-list/03.mp3');
    addItem('TLA LA LAND', 'LUKAS GRAHAM', './music-play-list/11.png', './music-play-list/04.mp3');
    setPlayer(0); // 0번 곡으로 초기값 설정
    

    // ===== 재생 이벤트 등록 =====
    $('#prev').click(function(){
        playPrev();
    });
    $('#pause').click(function(){
        pauseAndPlay();
    });
    $('#next').click(function(){
        playNext();
    });
    
    // ===== 프로그래스바 채우기 =====
    setInterval(function(){
        let progress = getProgress() * 100;
        $('.player-progress > div').css('width', progress + '%');
    
        setLyrics();
    }, 100)
    })
    
    
    // ===== List에 아이템을 추가하는 함수 =====
    function addItem(title, subtitle, image, audio){
        let newItem = $('#example_item').clone(true);
        newItem.removeProp('id');
        newItem.show();
    
        // 팀별로 리스트 아이템에 맞는 클래스 정보를 찾아서 교체해주기
        newItem.prop('title', title)
        newItem.prop('subtitle', subtitle)
        newItem.find('.item-img').css('background-image', "url('" + image + "')");
        newItem.find('.item-audio > source').attr('src', audio);
        
        // 리스트 아이템 클릭시 이벤트 등록
        newItem.click(function(){
            currentAudio[0].pause(); // 재생중인 오디오 중지
            currentAudio[0].currentTime = 0; // 재생중인 오디오 위치 초기화
            $(this).find('.item-audio')[0].play(); // 선택된 오디오 재생
    
            setPlayer( $(this).index() ); // setPlayer 함수 호출 (플레이어로 정보 전달)
        })
    
        // 리스트에 아이템 추가
        $('#music_list').append(newItem);
    }
    
    // ===== Player에 정보 넣는 함수 =====
    function setPlayer(index){
        currentPlaying = index;
        currentAudio = $('#music_list > .item').eq(index).find('.item-audio');
        
    
        // 아이템에 들어가는 정보에 따라 변경
        let title = $('#music_list > .item').eq(index).prop('title');
        let subtitle = $('#music_list > .item').eq(index).prop('subtitle');
        let image = $('#music_list > .item').eq(index).find('.item-img').css('background-image');
    
        $('.text_title > h1').text(title)
        $('.text_title > h2').text(subtitle)
        $('.player-img').css('background-image', image);
    
        setPosition(index);

        console.log(title, subtitle);

        
    }
    
    // ===== 재생 컨트롤 함수 =====
    function playPrev(){
        currentPlaying--;
        if(currentPlaying < 0 ) currentPlaying = $('#music_list > .item').length - 1;
    
        $('#music_list > .item').eq(currentPlaying).click();
    }
    
    function pauseAndPlay(){
        if(currentAudio[0].paused) currentAudio[0].play();
        else currentAudio[0].pause();
    }
    
    function playNext(){
        currentPlaying++;
        if(currentPlaying >= $('#music_list > .item').length ) currentPlaying = 0;
    
        $('#music_list > .item').eq(currentPlaying).click();
    }
    
    function getProgress(){
        return currentAudio[0].currentTime / currentAudio[0].duration;
    }
    
    
    // 가사 보이기
    function dis(){
        if($('#lyrics_contents').css('display') == 'none'){
        $('#lyrics_contents').show();
      }else{
        $('#lyrics_contents').hide();
      }
    }
    
    
    function setPosition(index){
        let pos = 0.5 * window.innerWidth - 115 - 270 * index;
    
        $('.item').css('opacity', 0.1)
        $('.item').eq(index-1).css('opacity', 0.5)
        $('.item').eq(index).css('opacity', 1)
        $('.item').eq(index+1).css('opacity', 0.5)
    
        $('.item').css('transform', 'scale(0.9)')
        $('.item').eq(index).css('transform', 'scale(1.1)')
    
        $('#music_list').animate({left: pos}, 500, 'swing');
    }
    
    
    function setLyrics(){
        let time = currentAudio[0].currentTime;
    
        let lyricIndex = 0;
    
        $('#lyrics_contents > p').each(function(index, item){
            if(time >= parseInt ($(item).attr('start') ) ){
                lyricIndex = index;
            }
        })
    
        console.log(lyricIndex);
        
    
        $('#lyrics_contents > p').css('opacity', 0.1)
        $('#lyrics_contents > p').eq(lyricIndex-1).css('opacity', 0.5)
        $('#lyrics_contents > p').eq(lyricIndex).css('opacity', 1)
        $('#lyrics_contents > p').eq(lyricIndex+1).css('opacity', 0.5)
    
        // $('#lyrics_contents').css('transform', 'scale(0.9)')
        // $('#lyrics_contents').eq(lyricIndex).css('transform', 'scale(1.1)')
    
        let pos = 0.5 * window.innerHeight - lyricIndex * 58;
        // $('#lyrics_contents').animate({top: pos}, 500, 'swing');
        $('#lyrics_contents').css({top: pos});
    
        
    }

    $(window).resize(function(){
        let pos = 0.5 * window.innerWidth - 115 - 270 * currentPlaying;
        $('#music_list').css('left', pos);
    })