new Vue({
  el: "#app",
  data: {
    lessons: lessons,
    cart: [],
    toggle: false,
    sortOption: "Price",
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
    addToCart(lesson) {
      const index = this.cart.findIndex((item) => item.lesson.id === lesson.id);
      if (index >= 0) {
        this.cart[index].quantity += 1;
      } else {
        const cartItem = {
          lesson: lesson,
          quantity: 1,
        };
        this.cart.push(cartItem);
      }
      this.lessons.map((lsn) => (lsn.id == lesson.id ? (lsn.space -= 1) : 5));
    },
    // switch between checkout and lessons
    toggleCheckout() {
      this.toggle = !this.toggle;
      this.orderComplete = false;
      
    },

    // validates input forms
    validateForm() {
      const isNumOnly = /^\d+$/.test(this.form.mobile);
      const isLettersOnly = /^[a-zA-Z]+$/.test(this.form.fullname);
      this.form.isValid = isNumOnly && isLettersOnly ? true : false;
    },
    // sort lessons
    sortBy() {
      switch (this.sortOption) {
        case "Price":
          this.lessons.sort((a, b) =>
            this.sortOrder == "Ascending"
              ? a.price - b.price
              : b.price - a.price
          );
          break;
        case "Space":
          this.lessons.sort((a, b) =>
            this.sortOrder == "Ascending"
              ? a.space - b.space
              : b.space - a.space
          );
          break;
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
    // class names for add button
    getBtnClasses(lesson) {
      return {
        "text-white text-md": true,
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
        this.form.fullname = "";
        this.form.mobile = null;
        this.cart = [];
      }, 2000);
    },
    // removes item from basket
    removeFromBasket(order) {
      order.quantity -= 1;
      if (order.quantity == 0) {
        this.cart = this.cart.filter(
          (item) => item.lesson.id != order.lesson.id
        );
      }
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
    orderTotal() {
      if (this.cart.length == 0) return;
      return this.cart
        .map((order) => order.lesson.price * order.quantity)
        .reduce((prev, next) => prev + next);
    },
    // search function
    searchResults() {
      return this.lessons.filter((lesson) => {
        return (lesson.subject || lesson.location)
          .toLowerCase()
          .includes(this.searchInput.toLowerCase());
      });
    },
  },
});
