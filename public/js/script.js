// RMIT University Vietnam
// Course: COSC2430 Web Programming
// Semester: 2023A
// Assessment: Assignment 2
// Author: Nguyen A Luy, Le Trung Kien, Trinh Xuan Khanh, Cao Le Hoang Minh, Le Khanh Toan
// ID: Your student ids (e.g. 1234567)
// Acknowledgement: Acknowledge the resources that you use here.
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
  