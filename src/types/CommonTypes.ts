
export type CustomDialogProps = {
  children: React.ReactNode;
  ref: React.Ref<{
    open: () => void;
    close: () => void;
  }>;
};

export type CustomDialogType = {
    open: () => void;
    close: () => void;
}

