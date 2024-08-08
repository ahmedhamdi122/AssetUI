/////////Start_Governments-Search/////////

export function GovernSearchFunction() {
  var input, filter, ul, li, item, i, txtValue;
  (input = document.getElementById("searchinputgovern")),
    (filter = input.value.toUpperCase());
  (ul = document.getElementById("searchitemsgovern")),
    (li = ul.getElementsByTagName("li"));
  for (i = 0; i < li.length; i++) {
    item = li[i];
    txtValue = item.textContent || item.innerText;
    if (txtValue.toUpperCase().indexOf(filter) > -1) {
      li[i].style.display = "";
    } else {
      li[i].style.display = "none";
    }
  }
}
/////////End_Governments-Search/////////

/////////Start_Cities-Search/////////

export function CitiesSearchFunction() {
  var input, filter, ul, li, item, i, txtValue;
  (input = document.getElementById("searchinputcities")),
    (filter = input.value.toUpperCase());
  (ul = document.getElementById("searchitemscities")),
    (li = ul.getElementsByTagName("li"));
  for (i = 0; i < li.length; i++) {
    item = li[i];
    txtValue = item.textContent || item.innerText;
    if (txtValue.toUpperCase().indexOf(filter) > -1) {
      li[i].style.display = "";
    } else {
      li[i].style.display = "none";
    }
  }
}
/////////End_Cities-Search/////////
/////////Start_Organizations-Search/////////

export function OrganSearchFunction() {
  var input, filter, ul, li, item, i, txtValue;
  (input = document.getElementById("searchinputorgan")),
    (filter = input.value.toUpperCase());
  (ul = document.getElementById("searchitemsorgan")),
    (li = ul.getElementsByTagName("li"));
  for (i = 0; i < li.length; i++) {
    item = li[i];
    txtValue = item.textContent || item.innerText;
    if (txtValue.toUpperCase().indexOf(filter) > -1) {
      li[i].style.display = "";
    } else {
      li[i].style.display = "none";
    }
  }
}
/////////End_Organizations-Search/////////

/////////Start_SubOrganizations-Search/////////

export function SubOrganSearchFunction() {
  var input, filter, ul, li, item, i, txtValue;
  (input = document.getElementById("searchinputsuborgan")),
    (filter = input.value.toUpperCase());
  (ul = document.getElementById("searchitemssuborgan")),
    (li = ul.getElementsByTagName("li"));
  for (i = 0; i < li.length; i++) {
    item = li[i];
    txtValue = item.textContent || item.innerText;
    if (txtValue.toUpperCase().indexOf(filter) > -1) {
      li[i].style.display = "";
    } else {
      li[i].style.display = "none";
    }
  }
}
/////////End_SubOrganizations-Search/////////

/////////Start_Departments-Search/////////

export function DepartSearchFunction() {
  var input, filter, ul, li, item, i, txtValue;
  (input = document.getElementById("searchinputdepart")),
    (filter = input.value.toUpperCase());
  (ul = document.getElementById("searchitemsdepart")),
    (li = ul.getElementsByTagName("li"));
  for (i = 0; i < li.length; i++) {
    item = li[i];
    txtValue = item.textContent || item.innerText;
    if (txtValue.toUpperCase().indexOf(filter) > -1) {
      li[i].style.display = "";
    } else {
      li[i].style.display = "none";
    }
  }
}
/////////End_Departments-Search/////////

/////////Start_Brands-Search/////////

export function BrandSearchFunction() {
  var input, filter, ul, li, item, i, txtValue;
  (input = document.getElementById("searchinputbrand")),
    (filter = input.value.toUpperCase());
  (ul = document.getElementById("searchitemsbrand")),
    (li = ul.getElementsByTagName("li"));
  for (i = 0; i < li.length; i++) {
    item = li[i];
    txtValue = item.textContent || item.innerText;
    if (txtValue.toUpperCase().indexOf(filter) > -1) {
      li[i].style.display = "";
    } else {
      li[i].style.display = "none";
    }
  }
}
/////////End_Brands-Search/////////

/////////Start_Suppliers-Search/////////

export function SuppSearchFunction() {
  var input, filter, ul, li, item, i, txtValue;
  (input = document.getElementById("searchinputsupp")),
    (filter = input.value.toUpperCase());
  (ul = document.getElementById("searchitemssupp")),
    (li = ul.getElementsByTagName("li"));
  for (i = 0; i < li.length; i++) {
    item = li[i];
    txtValue = item.textContent || item.innerText;
    if (txtValue.toUpperCase().indexOf(filter) > -1) {
      li[i].style.display = "";
    } else {
      li[i].style.display = "none";
    }
  }
}
/////////End_Suppliers-Search/////////

/////////End_Search/////////

/////////Start_Prices-Range/////////

////////For En//////////////

///////////For AR///////////
// $(document).ready(function () {
//   $("#slider-Prices-range").slider({
//     range: true,
//     min: 0,
//     max: 100000,
//     step: 1,
//     values: [30000, 60000],
//     slide: function (event, ui) {
//       for (var i = 0; i < ui.values.length; ++i) {
//         $("input.sliderValuee[data-index=" + i + "]").val(ui.values[i]);
//         $("#Pricesamount").val("$" + ui.values[1] + " - $" + ui.values[0]);
//       }
//     },
//   });

//   $("input.sliderValuee").change(function () {
//     var $this = $(this);
//     $("#slider-Prices-range").slider(
//       "values",
//       $this.data("index"),
//       $this.val()
//     );
//     $("#Pricesamount").val(
//       "$" +
//         $("#slider-Prices-range").slider("values", 1) +
//         " - $" +
//         $("#slider-Prices-range").slider("values", 0)
//     );
//   });
// });

/////////End_Prices-Range/////////

/////////Start_Map/////////

require(["esri/Map", "esri/views/MapView"], function (Map, MapView) {
  var map = new Map({
    basemap: "satellite",
  });
  var view1 = new MapView({
    id: "view1",
    container: "viewDiv",
    map: map,
  });
});

/////////End_Map/////////
