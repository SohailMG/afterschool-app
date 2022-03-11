<template>
  <div id="app">
    <main class="flex">
      <!-- sidebar -->
      <div id="sidebar" class="bg-gray-800 p-4">
        <div class="flex flex-col items-center px-2 space-y-40 relative">
          <!-- Home icon -->
          <div>
            <i
              class="
                fas
                fa-graduation-cap
                text-3xl text-orange-500
                cursor-pointer
              "
            ></i>
          </div>
          <!-- store icon -->
          <div v-if="toggle">
            <i
              class="
                fas
                fa-shopping-bag
                text-gray-200 text-2xl text-2xl
                mt-20
                text-white
                cursor-pointer
                hover:text-gray-500
                text-xs
              "
              @click="toggleCheckout"
              ><small class="text-sm px-2">Store</small></i
            >
          </div>
          <!-- Shopping cart icon -->
          <div v-else-if="!toggle">
            <i
              v-show="cart.length > 0"
              class="
                fas
                fa-shopping-cart
                text-2xl
                mt-20
                text-white
                cursor-pointer
                hover:text-gray-500
                flex flex-col
              "
              @click="toggleCheckout"
            ></i>
            <!-- Cart Count div -->
            <div
              v-show="cartCount > 0"
              class="
                absolute
                bg-orange-400
                bottom-0
                right-0
                px-1
                text-md
                rounded-full
              "
            >
              {{ cartCount }}
            </div>
          </div>
        </div>
      </div>
      <!-- content -->
      <div
        id="content"
        class="bg-gray-200 w-screen min-h-screen flex flex-col justify-center"
      >
        <!-- header -->
        <header class="p-2 flex items-center justify-center">
          <!-- search bar container -->
          <div
            class="
              flex
              items-center
              space-x-2
              bg-gray-100
              p-2
              mt-2
              rounded-xl
              w-64
            "
          >
            <i class="fas fa-search text-orange-500"></i>
            <input
              v-on:input="searchResults"
              v-model="searchInput"
              type="text"
              placeholder="search lessons"
              class="bg-transparent outline-none"
            />
          </div>
        </header>
        <!--content section -->
        <!-- sort menu -->
        <div class="flex items-center space-x-6" v-show="!toggle">
          <div
            class="
              relative
              inline-flex
              items-center
              bg-orange-500
              ml-10
              w-56
              rounded-md
            "
          >
            <svg
              class="w-2 h-2 absolute top-0 right-0 m-4 pointer-events-none"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 412 232"
            >
              <path
                d="M206 171.144L42.678 7.822c-9.763-9.763-25.592-9.763-35.355 0-9.763 9.764-9.763 25.592 0 35.355l181 181c4.88 4.882 11.279 7.323 17.677 7.323s12.796-2.441 17.678-7.322l181-181c9.763-9.764 9.763-25.592 0-35.355-9.763-9.763-25.592-9.763-35.355 0L206 171.144z"
                fill="#648299"
                fill-rule="nonzero"
              />
            </svg>
            <p class="px-2 text-white">Sort by</p>
            <select
              @change="sortBy"
              v-model="sortOption"
              class="
                text-gray-200
                h-10
                pl-5
                pr-10
                bg-transparent
                hover:border-gray-400
                outline-none
                appearance-none
              "
            >
              <option v-for="option in options" :key="option">
                {{ option }}
              </option>
            </select>
          </div>
          <div class-="ml-6 flex items-center">
            <input
              v-model="sortOrder"
              type="radio"
              id="Asc"
              value="Ascending"
              name="sortOrder"
              @change="sortBy"
            />
            <label for="Asc">Ascending</label><br />
            <input
              type="radio"
              id="Dec"
              value="Descending"
              name="sortOrder"
              v-model="sortOrder"
              @change="sortBy"
            />
            <label for="Dec">Descending</label><br />
          </div>
          <!-- Asc and Dec options -->
        </div>
        <!-- END OF SORT menu -->

        <section
          class="
            p-4
            bg-gray-300
            mt-10
            rounded-tr-3xl rounded-tl-3xl
            shadow-lg
            min-h-screen
          "
        >
          <h1 class="flex justify-center font-semibold text-gray-700">
            {{ toggle ? "Your basket" : "Available lessons" }}
          </h1>
          <!-- Order complete message -->
          <div
            v-if="orderComplete"
            class="flex bg-green-100 rounded-lg p-4 mb-4 text-sm text-green-700"
            role="alert"
          >
            <svg
              class="w-5 h-5 inline mr-3"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clip-rule="evenodd"
              ></path>
            </svg>
            <div>
              <span class="font-medium"
                >Thank you! <b>{{ form.fullname }}</b></span
              >
              Your order has been completed. Order id: <b>{{ orderId }}</b>
            </div>
          </div>
          <!-- LESSONS CONTAINER -->
          <div
            v-if="!toggle"
            class="flex items-center space-y-4 flex-wrap justify-center"
          >
            <!-- SINGLE LESSON CONTAINER -->
            <h3 v-show="!lessons" class="text-gray-500 text-xl font-semibold">
              Loading...
            </h3>
            <div
              v-for="lesson in lessons"
              :key="lesson.id"
              class="
                animate__animated animate__zoomIn
                container
                mx-auto
                p-10
                bg-white
                max-w-sm
                rounded-2xl
                overflow-hidden
                shadow-xl
                hover:shadow-2xl
                transition
                duration-300
              "
            >
              <Lesson
                :lesson="lesson"
                :loading="loading"
                :currentId="currentId"
                @lessonAdded="handleAddToCart"
              />
            </div>
          </div>
          <!-- CART CONTAINER -->
          <Checkout
            v-else-if="toggle"
            :cart="cart"
            @checkout="checkoutClicked = true"
            @lessonRemoved="removeFromBasket"
            @orderSubmitted="handleOrderSubmitted"
            :checkoutClicked="checkoutClicked"
            @updateLessons="fetchLessonsFromDb"
          />
        </section>
      </div>
    </main>
  </div>
</template>

<script>
import Checkout from "./components/Checkout.vue";
import Lesson from "./components/Lesson.vue";
export default {
  components: { Lesson, Checkout },
  data() {
    return {
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
    };
  },
  created() {
    this.fetchLessonsFromDb();
  },
  methods: {
    handleOrderSubmitted(id) {
      this.orderId = id;
      this.checkoutClicked = false;
      this.orderComplete = true;
      this.cart = [];
    },
    // performs a search on user input
    searchResults() {
      fetch(`${this.API_URL}/collection/lessons/search?q=` + this.searchInput)
        .then((res) => res.json())
        .then((data) => {
          this.lessons = data;
        });
    },
    // makes GET request to lessons
    fetchLessonsFromDb() {
      fetch(`${this.API_URL}/collection/lessons`)
        .then((response) => response.json())
        .then((data) => {
          this.lessons = data;
          this.loading = false;
        });
    },
    // adds lesson object to cart
    handleAddToCart(lesson) {
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
    //checkout btn
    // updates lesson spaces for a given id
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
        .then(() => {
          this.fetchLessonsFromDb();
        });
    },
  },
  computed: {
    cartCount() {
      return this.cart.length;
    },
    // computes the total of orders
  },
};
</script>

<style>
</style>
