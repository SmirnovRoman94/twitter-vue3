<template>
  <teleport to="body">
    <transition name="modal">
      <div @click="handleCloseModal" class="modal__wrapper">
        <div class="modal-content" @click.stop="">
          <div class="modal-header">
            <span class="modal-title">{{ title }}</span>
            <span @click="handleCloseModal" class="button-close">&times;</span>
          </div>
          <div class="modal-body">
            <slot></slot>
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: 'Modal'
    }
  },
  emits: ['onClose'],
  setup(_, { emit }) {
    const handleCloseModal = () => {
      emit('onClose')
    }
    return { handleCloseModal }
  }
}
</script>

<style lang="scss">
// Animation
.modal-enter {
  opacity: 0;
}
.modal-leave-active {
  opacity: 0;
}
.modal-enter .modal-content,
.modal-leave-active .modal-content {
  transform: scale(1.2);
}

.modal__wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  transition: opacity 0.2s ease;
  right: 0;
  z-index: 998;
  background-color: rgba(00, 00, 00, 0.48);
}

.modal-content {
  position: relative;
  max-width: 600px;
  padding: 20px 18px;
  background-color: #fff;
  border: 1px solid #dcdfe6;
  transition: all 0.2s ease;
  border-radius: 8px;
  z-index: 999;
  overflow: hidden;
  @media screen and (min-width: 900px) {
    min-width: 500px;
  }
}

.modal-header {
  display: flex;
  align-self: center;
  justify-content: space-between;
  padding-bottom: 20px;
  span {
    font-size: 24px;
  }
  .button-close {
    cursor: pointer;
  }
}

.modal-body {
  text-align: center;
}
</style>
