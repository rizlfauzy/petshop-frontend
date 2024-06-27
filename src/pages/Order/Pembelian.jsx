import PropTypes from 'prop-types';
import HeaderPage from '../../components/HeaderPage';

export default function Pembelian({ icon, title }) {
  return (
    <>
      <HeaderPage icon={icon} title={title}>

      </HeaderPage>
    </>
  )
}

Pembelian.propTypes = {
  icon: PropTypes.element,
  title: PropTypes.string
}