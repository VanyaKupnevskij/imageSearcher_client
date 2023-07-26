import { useContext, useEffect, useState } from 'react';
import globalStyles from '../../../../styles/global.module.scss';
import { Button, Icon, Navbar } from 'react-materialize';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../../../context/context';
import http from '../../../../axios.common';
import { useMessage } from '../../../../message.hook';
import styles from './style.module.scss';

function ImagesPage() {
  const auth = useContext(AuthContext);
  const message = useMessage();
  const [images, setImages] = useState([]);

  useEffect(() => {
    loadImages();
  }, []);

  async function loadImages() {
    try {
      const data = (await http.get('/image/')).data;

      setImages([...data]);
    } catch (error) {
      console.log(error);
      message('Помилка при завантаженні малюнків');
      setImages([]);
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
            ASCII Малюнки
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

        {auth.isAuth && (
          <Link to="/image/create">
            <Icon className="material-icons">add_photo_alternate</Icon>
          </Link>
        )}
        {auth.isAuth && (
          <Link to="/profile">
            <Icon className="material-icons">person</Icon>
          </Link>
        )}

        {auth.isAuth && (
          <Button
            className="blue darken-2"
            node="button"
            modal="confirm"
            waves="light"
            onClick={handleLogout}>
            Вийти
          </Button>
        )}

        {auth.isAuth === false && <Link to="/login">Login</Link>}
        {auth.isAuth === false && <Link to="/signup">Signup</Link>}
      </Navbar>

      <div className={globalStyles.container}>
        <div className={globalStyles.inner}>
          <nav>
            <div className="nav-wrapper">
              <form>
                <div className="input-field">
                  <input id="search" type="search" required />
                  <label className="label-icon" htmlFor="search">
                    <i className="material-icons">search</i>
                  </label>
                  <i className="material-icons">close</i>
                </div>
              </form>
            </div>
          </nav>
          <div className="grey-text text-lighten-2">
            {images.map((image) => {
              return (
                <div className="row" key={image.imageId}>
                  <div className="col s12">
                    <div className="card-panel  indigo lighten-1">
                      <a
                        className={
                          'btn-floating btn-small btn-flat waves-effect waves-light ' +
                          styles.copy_btn
                        }>
                        <i className="material-icons">content_copy</i>
                      </a>

                      <div className={styles.image_wrapper}>
                        <div className={'white-text ' + styles.image}>{image.imageData}</div>
                      </div>

                      <div className={'indigo-text text-lighten-4 ' + styles.tags}>
                        {image.tags.map((tag) => (
                          <a
                            className={
                              'indigo grey-text text-lighten-1 waves-effect waves-light btn-small ' +
                              styles.tags_item
                            }
                            key={tag.tagId}>
                            {tag.tagName}
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ImagesPage;
