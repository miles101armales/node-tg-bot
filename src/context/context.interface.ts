import { Context } from 'telegraf';

export interface SessionData {
	email: string;
	url_list: string;
}

export interface IBotContext extends Context {
	session: SessionData;
}