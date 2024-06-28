import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import Dashboard from '../dashboard/Dashboard';
import NotFound from './NotFound';
import { today } from '../utils/date-time';
import ReservationNew from '../reservations/ReservationNew';
import ReservationEdit from '../reservations/ReservationEdit';

import { ReservationSeat } from '../reservations/ReservationSeat';
import Search from '../search/Search';

import TableNew from '../Tables/TableNew';

function Routes() {
  return (
    <Switch>
      <Route exact={true} path='/'>
        <Redirect to={'/dashboard'} />
      </Route>
      <Route exact={true} path='/reservations'>
        <Redirect to={'/dashboard'} />
      </Route>
      <Route path='/dashboard'>
        <Dashboard date={today()} />
      </Route>
      <Route exact={true} path='/reservations/new'>
        <ReservationNew />
      </Route>
      <Route exact={true} path='/reservations/:reservation_id/edit'>
        <ReservationEdit />
      </Route>
      <Route exact={true} path='/reservations/:reservation_id/seat'>
        <ReservationSeat />
      </Route>
      <Route exact={true} path='/search'>
        <Search />
      </Route>
      <Route exact={true} path='/tables/new'>
        <TableNew />
      </Route>
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}

export default Routes;
