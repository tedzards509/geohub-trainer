import { signIn, useSession } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { Button, Icon, Input } from '@components/System'
import { LocationMarkerIcon } from '@heroicons/react/outline'
import { updateUser } from '@redux/slices'
import StyledAuthPage from '@styles/AuthPage.Styled'
import { PageType } from '@types'
import { showErrorToast } from '../utils/helpers/showToasts'

const LoginPage: PageType = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showBtnSpinner, setShowBtnSpinner] = useState(false)
  const router = useRouter()
  const dispatch = useDispatch()
  const { data: session } = useSession()

  useEffect(() => {
    if (session) {
      dispatch(
        updateUser({
          id: session.user.id,
          name: session.user.name || '',
          email: session.user.email || '',
          avatar: session.user.avatar,
        })
      )
      router.replace('/')
    }
  }, [session])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email) {
      return showErrorToast('Please enter your email address', { id: 'login-email' })
    }

    if (!password) {
      return showErrorToast('Please enter your password', { id: 'login-pass' })
    }

    setShowBtnSpinner(true)

    const userCredentials = { email, password }

    const res = await signIn('credentials', { redirect: false, ...userCredentials })

    if (!res || res.error) {
      setShowBtnSpinner(false)
      return showErrorToast(res?.error || '', { id: 'login-api' })
    }

    setShowBtnSpinner(false)
  }
  return (
    <StyledAuthPage>
      <Link href="/">
        <a>
          <div className="logoWrapper">
            <div className="logo">
              <Icon size={20} fill="#fff">
                <LocationMarkerIcon />
              </Icon>
            </div>
            <h2 className="appTitle">GeoHub</h2>
          </div>
        </a>
      </Link>

      <section className="authContainer">
        <h1 className="title">Welcome Back!</h1>

        <form className="inputGroup" onSubmit={(e) => handleLogin(e)}>
          <Input id="email" type="text" label="Email Address" callback={setEmail} autoComplete="email" autoFocus />
          <Input
            id="password"
            type="password"
            label="Password"
            callback={setPassword}
            autoComplete="current-password"
          />

          <Button width="100%" isLoading={showBtnSpinner}>
            Login
          </Button>
        </form>

        <span className="authPrompt">
          Need an account?
          <Link href="/register">
            <a>Sign up.</a>
          </Link>
        </span>
      </section>
    </StyledAuthPage>
  )
}

LoginPage.noLayout = true

export default LoginPage
