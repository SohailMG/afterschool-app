<template>
  <div>
    <img
      class="rounded-xl"
      :src="require('../assets/' + lesson.image)"
      alt=""
    />
    <div class="flex items-center">
      <div class="flex items-start flex-col">
        <h1 class="mt-5 text-2xl font-semibold">
          {{ lesson.subject }}
        </h1>
        <small class="text-sm text-gray-500">
          <i class="fa fa-map-marker-alt"></i>
          {{ lesson.location }}</small
        >
        <p class="mt-2 font-semibold text-green-700 text-xl">
          £{{ lesson.price }}
        </p>
        <p class="mt-2 font-semibold text-xl">
          <i
            :class="{
              'fa fa-users text-green-700 px-2': lesson.space > 0,
              'fa fa-users text-red-700 px-2': lesson.space == 0,
            }"
          ></i
          >{{ lesson.space === 0 ? "No spaces left" : lesson.space }}
        </p>
      </div>
      <div>
        <button
          v-if="!loading"
          :disabled="lesson.space === 0"
          :class="getBtnClasses(lesson)"
          @click="$emit('lessonAdded', lesson)"
        >
          Add
          <i class="fas fa-cart-plus text-gray-200 text-md text-white"></i>
        </button>
        <div
          v-if="loading && lesson._id == currentId"
          style="border-top-color: transparent"
          class="
            absolute
            bottom-0
            right-0
            m-2
            w-10
            h-10
            border-4 border-green-400 border-solid
            rounded-full
            animate-spin
          "
        ></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  props: ["lesson", "loading", "currentId"],
  methods: {
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
  },
};
</script>

<style>
</style>