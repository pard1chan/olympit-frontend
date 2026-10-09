<script setup>
import UserProfile from '@/entities/user/ui/UserProfile.vue';
import { Button, Card } from '@/shared/ui';
import { useProfile } from './useUser';
import { ref, computed, onMounted, watch } from 'vue';
import CropperDialog from '@/features/avatar-cropper/ui/CropperDialog.vue';
import { IconEdit } from '@/shared/ui/Icons';
import { useAuthStore } from '@/shared/stores';
import { storeToRefs } from 'pinia';

defineProps({
  type: {
    default: 'dashboard',
    type: String
  },
  userType: {
    default: 'student',
    type: String
  }
})
const modalVisible = ref(false)
const authStore = useAuthStore()
const { isAuthenticated } = storeToRefs(authStore)

const {
  toggleEdit,
  saveProfile,
  fetchUser,
  user,
  avatar,
  isLoading,
  isEditing,
  editForm,
  isAvatarLoading,
  openModal,
} = useProfile(modalVisible)

const buttonMethod = computed(() => isEditing.value ? saveProfile : toggleEdit)
const buttonMode = computed(() => isEditing.value ? 'secondary' : 'primary')
const buttonText = computed(() => isEditing.value ? 'Сохранить изменения' : 'Редактировать профиль')

watch(isAuthenticated, async (newVal) => {
  if (newVal) {
    await fetchUser();
  }
}, { immediate: true });
</script>

<template>
  <Card>
    <div class="user-profile-card">
      <div class="user-profile-card__top">
        <UserProfile 
          v-if="user" 
          :img="avatar" 
          :userType
          :isEditing="isEditing" 
          v-model:name="editForm.firstName"
          v-model:class="editForm.class" 
          v-model:email="editForm.email" 
          @avatar-click="openModal" 
          />

        <router-link v-if="type === 'dashboard'" :to="{ name: 'edit-profile' }"
          class="user-profile-card__link">
          <IconEdit />
        </router-link>
      </div>

      <div class="edit" v-if="type === 'edit'">
        <router-link class="edit__link" :to="{ name: 'auth', params: { type: 'forgot-password' } }">
          Забыл пароль
        </router-link>

        <div class="edit__buttons">
          <Button 
            @click="buttonMethod"
            :label="buttonText"
            :mode="buttonMode" 
            :loading="isLoading || isAvatarLoading" 
            />
          <Button 
            v-if="isEditing" 
            label="Отмена" 
            mode="secondary" 
            @click="isEditing = false" 
            />
        </div>

        <CropperDialog v-model="modalVisible" />
      </div>
    </div>
  </Card>
</template>

<style lang="scss" scoped>
.user-profile-card {
  display: flex;
  flex-direction: column;
  gap: fluid(40, 20) 0;
  color: var(--color-primary);

  &__top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0 20px;
  }

  &__link {
    align-self: flex-start;
    cursor: pointer;
    padding: 8px;
    border-radius: 8px;
    transition: background-color 0.2s;

    &:hover {
      background-color: rgba(0, 0, 0, 0.05);
    }
  }

  &__action {
    width: 20px;
    height: 20px;
    display: block;
    cursor: pointer;
    user-select: none;
  }
}

.edit {
  display: flex;
  flex-direction: column;
  row-gap: fluid(40, 20);
  padding-top: 20px;
  border-top: 1px solid #e5e7eb;

  &__link {
    color: var(--color-pink);
    font-weight: 700;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }

  &__buttons {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
}

/* Additional styles for cropper */
.loading-status {
  padding: 10px;
  background: #f0f0f0;
  border-radius: 4px;
  margin: 10px 0;
}

button.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

img {
  max-width: 100%;
  height: auto;
}
</style>