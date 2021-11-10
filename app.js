new Vue({
  el: "#app",
  data: {
    lessons: lessons,
    cart:[],
    toggle:false,
  },
  methods:{
      addToCart(lesson){
          this.cart.push(lesson);
      },
      toggleCheckout(){
      this.toggle = !this.toggle;

    }
  },
  computed:{
    cartCount() {
      return this.cart.length;
    },
  
  }
});
