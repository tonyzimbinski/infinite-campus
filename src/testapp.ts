import CampusClient from '.';

const User = await (new CampusClient()
	.setDistrict('district')
	.setState('state')
	.setUsername('username')
	.setPassword('password'))
	.login();