import { useForm } from "vee-validate";
import { computed, watch } from "vue";
import { schemas } from "../../lib";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/shared/stores";
import { storeToRefs } from "pinia";

const authStore = useAuthStore()
const { error } = storeToRefs(authStore)

export const useValidation = (formType) => {
  const validationSchema = computed(() => schemas[formType.value]);
  const router = useRouter()

  const {
    values,
    resetForm,
    isSubmitting,
    handleSubmit,
    errors: veeErrors,
  } = useForm({
    validationSchema,
  });

  const errors = computed(() => Object.keys(veeErrors.value).length);

  watch(formType, (newValue, oldValue) => {
    if (newValue !== oldValue) {
      error.value = null
       resetForm();
    }
  });

  const submit = handleSubmit(async (values) => {
    await authStore[formType.value](values)
    router.push({ name: 'home' })
  });

  return {
    resetForm,
    values,
    handleSubmit,
    isSubmitting,
    submit,
    errors,
    error,
  };
};
