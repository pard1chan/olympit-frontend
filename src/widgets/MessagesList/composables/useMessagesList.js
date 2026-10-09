// composables/useMessagesListLogic.js
import { ref, watch, nextTick, onMounted, onUnmounted } from 'vue';
import { useAutoScroll } from '@/shared/lib/scroll/useAutoScroll';
import { useProfile } from '@/widgets/UserProfileCard/useUser';

export function useMessagesListLogic(props, emit) {
  const { containerRef, scrollToBottom, scrollToBottomSmooth } = useAutoScroll();
  const { user } = useProfile();
  const isLoading = ref(false);
  const isLoadingMore = ref(false);
  const localMessages = ref([]);
  const hasMoreMessages = ref(true);
  const currentOffset = ref(0);
  const currentThreadId = ref(null);
  const isInitialLoad = ref(true);
  const shouldAutoScroll = ref(false);
  const pageRef = ref(1);
  
  // Intersection observer for loading more messages
  let observer = null;
  const loadMoreTrigger = ref(null);

  // Sync with props messages
  watch(() => props.messages, (newMessages) => {
    if (!newMessages) return;
    
    const oldMessages = localMessages.value;
    const isPrepending = oldMessages.length > 0 && 
                        newMessages.length > oldMessages.length &&
                        newMessages[0]?.id !== oldMessages[0]?.id;
    
    if (isPrepending) {
      // Save scroll position before prepending
      const container = containerRef.value;
      if (container) {
        const oldScrollHeight = container.scrollHeight;
        const oldScrollTop = container.scrollTop;
        
        // Prepend new messages
        localMessages.value = [...newMessages];
        
        // Restore scroll position after prepending
        nextTick(() => {
          const newScrollHeight = container.scrollHeight;
          container.scrollTop = oldScrollTop + (newScrollHeight - oldScrollHeight);
        });
      } else {
        localMessages.value = [...newMessages];
      }
    } else {
      // Normal messages update
      localMessages.value = newMessages;
      
      // Only auto-scroll to bottom if it's a new message (not initial load)
      if (shouldAutoScroll.value && props.autoScrollEnabled) {
        nextTick(() => {
          scrollToBottomSmooth();
          shouldAutoScroll.value = false; // Reset after scrolling
        });
      }
    }
    
    hasMoreMessages.value = newMessages.length >= props.pageSize;
    isLoadingMore.value = false;
  }, { deep: true });

  // Setup intersection observer
  const setupObserver = () => {
    if (!loadMoreTrigger.value || !containerRef.value) return;
    
    
    // Disconnect old observer if exists
    if (observer) {
      observer.disconnect();
    }
    
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          console.log('Intersection observed:', entry.isIntersecting, hasMoreMessages.value, isLoadingMore.value); // Debug
          
          // Only trigger if not initial load and not already loading
          if (entry.isIntersecting && 
              hasMoreMessages.value && 
              !isLoadingMore.value && 
              !isInitialLoad.value) {
            console.log('Loading more messages...'); // Debug
            loadMoreMessages();
          }
        });
      },
      {
        root: containerRef.value,
        threshold: 0,
        rootMargin: '200px' // Increased threshold for earlier loading
      }
    );
    
    observer.observe(loadMoreTrigger.value);
  };

  // Load more messages (older messages)
  const loadMoreMessages = async () => {
    if (!hasMoreMessages.value || isLoadingMore.value || !currentThreadId.value) {
      console.log('Cannot load more:', { hasMore: hasMoreMessages.value, isLoading: isLoadingMore.value, threadId: currentThreadId.value }); // Debug
      return;
    }
    
    console.log('Loading more messages, current page:', pageRef.value); // Debug
    isLoadingMore.value = true;
    
    try {
      // Increment page for next load
      pageRef.value++;
      const limit = props.pageSize;
      const offset = pageRef.value * props.pageSize;
      
      console.log('Fetching messages with offset:', offset); // Debug
      await emit('load', currentThreadId.value, limit, offset);
      currentOffset.value = offset;
    } catch (error) {
      console.error('Error loading more messages:', error);
      isLoadingMore.value = false;
    }
    // isLoadingMore will be set to false in the watch when messages are received
  };

  // Load initial messages
  const loadMessages = async (id, limit, offset = 0) => {
    if (isLoading.value) return;
    
    console.log('Loading initial messages for thread:', id); // Debug
    
    isLoading.value = true;
    isInitialLoad.value = true;
    shouldAutoScroll.value = false;
    currentThreadId.value = id;
    currentOffset.value = offset;
    pageRef.value = 1; // Reset page
    
    try {
      await emit('load', id, limit, offset);
      await nextTick();
      
      // After messages are loaded, scroll to bottom but only once
      if (props.autoScrollEnabled && localMessages.value.length > 0) {
        // Small delay to ensure DOM is ready
        setTimeout(() => {
          scrollToBottomSmooth();
          isInitialLoad.value = false;
          
          // Setup observer after messages are loaded and scrolled
          nextTick(() => {
            setupObserver();
          });
        }, 300);
      } else {
        isInitialLoad.value = false;
        
        // Setup observer after messages are loaded
        nextTick(() => {
          setupObserver();
        });
      }
    } catch (error) {
      console.error('Error loading messages:', error);
      isInitialLoad.value = false;
    } finally {
      isLoading.value = false;
    }
  };

  // Handle new message and scroll
  const handleNewMessage = async (sendMessageFn) => {
    try {
      await sendMessageFn();
      shouldAutoScroll.value = true; // Mark that we should auto-scroll for new messages
      
      // Reset pagination when new message is sent
      pageRef.value = 1;
      currentOffset.value = 0;
      hasMoreMessages.value = true;
      
      await nextTick();
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  // Scroll methods
  const scrollToBottomAuto = () => scrollToBottom();
  const scrollToBottomSmoothly = () => scrollToBottomSmooth();

  // Manual scroll to bottom (for user actions)
  const manualScrollToBottom = () => {
    shouldAutoScroll.value = true;
    scrollToBottomSmooth();
  };

  // Cleanup observer
  onUnmounted(() => {
    if (observer) {
      observer.disconnect();
    }
  });

  // Watch for scroll position to debug
  watch(() => containerRef.value?.scrollTop, (scrollTop) => {
    if (containerRef.value && loadMoreTrigger.value) {
      const triggerRect = loadMoreTrigger.value.getBoundingClientRect();
      const containerRect = containerRef.value.getBoundingClientRect();
      
      // Debug: Check if trigger is visible
      if (triggerRect.top < containerRect.bottom && triggerRect.bottom > containerRect.top) {
        console.log('Trigger is visible in viewport');
      }
    }
  });

  return {
    // State
    containerRef,
    loadMoreTrigger,
    isLoading,
    isLoadingMore,
    user,
    messages: localMessages,
    hasMoreMessages,
    
    // Methods
    loadMessages,
    handleNewMessage,
    loadMoreMessages,
    scrollToBottom: scrollToBottomAuto,
    scrollToBottomSmooth: scrollToBottomSmoothly,
    manualScrollToBottom,
    
    // Exposed methods for parent
    expose: {
      scrollToBottom: scrollToBottomAuto,
      scrollToBottomSmooth: scrollToBottomSmoothly,
      manualScrollToBottom,
      loadMessages
    }
  };
}