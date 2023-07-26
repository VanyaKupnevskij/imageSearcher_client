import globalStyles from '../../../../styles/global.module.scss';
import { Link } from 'react-router-dom';
import { Button, Icon, NavItem, Navbar, Select, TextInput } from 'react-materialize';
import { useMessage } from '../../../../message.hook';
import { useContext, useState } from 'react';
import http from '../../../../axios.common';
import { AuthContext } from '../../../../context/context';

function LoginPage() {
  const auth = useContext(AuthContext);
  const message = useMessage();
  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  function handleChange(name, event) {
    setForm({ ...form, [name]: event.target.value });
  }

  async function handleLogin(e) {
    e.preventDefault();

    try {
      const data = (await http.post('/customer/login', form)).data;

      console.log(data.customerId);
      if (!data || data.customerId === 0) {
        throw Error('Такий користувач не існує або не вірні дані');
      }

      auth.login(data.customerId, data.role);

      setForm({
        email: '',
        password: '',
      });

      message(
        `Користувач ${data.lastName} ${data.firstName} (${data.customerId}) увійшов в систему!`,
      );
    } catch (error) {
      console.log(error);
      message('Помилка при вході');

      localStorage.setItem('user_id', 0);
      localStorage.setItem('role', 0);
    }
  }

  return (
    <div className={globalStyles.wrapper}>
      <Navbar
        fixed
        alignLinks="right"
        className="blue"
        brand={
          <h1 className="brand-logo" style={{ margin: '1rem 0' }}>
            Login
          </h1>
        }
        centerLogo
        id="mobile-nav"
        menuIcon={<Icon>menu</Icon>}
        options={{
          draggable: true,
          edge: 'left',
          inDuration: 250,
          onCloseEnd: null,
          onCloseStart: null,
          onOpenEnd: null,
          onOpenStart: null,
          outDuration: 200,
          preventScrolling: true,
        }}>
        <Link to="/images">
          <Icon className="material-icons">home</Icon>
        </Link>
        <Link to="/login">Login</Link>
        <Link to="/signup">Signup</Link>
      </Navbar>

      <div className={globalStyles.container}>
        <div className={globalStyles.inner}>
          <div className="row">
            <form className="col s12">
              <div className="row">
                <TextInput
                  email
                  id="input_email"
                  label="Email"
                  validate
                  m={12}
                  value={form.email}
                  onChange={(event) => handleChange('email', event)}
                  className="grey-text text-lighten-5"
                />
              </div>
              <div className="row">
                <TextInput
                  password
                  data-length={20}
                  id="input_password"
                  label="Пароль"
                  validate
                  m={12}
                  value={form.password}
                  onChange={(event) => handleChange('password', event)}
                  className="grey-text text-lighten-5"
                />
              </div>

              <Button
                className="blue"
                node="button"
                large
                modal="confirm"
                waves="light"
                onClick={handleLogin}>
                Увійти
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
