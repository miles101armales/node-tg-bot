import { Context, Markup, Telegraf } from 'telegraf';
import { Command } from './command.class';
import { IBotContext } from '../context/context.interface';

export class SettingsCommand extends Command {
	constructor(bot: Telegraf<IBotContext>) {
		super(bot);
	}

	handle(): void {
		this.bot.command('settings', (ctx) => this.email(ctx));
		this.bot.action('settings', (ctx) => this.email(ctx));
	}

	email(ctx: IBotContext): void {
		try {
			ctx.editMessageText('Настройки выгрузки в разработке!', Markup.inlineKeyboard([
				Markup.button.callback('Вернуться в главное меню', 'start')
			]));

			this.bot.action('start', (ctx) => {
				ctx.editMessageText(
					`Добро пожаловать! Я бот-конвертер CSV-файлов в формат Google-таблиц.\nНа данный момент я умею:\n\n/convert - Конвертировать файлы в гугл таблицу\n/email - Устанавливать новую почту для доступа к Google-таблицам\n\n Выберите действие:`,
					Markup.inlineKeyboard([
						Markup.button.callback('Конвертировать', 'convert'),
						Markup.button.callback('Изменить почту', 'email'),
						Markup.button.callback('Настройки', 'settings'),
					]))
			} )			
		} catch (error) {
			throw new Error('Ошибка вызова команды settings');
		}
	}
}