import * as fs from 'fs';
import * as path from 'path';
import { parse } from 'csv-parse';

export class CsvService {
	public realArrOfObjects: any[];
	
	constructor() {}

	public async readCsvOrder(fileName: string) {
		try {
			const csvFilePath = path.resolve(`downloads/${fileName}`);
			const headers_of_orders = [
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
				columns: headers_of_orders,
				bom: true,
				skip_records_with_empty_values: true
			}, (error, csvData: string[][]) => {
				if (error) {
					console.error(error)
					return;
				}
			
				// Продолжаем с обработкой данных
				this.wtiteExportDataOrder(csvData);
			});
			
		} catch (error) {
			console.log('Error')
		}
	};

	wtiteExportDataOrder(data: any[]) {
		this.realArrOfObjects = [];
	
		data.forEach((item) => {
			this.realArrOfObjects.push({
				'ID Заказа': item['ID заказа'],
				'Номер': item['Номер'],
				'ID Пользователя': item['ID пользователя'],
				'Пользователь': item['Пользователь'],
				'Дата создания': item['Дата создания'],
				'Дата оплаты': item['Дата оплаты'],
				'Название': item['Title'],
				'Статус': item['Статус'],
				'Стоимость': item['Стоимость, RUB'],
				'Оплачено': item['Оплачено'],
				'Получено': item['Получено'],
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

	public async readCsvUser(fileName: string) {
		try {
			const csvFilePath = path.resolve(`downloads/${fileName}`);
			const headers_of_orders = [
				'id',
				'Email',
				'Тип регистрации',
				'Создан',
				'Последняя активность',
				'Имя',
				'Фамилия',
				'Телефон',
				'Дата рождения',
				'Возраст',
				'Страна',
				'Город',
				'От партнера',
				'Согласен с договором офертой',
				'reg_utm_source',
				'reg_utm_medium',
				'reg_utm_term',
				'reg_utm_content',
				'reg_utm_campaign',
				'Вторая волна',
				'Ссылка на Ваш инстаграмм',
				'Ссылка на ваш профиль ВКонтакте',
				'Ссылка на ваш аккаунт Youtube',
				'Ваш ник в Telegram',
				'Согласен на получение смс-рассылок с уведомлениями',
				'Согласен с правилами партнерской программы',
				'lm_utm_source',
				'lm_utm_medium',
				'lm_utm_term',
				'lm_utm_content',
				'lm_utm_campaign',
				'bothelp_id',
				'vk_uid',
				'vk_id_skript',
				'dialog',
				'sb_id',
				'contractor',
				'Количество прокруток колеса фортуны',
				'Старт вебинара',
				'Количество автопродлений БДПК-3Н - частями',
				'Количество прокруток КФ по МИ',
				'Количество автопродлений ДПК - частями',
				'Промокод из магнита',
				'Воронка_игра',
				'Сейлбот',
				'КФ-ДР-2023',
				'КФ-Деньги-без-правил',
				'Промокод бонуса',
				'api_response',
				'КФ-РОА-10.12.2023',
				'Бонусный счет',
				'Слово №1',
				'Слово №2',
				'Слово №3',
				'КФ-5_марта',
				'roa_utm_source',
				'Откуда пришел',
				'utm_source',
				'utm_medium',
				'utm_campaign',
				'utm_term',
				'utm_content',
				'utm_group',
				'ID партнера',
				'Email партнера',
				'ФИО партнера',
				'ФИО менеджера',
				'VK-ID',
				'ID группы',
				'Добавлен в группу'
			];
			const csvData = fs.readFileSync(csvFilePath, { encoding: 'utf-8' });

			parse(csvData, {
				delimiter: ';',
				columns: headers_of_orders,
				bom: true,
				skip_records_with_empty_values: true
			}, (error, csvData: string[][]) => {
				if (error) {
					console.error(error);
					return;
				}
			
				
			
				this.wtiteExportDataUser(csvData);
			});
			
		} catch (error) {
			console.log('Error')
		}
	};
	
	wtiteExportDataUser(data: any[]) {
		this.realArrOfObjects = [];
	
		data.forEach((item) => {
			this.realArrOfObjects.push({
				'ID': item['id'],
				'Тип регистрации': item['Тип регистрации'],
				'Создан': item['Создан'],
				'Последняя активность': item['Последняя активность'],
				'Имя': item['Имя'],
				'Возраст': item['Возраст'],
				'Страна': item['Страна'],
				'Город': item['Город'],
				'От партнера': item['От партнера'],
				'Согласен с договором офертой': item['Согласен с договором офертой'],
				'reg_utm_source': item['reg_utm_source'],
				'reg_utm_medium': item['reg_utm_medium'],
				'reg_utm_term': item['reg_utm_term'],
				'reg_utm_content': item['reg_utm_content'],
				'reg_utm_campaign': item['reg_utm_campaign'],
				'Вторая волна': item['Вторая волна'],
				'Ваш ник в Telegram': item['Ваш ник в Telegram'],
				'Согласен на получение смс-рассылок с уведомлениями': item['Согласен на получение смс-рассылок с уведомлениями'],
				'Согласен с правилами партнерской программы': item['Согласен с правилами партнерской программы'],
				'lm_utm_source': item['lm_utm_source'],
				'lm_utm_medium': item['lm_utm_medium'],
				'lm_utm_term': item['lm_utm_term'],
				'lm_utm_content': item['lm_utm_content'],
				'lm_utm_campaign': item['lm_utm_campaign'],
				'roa_utm_source': item['roa_utm_source'],
				'Откуда пришел': item['Откуда пришел'],
				'utm_source': item['utm_source'],
				'utm_medium': item['utm_medium'],
				'utm_campaign': item['utm_campaign'],
				'utm_term': item['utm_term'],
				'utm_content': item['utm_content'],
				'utm_group': item['utm_group'],
				'ID группы': item['ID группы'],
				'Добавлен в группу': item['Добавлен в группу'],
			});
		});
	}

	public async  deleteCsvFile(filePath: string): Promise<void> {
        return new Promise((resolve, reject) => {
            fs.unlink(filePath, (err) => {
                if (err) {
                    reject(err);
                } else {
                    console.log(`Файл ${filePath} успешно удален.`);
                    resolve();
                }
            });
        });
    }
}