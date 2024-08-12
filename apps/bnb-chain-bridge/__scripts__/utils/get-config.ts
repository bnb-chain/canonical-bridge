import axios from 'axios';

const CONFIG_URL = 'http://localhost:3000/api/getConfigs';

export async function getConfigs() {
  return (await axios.get(CONFIG_URL)).data;
}
