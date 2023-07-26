import { useContext, useEffect, useState } from 'react';
import globalStyles from '../../../../styles/global.module.scss';
import { Button, Collapsible, CollapsibleItem, Icon, Navbar } from 'react-materialize';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../../../context/context';
import http from '../../../../axios.common';
import { useMessage } from '../../../../message.hook';

function SelfTripsPage() {
  const auth = useContext(AuthContext);
  const message = useMessage();
  const [trips, setTrips] = useState([]);

  useEffect(() => {
    loadTrips();
  }, []);

  async function loadTrips() {
    try {
      const loadPath = auth.role == 'driver' ? '/trip/getAllByDriver/' : '/trip/getAllByCustomer/';
      const data = (await http.get(loadPath + auth.user_id)).data;

      setTrips([...data]);
    } catch (error) {
      console.log(error);
      message('Помилка при завантаженні поїздок');
      setTrips([]);
    }
  }

  function handleLogout(e) {
    auth.logout();
  }

  return (
    <div className={globalStyles.wrapper}>
      <Navbar
        fixed
        alignLinks="left"
        brand={
          <h1 className="brand-logo" style={{ margin: '1rem 0' }}>
            Свої поїздки
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
        <Button node="button" large modal="confirm" waves="light" onClick={handleLogout}>
          Вийти
        </Button>
        <Link to="/profile">Профіль</Link>
        <Link to="/trips/self">Свої поїздки</Link>
        {auth.role === 'driver' ? (
          <Link to="/trips">Всі поїздки</Link>
        ) : (
          <Link to="/trip/create">Створити поїздку</Link>
        )}
      </Navbar>

      <div className={globalStyles.container}>
        <div className={globalStyles.inner}>
          <div>
            <Collapsible accordion popout>
              {trips.map((trip) => {
                trip.price = Math.round(trip.price * 100) / 100;
                trip.distance = Math.round(trip.distance * 10) / 10;
                trip.tripTime =
                  Math.floor(trip.tripTime) +
                  ' годин ' +
                  Math.floor((trip.tripTime % 1) * 60) +
                  ' хвилин ';

                return (
                  <CollapsibleItem
                    key={trip.tripId}
                    expanded={false}
                    header={
                      <span
                        style={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
                        Поїздка до: {trip.tripTo}
                        <span>
                          Ціна: <b>{trip.price}</b> грн
                        </span>
                      </span>
                    }
                    node="div">
                    Від: {trip.tripFrom} <br />
                    До: {trip.tripTo} <br />
                    Погода: {trip.weather} <br />
                    Статус: {trip.status} <br />
                    Відстань: {trip.distance} км <br />
                    Час поїздки: {trip.tripTime} <br />
                    Ціна: <b>{trip.price}</b> грн
                  </CollapsibleItem>
                );
              })}
            </Collapsible>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SelfTripsPage;
