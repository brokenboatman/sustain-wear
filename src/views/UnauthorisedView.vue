<template>
  <div class="flex flex-col items-center justify-center h-screen">
    <h1 class="text-3xl font-bold mb-4">Unauthorized</h1>
    <p class="text-gray-600 mb-6">You must be logged in and have permission to access this page.</p>
    <RouterLink to="/login" class="text-blue-500 hover:underline">
      Go to Login
    </RouterLink>
  </div>
</template>
