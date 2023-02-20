import axios from "axios";

const url = `http://localhost:5000`;

export function registerUser(user) {
  return axios.post(`${url}/api/register`, user);
}

export function loginUser(user) {
  return axios.post(`${url}/api/login`, user);
}

export function logoutUser() {
  return axios.post(`${url}/api/logout`);
}

export function getAllUser() {
  return axios.get(`${url}/api/users`);
}

export function getAllItem() {
  return axios.get(`${url}/api/inventory`);
}

export function addItem(item) {
  return axios.post(`${url}/api/inventory/item`, item);
}

export function addToLog(item) {
  return axios.post(`${url}/api/inventory/logs`, item);
}

export function updateItem(item) {
  return axios.put(`${url}/api/inventory/${item.id}`, item);
}
export function updatePurchaseItem(item) {
  console.log(item);
  return axios.put(`${url}/api/inventory/purchase/${item.id}`, item);
}

export function updateToLog(item) {
  return axios.put(`${url}/api/inventory/logs/${item.id}`, item);
}

export function deleteAItem(id) {
  return axios.delete(`${url}/api/inventory/${id}`);
}

export function getPurchase() {
  return axios.get(`${url}/api/log`);
}

export function getTransact() {
  return axios.get(`${url}/api/transact`);
}

export function getInventory() {
  return axios.get(`${url}/api/purchase`);
}
export function getSales() {
  return axios.get(`${url}/api/sales`);
}

export function getAPurchase() {
  return axios.get(`${url}/api/purchase/added`);
}

export function addPurchase(purchase) {
  return axios.post(`${url}/api/purchase`, purchase);
}

export function clearLog() {
  return axios.post(`${url}/api/purchase/clear`);
}

export function newTransact(num) {
  return axios.post(`${url}/api/purchase/new`, num);
}

export function addSales(item) {
  return axios.post(`${url}/api/sales/add`, item);
}

export function updateTransact(transact) {
  return axios.put(`${url}/api/transact/${transact.id}`, transact);
}
