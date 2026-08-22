const SocialLogin = () => {
  return (
    <>
      <div className="divider">
        <span>OR</span>
      </div>
      <div className="oauth-links">
        <a
          href="/auth/google"
          className="oauth-button"
        >
          <span aria-hidden="true">G</span> Google
        </a>
        <a
          href="/auth/github"
          className="oauth-button"
        >
          <span aria-hidden="true">&lt; &gt;</span> GitHub
        </a>
      </div>
    </>
  )
}

export default SocialLogin
