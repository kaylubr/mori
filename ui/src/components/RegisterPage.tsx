import RegisterForm from "./auth/RegisterForm"
import SocialLogin from "./auth/SocialLogin"

const RegisterPage = () => {
  return (
    <main className="login-main">
      <section
        className="login-panel"
        aria-labelledby="register-title"
      >
        <h1 id="register-title">Create your account</h1>
        <RegisterForm />
        <SocialLogin />
        <p className="signup-prompt">
          Already have an account? <a href="#login">LOG IN</a>
        </p>
      </section>
    </main>
  )
}

export default RegisterPage
