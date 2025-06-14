import { Suspense, useEffect, useRef, useState } from "react";
import { signIn, signUp } from "../../api/auth";
import styles from "./styles.module.scss";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import CustomDialog from "../../components/CustomDialog";
import { CustomDialogType } from "../../types/CommonTypes";
import { AuthError } from "@supabase/supabase-js";

const SignIn = () => {
  const [isSignIn, setIsSignIn] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<AuthError | null>(null);
  const user = useAuth(); // 現在のユーザー情報を取得
  const navigate = useNavigate();
  const errorDialogRef = useRef<CustomDialogType>(null);
  const singUpDialogRef = useRef<CustomDialogType>(null);

  useEffect(() => {
    if (user) {
      // ユーザー情報がある場合はカレンダー画面に遷移
      navigate("/calender");
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let res = null;
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    setIsLoading(true);

    if (isSignIn) {
      res = await signIn({ email, password });
      navigate("/calender");
    } else {
      res = await signUp({ email, password });
    }
    setIsLoading(false);
    if (res.error) {
      setError(res.error);
      errorDialogRef.current?.open();
    } else if (!isSignIn) {
      setError(null);
      singUpDialogRef.current?.open();
    }
  };

  const reset = () => {
    setEmail("");
    setPassword("");
  };

  const toggleView = () => {
    reset();
    setIsSignIn((prev) => !prev);
  };

  return (
    <div className={styles.signIn}>
      <h1 className="logo">Small Stacks</h1>
      <Suspense fallback={null}>
        <div className="signInForm">
          <h2>{isSignIn ? "Sign in" : "Sign up"}</h2>

          <form onSubmit={handleSubmit}>
            <label htmlFor="email">
              <span>Email Address</span>
              <input
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>
            <label htmlFor="password">
              <span>Password</span>
              <input
                type="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </label>
            <button
              className="button-primary-filled"
              type="submit"
              disabled={isLoading}
            >
              <span>{isSignIn ? "Sign in" : "Sign up"}</span>
              {isLoading && <span className="loader"></span>}
            </button>
            {isSignIn ? (
              <p className="toggleText">
                Don't have an account?
                <span className="link" onClick={toggleView}>
                  Sign up
                </span>
              </p>
            ) : (
              <p className="toggleText">
                Already have an account?
                <span className="link" onClick={toggleView}>
                  Sign in
                </span>
              </p>
            )}
          </form>
        </div>
      </Suspense>
      <ErrorDialog error={error} modalRef={errorDialogRef} />
      <SignUpDialog isSignIn={isSignIn} modalRef={singUpDialogRef} />
    </div>
  );
};

const ErrorDialog: React.FC<{
  error: AuthError | null;
  modalRef: React.RefObject<CustomDialogType | null>; // 型を明確に指定
}> = ({ modalRef, error }) => {
  return (
    <CustomDialog ref={modalRef}>
      <div className="dialog-container">
        <h2 className="title-dialog">Failed</h2>
        {error && <p>{error.message}</p>}
        <div className="dialog-buttons">
          <button
            className="button-primary-stroke"
            onClick={() => modalRef.current?.close()}
          >
            Close
          </button>
        </div>
      </div>
    </CustomDialog>
  );
};

const SignUpDialog: React.FC<{
  isSignIn: boolean;
  modalRef: React.RefObject<CustomDialogType | null>;
}> = ({ modalRef }) => {
  return (
    <CustomDialog ref={modalRef}>
      <div className="dialog-container">
        <h2 className="title-dialog">Verification Email Sent</h2>
        <p>
          A verification email has been sent to your registered email address.
          Please click the link in the email to complete your account
          verification.
        </p>
        <div className="dialog-buttons">
          <button
            className="button-primary-stroke"
            onClick={() => modalRef.current?.close()}
          >
            OK
          </button>
        </div>
      </div>
    </CustomDialog>
  );
};

export default SignIn;
