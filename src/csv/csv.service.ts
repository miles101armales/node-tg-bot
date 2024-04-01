import * as fs from 'fs';
import * as path from 'path';
import { parse } from 'csv-parse';

export class CsvService {
	public realArrOfObjects: any[];
	
	constructor() {}

	public async readCsv(fileName: string) {
		const csvFilePath = path.resolve(`downloads/${fileName}`);
		const headers = [
			'ID заказа',
			'Номер',
			'ID пользователя',
			'Пользователь',
			'Email',
			'Телефон',
			'Дата создания',
			'Дата оплаты',
			'Title',
			'Статус',
			'Стоимость, RUB',
			'Оплачено',
			'Комиссия платежной системы',
			'Получено',
			'Налог',
			'Осталось после вычета комиссии платежной системы и налога',
			'Другие комиссии',
			'Заработано',
			'Валюта',
			'Менеджер',
			'Город',
			'Платежная система',
			'ID партнера',
			'Использован промокод',
			'Промоакция',
			'Работа с клиентом',
			'Комментарий к заказу',
			'Причина отказа',
			'Дата',
			'Назначение СтС',
			'Фин цель',
			'Продал в СТС',
			'Купил после СтС курс?',
			'Причина отказа СтС',
			'custom_utm_source',
			'custom_utm_medium',
			'custom_utm_campaign',
			'custom_utm_content',
			'custom_utm_term',
			'Вторая волна',
			'ID партнера заказа',
			'Email партнера заказа',
			'ФИО партнера заказа',
			'ID партнера пользователя',
			'Email партнера пользователя',
			'ФИО партнера пользователя',
			'utm_source',
			'utm_medium',
			'utm_campaign',
			'utm_content',
			'utm_term',
			'utm_group',
			'Партнерский источник',
			'Партнерский код',
			'Партнер (сессия)',
			'user_utm_source',
			'user_utm_medium',
			'user_utm_campaign',
			'user_utm_content',
			'user_utm_term',
			'user_utm_group',
			'user_gcpc',
			'Теги',
			'Теги предложений'
		];
		const csvData = fs.readFileSync(csvFilePath, { encoding: 'utf-8' });

		parse(csvData, {
			delimiter: ';',
			columns: headers,
			bom: true,
			skip_records_with_empty_values: true
		}, (error, csvData: string[][]) => {
			if(error) {
				console.error(error)
			}
			this.wtiteExportData(csvData)
		});
	};

	wtiteExportData(data: any[]) {
		this.realArrOfObjects = [];
	
		data.forEach((item) => {
			this.realArrOfObjects.push({
				'ID Заказа': Number(item['ID заказа']),
				'Номер': Number(item['Номер']),
				'ID Пользователя': Number(item['ID пользователя']),
				'Пользователь': item['Пользователь'],
				'Дата создания': item['Дата создания'],
				'Дата оплаты': item['Дата оплаты'],
				'Название': item['Title'],
				'Статус': item['Статус'],
				'Стоимость': Number(item['Стоимость, RUB']),
				'Оплачено': Number(item['Оплачено']),
				'Получено': Number(item['Получено']),
				'Менеджер': item['Менеджер'],
				'Город': item['Город'],
				'Платежная система': item['Платежная система'],
				'Работа с клиентом': item['Работа с клиентом'],
				'Комментарий к заказу': item['Комментарий к заказу'],
				'Причина отказа': item['Причина отказа'],
				'Дата': item['Дата'],
				'Назначение СтС': item['Назначение СтС'],
				'Фин цель': item['Фин цель'],
				'Продал в СТС': item['Продал в СТС'],
				'Купил после СтС курс?': item['Купил после СтС курс?'],
				'Причина отказа СтС': item['Причина отказа СтС'],
				'utm_source': item['utm_source'],
				'utm_medium': item['utm_medium'],
				'utm_campaign': item['utm_campaign'],
				'utm_content': item['utm_content'],
				'utm_term': item['utm_term'],
				'utm_group': item['utm_group'],
				'Теги': item['Теги'],
				'Теги предложений': item['Теги предложений']
			});
		});
		
	}
	
}