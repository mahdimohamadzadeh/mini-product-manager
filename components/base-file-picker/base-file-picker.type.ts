import type { PropType } from 'vue';

export interface FilePickerProps {
  modelValue?: File[] | File | null;
  accept?: string;
  multiple?: boolean;
  disabled?: boolean;
  maxFileSize?: number;
  maxFiles?: number;
  label?: string;
  hint?: string;
  color?: string;
  dense?: boolean;
  outlined?: boolean;
  rounded?: boolean;
  square?: boolean;
  flat?: boolean;
  bordered?: boolean;
  noFileSelectedText?: string;
  fileSelectedText?: string;
  filesSelectedText?: string;
  clearable?: boolean;
  counter?: boolean;
  loading?: boolean;
  useChips?: boolean;
  /**
   * If true, only allows image files to be selected
   * @default false
   */
  imageOnly?: boolean;
  dropZoneText?: string;
  dropZoneSubtext?: string;
  browseButtonText?: string;
  removeButtonText?: string;
  clearAllText?: string;
  uploadIcon?: string;
  removeIcon?: string;
  clearIcon?: string;
  description?: string;
  browseButton?: boolean;
}

export interface FilePickerEmits {
  (e: 'update:modelValue', value: File[] | File | null): void;
  (e: 'rejected', rejectedEntries: { file: File; reason: string }[]): void;
  (e: 'added', files: File[]): void;
  (e: 'removed', files: File[]): void;
  (e: 'clear'): void;
  (e: 'change', files: File[]): void;
}

export const filePickerProps = {
  modelValue: {
    type: [Array, File] as PropType<File[] | File | null>,
    default: null,
  },
  accept: {
    type: String,
    default: '*/*',
  },
  multiple: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  maxFileSize: {
    type: Number,
    default: 5 * 1024 * 1024, // 5MB
  },
  maxFiles: {
    type: Number,
    default: 10,
  },
  label: {
    type: String,
    default: 'Choose files',
  },
  hint: {
    type: String,
    default: '',
  },
  color: {
    type: String,
    default: 'primary',
  },
  dense: {
    type: Boolean,
    default: false,
  },
  outlined: {
    type: Boolean,
    default: false,
  },
  rounded: {
    type: Boolean,
    default: false,
  },
  square: {
    type: Boolean,
    default: false,
  },
  flat: {
    type: Boolean,
    default: false,
  },
  bordered: {
    type: Boolean,
    default: true,
  },
  noFileSelectedText: {
    type: String,
    default: 'No file selected',
  },
  fileSelectedText: {
    type: String,
    default: 'file selected',
  },
  filesSelectedText: {
    type: String,
    default: 'files selected',
  },
  clearable: {
    type: Boolean,
    default: true,
  },
  counter: {
    type: Boolean,
    default: true,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  useChips: {
    type: Boolean,
    default: false,
  },
  imageOnly: {
    type: Boolean,
    default: false,
  },
};

