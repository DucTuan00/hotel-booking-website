import React, { ChangeEvent, FormEvent } from 'react';
import styles from '@/pages/Login/LoginForm.module.css';

interface FormData {
    name: string;
    phone: string;
    email: string;
    password: string;
}

interface LoginFormProps {
    onSubmit: (type: 'login' | 'register') => (e: FormEvent<HTMLFormElement>) => void;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    formData: FormData;
    isRegister: boolean;
    toggleAuthMode: () => void;
    error: string;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSubmit, onChange, formData, isRegister, toggleAuthMode, error }) => {
    return (
        <div className={styles['login-page']}>
            <div className={`${styles.container} ${isRegister ? styles.active : ''}`}>
                <div className={`${styles["form-container"]} ${styles["sign-up"]}`}>
                    <form onSubmit={onSubmit('register')}>
                        <h1>Create Account</h1>
                        <div className={styles["social-icons"]}>
                            <a href="#" className={styles.icon}><i className="fa-brands fa-google"></i></a>
                            <a href="#" className={styles.icon}><i className="fa-brands fa-facebook"></i></a>
                            <a href="#" className={styles.icon}><i className="fa-brands fa-github"></i></a>
                            <a href="#" className={styles.icon}><i className="fa-brands fa-linkedin"></i></a>
                        </div>
                        <span>or use your email for registration</span>
                        <input type="text" placeholder="Name" name="name" value={formData.name} onChange={onChange} />
                        <input type="phone" placeholder="Phone" name="phone" value={formData.phone} onChange={onChange} />
                        <input type="email" placeholder="Email" name="email" value={formData.email} onChange={onChange} />
                        <input type="password" placeholder="Password" name="password" value={formData.password} onChange={onChange} />
                        { isRegister && error && <p className={styles.error}>{error}</p> }
                        <button type="submit">Sign Up</button>
                    </form>
                </div>

                <div className={`${styles["form-container"]} ${styles["sign-in"]}`}>
                    <form onSubmit={onSubmit('login')}>
                        <h1>Sign In</h1>
                        <div className={styles["social-icons"]}>
                            <a href="#" className={styles.icon}><i className="fa-brands fa-google"></i></a>
                            <a href="#" className={styles.icon}><i className="fa-brands fa-facebook"></i></a>
                            <a href="#" className={styles.icon}><i className="fa-brands fa-github"></i></a>
                            <a href="#" className={styles.icon}><i className="fa-brands fa-linkedin"></i></a>
                        </div>
                        <span>or use your email password</span>
                        <input type="email" placeholder="Email" name="email" value={formData.email} onChange={onChange} />
                        <input type="password" placeholder="Password" name="password" value={formData.password} onChange={onChange} />
                        { !isRegister && error && <p className={styles.error}>{error}</p> }
                        <a href="#">Forget Your Password?</a>
                        <button type="submit">Sign In</button>
                    </form>
                </div>

                <div className={styles["toggle-container"]}>
                    <div className={styles["toggle"]}>
                        <div className={`${styles["toggle-panel"]} ${styles["toggle-left"]}`}>
                            <h1>Welcome Back!</h1>
                            <p>Enter your personal details to use all of site features</p>
                            <button className={styles["hidden"]} type="button" onClick={toggleAuthMode}>Sign In</button>
                        </div>
                        <div className={`${styles["toggle-panel"]} ${styles["toggle-right"]}`}>
                            <h1>Hello, Friend!</h1>
                            <p>Register with your personal details to use all of site features</p>
                            <button className={styles["hidden"]} type="button" onClick={toggleAuthMode}>Sign Up</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginForm;