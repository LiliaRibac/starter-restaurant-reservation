import React from 'react';

import { Redirect, Route, Switch } from 'react-router-dom';
import Dashboard from '../dashboard/Dashboard';
import NotFound from './NotFound';
import { today } from '../utils/date-time';
import ReservationNew from '../reservations/ReservationNew';
import ReservationEdit from '../reservations/ReservationEdit';
import TableNew from '../Tables/TableNew';

/**
 * Defines all the routes for the application.
 *
 * You will need to make changes to this file.
 *
 * @returns {JSX.Element}
 */
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
