import axios from '../axios';

import { DistrictData } from '../types/districtData';
import User from '../user';

/**
 * The client used to initiate requests to the Infinite Campus API.
 */
class CampusClient {
	private district = '';
	private state = '';
	private username = '';
	private password = '';

	/**
	 * @param district The district name
	 * @returns this
	 */
	setDistrict(district: string): this {
		this.district = district;
		return this;
	}

	/**
	 * @param state The state abbreviation (e.g. "TX")
	 * @returns this
	 */
	setState(state: string): this {
		this.state = state;
		return this;
	}

	/**
	 * @param username Login name
	 * @returns this
	 */
	setUsername(username: string): this {
		this.username = username;
		return this;
	}

	/**
	 * @param password Login password
	 * @returns this
	 */
	setPassword(password: string): this {
		this.password = password;
		return this;
	}

	/**
	 * @returns A user object to use the API
	 * @throws Error if district is not set
	 * @throws Error if district is not found
	 */
	async login(): Promise<User> {
		if (!this.district || !this.state || !this.username || !this.password) {
			throw new Error('Missing required parameters');
		}

		const { data: res } = await axios.get(`https://mobile.infinitecampus.com/mobile/searchDistrict?query=${this.district}&state=${this.state}`);

		if (res.error) throw new Error('District not found');
		const districtData: DistrictData = res.data[0];

		await axios.get(`${districtData.district_baseurl}verify.jsp?nonBrowser=true&username=${this.username}&password=${this.password}&appName=${districtData.district_app_name}`);

		return new User(districtData);
	}
}

export default CampusClient;