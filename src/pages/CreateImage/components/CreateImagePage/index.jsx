import { useContext, useState } from 'react';
import globalStyles from '../../../../styles/global.module.scss';
import { Button, Icon, Navbar, TextInput } from 'react-materialize';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../../../context/context';
import http from '../../../../axios.common';
import { useMessage } from '../../../../message.hook';
import styles from './style.module.scss';

function CreateImagePage() {
  const auth = useContext(AuthContext);
  const message = useMessage();
  const [form, setForm] = useState({
    imageData: '',
    tags: [],
  });

  function handleChange(name, event) {
    setForm({ ...form, [name]: event.target.value });
  }

  async function handleCreate(e) {
    e.preventDefault();

    try {
      const data = (
        await http.post('/image/create', {
          ...form,
          customer: { customerId: auth.user_id },
        })
      ).data;

      setForm({
        imageData: '',
        tags: [],
      });
      message('Створено малюнок успішно!');
    } catch (error) {
      console.log(error);
      message('Помилка при створенні малюнка');
    }
  }

  function handleLogout(e) {
    auth.logout();
  }

  return (
    <div className={globalStyles.wrapper}>
      <Navbar
        fixed
        alignLinks="right"
        brand={
          <h1 className="brand-logo" style={{ margin: '1rem 0' }}>
            Створення малюнку
          </h1>
        }
        centerLogo
        id="mobile-nav"
        menuIcon={<Icon>menu</Icon>}
        options={{
          draggable: true,
          edge: 'right',
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
        <Link to="/image/create">
          <Icon className="material-icons">add_photo_alternate</Icon>
        </Link>
        <Link to="/profile">
          <Icon className="material-icons">person</Icon>
        </Link>

        <Button
          className="blue darken-2"
          node="button"
          modal="confirm"
          waves="light"
          onClick={handleLogout}>
          Вийти
        </Button>
      </Navbar>

      <div className={globalStyles.container}>
        <div className={globalStyles.inner}>
          <form className="col s12">
            <div className="row">
              <div className="input-field col s12">
                <textarea
                  id="textarea"
                  placeholder=""
                  value={form.imageData}
                  onChange={(event) => handleChange('imageData', event)}
                  className={
                    'materialize-textarea grey-text text-lighten-5 ' + styles.input_image
                  }></textarea>
                <label htmlFor="textarea">Малюнок (текст)</label>
              </div>
            </div>
            <div className="row">
              <TextInput
                id="input_to"
                label="Теги"
                m={12}
                value={form.tripTo}
                onChange={(event) => handleChange('tripTo', event)}
                className="grey-text text-lighten-5"
              />
            </div>

            <Button
              className="blue"
              node="button"
              large
              modal="confirm"
              waves="light"
              onClick={handleCreate}>
              Створити малюнок
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateImagePage;
