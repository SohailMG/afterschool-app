<template>
  <div v-show="cart.length > 0">
    <!-- ORDER SUMMARY-->
    <div class="flex justify-evenly space-x-2">
      <!-- SINGLE ORDER CONTAINER -->
      <div class="flex flex-col w-1/2 space-y-4">
        <h1 class="font-semibold text-gray-800 mx-auto">Order Summary</h1>
        <div
          v-for="order in cart"
          :key="order.id"
          class="
            flex
            bg-white
            rounded-md
            items-center
            space-x-10
            justify-between
            border-b-2 border-gray-300
            hover:shadow-2xl
            p-2
            animate__animated animate__zoomIn
          "
        >
          <img :src="require('../assets/' + order.lesson.image)" alt="art" />
          <div>
            <p class="text-md font-semibold text-gray-500">
              {{ order.lesson.subject }}
            </p>
            <p class="text-md font-semibold text-gray-800">
              £{{ order.lesson.price * order.quantity }}
            </p>
          </div>
          <span class="text-md text-gray-500">x{{ order.quantity }}</span>
          <!-- remove from basket -->
          <i
            class="fa fa-trash text-gray-500 hover:text-red-800 cursor-pointer"
            @click="$emit('lessonRemoved', order)"
          ></i>
        </div>
      </div>
      <!-- checkout form -->
      <!-- form container -->
      <div class="flex flex-col w-1/3 space-y-2">
        <label>FullName</label>
        <input
          v-model="form.fullname"
          type="text"
          class="bg-gray-200 outline-none rounded-md px-2 py-1 w-64"
          @input="validateForm"
        />
        <label>Mobile Number</label>
        <input
          v-model="form.mobile"
          type="text"
          class="bg-gray-200 outline-none rounded-md px-2 py-1 w-64"
          @input="validateForm"
        />
        <h1 class="text-md font-semibold mx-auto py-4">
          Total £{{ orderTotal }}
        </h1>
        <!-- Checkout button -->
        <button
          v-if="!checkoutClicked"
          :class="{
            'p-2 text-white rounded-md mt-10 outline-none': true,
            'bg-green-500': form.isValid,
            'bg-gray-500': !form.isValid,
            'cursor-not-allowed': !form.isValid,
          }"
          :disabled="!form.isValid"
          @click="checkout"
        >
          Checkout<i class="fa fa-check-circle px-2"></i>
        </button>
        <!-- loading animation -->
        <div
          v-else-if="checkoutClicked"
          class="
            bg-white
            border
            py-2
            px-5
            rounded-lg
            flex
            items-center
            flex-col
          "
        >
          <div class="loader-dots block relative w-20 h-5 mt-2">
            <div
              class="absolute top-0 mt-1 w-3 h-3 rounded-full bg-green-500"
            ></div>
            <div
              class="absolute top-0 mt-1 w-3 h-3 rounded-full bg-green-500"
            ></div>
            <div
              class="absolute top-0 mt-1 w-3 h-3 rounded-full bg-green-500"
            ></div>
            <div
              class="absolute top-0 mt-1 w-3 h-3 rounded-full bg-green-500"
            ></div>
          </div>
          <div class="text-gray-500 text-xs font-light mt-2 text-center">
            Processing Payment...
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      API_URL: "https://secure-coast-65382.herokuapp.com",
      form: {
        fullname: "",
        mobile: null,
        isValid: false,
      },
    };
  },
  props: ["cart", "checkoutClicked"],
  methods: {
    // validates input forms
    validateForm() {
      const isNumOnly = /^\d+$/.test(this.form.mobile);
      const isLettersOnly = /^[a-zA-Z\s]+$/.test(this.form.fullname);
      this.form.isValid = isNumOnly && isLettersOnly ? true : false;
    },
    checkout() {
      this.$emit("checkoutClicked", true);
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
            this.$emit("orderSubmitted", res.orderId);
            this.updateSpaces(_id, space, quantity);
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
        .then(() => {
          this.$emit("updateLessons");
        });
    },
  },
  computed: {
    orderTotal() {
      if (this.cart.length == 0) return;
      return this.cart
        .map((order) => order.lesson.price * order.quantity)
        .reduce((prev, next) => prev + next);
    },
  },
};
</script>

<style>
</style>