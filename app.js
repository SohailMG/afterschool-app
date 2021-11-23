new Vue({
  el: "#app",
  data: {
    lessons: lessons,
    cart: [],
    toggle: false,
    sortOption: "",
    options: [
      "Price",
      "Space",
      "Subject",
      "Location",
    ],
    sortOrder:"Ascending",
    basketItems: [],
    checkoutClicked: false,
    form: {
      fullname: "",
      mobile: null,
      isValid: false,
    },
    orderComplete: false,
    searchInput: "",
  },
  methods: {
    // adds lesson object to cart 
    addToCart(lesson) {
      // getting index if item exists in cart
      const index = this.cart.findIndex((cartItem) => cartItem.lesson.id === lesson.id);

      // increment quantity of item if it already exists
      if (index >= 0) {
        this.cart[index].quantity += 1;
      } else {
        // creating new cart object with quantity
        const cartItem = {
          lesson: lesson,
          quantity: 1,
        };
        this.cart.push(cartItem);
      }
      // decreasing spaces by one
      this.lessons.map((lsn) => (lsn.id == lesson.id ? (lsn.space -= 1) : 5));
    },
    // switch between checkout and lessons
    toggleCheckout() {
      this.toggle = !this.toggle;
      this.orderComplete = false;
      // reset form fields
      this.form.fullname = "";
      this.form.mobile = null;
      this.form.isValid = false;
      
    },

    // validates input forms
    validateForm() {
      const isNumOnly = /^\d+$/.test(this.form.mobile);
      const isLettersOnly = /^[a-zA-Z\s]+$/.test(this.form.fullname);
      this.form.isValid = isNumOnly && isLettersOnly ? true : false;
    },
    // checks search options and sorts lessons according to the order
    sortBy() {
      switch (this.sortOption) {
        // sort by price Ascending or descending
        case "Price":
          this.lessons.sort((a, b) =>
            this.sortOrder == "Ascending"
              ? a.price - b.price
              : b.price - a.price
          );
          break;
        // sort by space available in  Ascending or descending
        case "Space":
          this.lessons.sort((a, b) =>
            this.sortOrder == "Ascending"
              ? a.space - b.space
              : b.space - a.space
          );
          break;
        // sort by subject a-z or z-a
        case "Subject":
          this.sortOrder == "Ascending"
            ? this.lessons.sort((a, b) =>
                a.subject.toLowerCase().localeCompare(b.subject.toLowerCase())
              )
            : this.lessons.sort(function (a, b) {
                if (a.subject < b.subject) {
                  return 1;
                }
                if (a.subject > b.subject) {
                  return -1;
                }
                return 0;
              });
          break;
        // sort by location a-z or z-a
        case "Location":
          this.sortOrder == "Ascending"
            ? this.lessons.sort((a, b) =>
                a.location.toLowerCase().localeCompare(b.location.toLowerCase())
              )
            : this.lessons.sort(function (a, b) {
                if (a.location < b.location) {
                  return 1;
                }
                if (a.location > b.location) {
                  return -1;
                }
                return 0;
              });
          break;

        default:
          break;
      }

      
    },
    // dynamic class names for add button
    getBtnClasses(lesson) {
      return {
        "text-white text-md": true,
        "absolute bottom-0 right-0 m-2":true,
        "font-semibold": true,
        "bg-orange-400": lesson.space > 0,
        "bg-gray-500": lesson.space == 0,
        "cursor-not-allowed": lesson.space == 0,
        "py-2": true,
        "px-4": true,
        "rounded-lg": true,
        "shadow-md": true,
        "hover:shadow-lg": true,
        transition: true,
        "duration-500": true,
        "transform-gpu": true,
        "hover:bg-gray-800": lesson.space > 0,
      };
    },
    //checkout btn
    checkout() {
      this.checkoutClicked = true;
      setTimeout(() => {
        this.checkoutClicked = false;
        this.orderComplete = true;
        this.cart = [];
      }, 1000);
    },
    // removes item from basket
    removeFromBasket(order) {
      order.quantity -= 1;
      // removing item from cart
      if (order.quantity == 0) {
        this.cart = this.cart.filter(
          (item) => item.lesson.id != order.lesson.id
        );  
      }
      // adding back space to removed item
      const currentLesson = this.lessons.filter(
        (lesson) => lesson.id == order.lesson.id
      );
      currentLesson[0].space += 1;
    },
  },
  computed: {
    cartCount() {
      return this.cart.length;
    },
    // computes the total of orders
    orderTotal() {
      if (this.cart.length == 0) return;
      return this.cart
        .map((order) => order.lesson.price * order.quantity)
        .reduce((prev, next) => prev + next);
    },
    //Filters lessons array where search input matches either 
    //location or subject
    searchResults() {
      return this.lessons.filter((lesson) => {
        return (
          lesson.subject
            .toLowerCase()
            .includes(this.searchInput.toLowerCase()) 
            ||
          lesson.location
          .toLowerCase()
          .includes(this.searchInput.toLowerCase())
        );
      });
      
    },
  },
});
