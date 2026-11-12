import moment from 'moment'
import { useApp } from '../context/AppContext'

export default function Footer() {
  const { now, user } = useApp()
  return (
    <footer className="footer">
      <span>{user.shop}</span>
      <span>Session started {moment(now).subtract(42, 'minutes').fromNow()}</span>
      <span>© {moment(now).format('YYYY')} Bazaarline Commerce Pvt. Ltd.</span>
    </footer>
  )
}
