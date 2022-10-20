const urls = new Map();
let numOfitems;
let c = [];
let num_c = 0;
let c_2 = new Map();
let size = 0;
let global_cloud;
let cookie_num;
let newCountValue = 0;
let nakd_num = 0;
let loc;
let nakd_count = [1, 1];
let nakd_tc;
let nakd_tw;

const init = () => {
  if (!localStorage.getItem("flag")) {
    localStorage.setItem("flag", "true");
  }
  chrome.runtime.sendMessage("get-tab-info", (response) => {
    gotSiteName(response);
  });
};

const gotSiteName = (response) => {
  let siteName;
  urls.set("https://www.na-kd.com/sv/kassan", "nakd");
  urls.set("https://www2.hm.com/sv_se/cart", "hm");
  urls.set("https://www.shein.se/cart", "shein");
  urls.set("https://www.zalando.se/cart", "zalando");
  urls.set("https://www.zalando.se/cart/", "zalando");
  urls.set("https://nelly.com/se/kassa/", "nelly");
  urls.set("https://www.bubbleroom.se/Shop/Order/Index", "bubbleroom");
  urls.set("https://junkyard.com/sv/functional/kassa/varukorg/", "junkyard");
  urls.set("https://bikbok.com/sv/butik/Checkout/CartPage/", "bikbok");

  if (response && response.includes("ellos")) {
    siteName = "ellos";
  }
  else if (response) {
    siteName = urls.get(response);
    loc = response;
  } else if (!response || response == null) {
    chrome.runtime.sendMessage("get-tab-info", (response) => {
      gotSiteName(response);
      loc = response;
    });
  }


  switch (siteName) {
    case "nakd":
      nakd();
      break;
    case "hm":
      hm();
      break;
    case "shein":
      shein();
      break;
    case "zalando":
      zalando();
      break;
    case "nelly":
      nelly();
      break;
    case "ellos":
      ellos();
      break;
    case "bubbleroom":
      bubbleroom();
      break;
    case "junkyard":
      junkyard();
      break;
    case "bikbok":
      bikbok();
      break;
  }
};

const handleCloud = (n, items) => {
  let items_count = 0;

  if (document.getElementsByClassName('cloud-chrome-extension')[0] !== undefined || null) {
    document.getElementsByClassName('cloud-chrome-extension')[0].id = 'cloud';
    let cloud = document.getElementById('cloud');

    if (n == -1) {
      size = size + (n * 60);
      cloud.style.width = `${size}px`;
      cloud.style.height = `${size}px`;
    } else if (n == 1) {
      size = size + (n * 60);
      cloud.style.width = `${size}px`;
      cloud.style.height = `${size}px`;
    } 
    if (n == 0) {
      size = items * 60;
      cloud.style.width = `${size}px`;
      cloud.style.height = `${size}px`;
      newCountValue = 0;
    }

  } else if (document.getElementsByClassName('cloud-chrome-extension')[0] == undefined || null) {
    for (let u = 0; u < items.length; u++) {
      items_count += parseInt(items[u]);
      if (u == items.length - 1) {
        size = items_count * 60;
      }
    }
  }
}


//NAKD
const nakd = () => {
  let container = document.getElementById("container");
  var images = container.getElementsByTagName("img");
  var srcList = [];
  var altList = [];
  let imageUrls;
  let imageAlts;
  let countList = 'nakd';
  let c = [];

  setTimeout(() => {
    for (var i = 0; i < images.length; i++) {
      srcList.push(images[i].src);
      altList.push(images[i].alt);

      if (i === images.length - 1) {
        imageUrls = srcList.slice(1, -1);
        imageAlts = altList.slice(1, -1);
        for (let u = 0; u < imageAlts.length; u++) {
          c.push(1);
        }
        createPopup(imageUrls, imageAlts, countList);
        nakd_num = imageUrls.length;
        handleCloud(7, c);
      }
    }
  }, 1000);
};

//HM
const hm = () => {
  let container = document.getElementById("sidebar-sticky-boundary");
  let images = container.getElementsByClassName("Image-module--image__1qc76");
  let srcList = [];
  let altList = [];
  let countList = [];

  setTimeout(() => {
    for (var i = 0; i < images.length; i++) {
      srcList.push(images[i].currentSrc);
      altList.push(images[i].alt);

      if (i === images.length - 1) {
        for (var k = 0; k < images.length; k++) {
          let count_div = container.getElementsByClassName('Select-module--select__5Uzpn');
          countList.push(count_div[k].value)
          count_div[k].onchange = (event) => {
            for (var c = 0; c < count_div.length; c++) {
              if (count_div[c] == event.target) {
                newCountValue += parseInt(event.target.value);
              } else {
                newCountValue += parseInt(count_div[c].value);
              }
              if (c == count_div.length - 1) {
                handleCloud(0, newCountValue);
              }
            }
          }
        }
        createPopup(srcList, altList, countList);
        handleCloud(7, countList);
      }
    }
  }, 1000);
};

const shein = () => {
  let container = document.getElementsByClassName(
    "col-sm-8 c-check c-check-cart-left c-check-bag j-check-bag"
  )[0];
  let images = [];
  images = container.getElementsByClassName("i-img");
  let newAltList;
  let alts = [];
  alts = container.getElementsByClassName("gd-name");
  let buttons_add = document.getElementsByClassName('qty-opt right');
  let buttons_del = document.getElementsByClassName('qty-opt left');
  for (let v = 0; v < buttons_add.length; v++) {
    buttons_add[v].addEventListener('click', () => { handleCloud(1, countList) });
    buttons_del[v].addEventListener('click', () => { handleCloud(-1, countList) });
  }

  let srcList = [];
  let altList = [];
  let countList = [];

  for (var i = 0; i < images.length; i++) {
    if (images[i].src.includes("thumbnail")) {
      srcList.push(images[i].src);
    }
    for (var j = 0; j < alts.length; j++) {
      altList.push(alts[i].innerText);
      if (j === alts.length - 1) {
        newAltList = [...new Set(altList)];
        break;
      }
    }
    if (i === images.length - 1) {
      for (var k = 0; k < images.length; k++) {
        let count_div = container.getElementsByClassName('qty-num');
        countList.push(count_div[k].value);
      }
      createPopup(srcList, newAltList, countList);
      handleCloud(7, countList);
    }
  }
};

const zalando = () => {
  let divs = [];
  let image;
  let srcList = [];
  let altList = [];
  let countList = [];

  divs = document.getElementsByClassName("z-coast-base__article-group");
  for (var i = 0; i < divs.length; i++) {
    image = divs[i].getElementsByClassName("z-2-product-image_image")[0];
    alt = divs[i].getElementsByClassName(
      "z-2-text z-coast-base__article__name z-2-text-body-small-regular z-2-text-gray"
    )[0];
    srcList.push(image.currentSrc);
    altList.push(alt.innerText);
    if (i === divs.length - 1) {
      for (var k = 0; k < divs.length; k++) {
        let count_div = divs[k].getElementsByClassName('z-2-dropdown__currentValue');
        let s = divs[k].getElementsByClassName('z-2-dropdown__control');
        countList.push(count_div[0].outerText);
        s[k].onchange = (event) => {
          for (var c = 0; c < s.length; c++) {
            if (s[c] == event.target) {
              newCountValue += parseInt(event.target.value);
            } else {
              newCountValue += parseInt(s[c].value);
            }
            if (c == s.length - 1) {
              handleCloud(0, newCountValue);
            }
          }
        }
      }
      createPopup(srcList, altList, countList);
      handleCloud(7, countList);
    }
  }
};

const nelly = () => {
  let divs = [];
  let picture;
  let image;
  let srcList = [];
  let altList = [];
  let countList = [];

  divs = document.getElementsByClassName("checkout-item GA_CartProduct");

  for (var i = 0; i < divs.length; i++) {
    picture = divs[i].getElementsByTagName("picture")[0];
    image = picture.getElementsByTagName("img");
    srcList.push(image[0]);
    altList.push(image[0].alt);
    if (i === divs.length - 1) {
      for (var k = 0; k < divs.length; k++) {
        let count_div = divs[k].getElementsByClassName('js-select-quantity-select');
        let count_divs = document.getElementsByClassName('js-select-quantity-select');
        countList.push(count_div[0].value);

        count_divs[k].onchange = (event) => {
          for (var c = 0; c < count_divs.length; c++) {
            if (count_divs[c] == event.target) {
              newCountValue += parseInt(event.target.value);
            } else {
              newCountValue += parseInt(count_divs[c].value);
            }
            if (c == count_divs.length - 1) {
              handleCloud(0, newCountValue);
              localStorage.setItem('flag', 'false');
              setTimeout(() => {
                location.reload();
              }, 100);
            }
          }
        }
      }
      createPopup(srcList, altList, countList);
      handleCloud(7, countList);
    }
  }
};

const ellos = () => {
  let divs = [];
  let image;
  let srcList = [];
  let altList = [];
  let countList = [];

  divs = document.getElementsByClassName(
    "product-table-product js-product-table-product"
  );

  let buttons_add = document.getElementsByClassName('custom-stepper-action custom-stepper-action-increase js-custom-stepper-increase ');
  let buttons_del = document.getElementsByClassName('custom-stepper-action custom-stepper-action-decrease js-custom-stepper-decrease');
  for (let v = 0; v < buttons_add.length; v++) {
    buttons_add[v].addEventListener('click', () => {
      handleCloud(1, countList)
      localStorage.setItem('flag', 'false');
      setTimeout(() => {
        location.reload();
      }, 200);
    });
    buttons_del[v].addEventListener('click', () => {
      handleCloud(-1, countList)
      localStorage.setItem('flag', 'false');
      setTimeout(() => {
        location.reload();
      }, 200);
    });
  }

  for (var i = 0; i < divs.length; i++) {
    image = divs[i].getElementsByTagName("img");
    srcList.push(image[0].currentSrc);
    altList.push(image[0].alt);
    if (i === divs.length - 1) {
      for (var k = 0; k < divs.length; k++) {
        let count_div = divs[k].getElementsByClassName('form-control js-custom-stepper-value');
        countList.push(count_div[0].value);
        handleCloud(0, newCountValue);
      }
      createPopup(srcList, altList, countList);
      handleCloud(7, countList);
    }
  }
};

const bubbleroom = () => {
  let divs = [];
  let image;
  let srcList = [];
  let altList = [];
  let countList = [];

  divs = document.getElementsByClassName("liCheckoutItem");
  let buttons_add = document.getElementsByClassName('aBtn aIncrease jsUpdateAction');
  let buttons_del = document.getElementsByClassName('aBtn aDecrease jsUpdateAction');
  for (let v = 0; v < buttons_add.length; v++) {
    buttons_add[v].addEventListener('click', () => {
      handleCloud(1, countList);
      localStorage.setItem('flag', 'false');
      setTimeout(() => {
        location.reload();
      }, 200);
    });
    buttons_del[v].addEventListener('click', () => {
      handleCloud(-1, countList);
      localStorage.setItem('flag', 'false');
      setTimeout(() => {
        location.reload();
      }, 200);
    });
  }

  for (var i = 0; i < divs.length; i++) {
    image = divs[i].getElementsByTagName("img");
    srcList.push(image[0].currentSrc);
    altList.push(image[0].alt);
    if (i === divs.length - 1) {
      for (var k = 0; k < divs.length; k++) {
        let count_div = divs[k].getElementsByClassName('itemcounter-count');
        countList.push(count_div[0].outerText);
        handleCloud(0, countList);
      }
      createPopup(srcList, altList, countList);
      handleCloud(0, countList);
    }
  }
};

const junkyard = () => {
  let divs = [];
  let image;
  let srcList = [];
  let altList = [];
  let countList = [];
  let buttons_add = document.getElementsByClassName('quick-cart__increase');
  let buttons_del = document.getElementsByClassName('quick-cart__decrease');
  for (let v = 0; v < buttons_add.length; v++) {
    buttons_add[v].addEventListener('click', () => { handleCloud(1, countList) });
    buttons_del[v].addEventListener('click', () => { handleCloud(-1, countList) });
  }

  divs = document.getElementsByClassName("quick-cart__item -shoppingcart");

  for (var i = 0; i < divs.length; i++) {
    image = divs[i].getElementsByTagName("img");
    srcList.push(image[0].src);
    altList.push(image[0].alt);
    if (i === divs.length - 1) {
      for (var k = 0; k < divs.length; k++) {
        let count_div = divs[k].getElementsByClassName('quick-cart__amount');
        countList.push(count_div[0].value);
      }
      createPopup(srcList, altList, countList);
      handleCloud(7, countList);
    }
  }
};

const bikbok = () => {
  let divs = [];
  let image;
  let srcList = [];
  let altList = [];
  let countList = [];
  let buttons_add = document.getElementsByClassName('quick-cart__increase');
  let buttons_del = document.getElementsByClassName('quick-cart__decrease');
  for (let v = 0; v < buttons_add.length; v++) {
    buttons_add[v].addEventListener('click', () => {
      handleCloud(1, countList);
      localStorage.setItem('flag', 'false');
      setTimeout(() => {
        location.reload();
      }, 200);
    });
    buttons_del[v].addEventListener('click', () => {
      handleCloud(-1, countList);
      localStorage.setItem('flag', 'false');
      setTimeout(() => {
        location.reload();
      }, 200);
    });
  }

  divs = document.getElementsByClassName("quick-cart__item -shoppingcart");

  for (var i = 0; i < divs.length; i++) {
    image = divs[i].getElementsByTagName("img");
    srcList.push(image[0].src);
    altList.push(image[0].alt);
    if (i === divs.length - 1) {
      for (var k = 0; k < divs.length; k++) {
        let count_div = divs[k].getElementsByClassName('quick-cart__amount');
        countList.push(count_div[0].value);
      }
      createPopup(srcList, altList, countList);
      handleCloud(0, countList);
    }
  }
};

const getData = (item) => {
  let data = [];
  const items = ['Tröja', 'Jumper', "T-shirt", 'Långärmad', 'Blazer',
    'Linne', 'Topp', 'Body', 'Kofta', 'Skjorta', 'Top', 'Korsett',
    'Bodysuit', 'Bralette', "Sport-BH", 'Överdel', 'Blus', 'Väst', 'Kortärmad', 'Cardigan',
    'Jeans', 'Byxor', 'Sweatpants', 'Mjukisbyxor', 'Leggings', 'Pants', 'Byxa', 'Jumpsuit',
    'Kappa', 'Jacka', 'trenchcoat', 'Överskjorta', 'Kavaj', 'Trench', 'Fleece', 'Poncho',
    'Overshirt', 'Coat', 'Blouse', 'String', 'Trosor', 'BH', 'Triangeltopp', 'Rock', 'Pyjamasskjorta',
    'Nattlinne', 'Playsuit', 'Thong', 'Shorts', 'Bra', 'Trosa', 'Kjol', 'Skirt', 'Hoodie', 'Sweatshirt',
    'Bikinitrosa', 'Bikinitopp', 'Dress', 'Klänning', 'Jacket', 'Omlottkjol', 'Sockor', 'Strumpor', 'Treggings',
    'Gown', 'Tee', 'Panty', 'SportLeggings', 'Shirt', 'Shacket', 'Singlet', 'Maxiklänning', 'Miniklänning', 'Midiklänning', 'Satinklänning', 'Cykelbyxa',
    'Jeansjacka', 'Skinnjacka', 'Skjortklänning', 'Volangklänning', 'Långklänning', 'Tanktop', 'Sweatshorts', 'Shoulder-top',
    'Trikåklänning', 'Linneskjorta', 'Jeansshorts', 'Tubtopp', 'Cargobyxa', 'T-shirtklänning', 'Cargoshorts', 'Sweatshirtshorts',
    'Baddräkt', 'Omlottklänning', 'Trikåkjol', 'Bomullsklänning', 'Linnebyxa', 'Strandklänning', 'Resortskjorta', "Bikini-bh", "Tunika",
    "Chiffongklänning", "Denimklänning", 'Träningstights', 'Chinos', 'Satinlinne', 'Bikers', 'Trousers', 'Sportbaddräkt', 'Meshklänning',
    'Nätklänning', 'Twillbyxa', 'Satintopp', 'Bottom', 'Träningstopp', "2-pack t-shirt", "Bermudashorts", "Spetsklänning", "Slipklänning",
    "Munkjacka", "Träningscykelbyxa", "Volangkjol", "Löparskjorts", "Twillkjol", "Träningslinne", "Chiffongtopp", "Joggers", "Sarong", "Peplumtopp",
    "Strandskjorta", "Bathing suit", "Cardigan", "Minikjol", "Huvtröja", 'Shapingtights', "Bomullsblus", "Hängselbyxa", "Hängselklänning", "Hängselshorts", "Tietanga",
    "Stringbody", "Meshkjol", "Hotpants", "Caftan", "Träningsshorts", "Hängselbyxor", "Croptop", "Tenniströja", "Amningsklänning", "Amningslinne",
    "Amningsbh", "Amningsblus", "Amningstopp", "Overall"
  ];

  const co2Data = {
    Tröja: 2.5, Jumper: 5.0, "T-shirt": 2.5, Långärmad: 5.0, Blazer: 5.0,
    Linne: 2.0, Topp: 2.5, Body: 2.5, Kofta: 5.0, Skjorta: 5.0, Top: 2.5, Korsett: 3.0,
    Bodysuit: 2.5, Bralette: 2.0, "Sport-BH": 1.0, Överdel: 3.0, Blus: 2.5, Väst: 3.0, Kortärmad: 2.5, Cardigan: 5.0,
    Jeans: 11.5, Byxor: 9.0, Sweatpants: 9.0, Mjukisbyxor: 9.0, Leggings: 7.0, Pants: 9.0, Byxa: 11.5, Jumpsuit: 11.5,
    Kappa: 20.0, Jacka: 20.0, trenchcoat: 20.0, Överskjorta: 20.0, Kavaj: 5.0, Trench: 20.0, Fleece: 7.0, Poncho: 7.0,
    Overshirt: 20.0, Coat: 20.0, Blouse: 2.5, String: 1.0, Trosor: 1.0, BH: 1.0, Triangeltopp: 1.0, Rock: 20.0, Pyjamasskjorta: 5.0,
    Nattlinne: 18.0, Playsuit: 5.0, Thong: 1.0, Shorts: 5.0, Bra: 1.0, Trosa: 1.0, Kjol: 9.0, Skirt: 9.0, Hoodie: 5.0, Sweatshirt: 5.0,
    Bikinitrosa: 1.0, Bikinitopp: 1.0, Dress: 18.0, Klänning: 18.0, Jacket: 20.0, Omlottkjol: 9.0, Sockor: 1.0, Strumpor: 1.0, Treggings: 7.0,
    Gown: 18.0, Tee: 2.5, Panty: 860, SportLeggings: 9540, Shirt: 5.0, Shacket: 5.0, Singlet: 2.0, Maxiklänning: 18.0, Miniklänning: 18.0, Midiklänning: 18.0, Satinklänning: 18.0, Cykelbyxa: 5.0,
    Jeansjacka: 20.0, Skinnjacka: 20.0, Skjortklänning: 18.0, Volangklänning: 18.0, Långklänning: 18.0, Tanktop: 2.5, Sweatshorts: 5.0, "Shoulder-top": 2.5,
    Trikåklänning: 18.0, Linneskjorta: 5.0, Jeansshorts: 5.0, Tubtopp: 2.5, Cargobyxa: 9.0, "T-shirtklänning": 18.0, Cargoshorts: 5.0,
    Sweatshirtshorts: 5.0, Baddräkt: 2.5, Omlottklänning: 18.0, Trikåkjol: 9.0, Bomullsklänning: 18.0, Linnebyxa: 9.0, Strandklänning: 18.0,
    Resortskjorta: 5.0, "Bikini-bh": 1.0, Tunika: 5.0, Chiffongklänning: 18.0, Denimklänning: 18.0, Träningstights: 7.0, Chinos: 9.0,
    Satinlinne: 2.0, Bikers: 5.0, Trousers: 9.0, Sportbaddräkt: 2.5, Meshklänning: 18.0, Nätklänning: 18.0, Twillbyxa: 9.0, Satintopp: 2.5,
    Bottom: 1.0, Träningstopp: 2.5, "2-pack t-shirt": 5.0, Bermudashorts: 5.0, Spetsklänning: 18.0, Slipklänning: 18.0, Munkjacka: 5.0,
    Träningscykelbyxa: 5.0, Volangkjol: 9.0, Löparskjorts: 5.0, Twillkjol: 9.0, Träningslinne: 2.0, Chiffongtopp: 2.5, Joggers: 9.0,
    Sarong: 9.0, Peplumtopp: 2.5, Strandskjorta: 5.0, "Bathing suit": 2.5, Cardigan: 5.0, Minikjol: 9.0, Huvtröja: 5.0, Shapingtights: 7.0, Bomullsblus: 2.5,
    Hängselbyxa: 9.0, Hängselbyxor: 9.0, Hängselklänning: 18.0, Hängselshorts: 5.0, Tietanga: 1.0, Stringbody: 2.5, Meshkjol: 9.0, Hotpants: 5.0, Caftan: 18.0,
    Träningsshorts: 5.0, Croptop: 2.5, Tenniströja: 2.5, Amningsklänning: 18.0, Amningslinne: 2.0, Amningsbh: 1.0, Amningsblus: 2.5, Amningstopp: 2.5, Overall: 11.5
  };

  const h2oData = {
    Tröja: 2200, Jumper: 4400, "T-shirt": 2200, Långärmad: 4400, Blazer: 4400,
    Linne: 2200, Topp: 2200, Body: 2200, Kofta: 4400, Skjorta: 4400, Top: 2200, Korsett: 2400,
    Bodysuit: 2200, Bralette: 860, "Sport-BH": 860, Överdel: 2200, Blus: 2200, Väst: 2200, Kortärmad: 2200, Cardigan: 4400,
    Jeans: 9540, Byxor: 9540, Sweatpants: 9540, Mjukisbyxor: 9540, Leggings: 9540, Pants: 9540, Byxa: 9540, Jumpsuit: 9540,
    Kappa: 8880, Jacka: 8880, trenchcoat: 8880, Överskjorta: 8880, Kavaj: 4400, Trench: 8880, Fleece: 8880, Poncho: 8880,
    Overshirt: 8880, Coat: 13627.4, Blouse: 2200, String: 860, Trosor: 860, BH: 860, Triangeltopp: 860, Rock: 8880, Pyjamasskjorta: 4400,
    Nattlinne: 9560, Playsuit: 9540, Thong: 860, Shorts: 4770, Bra: 860, Trosa: 860, Kjol: 4780, Skirt: 4780, Hoodie: 4400, Sweatshirt: 4400,
    Bikinitrosa: 860, Bikinitopp: 860, Dress: 9560, Klänning: 9560, Jacket: 8880, Omlottkjol: 4780, Sockor: 860, Strumpor: 860, Treggings: 9540,
    Gown: 9560, Tee: 2200, Panty: 860, SportLeggings: 9540, Shirt: 4400, Shacket: 4400, Singlet: 2200, Maxiklänning: 9560, Miniklänning: 9560, Midiklänning: 9560,
    Satinklänning: 9560, Cykelbyxa: 4770,
    Jeansjacka: 8880, Skinnjacka: 8880, Skjortklänning: 9560, Volangklänning: 9560, Långklänning: 9560, Tanktop: 2200, Sweatshorts: 4770, "Shoulder-top": 2200,
    Trikåklänning: 9560, Linneskjorta: 4400, Jeansshorts: 4770, Tubtopp: 2200, Cargobyxa: 9540, 'T-shirtklänning': 9560, Cargoshorts: 4770,
    Sweatshirtshorts: 4770, Baddräkt: 2200, Omlottklänning: 9560, Trikåkjol: 4780, Bomullsklänning: 9560, Linnebyxa: 9540, Strandklänning: 9560,
    Resortskjorta: 4400, "Bikini-bh": 860, Tunika: 4400, Chiffongklänning: 9560, Denimklänning: 9560, Träningstights: 9540, Chinos: 9540,
    Satinlinne: 2200, Bikers: 4770, Trousers: 9540, Sportbaddräkt: 2200, Meshklänning: 9560, Nätklänning: 9560, Twillbyxa: 9540, Satintopp: 2200,
    Bottom: 2200, Träningstopp: 2200, "2-pack t-shirt": 4400, Bermudashorts: 4770, Spetsklänning: 9560, Slipklänning: 9560, Munkjacka: 4400,
    Träningscykelbyxa: 4770, Volangkjol: 4780, Löparskjorts: 4770, Twillkjol: 4780, Träningslinne: 2200, Chiffongtopp: 2200, Joggers: 9540,
    Sarong: 4780, Peplumtopp: 2200, Strandskjorta: 4400, "Bathing suit": 2200, Cardigan: 4400, Minikjol: 4780, Huvtröja: 4400, Shapingtights: 9540, Bomullsblus: 2200,
    Hängselbyxa: 9540, Hängselbyxor: 9540, Hängselklänning: 9560, Hängselshorts: 4770, Tietanga: 2200, Stringbody: 2200, Meshkjol: 4780, Hotpants: 4770, Caftan: 9560,
    Träningsshorts: 4770, Croptop: 2200, Tenniströja: 2200, Amningsklänning: 9560, Amningslinne: 2200, Amningsbh: 860, Amningsblus: 2200, Amningstopp: 2200,
    Overall: 9540
  };

  for (let i = 0; i < items.length; i++) {
    const word = items[i].trim();
    const match = new RegExp(`\\b${word.toLowerCase()}\\b`).test(item.toLowerCase());
    if (match) {
      data.push(co2Data[items[i]]);
      data.push(h2oData[items[i]]);
      return data;
    }
    if (i == items.length - 1) {
      data.push(0);
      data.push(0);
      return data;
    }
  }

}

const closeTab = () => {
  chrome.runtime.sendMessage("close-this-tab", (response) => {
  });
}

const createPopup = (srcList, altList, countList) => {
  //Arrays
  let co2_totals = [];
  let h2o_totals = [];
  let count;
  let count_div;

  //Baskomponenter: popup, kryss, titel
  let nav = document.createElement('div');
  let container = document.createElement("div");
  let title = document.createElement('img');
  let title_file = chrome.runtime.getURL('images/title_4.svg');
  title.src = title_file;
  title.classList.add('title-chrome-extension');

  nav.appendChild(title);
  //nav.appendChild(cross);
  nav.classList.add('nav-chrome-extension');
  container.appendChild(nav);
  container.classList.add("popup-chrome-extension");

  //Creates each row width image and product name, count, line. 
  for (var i = 0; i < srcList.length; i++) {
    let j = 1;
    let div = document.createElement("div");
    let info_container = document.createElement('div');
    let co2_div = document.createElement('div');
    let water_div = document.createElement('div');
    let alt = document.createElement("p");
    let altText = document.createTextNode(altList[i]);
    let item_count = document.createElement('p');
    let ic = [];
    let item_count_txt = document.createTextNode(j);
    item_count.classList.add('itemcount' + i);
    item_count.appendChild(item_count_txt);

    count = document.createElement("p");
    countText = document.createTextNode('Items: 1');
    count.appendChild(countText);
    count.classList.add(countList + i);
    c.push(count);
    ic.push(item_count);
    let co2Text;
    let waterText


    //Antal produkter
    if (countList == 'nakd') {
      count_div = document.createElement('div');
      count_div.classList.add('chrome-extension-count-div');
      let btn_m = document.createElement('button');
      btn_m.classList.add(i);
      let btn_p = document.createElement('button');
      btn_p.classList.add(i);
      count_div.appendChild(btn_m);
      count_div.appendChild(item_count);
      count_div.appendChild(btn_p);
      let sum;


      btn_m.addEventListener('click', (e) => {
        if (j > 1) { j -= 1; }
        ic[i] = j;
        c[e.path[0].className].innerText = 'Items: ' + j;
        ic[0].innerHTML = j;
        nakd_num -= 1;
        document.getElementsByClassName('co2_div-chrome-extension')[e.path[0].className].innerHTML = '<img src="' +
          chrome.runtime.getURL('images/footprint.svg') + '" class="foot-chrome-extension">' + (item[0] * j + ' KG CO2 eq');
        document.getElementsByClassName('water_div-chrome-extension')[e.path[0].className].innerHTML = '<img src="' +
          chrome.runtime.getURL('images/water.svg') + '" class="water-chrome-extension">' + (item[1] * j + ' l H2O');
        nakd_count[0] -= item[0];
        nakd_count[1] -= item[1];

        document.getElementsByClassName('inner-txt-chrome-extension-c')[0].innerHTML = nakd_count[0] + ' KG CO2 eq, which corresponds to about ' + (nakd_count[0] * 3) + ' km travel with an average car';
        document.getElementsByClassName('inner-txt-chrome-extension-w')[0].innerHTML;

        handleCloud(-1, nakd_num);
      });


      btn_p.addEventListener('click', (e) => {
        j += 1;
        c[e.path[0].className].innerText = 'Items: ' + j;
        ic[0].innerHTML = j;
        nakd_num += 1;
        document.getElementsByClassName('co2_div-chrome-extension')[e.path[0].className].innerHTML = '<img src="' +
          chrome.runtime.getURL('images/footprint.svg') + '" class="foot-chrome-extension">' + (item[0] * j + ' KG CO2 eq');
        document.getElementsByClassName('water_div-chrome-extension')[e.path[0].className].innerHTML = '<img src="' +
          chrome.runtime.getURL('images/water.svg') + '" class="water-chrome-extension">' + (item[1] * j + ' l H2O');
        handleCloud(1, nakd_num);
        nakd_count[0] += item[0];
        nakd_count[1] += item[1];
        document.getElementsByClassName('inner-txt-chrome-extension-c')[0].innerHTML = nakd_count[0] + ' KG CO2 eq, which corresponds to about ' + (nakd_count[0] * 3) + ' km travel with an average car';
        document.getElementsByClassName('inner-txt-chrome-extension-w')[0].innerHTML = nakd_count[1] + ' l H2O, which corresponds to about ' + Math.round(nakd_count[1] / (365 * 2)) + ' years consumption of water for one person (2 liters per day)'
      });

      btn_m.innerText = '-';
      btn_p.innerText = '+';

    } else {
      count = document.createElement("p");
      countText = document.createTextNode('Items: ' + countList[i]);
      count.appendChild(countText);
    }

    alt.appendChild(altText);
    let image = document.createElement("img");

    //Adds image source to image element
    if (srcList[i].currentSrc) {
      image.src = srcList[i].currentSrc;
    } else {
      image.src = srcList[i];
    }

    //Adds icons, co2 and h2o data
    div.classList.add("row-chrome-extension");
    div.appendChild(image);
    let icon = document.createElement("img");
    let file = chrome.runtime.getURL('images/footprint.svg');
    icon.src = file;
    icon.classList.add('foot-chrome-extension');
    let waterIcon = document.createElement('img');
    let file_2 = chrome.runtime.getURL('images/water.svg');
    waterIcon.src = file_2;
    co2_div.appendChild(icon);
    let item = getData(altList[i]);

    if (countList == 'nakd') {
      co2Text = document.createTextNode(item[0] * j + ' KG CO2 eq');
      waterText = document.createTextNode(item[1] * j + ' l H2O');
    }
    else {
      co2Text = document.createTextNode(item[0] * countList[i] + ' KG CO2 eq');
      waterText = document.createTextNode(item[1] * countList[i] + ' l H2O');
    }

    waterIcon.classList.add('water-chrome-extension');
    water_div.appendChild(waterIcon);
    co2_div.appendChild(co2Text);
    water_div.appendChild(waterText);
    info_container.appendChild(alt);

    if (countList == 'nakd') {
      info_container.appendChild(count);
      info_container.appendChild(count_div);
    } else {
      info_container.appendChild(count);
    }

    water_div.classList.add('water_div-chrome-extension');
    co2_div.classList.add('co2_div-chrome-extension');
    info_container.appendChild(co2_div);
    info_container.appendChild(water_div);
    if (item[0] == 0) {
      let error = document.createElement('p');
      let error_txt = document.createTextNode("Sorry, there's no data for this type of item");
      error.appendChild(error_txt);
      error.classList = 'error';
      info_container.appendChild(error);
    }
    info_container.classList.add('info_container-chrome-extension');

    div.appendChild(info_container);

    //divider
    let line = document.createElement('hr');
    line.setAttribute("width", "800px");
    line.setAttribute("color", "#F1F1F1");
    container.appendChild(div);
    container.appendChild(line);

    co2_totals.push(parseFloat(co2_div.innerText));
    h2o_totals.push(parseFloat(water_div.innerText));

  } if (i === srcList.length) {
    let t_c = 0;
    let t_w = 0;
    let turns = 0;
    let supply = 0;

    for (let k = 0; k < co2_totals.length; k++) {
      t_c += parseFloat(co2_totals[k]);
      t_w += parseFloat(h2o_totals[k]);
      if (k == co2_totals.length - 1) {
        if (countList == 'nakd') {
          nakd_count[0] = t_c;
          nakd_count[1] = t_w;
        }
        turns = t_c * 3;
        supply = t_w / (365 * 2);
      }
    }


    let txt = document.createElement("p");
    let txtText = document.createTextNode('Do you really need these items? Your shopping cart contributes to approximately:');
    txt.appendChild(txtText);
    txt.classList.add("txt-chrome-extension");


    let totals_div = document.createElement('div');
    let co2_total = document.createElement("p");
    let co2_total_text = document.createTextNode(t_c + ' KG CO2 eq, which corresponds to about ' + turns + ' km travel with an average car');
    co2_total.appendChild(co2_total_text);
    co2_total.classList.add('inner-txt-chrome-extension-c');

    let h2o_total = document.createElement("p");
    let h2o_total_text = document.createTextNode(t_w + ' l H2O, which corresponds to about ' + Math.round(supply) + ' years consumption of water for one person (2 liters per day)');
    h2o_total.appendChild(h2o_total_text);
    h2o_total.classList.add('inner-txt-chrome-extension-w');

    totals_div.appendChild(co2_total);
    totals_div.appendChild(h2o_total);
    totals_div.classList.add('totals_div-chrome-extension');

    container.appendChild(txt);
    container.appendChild(totals_div);
    let background = chrome.runtime.getURL('images/emissionyouwear_3.svg');
    totals_div.style['background-image'] = "url(" + background + ")";
    totals_div.style['background-repeat'] = 'no-repeat';
    let btn_close = document.createElement('button');
    btn_close.innerText = 'Close tab';
    btn_close.classList = 'close_btn';
    btn_close.addEventListener('click', closeTab);

    let btn_shop = document.createElement('button');
    btn_shop.innerText = 'I want them';
    btn_shop.classList = 'shop_btn';
    btn_shop.addEventListener('click', closeModal);
    let btn_container = document.createElement('div');

    btn_container.appendChild(btn_close);
    btn_container.appendChild(btn_shop);
    btn_container.classList = 'btn_container';
    container.appendChild(btn_container);
    document.body.appendChild(container);
    let shadow = document.createElement('div');
    shadow.classList.add('shadow-chrome-extension');
    document.body.appendChild(shadow);
    document.getElementsByClassName('popup-chrome-extension')[0].style.opacity = 0;
    document.getElementsByClassName('shadow-chrome-extension')[0].style.display = 'none';
    setTimeout(() => {
      document.getElementsByClassName('popup-chrome-extension')[0].style.opacity = 1;
      document.getElementsByClassName('shadow-chrome-extension')[0].style.display = 'block';
    }, 100);

    if (localStorage.getItem('flag') == 'false') {
      localStorage.setItem('flag', 'true');
      setTimeout(() => {
        document.getElementsByClassName('popup-chrome-extension')[0].style.opacity = 0;
        document.getElementsByClassName('shadow-chrome-extension')[0].style.display = 'none';
        closeModal();
      }, 100);
    }

  }
};

function draggable(el) {
  let cloud = document.getElementsByClassName('cloud-chrome-extension')[0];
  let popup = document.getElementsByClassName('popup-chrome-extension')[0];
  let i = 0;

  el.addEventListener('mousedown', function (e) {
    var offsetX = e.clientX - parseInt(window.getComputedStyle(this).left);
    var offsetY = e.clientY - parseInt(window.getComputedStyle(this).top);

    function mouseMoveHandler(e) {
      e.preventDefault();
      i += 1;
      el.style.top = (e.clientY - offsetY) + 'px';
      el.style.left = (e.clientX - offsetX) + 'px';
    }

    function addEvent() {
      if (i == 0) {
        cloud.addEventListener('click', openModal);
        document.getElementsByClassName('popup-chrome-extension')[0].remove();
        document.getElementsByClassName('shadow-chrome-extension')[0].remove();
        openModal();
        init();
      } else {
        i = 0;
      }
    }

    function reset() {
      cloud.removeEventListener('click', openModal);
      window.removeEventListener('mousemove', mouseMoveHandler);
      window.removeEventListener('mouseup', reset);
      addEvent();
    }

    window.addEventListener('mousemove', mouseMoveHandler);
    window.addEventListener('mouseup', reset);
  });
}
//Function to open modal
const openModal = () => {
  document.getElementsByClassName('cloud-chrome-extension')[0].style.display = 'none';
}


//Function to close modal
const closeModal = () => {
  document.getElementsByClassName('popup-chrome-extension')[0].style.display = 'none';
  if (!document.getElementsByClassName('cloud-chrome-extension')[0]) {
    let cloud = document.createElement('img');
    let file = chrome.runtime.getURL('images/cloud.svg');
    cloud.src = file;
    cloud.classList.add('cloud-chrome-extension');
    cloud.style.cursor = 'pointer';
    cloud.style.width = size + 'px';
    cloud.style.height = size + 'px';
    document.body.appendChild(cloud);
    size = cloud.offsetHeight;
    draggable(document.getElementsByClassName('cloud-chrome-extension')[0]);
  } else {
    document.getElementsByClassName('cloud-chrome-extension')[0].style.display = 'block';
  }
  document.getElementsByClassName('shadow-chrome-extension')[0].style.display = 'none';

}

init();