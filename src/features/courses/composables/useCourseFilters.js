// features/courses/composables/useCourseFilters.js
import { computed } from 'vue';

export function useCourseFilters(courses, filterOptions, selectedFilter, type = 'all') {
  
  // Filter courses based on selected filter
  const filteredCourses = computed(() => {
    
    if (!courses.value || !Array.isArray(courses.value)) {
      return [];
    }
    
    const filterValue = selectedFilter.value;
    
    // If no filter selected or "all" filter, return all courses
    if (!filterValue || filterValue === 'all') {
      
      return courses.value;
    }
    
    // Apply filters based on filter value and type
    return courses.value.filter(course => {
      // For all courses page
      if (type === 'all') {
        switch (filterValue) {
          case 'active':
          case 'published':
            return course.status === 'published';
          case 'draft':
            return course.status === 'draft';
          case 'archived':
            return course.status === 'archived';
          default:
            return course.status === filterValue;
        }
      } 
      // For student courses page
      else {
        switch (filterValue) {
          case 'active':
            return course.progress > 0 && course.progress < 100;
          case 'completed':
            return course.progress === 100;
          case 'draft':
            return course.progress === 0;
          default:
            return true;
        }
      }
    });
  });
  
  // Get count for each filter
  const getFilterCounts = () => {
    if (!courses.value) return {};
    
    const counts = {
      all: courses.value.length
    };
    
    filterOptions.value.forEach(filter => {
      if (filter.value === 'all') return;
      
      counts[filter.value] = courses.value.filter(course => {
        // For all courses page
        if (type === 'all') {
          switch (filter.value) {
            case 'active':
            case 'published':
              return course.status === 'published';
            case 'draft':
              return course.status === 'draft';
            case 'archived':
              return course.status === 'archived';
            default:
              return course.status === filter.value;
          }
        } 
        // For student courses page
        else {
          switch (filter.value) {
            case 'active':
              return course.progress > 0 && course.progress < 100;
            case 'completed':
              return course.progress === 100;
            case 'not_started':
              return course.progress === 0;
            default:
              return false;
          }
        }
      }).length;
    });
    
    return counts;
  };
  
  // Update filters with counts
  const filtersWithCounts = computed(() => {
    const counts = getFilterCounts();
    
    return filterOptions.value.map(filter => ({
      ...filter,
      count: counts[filter.value] || 0,
      disabled: counts[filter.value] === 0
    }));
  });
  
  return {
    filteredCourses,
    filtersWithCounts,
    getFilterCounts
  };
}