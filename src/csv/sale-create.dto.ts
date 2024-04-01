import { IsInt, IsString, NotEquals } from 'class-validator';

export class SaleCreateDto {
	@NotEquals('undefined', { message: 'Пустое значение' })
	@IsInt({ message: 'Невалидное число' })
	idSystemGc: number;

	@NotEquals('undefined', { message: 'Пустое значение' })
	@IsInt({ message: 'Невалидное число' })
	idAzatGc: number;

	@NotEquals('undefined', { message: 'Пустое значение' })
	@IsInt({ message: 'Невалидное число' })
	idUserGc: number;

	@NotEquals('undefined', { message: 'Пустое значение' })
	@IsInt({ message: 'Невалидное число' })
	user_id: number;

	@IsString({ message: 'Невалидная строка' })
	createdAt: string;

	payedAt: string;
	orderName: string;
	dealStatus: string;
	price: string;
	payedPrice: string;
	payFee: string;
	income: string;
	taxes: string;
	profit: string;
	otherFee: string;
	netProfit: string;
	currency: string;
	managerName: string;
	city: string;
	payedBy: string;
	partnerId: string;
	promocodeUsed: string;
	promoCompany: string;
	customUtmSource: string;
	customUtmMedium: string;
	customUtmCampaign: string;
	customUtmContent: string;
	customUtmTerm: string;
	utmSource: string;
	utmMedium: string;
	utmCampaign: string;
	utmContent: string;
	utmTerm: string;
	utmGroup: string;
	managerTag: string;
	offerTag: string;
}
