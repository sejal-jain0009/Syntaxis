import { useEffect, useRef, useState } from 'react';

const emailPattern = /^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/;

const passwordRules = [
  { key: 'length', label: 'At least 8 characters', test: (value) => value.length >= 8 },
  { key: 'uppercase', label: 'One uppercase letter', test: (value) => /[A-Z]/.test(value) },
  { key: 'lowercase', label: 'One lowercase letter', test: (value) => /[a-z]/.test(value) },
  { key: 'number', label: 'One number', test: (value) => /\d/.test(value) },
  { key: 'special', label: 'One special character', test: (value) => /[^A-Za-z0-9]/.test(value) },
];

function AuthForm({ mode, onSuccess }) {
  const isLogin = mode === 'login';
  const firstInputRef = useRef(null);
  const [showPassword, setShowPassword] = useState(false);
  const [values, setValues] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [touched, setTouched] = useState({});

  useEffect(() => {
    firstInputRef.current?.focus();
  }, [isLogin]);

  function handleChange(event) {
    const { name, value } = event.target;
    setValues((currentValues) => ({ ...currentValues, [name]: value }));
  }

  function handleBlur(event) {
    const { name } = event.target;
    setTouched((currentTouched) => ({ ...currentTouched, [name]: true }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    setTouched({ fullName: true, email: true, password: true, confirmPassword: true });

    const isValid = emailPattern.test(values.email)
      && Boolean(values.password)
      && (isLogin || (values.fullName.trim() && Object.values(passwordStatus).every(Boolean) && values.password === values.confirmPassword));

    if (isValid) {
      onSuccess(values);
    }
  }

  const emailError = touched.email && !emailPattern.test(values.email)
    ? 'Please enter a valid email address.'
    : '';
  const passwordStatus = Object.fromEntries(passwordRules.map((rule) => [rule.key, rule.test(values.password)]));
  const passwordError = touched.password && (isLogin ? !values.password : !Object.values(passwordStatus).every(Boolean))
    ? isLogin ? 'Enter your password.' : 'Use all of the requirements below.'
    : '';
  const confirmPasswordError = touched.confirmPassword && !isLogin && values.password !== values.confirmPassword
    ? 'Passwords do not match.'
    : '';
  const fullNameError = touched.fullName && !values.fullName.trim() ? 'Enter your full name.' : '';

  const inputProps = (name) => ({
    onBlur: handleBlur,
    'aria-invalid': Boolean({ fullName: fullNameError, email: emailError, password: passwordError, confirmPassword: confirmPasswordError }[name]),
  });

  return (
    <form className="auth-form" onSubmit={handleSubmit} noValidate>
      {!isLogin && (
        <div className="field-group">
          <label htmlFor="fullName">Full Name</label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            autoComplete="name"
            placeholder="Ada Lovelace"
            value={values.fullName}
            onChange={handleChange}
            ref={firstInputRef}
            {...inputProps('fullName')}
            aria-required="true"
          />
          {fullNameError && <p className="field-error" id="full-name-error">{fullNameError}</p>}
        </div>
      )}

      <div className="field-group">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={values.email}
          onChange={handleChange}
          ref={isLogin ? firstInputRef : undefined}
          {...inputProps('email')}
          aria-describedby={emailError ? 'email-error' : undefined}
          aria-required="true"
        />
        {emailError && <p className="field-error" id="email-error">{emailError}</p>}
      </div>

      <div className="field-group">
        <label htmlFor="password">Password</label>
        <div className={`password-input ${passwordError ? 'has-error' : ''}`}>
          <input
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete={isLogin ? 'current-password' : 'new-password'}
            placeholder="Enter your password"
            value={values.password}
            onChange={handleChange}
            {...inputProps('password')}
            aria-describedby={passwordError ? 'password-error' : undefined}
            aria-required="true"
          />
          <button
            className="password-toggle"
            type="button"
            onClick={() => setShowPassword((visible) => !visible)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? 'Hide' : 'Show'}
          </button>
        </div>
        {passwordError && <p className="field-error" id="password-error">{passwordError}</p>}
        {!isLogin && (
          <ul className="password-rules" aria-label="Password requirements">
            {passwordRules.map((rule) => (
              <li className={passwordStatus[rule.key] ? 'is-valid' : ''} key={rule.key}>
                <span aria-hidden="true">{passwordStatus[rule.key] ? '✓' : '○'}</span>
                {rule.label}
              </li>
            ))}
          </ul>
        )}
      </div>

      {!isLogin && (
        <div className="field-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type={showPassword ? 'text' : 'password'}
            autoComplete="new-password"
            placeholder="Re-enter your password"
            value={values.confirmPassword}
            onChange={handleChange}
            {...inputProps('confirmPassword')}
            aria-describedby={confirmPasswordError ? 'confirm-password-error' : undefined}
            aria-required="true"
          />
          {confirmPasswordError && <p className="field-error" id="confirm-password-error">{confirmPasswordError}</p>}
        </div>
      )}

      {isLogin && (
        <div className="form-options">
          <label className="remember-option">
            <input type="checkbox" name="rememberMe" />
            <span>Remember me</span>
          </label>
          <a href="mailto:support@syntaxis.dev">Forgot password?</a>
        </div>
      )}

      <button className="auth-submit" type="submit">
        {isLogin ? 'Log In' : 'Create Account'}
        <span aria-hidden="true">-&gt;</span>
      </button>
    </form>
  );
}

export default AuthForm;
