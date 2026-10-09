import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { AUTH_CONFIGS } from '../../lib'

export const useAuthForm = () => {
  const route = useRoute()

  const formType = computed(() => route.params.type || 'login')
  const config = computed(() => AUTH_CONFIGS[formType.value])

  return {
    formType,
    config,
  }
}
