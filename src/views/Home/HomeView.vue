<template>
  <div class="flex flex-col space-y-8">
    <!-- Start Second Row -->
    <BaseContainer
      caption="App summary"
    >
      <InfoBox
        topText="Connected wallet"
        featuredText="MetaMask"
        bottomText="Your wallet provider name"
        icon="fa-solid fa-wallet"
        textColor="text-blue-500"
        bgColor="bg-blue-500"
      />
      <InfoBox
        topText="Connected chain"
        featuredText="0x7a69"
        bottomText="Hex id of connected chain"
        icon="fa-solid fa-link"
        textColor="text-green-500"
        bgColor="bg-green-500"
      />
      <InfoBox
        topText="DApp address"
        featuredText="0xa37aE2b259D35aF4aBdde122eC90B204323ED304"
        bottomText="Your DApp backend address"
        icon="fa-solid fa-location-crosshairs"
        textColor="text-yellow-500"
        bgColor="bg-yellow-500"
      />
    </BaseContainer>

    <BaseContainer
      caption="Rollup Communication"
    >
      <Box
        additionalClass="col-span-3"
      >
        <ul class="divide-y-2 divide-gray-100 overflow-x-auto w-full">
          <li class="py-3 flex justify-between text-sm text-gray-500 font-bold">
            <p class="px-4">Input</p>
            <p class="px-4">Output</p>
          </li>
          <li class="py-3 flex justify-between text-sm text-gray-500 font-light">
            <pre class="px-4">asd</pre>
            <pre class="px-4">asasdasda</pre>
          </li>
          <li class="py-3 flex justify-between text-sm text-gray-500 font-light">
            <pre class="px-4">asd</pre>
            <pre class="px-4">asasdasda</pre>
          </li>
          <li class="py-3 flex justify-between text-sm text-gray-500 font-light">
            <pre class="px-4">asd</pre>
            <pre class="px-4">asasdasda</pre>
          </li>
        </ul>
      </Box>
<!--      <div class="col-span-4 bg-white p-6 rounded-xl border border-gray-50 flex flex-col space-y-6">-->

<!--      </div>-->
    </BaseContainer>
    <!-- End Third Row -->
  </div>
</template>

<script setup lang="ts">

import InfoBox from '@/components/Box/InfoBox.vue';
import BaseContainer from '@/components/Containers/BaseContainer.vue';
import Box from '@/components/Box/Box.vue';
</script>
