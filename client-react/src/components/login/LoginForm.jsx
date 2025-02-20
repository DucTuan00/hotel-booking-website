import React, { useState, useEffect } from 'react';
import styles from './LoginForm.module.css';

const LoginForm = ({ onSubmit, onChange, formData, isRegister, toggleAuthMode }) => {
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
                        <input type="text" placeholder="Name" name="name" onChange={onChange} />
                        <input type="phone" placeholder="Phone" name="phone" onChange={onChange} />
                        <input type="email" placeholder="Email" name="email" onChange={onChange} />
                        <input type="password" placeholder="Password" name="password" onChange={onChange} />
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
                        <input type="email" placeholder="Email" name="email" onChange={onChange} />
                        <input type="password" placeholder="Password" name="password" onChange={onChange} />
                        <a href="#">Forget Your Password?</a>
                        <button type="submit">Sign In</button>
                    </form>
                </div>

                <div className={styles["toggle-container"]}>
                    <div className={styles["toggle"]}>
                        <div className={`${styles["toggle-panel"]} ${styles["toggle-left"]}`}>
                            <h1>Welcome Back!</h1>
                            <p>Enter your personal details to use all of site features</p>
                            <button className={styles["hidden"]} onClick={toggleAuthMode}>Sign In</button>
                        </div>
                        <div className={`${styles["toggle-panel"]} ${styles["toggle-right"]}`}>
                            <h1>Hello, Friend!</h1>
                            <p>Register with your personal details to use all of site features</p>
                            <button className={styles["hidden"]} onClick={toggleAuthMode}>Sign Up</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginForm;