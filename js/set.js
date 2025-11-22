// 背景图片 Cookies
function setBgImg(bg_img) {
  if (bg_img) {
    Cookies.set("bg_img", bg_img, {
      expires: 36500,
    });
    return true;
  }
  return false;
}

// 获取背景图片 Cookies
function getBgImg() {
  let bg_img_local = Cookies.get("bg_img");
  if (bg_img_local && bg_img_local !== "{}") {
    return JSON.parse(bg_img_local);
  } else {
    setBgImg(bg_img_preinstall);
    return bg_img_preinstall;
  }
}

let bg_img_preinstall = {
  type: "1", // 1:默认背景 2:每日一图 3:随机风景 4:随机动漫
  path: "", //自定义图片
};

// 更改背景图片
function setBgImgInit() {
  let bg_img = getBgImg();
  $("input[name='wallpaper-type'][value=" + bg_img["type"] + "]").click();

  switch (bg_img["type"]) {
    case "1":
      $("#bg").attr("src", `./img/background${1 + ~~(Math.random() * 10)}.jpg`); //随机默认壁纸
      break;
    case "2":
      $("#bg").attr("src", "https://api.dujin.org/bing/1920.php"); //必应每日
      break;
    case "3":
      $("#bg").attr("src", "https://tu.ltyuanfang.cn/api/fengjing.php"); //随机风景
      break;
    case "4":
      $("#bg").attr("src", "https://t.mwm.moe/fj"); //随机动漫
      break;
  }
}

$(document).ready(function () {
  // Pemuatan data wallpaper
  setBgImgInit();

  // Atur gambar background
  $("#wallpaper").on("click", ".set-wallpaper", function () {
    let type = $(this).val();
    let bg_img = getBgImg();
    bg_img["type"] = type;
    setBgImg(bg_img);

    // --- OPSI BACKGROUND ---

    if (type === "1") {
      // Fungsi yang akan menjalankan slide acak
      function autoSlideBg() {
        // Wallpaper standar/bawaan secara acak (sudah diubah ke .jpg)
        $("#bg").attr(
          "src",
          `./img/background${1 + ~~(Math.random() * 10)}.jpg`
        );
      }

      // Jalankan sekali saat tombol diklik/dipilih
      autoSlideBg();

      // Aktifkan Slideshow Otomatis setiap 5 detik (5000 ms)
      // Catatan: Jika Anda ingin mematikan slideshow saat opsi lain dipilih,
      // Anda perlu menggunakan clearInterval di awal fungsi ini.
      setInterval(autoSlideBg, 5000);
    } else if (type === "2") {
      // Bing setiap hari
      $("#bg").attr("src", "https://api.dujin.org/bing/1920.php");
    } else if (type === "3") {
      // Pemandangan Acak
      $("#bg").attr("src", "https://tu.ltyuanfang.cn/api/fengjing.php");
    } else if (type === "4") {
      // Anime Acak
      $("#bg").attr("src", "https://t.mwm.moe/fj");
    }

    iziToast.show({
      icon: "fa-solid fa-image",
      timeout: 2500,
      message: "Pengaturan wallpaper berhasil",
    });
  });
});
