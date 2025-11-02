import { ref, onMounted } from 'vue'

/**
 * Composable for managing side menu state with localStorage persistence
 * @returns {Object} Object containing menuOpen ref and handleToggle function
 */
export const useSideMenu = () => {
  const menuOpen = ref(true)

  // Load saved state from localStorage on mount
  onMounted(() => {
    if (typeof window !== 'undefined') {
      const savedState = localStorage.getItem('sideMenuOpen')
      if (savedState !== null) {
        menuOpen.value = savedState === 'true'
      }
    }
  })

  const handleToggle = (state: boolean) => {
    menuOpen.value = state
  }

  return {
    menuOpen,
    handleToggle
  }
}

