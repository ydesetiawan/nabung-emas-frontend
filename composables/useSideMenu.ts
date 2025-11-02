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
      // Check if mobile device
      const isMobile = window.innerWidth < 1024 // lg breakpoint

      const savedState = localStorage.getItem('sideMenuOpen')
      if (savedState !== null) {
        // On mobile, always start closed; on desktop, use saved state
        menuOpen.value = isMobile ? false : savedState === 'true'
      } else {
        // Default: closed on mobile, open on desktop
        menuOpen.value = !isMobile
      }
    }
  })

  const handleToggle = (state?: boolean) => {
    if (typeof state === 'boolean') {
      menuOpen.value = state
    } else {
      menuOpen.value = !menuOpen.value
    }
  }

  return {
    menuOpen,
    handleToggle
  }
}

