<template>
  <div class="w-full" :class="{ 'opacity-50 cursor-not-allowed': disabled }">
    <!-- Label -->
    <label v-if="label" class="block text-sm font-medium mb-1"
      :class="[`text-${color}-700 dark:text-${color}-300`]">
      {{ label }}
    </label>

    <!-- Drop Zone -->
    <div ref="dropZone" class="relative p-4 rounded-lg transition-all duration-200 ease-in-out"
      :class="[
        {
          'bg-gray-100': !flat,
          'border-2 border-dashed': bordered,
          'border-gray-300': !isDragOver,
          'border-primary-500': isDragOver,
          'rounded-lg': rounded,
          'rounded-none': square,
          'shadow-sm': !flat,
          'opacity-60': loading,
          'cursor-pointer': !disabled,
          'cursor-not-allowed opacity-60': disabled,
        },
        `border-${color}-500`,
      ]" @click.prevent="!disabled && openFileDialog()" @dragover.prevent="handleDragOver"
      @dragleave.prevent="handleDragLeave" @drop.prevent="handleDrop">
      <input ref="fileInput" type="file" :accept="accept" :multiple="multiple" :disabled="disabled || loading"
        @change="handleFileSelect" class="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />

      <!-- Loading State -->
      <div v-if="loading"
        class="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center rounded-lg">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2" :class="`border-${color}-500`">
        </div>
      </div>

      <!-- Drop Zone Content -->
      <div class="text-center p-4">
        <div class="mx-auto mb-3 w-12 h-12" :class="`text-${color}-500`">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
        </div>

        <div class="text-sm mb-1" :class="`text-${color}-700`">
          <span class="font-medium">{{ getDropZoneText }}</span>
          <span v-if="!disabled && props.dropZoneSubtext" class="text-gray-500 ml-1">
            {{ props.dropZoneSubtext }}
          </span>
        </div>

        <p v-if="hint" class="text-xs mt-1 text-gray-500">
          {{ hint }}
        </p>

        <!-- File Counter -->
        <div v-if="counter && selectedFiles.length > 0" class="mt-2 text-xs text-gray-500">
          {{ getFileCounterText }}
        </div>
      </div>
    </div>

    <!-- Image Preview (for imageOnly mode) -->
    <div v-if="imageOnly && selectedFiles.length > 0 && selectedFiles[0]?.type.startsWith('image/')" class="mt-4">
      <img :src="imagePreviewUrl" :alt="selectedFiles[0]?.name" class="max-w-sm h-auto rounded-lg shadow-md object-cover" />
    </div>

    <!-- Selected Files -->
    <div v-if="selectedFiles.length > 0" class="mt-2 space-y-2">
      <template v-if="useChips">
        <!-- Chips Style -->
        <div class="flex flex-wrap gap-2">
          <div v-for="(file, index) in selectedFiles" :key="index"
            class="inline-flex items-center px-3 py-1 rounded-full text-sm"
            :class="[`bg-${color}-100`, `text-${color}-800`]">
            <span class="mr-2">{{ file.name }}</span>
            <span class="text-xs opacity-70">({{ formatFileSize(file.size) }})</span>
            <button v-if="clearable" @click.stop="removeFile(index)" class="ml-2 opacity-70 hover:opacity-100"
              :class="`hover:text-${color}-900`" :disabled="disabled || loading">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="removeIcon" />
              </svg>
              <span class="sr-only">{{ removeButtonText }}</span>
            </button>
          </div>
        </div>
      </template>
      <template v-else>
        <!-- List Style -->
        <div v-for="(file, index) in selectedFiles" :key="index"
          class="flex items-center justify-between p-2 rounded" :class="[
            `bg-${color}-50`,
            `hover:bg-${color}-100`,
            { 'opacity-60': disabled || loading },
          ]">
          <div class="flex items-center space-x-3">
            <div class="flex justify-center items-center w-8 h-8 rounded-full"
              :class="`bg-${color}-100`">
              <span class="text-sm" :class="`text-${color}-600`">
                {{ getFileIcon(file.type) }}
              </span>
            </div>
            <div class="min-w-0">
              <p class="text-sm font-medium truncate" :class="`text-${color}-900`">
                {{ file.name }}
              </p>
              <p class="text-xs" :class="`text-${color}-600`">
                {{ formatFileSize(file.size) }}
              </p>
            </div>
          </div>
          <button v-if="clearable" @click.stop="removeFile(index)" class="p-1 rounded-full"
            :class="`hover:bg-${color}-200`" :disabled="disabled || loading">
            <svg class="w-4 h-4" :class="`text-${color}-500`" fill="none" stroke="currentColor"
              viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="removeIcon" />
            </svg>
          </button>
        </div>
      </template>
    </div>

    <!-- Browse Button -->
    <button v-if="browseButton" type="button"
      class="mt-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white"
      :class="`bg-${color}-600 hover:bg-${color}-700`" :disabled="disabled || loading"
      @click.stop="openFileDialog">
      <span>{{ browseButtonText }}</span>
    </button>

    <!-- Error Message -->
    <div v-if="errorMessage" class="mt-2 text-sm text-red-600">
      {{ errorMessage }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import type { FilePickerProps, FilePickerEmits } from "./base-file-picker.type";
import { filePickerProps as baseProps } from "./base-file-picker.type";
import { formatFileSize, getFileIcon } from "./base-file-picker.helper";

// Define props with defaults
const props = withDefaults(defineProps<FilePickerProps>(), {
  ...baseProps,
  modelValue: null,
  accept: "*/*",
  multiple: false,
  disabled: false,
  maxFileSize: 5 * 1024 * 1024, // 5MB
  maxFiles: 10,
  label: "Choose files",
  hint: "",
  color: "primary",
  dense: false,
  outlined: false,
  rounded: false,
  square: false,
  flat: false,
  bordered: true,
  noFileSelectedText: "No file selected",
  fileSelectedText: "file selected",
  filesSelectedText: "files selected",
  clearable: true,
  counter: true,
  loading: false,
  useChips: false,
  imageOnly: false,
  dropZoneText: "Drag and drop files here or",
  dropZoneSubtext: "or drop files here",
  browseButtonText: "Browse files",
  removeButtonText: "Remove",
  clearAllText: "Clear all",
  uploadIcon:
    "M3 15a4 4 0 004 4h10a2 2 0 001.732-1z M15 19l3-3m0 0l3-3m-3 3l-3-3m3 3l3 3",
  removeIcon: "M6 18L18 6M6 6l12 12",
  clearIcon: "M6 18L18 6M6 6l12 12",
  browseButton: true,
});

// Define emits
const emit = defineEmits<FilePickerEmits>();

// Refs
const fileInput = ref<HTMLInputElement>();
const dropZone = ref<HTMLElement>();
const isDragOver = ref(false);
const errorMessage = ref("");
const selectedFiles = ref<File[]>([]);

// Computed properties
const getDropZoneText = computed(() => {
  if (selectedFiles.value.length === 0) {
    return props.imageOnly ? "Drop an image here" : props.noFileSelectedText;
  }
  if (props.multiple) {
    return `${selectedFiles.value.length} ${selectedFiles.value.length === 1 ? "file" : "files"} selected`;
  }
  return selectedFiles.value[0]?.name || props.noFileSelectedText;
});

const getFileCounterText = computed(() => {
  if (!props.counter) return "";
  if (selectedFiles.value.length === 0) return "";
  if (selectedFiles.value.length === 1) {
    return `1 ${props.fileSelectedText}`;
  }
  return `${selectedFiles.value.length} ${props.filesSelectedText}`;
});

const imagePreviewUrl = computed(() => {
  if (selectedFiles.value.length === 0) return "";
  const file = selectedFiles.value[0];
  if (file && file.type.startsWith("image/")) {
    return URL.createObjectURL(file);
  }
  return "";
});

// Watch for external changes to modelValue
watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue) {
      selectedFiles.value = Array.isArray(newValue) ? newValue : [newValue];
    } else {
      selectedFiles.value = [];
    }
  },
  { immediate: true, deep: true }
);

// Methods
const openFileDialog = () => {
  if (!props.disabled && !props.loading) {
    // Ensure we're not in the middle of another file selection
    if (!fileInput.value) return;

    // Create file input with proper accept attribute
    const createFileInput = () => {
      const input = document.createElement("input");
      input.type = "file";
      input.multiple = props.multiple;
      input.accept = props.imageOnly ? "image/*" : props.accept || "*/*";
      input.style.display = "none";
      return input;
    };

    const input = createFileInput();

    input.onchange = (e: Event) => {
      handleFileSelect(e);
      // Clean up
      document.body.removeChild(input);
    };

    // Add to body and trigger click
    document.body.appendChild(input);
    input.click();
  }
};

const validateFiles = (files: File[]): boolean => {
  errorMessage.value = "";

  // Check if file is an image when imageOnly is true
  if (props.imageOnly) {
    for (const file of files) {
      if (!file.type.startsWith("image/")) {
        errorMessage.value = `File "${file.name}" is not an image.`;
        emit("rejected", [{ file, reason: "Only image files are allowed" }]);
        return false;
      }
    }
  }

  // Check file size
  for (const file of files) {
    if (file.size > props.maxFileSize) {
      errorMessage.value = `File "${file.name}" is too large. Maximum size is ${formatFileSize(props.maxFileSize)}.`;
      emit("rejected", [
        { file, reason: "File size exceeds maximum allowed size" },
      ]);
      return false;
    }
  }

  // Check number of files
  if (props.multiple && files.length > props.maxFiles) {
    errorMessage.value = `Too many files selected. Maximum is ${props.maxFiles}.`;
    emit(
      "rejected",
      files.map((file) => ({
        file,
        reason: `Maximum number of files (${props.maxFiles}) exceeded`,
      }))
    );
    return false;
  }

  return true;
};

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    const files = Array.from(target.files);
    processFiles(files);
    // Emit the update event with the first file or array of files
    if (files.length > 0) {
      emit('update:modelValue', props.multiple ? files : files[0]);
    }
  } else {
    emit('update:modelValue', null);
  }
  // Reset the input value to allow selecting the same file again
  // Using setTimeout to ensure the reset happens after the current event loop
  setTimeout(() => {
    if (target) {
      target.value = "";
    }
  }, 0);
};

const processFiles = (files: File[]) => {
  if (!validateFiles(files)) {
    return;
  }

  const newFiles = props.multiple
    ? [...selectedFiles.value, ...files]
    : files.slice(0, 1);

  if (props.multiple && newFiles.length > props.maxFiles) {
    errorMessage.value = `Cannot add more than ${props.maxFiles} files.`;
    return;
  }

  selectedFiles.value = newFiles;
  emit(
    "update:modelValue",
    props.multiple ? [...selectedFiles.value] : selectedFiles.value[0] || null
  );
  emit("added", files);
  emit("change", selectedFiles.value);
};

const removeFile = (index: number) => {
  if (props.disabled || props.loading) return;

  const removedFiles = selectedFiles.value.splice(index, 1);

  if (props.multiple) {
    emit("update:modelValue", [...selectedFiles.value]);
  } else {
    emit("update:modelValue", selectedFiles.value[0] || null);
  }

  emit("removed", removedFiles);
  emit("change", selectedFiles.value);
};

const clearFiles = () => {
  selectedFiles.value = [];
  errorMessage.value = "";
  // Reset the file input
  if (fileInput.value) {
    fileInput.value.value = "";
  }
  emit('clear');
  emit('update:modelValue', null);
};

const handleDragOver = (event: DragEvent) => {
  if (props.disabled || props.loading) return;
  event.preventDefault();
  isDragOver.value = true;
};

const handleDragLeave = (event: DragEvent) => {
  if (props.disabled || props.loading) return;
  event.preventDefault();
  isDragOver.value = false;
};

const handleDrop = (event: DragEvent) => {
  if (props.disabled || props.loading) return;
  event.preventDefault();
  isDragOver.value = false;

  if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
    const files = Array.from(event.dataTransfer.files);
    processFiles(files);
  }
};

// Expose methods to parent component
defineExpose({
  openFileDialog,
  clearFiles,
  removeFile,
});
</script>
