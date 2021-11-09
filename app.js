new Vue({
  el: "#app",
  data: {
    lessons: lessons,
    cart:[],
  },
  methods:{
      addToCart(lessonId){
          this.cart.push(lessonId);

      }
  }
});
