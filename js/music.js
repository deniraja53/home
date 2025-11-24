const { ap } = require("../sw");

let server = "tencent"; // Opsi server: netease (NetEase Cloud Music); tencent (QQ Music); kugou; xiami; kuwo
let type = "playlist"; // song: Lagu Tunggal; playlist: Daftar Putar; album: Album
let id = "7476871946"; // ID Sampul / ID Lagu Tunggal / ID Daftar Putar

$("#volume-ico").html("<i class='fa-solid fa-volume-low'></i>");

/*LIRIK BAGIAN BAWAH/
setInterval(function () {
  $("#lrc").html(
    "<span class='lrc-show'><svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='18' height='18'><path fill='none' d='M0 0h24v24H0z'/><path d='M12 13.535V3h8v3h-6v11a4 4 0 1 1-2-3.465z' fill='rgba(255,255,255,1)'/></svg>&nbsp;" +
      $(".aplayer-lrc-current").text() +
      "&nbsp;<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='18' height='18'><path fill='none' d='M0 0h24v24H0z'/><path d='M12 13.535V3h8v3h-6v11a4 4 0 1 1-2-3.465z' fill='rgba(255,255,255,1)'/></svg></span>"
  );
}, 500);

/* NOTOFIKASI & KONTROL MUSIK */
ap.on("play", function () {
  music = $(".aplayer-title").text() + $(".aplayer-author").text();
  iziToast.info({
    timeout: 4000,
    icon: "fa-solid fa-circle-play",
    displayMode: "replace",
    message: music,
  });
  $("#play").html("<i class='fa-solid fa-pause'></i>");
  $("#Terhubung").html(
    "<audio src='https://res.cloudinary.com/dzf8k6xcp/video/upload/v1763807995/Yeshua-Abraham-Terhubung_krk78b.mp3' preload='none'></audio>" +
      $(".aplayer-title").text() +
      $(".aplayer-author").text()
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

/* PERGANTIAN MUSIK */
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

/* Lagu Sebelumnya dan Berikutnya (Previous and Next Track) */
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

/* BUKA DAFTAR MUSIK */
$("#music-open").on("click", function () {
  if ($(document).width() >= 990) {
    $("#box").css("display", "block");
    $("#row").css("display", "none");
    $("#more").css("cssText", "display:none !important");
  }
});

//PENGATURAN VOLUME
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
