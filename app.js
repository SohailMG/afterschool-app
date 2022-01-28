new Vue({
  el: "#app",
  data: {
    loading: false,
    API_URL: "https://secure-coast-65382.herokuapp.com",
    lessons: null,
    orderId: null,
    cart: [],
    toggle: false,
    sortOption: "",
    options: ["Price", "Space", "Subject", "Location"],
    sortOrder: "Ascending",
    basketItems: [],
    checkoutClicked: false,
    form: {
      fullname: "",
      mobile: null,
      isValid: false,
    },
    orderComplete: false,
    searchInput: "",
    currentId: null,
  },
  created() {
    this.fetchLessonsFromDb();
  },
  methods: {
    searchResults() {
      fetch(`${this.API_URL}/collection/lessons/search?q=` + this.searchInput)
        .then((res) => res.json())
        .then((data) => {
          this.lessons = data;
        });
    },
    fetchLessonsFromDb() {
      fetch(`${this.API_URL}/collection/lessons`)
        .then((response) => response.json())
        .then((data) => {
          this.lessons = data;
          this.loading = false;
        });
    },
    // adds lesson object to cart
    addToCart(lesson) {
      this.loading = true;
      this.currentId = lesson._id;
      // getting index if item exists in cart
      const index = this.cart.findIndex(
        (cartItem) => cartItem.lesson._id === lesson._id
      );
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
      this.updateSpaces(lesson._id, lesson.space, 1);
    },
    // switch between checkout and lessons
    toggleCheckout() {
      this.fetchLessonsFromDb();
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
        "absolute bottom-0 right-0 m-2": true,
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
    async checkout() {
      this.checkoutClicked = true;
      this.cart.forEach((order) => {
        const {
          lesson: { _id, space, subject },
          quantity,
        } = order;
        fetch(`${this.API_URL}/collection/orders`, {
          method: "POST",
          headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            lessonId: _id,
            space: quantity,
            subject,
            phone: this.form.mobile,
            name: this.form.fullname,
            total: this.orderTotal,
            purchaseDate: new Date().toDateString(),
          }),
        })
          .then((res) => res.json())
          .then((res) => {
            this.orderId = res.orderId;
            this.updateSpaces(_id, space, quantity);
            this.checkoutClicked = false;
            this.orderComplete = true;
            this.cart = [];
          });
      });
    },
    updateSpaces(lessonId, space, quantity) {
      const remainingSpace = space - quantity;
      fetch(`${this.API_URL}/collection/lessons/${lessonId}`, {
        method: "PUT",
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ spaces: remainingSpace }),
      })
        .then((res) => res.json())
        .then((res) => {
          this.fetchLessonsFromDb();
        });
    },
    // removes item from basket
    removeFromBasket(order) {
      order.quantity -= 1;
      // removing item from cart
      if (order.quantity == 0) {
        this.cart = this.cart.filter(
          (item) => item.lesson._id != order.lesson._id
        );
      }
      // adding back space to removed item
      const currentLesson = this.lessons.filter(
        (lesson) => lesson._id == order.lesson._id
      );
      fetch(`${this.API_URL}/collection/lessons/${order.lesson._id}`, {
        method: "PUT",
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ spaces: currentLesson[0].space + 1 }),
      })
        .then((res) => res.json())
        .then((res) => {
          this.fetchLessonsFromDb();
        });
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
  },
});
