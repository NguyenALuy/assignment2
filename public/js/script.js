function search() {
    var input, filter, products, product1, details, name, i;
    input = document.getElementById("search-item");
    filter = input.value.toUpperCase();
    products = document.getElementById("product-list");
    product1 = products.getElementsByClassName("product1");
    if (filter) {
      products.style.display = "block";
      for (i = 0; i < product1.length; i++) {
        details = product1[i].getElementsByClassName("p-details")[0];
        name = details.getElementsByTagName("h2")[0];
        if (name.innerHTML.toUpperCase().indexOf(filter) > -1) {
          product1[i].style.display = "";
        } else {
          product1[i].style.display = "none";
        }
      }
    } else {
      products.style.display = "none";
    }
  }
  