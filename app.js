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
       const index = this.cart.findIndex(
         (item) => item.lesson.id === lesson.id
       );
      if(index >= 0) {
        this.cart[index].quantity +=1;
      }else{
        const cartItem = {
          lesson: lesson,
          quantity:1
        }
        this.cart.push(cartItem);
      }
      this.lessons.map((lsn) => (lsn.id == lesson.id ? (lsn.space -= 1) : 5));
    },
    toggleCheckout() {
      this.toggle = !this.toggle;
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
      order.quantity -= 1;
      if(order.quantity == 0) {
        this.cart = this.cart.filter((item) => item.lesson.id != order.lesson.id)
      }
      const currentLesson = this.lessons.filter((lesson) => lesson.id == order.lesson.id);
      currentLesson[0].space+=1;
    }
  },
  computed: {
    cartCount() {
      return this.cart.length;
    },
    orderTotal(){
      if(this.cart.length == 0) return;
      return this.cart
        .map((order) => (order.lesson.price * order.quantity))
        .reduce((prev, next) => prev + next);
    }
  },
});
