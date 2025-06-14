import sytles from "./styles.module.scss";

import { Outlet } from "react-router-dom";
import { LuLogOut } from "react-icons/lu";
import { signOut } from "../../api/auth";
import { useNavigate } from "react-router-dom";
import CustomDialog from "../CustomDialog";
import { useRef, useState } from "react";
import { CustomDialogType } from "../../types/CommonTypes";

const LayoutWithHeader = () => {
  const modalRef = useRef<CustomDialogType>(null);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignOut = async () => {
    setIsLoading(true);
    const error = await signOut();
    modalRef.current?.close();
    if (!error) {
      navigate("/signup");
    } else {
      setIsLoading(false);
      alert("Error signing out:");
    }
  };

  return (
    <>
      <header className={sytles.header}>
        <CustomDialog ref={modalRef}>
          <div className="dialog-container">
            <h2 className="title-dialog">Are you sure you want to sign out?</h2>
            <div className="dialog-buttons">
              <button className="button-primary-filled" onClick={handleSignOut}>
                <span>Sign out</span>
                {isLoading && <span className="loader"></span>}
              </button>
              <button
                className="button-primary-stroke"
                onClick={() => modalRef.current?.close()}
              >
                Cancel
              </button>
            </div>
          </div>
        </CustomDialog>
        <h1 className="logo">Small Stacks</h1>
        <nav className="headerNav">
          <ul>
            <li onClick={() => modalRef.current?.open()}>
              <LuLogOut />
            </li>
          </ul>
        </nav>
      </header>
      <Outlet /> {/* 子ルートをここにレンダリング */}
    </>
  );
};

export default LayoutWithHeader;
