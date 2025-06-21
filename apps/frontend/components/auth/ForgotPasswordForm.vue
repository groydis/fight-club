<script setup lang="ts">
import { useForm, useField } from 'vee-validate'
import * as yup from 'yup'

const { auth } = useSupabaseClient()

// ✅ Schema
const forgotPasswordSchema = yup.object({
  email: yup.string().email('Invalid email address').required('Email is required'),
})

// ✅ Setup form
const { handleSubmit, errors } = useForm({
  validationSchema: forgotPasswordSchema,
})

const { value: email } = useField<string>('email')

// ✅ Submit handler
const onSubmit = handleSubmit(async (values) => {
  try {
    await withLoading(async () => {
      const { error } = await auth.resetPasswordForEmail(values.email)
      if (error) throw error

      await navigateTo('/auth?view=verify-email')
    })
  } catch (e) {
    console.error('Error sending reset password email:', e)
  }
})
</script>

<template>
  <form class="flex flex-col gap-6" @submit.prevent="onSubmit">
    <!-- Title -->
    <h2 class="text-2xl font-extrabold text-zinc-100 text-center uppercase tracking-wide">
      Reset Your Password
    </h2>

    <!-- Email Field -->
    <div class="flex flex-col gap-1">
      <label for="email" class="text-xs font-semibold text-zinc-400">Email</label>
      <input
        id="email"
        v-model="email"
        type="email"
        class="bg-zinc-900 border border-zinc-700 rounded px-4 py-2 text-zinc-100 placeholder-zinc-500 
               focus:outline-none focus:ring-2 focus:ring-rose-600"
      >
      <p v-if="errors.email" class="text-xs text-red-500">{{ errors.email }}</p>
    </div>

    <!-- Submit Button -->
    <button
      type="submit"
      class="bg-rose-600 hover:bg-rose-700 text-white font-bold py-2 rounded transition 
             uppercase tracking-wider shadow-sm hover:shadow-md"
    >
      Send Reset Link
    </button>

    <!-- Navigation Link -->
    <p class="text-sm text-center text-zinc-400">
      Got it sorted?
      <NuxtLink to="/auth?view=login" class="underline hover:text-rose-500">Back to login</NuxtLink>
    </p>
  </form>
</template>

