import { ref } from 'vue'
import type { Character } from '@/types/character'

const selectedCharacter = ref<Character | null>(null)

export function useCharacterProfile() {
  return {
    selectedCharacter
  }
}
