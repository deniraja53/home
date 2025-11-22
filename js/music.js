let server = "tencent"; // Opsi server: netease (NetEase Cloud Music); tencent (QQ Music); kugou; xiami; kuwo
let type = "playlist"; // song: Lagu Tunggal; playlist: Daftar Putar; album: Album
let id = "7476871946"; // ID Sampul / ID Lagu Tunggal / ID Daftar Putar

// Konfigurasi APlayer untuk Playlist Lokal (MP3)
const ap = new APlayer({
    container: document.getElementById('aplayer'), // Player di sidebar
    fixed: false,
    autoplay: true, // Ubah ke false jika tidak ingin auto-play
    theme: '#b7daff',
    loop: 'all', // all (ulang semua), one (ulang satu lagu), none (tidak ulang)
    order: 'random', // random (acak) atau normal
    preload: 'auto',
    volume: 0.7,
    mutex: true,
    listFolded: false, // Daftar lagu terbuka saat dimuat
    listMaxHeight: '150px',
    audio: [
        {
            name: 'Terhubung', 
            artist: 'Yeshua Abraham', 
            url: './music/Yeshua-Abraham-Terhubung.mp3',
            cover: './img/denii.png', 
        },
        {
            name: 'KAU MENGENAL HATIKU', 
            artist: 'Yeshua Abraham', 
            url: './music/KAU-MENGENAL-HATIKU.mp3',
            cover: './img/denii.png',
        },
        {
            name: 'MengenalMu', 
            artist: 'Yeshua Abraham', 
            url: './music/MengenalMu-Yeshua-Abraham.mp3',
            cover: './img/denii.png', 
        },
        {
            name: 'Saat Teduh: Yesusku Kau Terindah', 
            artist: 'Yeshua Abraham', 
            url: './music/Saat-Teduh-Yesusku-Kau-Terindah.mp3',
            cover: './img/denii.png',
        }
        {
            name: 'Kumilik-Mu', 
            artist: 'JPCC-Worship', 
            url: './music/Kumilik-Mu-JPCC.mp3',
            cover: './img/denii.png',
        }     
    ]
});
    $("#volume-ico").html("<i class='fa-solid fa-volume-low'></i>");

    /* 底栏歌词 */
    setInterval(function () {
      $("#lrc").html(
        "<span class='lrc-show'><svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='18' height='18'><path fill='none' d='M0 0h24v24H0z'/><path d='M12 13.535V3h8v3h-6v11a4 4 0 1 1-2-3.465z' fill='rgba(255,255,255,1)'/></svg>&nbsp;" +
          $(".aplayer-lrc-current").text() +
          "&nbsp;<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='18' height='18'><path fill='none' d='M0 0h24v24H0z'/><path d='M12 13.535V3h8v3h-6v11a4 4 0 1 1-2-3.465z' fill='rgba(255,255,255,1)'/></svg></span>"
      );
    }, 500);

    /* 音乐通知及控制 */
    ap.on("play", function () {
      music = $(".aplayer-title").text() + $(".aplayer-author").text();
      iziToast.info({
        timeout: 4000,
        icon: "fa-solid fa-circle-play",
        displayMode: "replace",
        message: music,
      });
      $("#play").html("<i class='fa-solid fa-pause'>");
      $("#music-name").html(
        $(".aplayer-title").text() + $(".aplayer-author").text()
      );
      if ($(document).width() >= 990) {
        $(".power").css("cssText", "display:none");
        $("#lrc").css("cssText", "display:block !important");
      }
    });

    ap.on("pause", function () {
      $("#play").html("<i class='fa-solid fa-play'>");
      if ($(document).width() >= 990) {
        $("#lrc").css("cssText", "display:none !important");
        $(".power").css("cssText", "display:block");
      }
    });

    $("#music").hover(
      function () {
        $(".music-text").css("display", "none");
        $(".music-volume").css("display", "flex");
      },
      function () {
        $(".music-text").css("display", "block");
        $(".music-volume").css("display", "none");
      }
    );

    /* 一言与音乐切换 */
    $("#open-music").on("click", function () {
      $("#hitokoto").css("display", "none");
      $("#music").css("display", "flex");
    });

    $("#hitokoto").hover(
      function () {
        $("#open-music").css("display", "flex");
      },
      function () {
        $("#open-music").css("display", "none");
      }
    );

    $("#music-close").on("click", function () {
      $("#music").css("display", "none");
      $("#hitokoto").css("display", "flex");
    });

    /* 上下曲 */
    $("#play").on("click", function () {
      ap.toggle();
      $("#music-name").html(
        $(".aplayer-title").text() + $(".aplayer-author").text()
      );
    });

    $("#last").on("click", function () {
      ap.skipBack();
      ap.play();
      $("#music-name").html(
        $(".aplayer-title").text() + $(".aplayer-author").text()
      );
    });

    $("#next").on("click", function () {
      ap.skipForward();
      ap.play();
      $("#music-name").html(
        $(".aplayer-title").text() + $(".aplayer-author").text()
      );
    });

    window.onkeydown = function (e) {
      if (e.keyCode == 32) {
        ap.toggle();
      }
    };

    /* 打开音乐列表 */
    $("#music-open").on("click", function () {
      if ($(document).width() >= 990) {
        $("#box").css("display", "block");
        $("#row").css("display", "none");
        $("#more").css("cssText", "display:none !important");
      }
    });

    //音量调节
    $("#volume").on("input propertychange touchend", function () {
      let x = $("#volume").val();
      ap.volume(x, true);
      if (x == 0) {
        $("#volume-ico").html("<i class='fa-solid fa-volume-xmark'></i>");
      } else if (x > 0 && x <= 0.3) {
        $("#volume-ico").html("<i class='fa-solid fa-volume-off'></i>");
      } else if (x > 0.3 && x <= 0.6) {
        $("#volume-ico").html("<i class='fa-solid fa-volume-low'></i>");
      } else {
        $("#volume-ico").html("<i class='fa-solid fa-volume-high'></i>");
      }
    });
  },
  error: function () {
    setTimeout(function () {
      iziToast.info({
        timeout: 8000,
        icon: "fa-solid fa-circle-exclamation",
        displayMode: "replace",
        message: "音乐播放器加载失败",
      });
    }, 3800);
  },
});
