import { StaticImageData } from 'next/image';
import DigitalOceanLogo from './digitalocean.png';
import DropboxLogo from './dropbox.png';
import DynadotLogo from './dynadot.png';
import InternetBSLogo from './internetbs.jpg';
import KeitaroLogo from './keitaro.png';
import NamesiloLogo from './namesilo.png';

import { ServicesInsert } from '@/app/lib/drizzle/schemas/services';

export const servicesLogos: Record<
	ServicesInsert['name'],
	StaticImageData
> = {
	digital_ocean: DigitalOceanLogo,
	dropbox: DropboxLogo,
	namesilo: NamesiloLogo,
	internet_bs: InternetBSLogo,
	dynodot: DynadotLogo,
	keitaro: KeitaroLogo
};
