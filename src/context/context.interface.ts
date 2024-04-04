import { Context } from 'telegraf';

export interface SessionData {
	email: string;
	url: string, // ЮРЛ для существующей таблицы
	url_list: string; // вывод списка полученных ЮРЛ при создании новой таблицы
	convert_to: string; // Существующая таблица или Новая таблица
	convert_type: string; // Выгрузка пользователей или Выгрузка заказов
	convert_settings: string; // Безопасная выгрузка или Пользовательская выгрузка
}

export interface IBotContext extends Context {
	session: SessionData;
}