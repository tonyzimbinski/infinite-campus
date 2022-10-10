import { CookieJar } from 'tough-cookie';
import { wrapper } from 'axios-cookiejar-support';
import axios from 'axios';

const jar = new CookieJar();
const client = wrapper(axios.create({
	jar: jar,
	headers: {
		common: {
			'User-Agent': 'Infinite Campus API v3.0.0 - TheAlphaReturns/infinite-campus',
			'Accept': 'application/json'
		}
	}
}));

export default client;