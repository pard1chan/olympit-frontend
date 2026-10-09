import { ref, computed } from 'vue';

export function useProgress() {
  const progressData = ref([]);

  const setProgressData = (data) => {
    progressData.value = data.map(item => ({
      subject: item.subject,
      progress: Math.min(100, Math.max(0, item.progress)),
      color: item.color || getDefaultColor(item.subject),
      backgroundColor: item.backgroundColor || '#E0E0E0'
    }));
  };

  const updateSubjectProgress = (subjectName, progress) => {
    const index = progressData.value.findIndex(item => item.subject === subjectName);
    if (index !== -1) {
      progressData.value[index].progress = Math.min(100, Math.max(0, progress));
    }
  };

  const addSubject = (subjectData) => {
    progressData.value.push({
      subject: subjectData.subject,
      progress: Math.min(100, Math.max(0, subjectData.progress || 0)),
      color: subjectData.color || getDefaultColor(subjectData.subject),
      backgroundColor: subjectData.backgroundColor || '#E0E0E0'
    });
  };

  const removeSubject = (subjectName) => {
    const index = progressData.value.findIndex(item => item.subject === subjectName);
    if (index !== -1) {
      progressData.value.splice(index, 1);
    }
  };

  const totalProgress = computed(() => {
    if (progressData.value.length === 0) return 0;
    const total = progressData.value.reduce((sum, item) => sum + item.progress, 0);
    return Math.round(total / progressData.value.length);
  });

  const getDefaultColor = (subject) => {
    const colors = [
      '#FF6B6B', '#4ECDC4', '#FFD166', '#06D6A0',
      '#118AB2', '#9D4EDD', '#EF476F', '#FF9A5A'
    ];
    const hash = subject.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };

  return {
    progressData,
    setProgressData,
    updateSubjectProgress,
    addSubject,
    removeSubject,
    totalProgress
  };
}