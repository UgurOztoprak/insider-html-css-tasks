$(function () {
  $('[data-fancybox="detay"]').fancybox();

  function detaylarContainerOlustur() {
    let detaylar = $("#detaylar");
    if (detaylar.length === 0) {
      detaylar = $('<div id="detaylar" style="display:none;"></div>').appendTo(
        "body"
      );
    } else {
      detaylar.empty();
    }
    return detaylar;
  }

  function kartHtml(kisi, index) {
    return `
      <div class="kart">
        <a data-fancybox="detay" data-src="#detay-${index}" href="javascript:;">
          <img src="${kisi.picture.large}" alt="Profil" />
          <h4>${kisi.name.first} ${kisi.name.last}</h4>
          <p>${kisi.email}</p>
          <p>${kisi.location.country}</p>
        </a>
      </div>
    `;
  }

  function detayHtml(kisi, index) {
    return `
      <div id="detay-${index}">
        <h3>${kisi.name.title} ${kisi.name.first} ${kisi.name.last}</h3>
        <p><strong>Email:</strong> ${kisi.email}</p>
        <p><strong>Telefon:</strong> ${kisi.phone}</p>
        <p><strong>Yaş:</strong> ${kisi.dob.age}</p>
        <p><strong>Doğum:</strong> ${new Date(
          kisi.dob.date
        ).toLocaleDateString()}</p>
        <img src="${
          kisi.picture.large
        }" style="width:150px; border-radius:10px;" />
      </div>
    `;
  }

  function sliderItemHtml(kisi) {
    return `
      <div class="item">
        <img src="${kisi.picture.thumbnail}" alt="${kisi.name.first}" />
        <p>${kisi.name.first}</p>
      </div>
    `;
  }

  $("#getir").click(function () {
    $.ajax({
      url: "https://randomuser.me/api/?results=10",
      dataType: "json",
      success: function (veri) {
        const $kullanicilar = $("#kullanicilar").empty();
        const $slider = $(".slider");
        if ($slider.hasClass("slick-initialized")) {
          $slider.slick("unslick");
        }
        $slider.empty();

        const $detaylar = detaylarContainerOlustur();

        veri.results.forEach(function (kisi, index) {
          $kullanicilar.append($(kartHtml(kisi, index)).hide().fadeIn(800));
          $detaylar.append(detayHtml(kisi, index));
          $slider.append(sliderItemHtml(kisi));
        });

        $slider.slick({
          slidesToShow: 3,
          autoplay: false,
          arrows: true,
          dots: true,
          speed: 500,
          cssEase: "ease-in-out",
        });

        $('[data-fancybox="detay"]').fancybox();
      },
      error: function () {
        alert("Veri alınamadı.");
      },
    });
  });
});
