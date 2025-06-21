<script setup lang="ts">
import { useForm, useField } from 'vee-validate'
import * as yup from 'yup'

const { auth } = useSupabaseClient()

// ✅ Schema
const signupSchema = yup.object({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  acceptTerms: yup.boolean().oneOf([true], 'You must accept the terms & conditions'),
})

// ✅ Form setup
const { handleSubmit, errors } = useForm({
  validationSchema: signupSchema,
})

const { value: email } = useField<string>('email')
const { value: password } = useField<string>('password')
const { value: acceptTerms } = useField<boolean>('acceptTerms')

// ✅ Submit handler
const onSubmit = handleSubmit(async (values) => {
  try {
    await withLoading(async () => {
      const { error } = await auth.signUp({
        email: values.email,
        password: values.password,
      })

      if (error) throw error

      await navigateTo('/auth?view=verify-email')
    })
  } catch (e) {
    console.error('Signup error:', e)
  }
})
</script>

<template>
  <form class="flex flex-col gap-6" @submit.prevent="onSubmit">
    <!-- Title -->
    <h2 class="text-2xl font-extrabold text-zinc-100 text-center uppercase tracking-wide">
      Create an Account
    </h2>

    <!-- Email Field -->
    <div class="flex flex-col gap-1">
      <label for="email" class="text-xs font-semibold text-zinc-400">Email</label>
      <input
        id="email"
        v-model="email"
        type="email"
        class="bg-zinc-900 text-zinc-100 placeholder-zinc-500 border border-zinc-700 rounded px-4 py-2 
               focus:outline-none focus:ring-2 focus:ring-rose-600"
      >
      <p v-if="errors.email" class="text-xs text-red-500">{{ errors.email }}</p>
    </div>

    <!-- Password Field -->
    <div class="flex flex-col gap-1">
      <label for="password" class="text-xs font-semibold text-zinc-400">Password</label>
      <input
        id="password"
        v-model="password"
        type="password"
        class="bg-zinc-900 text-zinc-100 placeholder-zinc-500 border border-zinc-700 rounded px-4 py-2 
               focus:outline-none focus:ring-2 focus:ring-rose-600"
      >
      <p v-if="errors.password" class="text-xs text-red-500">{{ errors.password }}</p>
    </div>

    <!-- Terms & Conditions -->
    <div class="flex items-center gap-2">
      <input
        id="terms"
        v-model="acceptTerms"
        type="checkbox"
        class="accent-rose-600"
      >
      <label for="terms" class="text-sm text-zinc-400">
        I agree to the
        <NuxtLink to="/terms" class="underline hover:text-rose-500">Terms & Conditions</NuxtLink>
      </label>
    </div>
    <p v-if="errors.acceptTerms" class="text-xs text-red-500">{{ errors.acceptTerms }}</p>

    <!-- Submit Button -->
    <button
      type="submit"
      class="bg-rose-600 hover:bg-rose-700 text-white font-bold py-2 rounded 
             uppercase tracking-wider shadow-sm hover:shadow-md transition-all"
    >
      Sign Up
    </button>

    <!-- Navigation Link -->
    <p class="text-sm text-center text-zinc-400">
      Already in the fight?
      <NuxtLink to="/auth?view=login" class="underline hover:text-rose-500">
        Log in
      </NuxtLink>
    </p>
  </form>
</template>

