<template>
  <nav class="p-4 md:py-8 xl:px-0 md:container md:mx-w-6xl md:mx-auto">
    <div class="hidden lg:flex lg:justify-between lg:items-center">
      <ul class="flex items-center space-x-4 text-sm font-semibold">
        <li v-for="menuItem of menuItems">
          <router-link
            :to="{
              name: menuItem.routeName
            }"
            :class="`
              px-2
              xl:px-4
              py-2
              ${ menuItem.active ? 'text-gray-900' : 'text-gray-500' }
              rounded-md
              ${ menuItem.active ? 'bg-gray-300' : 'bg-gray-200' }
              ${ menuItem.active ? '' : 'hover:bg-gray-300 hover:text-gray-900' }
            `"
          >
            {{ menuItem.displayName }}
          </router-link>
        </li>
      </ul>
      <ul class="flex items-center gap-6">
        <li>
          <span class="text-sm font-sans text-gray-800 font-semibold tracking-wider">
            Cartesi DApp Vue Boilerplate
          </span>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { ref, watch } from 'vue';

interface MenuItem {
  displayName: string,
  routeName: string,
  active?: boolean,
}

const menuItems = ref<MenuItem[]>([
  {
    displayName: 'Start here',
    routeName: 'home',
  },
  {
    displayName: 'Hello DApp',
    routeName: 'hello',
  },
]);

watch(useRouter().currentRoute, async (currentRoute) => {
  const currentRouteName = currentRoute.name;

  menuItems.value = menuItems.value.map((menuItem: MenuItem) => {
    menuItem.active = currentRouteName === menuItem.routeName;

    return menuItem;
  });
});
</script>
