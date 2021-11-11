new Vue({
  el: "#app",
  data: {
    lessons: lessons,
    cart: [],
    toggle: false,
    sortOption: "",
    options: ["Price-asc", "Price-dec", "Space-asc", "Space-dec"],
    basketItems: [],
  },
  methods: {
    addToCart(lesson) {
      this.cart.push(lesson.id);
      this.lessons.map((lsn) => (lsn.id == lesson.id ? (lsn.space -= 1) : 5));
    },
    toggleCheckout() {
      this.toggle = !this.toggle;
      if (this.toggle) {
        this.countOccurrences();
      }
    },
    countOccurrences() {
      let counts = {};
      for (const num of this.cart) {
        counts[num] = counts[num] ? counts[num] + 1 : 1;
      }
      Object.keys(counts).forEach((num) => {
        this.lessons.map((lesson) => {
          if (lesson.id == num) {
            const order = {
              lesson: lesson,
              quantity: counts[num],
            };
            this.basketItems.push(order);
          }
        });
      });
    },
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
        "transition": true,
        "duration-500": true,
        "transform-gpu": true,
        "hover:bg-gray-800": lesson.space > 0,
      };
    },
    removeFromBasket(order) {
      const {quantity,lesson} = order;
      order.quantity -= 1;
      if(order.quantity == 0) {
        this.basketItems = this.basketItems.filter((item) => item.lesson.id != order.lesson.id)
      }
    }
  },
  computed: {
    cartCount() {
      return this.cart.length;
    },
  },
});
