import { useImperativeHandle, useRef } from "react";
import sytles from "./styles.module.scss";
import { createPortal } from "react-dom";
import { CustomDialogProps } from "../../types/CommonTypes";

const CustomDialog: React.FC<CustomDialogProps> = ({ children, ref }) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useImperativeHandle(
    ref,
    () => ({
      open: () => {
        if (dialogRef.current) {
          dialogRef.current.showModal();
        }
      },
      close: () => {
        if (dialogRef.current) {
          dialogRef.current.close();
        }
      },
    }),
    []
  );

  return (
    <>
      {createPortal(
        <dialog className={sytles.dialog} ref={dialogRef}>
          {children}
        </dialog>,
        document.body
      )}
    </>
  );
};

export default CustomDialog;
