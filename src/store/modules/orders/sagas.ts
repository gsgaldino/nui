import {
  all,
  call,
  takeLatest,
  select,
  put,
} from 'redux-saga/effects';
import { createStandaloneToast } from '@chakra-ui/react';
import axios from 'axios';

import * as actions from './slice';

const { toast } = createStandaloneToast();

export function* createOrder(action: any) {
  const { items } = action.payload;

  const payload = items.map((item: any) => ({
    id: item.id,
    size: item.size,
    color: item.color,
    paymentMethod: item.paymentMethod,
    price: item.price,
    name: item.name,
    thumbnailUrl: item.thumbnailUrl,
  }));

  try {
    const { loggedUser } = yield select((state) => state.user);
    yield call(axios.post, '/api/v1/order', { items: payload }, {
      headers: {
        token: loggedUser?.dashboardToken,
      },
    });
  } catch (error) {
    toast({
      isClosable: true,
      title: 'Oops',
      description: 'Erro ao criar pedido',
    });
  }
}

function* getOrders() {
  const { loggedUser } = yield select((state) => state.user);

  try {
    const { data } = yield call(axios.get, '/api/v1/order', {
      headers: {
        token: loggedUser?.dashboardToken,
      },
    });

    yield put(actions.getOrdersSuccess(data));
  } catch (error) {
    toast({
      isClosable: true,
      title: 'Oops',
      description: 'Erro ao buscar pedidos',
    });
  }
}

export default all([
  takeLatest(actions.createOrder.type, createOrder),
  takeLatest(actions.getOrders.type, getOrders),
]);
