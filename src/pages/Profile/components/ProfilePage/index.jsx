import globalStyles from '../../../../styles/global.module.scss';
import { Link } from 'react-router-dom';
import { Button, Col, Collection, CollectionItem, Icon, Navbar, Row } from 'react-materialize';
import { useMessage } from '../../../../message.hook';
import { useContext, useEffect, useState } from 'react';
import http from '../../../../axios.common';
import { AuthContext } from '../../../../context/context';
import styles from './style.module.scss';

function ProfilePage() {
  const auth = useContext(AuthContext);
  const message = useMessage();
  const [userInfo, setUserInfo] = useState(null);
  const [images, setImages] = useState([]);

  useEffect(() => {
    loadProfile();
    loadImages();
  }, []);

  async function loadImages() {
    try {
      const data = (await http.get('/image/getAllByCustomer/' + auth.user_id)).data;

      setImages([...data]);
    } catch (error) {
      console.log(error);
      message('Помилка при завантаженні малюнків');
      setImages([]);
    }
  }

  async function loadProfile() {
    try {
      const data = (await http.get('/customer/' + auth.user_id)).data;

      setUserInfo({ ...data });
    } catch (error) {
      console.log(error);
      message('Помилка при завантаженні особистих даних');
      setUserInfo(null);
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
            Особистий профіль
          </h1>
        }
        centerLogo
        id="mobile-nav"
        menuIcon={<Icon className="material-icons">menu</Icon>}
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
          <Row style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
            <Col m={6} s={6} style={{ margin: 0 }}>
              {userInfo && (
                <Collection>
                  <CollectionItem className="grey darken-3 grey-text text-lighten-2">
                    Ім'я:{' '}
                    <b>
                      {userInfo.lastName} {userInfo.firstName}
                    </b>
                  </CollectionItem>
                  <CollectionItem className="grey darken-3 grey-text text-lighten-2">
                    Електронна пошта: <b>{userInfo.email}</b>
                  </CollectionItem>
                </Collection>
              )}
            </Col>
          </Row>

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

export default ProfilePage;
