// Menggunakan objek status untuk mengelola variabel global
const state = {
  times: 0,
  shoemore: false,
  switchmenu: false,
  changemore: false,
};

// Cache (Simpan Sementara)
const $elements = {
  linkText: $("#link-text"),
  container: $("#container"),
  loadingBox: $("#loading-box"),
  hitokotoText: $("#hitokoto_text"),
  fromText: $("#from_text"),
  social: $("#social"),
  pointer: $("#pointer"),
  bg: $("#bg"),
  cover: $(".cover"),
  section: $("#section"),
  row: $("#row"),
  menu: $("#menu"),
  box: $("#box"),
  more: $("#more"),
  rightone: $("#rightone"),
  change: $("#change"),
  change1: $("#change1"),
  close: $("#close"),
  openmore: $("#openmore"),
  closemore: $("#closemore"),
};

// Debounce Function
function debounce(fn, delay) {
  let timer;
  return function () {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, arguments), delay);
  };
}

// Mendapatkan Versi
function fetchVersion() {
  if (!navigator.serviceWorker?.controller) {
    setTimeout(fetchVersion, 300);
    return;
  }

  const handleMessage = (event) => {
    if (event.data.type === "VERSION_INFO") {
      const cleanVersion = event.data.version.replace(/[^\d.]/g, "");
      $("span.img-github span").text(cleanVersion);
      navigator.serviceWorker.removeEventListener("message", handleMessage);
    }
  };

  navigator.serviceWorker.addEventListener("message", handleMessage);
  navigator.serviceWorker.controller.postMessage({ type: "GET_VERSION" });
}

// Konfigurasi Gaya Pop-up
iziToast.settings({
  timeout: 10000,
  progressBar: false,
  close: false,
  closeOnEscape: true,
  position: "topCenter",
  transitionIn: "bounceInDown",
  transitionOut: "flipOutX",
  displayMode: "replace",
  layout: "1",
  backgroundColor: "#00000040",
  titleColor: "#efefef",
  messageColor: "#efefef",
  icon: "Fontawesome",
  iconColor: "#efefef",
});

// Gaya Kursor Mouse
if (!/Mobi|Tablet|iPad|iPhone|Android/i.test(navigator.userAgent)) {
  const halfElementWidth = $elements.pointer[0].offsetWidth / 2;

  function setPosition(x, y) {
    $elements.pointer.css({
      transform: `translate(${x - halfElementWidth + 19}px, ${
        y - halfElementWidth + 19
      }px)`,
    });
  }

  $(document).on("mousemove", (e) => {
    window.requestAnimationFrame(() => setPosition(e.clientX, e.clientY));
  });
} else {
  $elements.pointer.hide();
}

// Jalankan Setelah Pemuatan Selesai
$(window).on("load", function () {
  // Loading Animation
  $elements.loadingBox.addClass("loaded");
  $elements.bg.css({
    transform: "scale(1)",
    filter: "blur(0px)",
    transition: "ease 1.5s",
  });
  $elements.cover.css("opacity", 1);
  $elements.section.css({
    transform: "scale(1)",
    opacity: 1,
    filter: "blur(0px)",
  });

  // User Welcome
  setTimeout(() => {
    iziToast.show({
      timeout: 2500,
      icon: false,
      title: timeProcessor.getGreeting(),
      message: "Selamat Datang di Beranda Saya",
    });
  }, 800);

  // Pemuatan Tertunda (Lazy Loading) Pemutar Musik
  if (document.readyState === "complete") {
    loadMusicPlayer();
  } else {
    window.addEventListener("load", loadMusicPlayer);
  }
});

// Loading Music Player
function loadMusicPlayer() {
  const script = document.createElement("script");
  script.src = "./js/music.js";
  script.async = true;
  document.body.appendChild(script);
}

// Fungsi Sepatah Kata
const fetchHitokoto = debounce(async function () {
  try {
    const response = await fetch("https://v1.hitokoto.cn?max_length=24");
    if (!response.ok) throw new Error("Network response was not ok");
    const data = await response.json();
    $elements.hitokotoText.text(data.hitokoto);
    $elements.fromText.text(data.from);
  } catch (error) {
    console.error("Error fetching hitokoto:", error);
    $elements.hitokotoText.text("Gagal memuat sepatah kata.");
  }
}, 1000);

$("#hitokoto").on("click", function () {
  if (state.times === 0) {
    state.times = 1;
    setTimeout(() => {
      state.times = 0;
    }, 1000);
    fetchHitokoto();
  } else {
    iziToast.show({
      timeout: 2000,
      icon: "fa-solid fa-circle-exclamation",
      message: "Anda Mengeklik Terlalu Gesit",
    });
  }
});

// Fungsi Cuaca
fetch("https://api.vvhan.com/api/weather")
  .then((response) => {
    if (!response.ok) throw new Error("Network response was not ok");
    return response.json();
  })
  .then((data) => {
    $("#wea_text").text(data.data.type);
    $("#city_text").text(data.city);
    $("#tem_low").text(data.data.low);
    $("#tem_high").text(data.data.high);
  })
  .catch((error) => {
    console.error("Error fetching weather:", error);
  });

// Konfigurasi Tautan Media Sosial
const socialLinks = [
  {
    id: "github",
    hint: "deniraja53",
    icon: "fa-brands fa-github",
    url: "https://github.com/deniraja53",
    target: "_blank",
    marginLeft: "4px",
  },
  {
    id: "email",
    hint: "Tulis/Kirim Email",
    icon: "fa-solid fa-envelope",
    url: "deniraja53@guru.sd.belajar.id",
  },
  {
    id: "telegram",
    hint: "Silakan kirim telegram",
    icon: "fa-brands fa-telegram",
    url: "URL...",
    target: "_blank",
  },
  {
    id: "tiktok",
    hint: "Ikuti di Tik-tok~",
    icon: "fa-brands fa-x-twitter",
    url: "https://www.tiktok.com/@denoxz99?_r=1&_t=ZS-91aeJwA6i5o",
    target: "_blank",
  },
  {
    id: "phone",
    hint: "hubungi saya melalui whatsapp",
    icon: "fa-solid fa-square-phone",
    url: "tel:+6281227278811",
  },
];

// Mengatur Awal Tautan Media Sosial
function initSocialLinks() {
  const { social, linkText } = $elements;

  // 清空现有链接（保留提示文本）
  social.children(".link").remove();

  // Buat Tautan Sosial Berurutan
  socialLinks
    .slice()
    .reverse()
    .forEach((config) => {
      const $link = $(`
            <a href="${config.url}" 
               class="link" 
               id="${config.id}"
               ${
                 config.target
                   ? `target="${config.target}" rel="noopener noreferrer"`
                   : ""
               }>
                <i class="${config.icon}"></i>
            </a>
        `);

      if (config.marginLeft) {
        $link.css("margin-left", config.marginLeft);
      }

      social.prepend($link);
    });

  // Efek Hover Keseluruhan Area Sosial
  social.hover(
    () => {
      social.addClass("social-hover");
      linkText.show();
    },
    () => {
      social.removeClass("social-hover");
      linkText.hide();
    }
  );

  // Efek Petunjuk/Hint Tautan Tunggal
  const linkMap = {};
  socialLinks.forEach((link) => {
    linkMap[link.id] = link.hint;
  });

  social
    .on("mouseenter", ".link", function () {
      const id = $(this).attr("id");
      linkText.text(linkMap[id]).show();
    })
    .on("mouseleave", ".link", function () {
      linkText.text("Hubungi Saya Melalui Sini");
    });
}

// Inisialisasi Setelah Dokumen Selesai Dimuat
$(document).ready(initSocialLinks);

// Pergantian (Switching) Halaman Lebih Lanjut
$("#switchmore").on("click", function () {
  state.shoemore = !state.shoemore;
  if (state.shoemore && $(document).width() >= 990) {
    $elements.container.addClass("mores");
    $elements.change.html("Oops&nbsp;!");
    $elements.change1.html("Wah, Anda menemukannya! (Klik lagi untuk menutup)");
  } else {
    $elements.container.removeClass("mores");
    $elements.change.html("Hello&nbsp;World&nbsp;!");
    $elements.change1.html(
      "Beri ruang bagi diri, buka jendela pikiran. Nikmati keemasan senja di bawah langit terbuka."
    );
  }
});

// Tombol Tutup Halaman
$elements.close.on("click", function () {
  $("#switchmore").trigger("click");
});

// Fungsionalitas Buka/Tutup Menu Navigasi di Perangkat Seluler
$("#switchmenu").on("click", function () {
  state.switchmenu = !state.switchmenu;
  if (state.switchmenu) {
    $elements.row.addClass("menus");
    $elements.menu.html("<i class='fa-solid fa-xmark'></i>");
  } else {
    $elements.row.removeClass("menus");
    $elements.menu.html("<i class='fa-solid fa-bars'></i>");
  }
});

// Tampilan Pop-up Lebih Lanjut
$elements.openmore.on("click", function () {
  $elements.box.show();
  $elements.row.hide();
  $elements.more.hide();
});

$elements.closemore.on("click", function () {
  $elements.box.hide();
  $elements.row.show();
  $elements.more.show();
});

// Area Peralihan Fungsionalitas Versi Mobile
$("#changemore").on("click", function () {
  state.changemore = !state.changemore;
  $elements.rightone.toggleClass("mobile", state.changemore);
});

// Memantau/Mendengarkan Lebar Halaman Web
const handleResize = debounce(function () {
  if (window.innerWidth >= 600) {
    $elements.row.removeClass("menus");
    $elements.menu.html("<i class='fa-solid fa-bars'></i>");
    $elements.rightone.removeClass("mobile");
  }

  if (window.innerWidth <= 990) {
    $elements.container.removeClass("mores");
    $elements.change.html("Hello&nbsp;World&nbsp;!");
    $elements.change1.html(
      "Beri ruang, buka jendela. Nikmati waktu luang di bawah langit terbuka."
    );
    $elements.box.hide();
    $elements.row.show();
    $elements.more.show();
  }
}, 200);

window.addEventListener("resize", handleResize);

// Tampilkan Tombol Tutup Halaman
$elements.more.on({
  mouseenter: () => {
    $elements.close.add($elements.openmore).addClass("show-buttons");
  },
  mouseleave: () => {
    $elements.close.add($elements.openmore).removeClass("show-buttons");
  },
});

$(".box-wrapper").on({
  mouseenter: () => {
    $elements.closemore.addClass("show-buttons");
  },
  mouseleave: () => {
    $elements.closemore.removeClass("show-buttons");
  },
});

// Disable Klik Kanan
document.oncontextmenu = function () {
  iziToast.show({
    timeout: 2000,
    icon: "fa-solid fa-circle-exclamation",
    message: "Demi pengalaman browsing yang optimal, klik kanan dinonaktifkan.",
  });
  return false;
};

// Pemuatan Awal
document.addEventListener("DOMContentLoaded", fetchVersion);
setTimeout(() => $("#loading-text").html("File Mungkin Butuh Waktu"), 3000);
