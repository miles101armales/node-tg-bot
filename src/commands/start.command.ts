import { Markup, Telegraf } from 'telegraf';
import { IBotContext } from '../context/context.interface';
import { Command } from './command.class';
import * as tt from '../../node_modules/telegraf/typings/telegram-types'

export class StartCommand extends Command {
	constructor(bot: Telegraf<IBotContext>) {
		super(bot);
	}
	handle(): void {
		try {
			this.bot.start((ctx) => {
				try {
					ctx.reply(
						`Добро пожаловать! Я бот-конвертер CSV-файлов в формат Google-таблиц.\nНа данный момент я умею:\n\n/convert - Конвертировать файлы в гугл таблицу\n/delete - Удалять вашу почту для доступа из базы данных\n/email - Устанавливать новую почту для доступа к Google-таблицам\n\n Выберите действие:`,
						Markup.inlineKeyboard([
							Markup.button.callback('Конвертировать', 'convert'),
							Markup.button.callback('Изменить почту', 'email'),
							Markup.button.callback('Настройки', 'settings'),
						]))
				} catch (error) {
					this.bot.launch();
				}
			});
		} catch (error) {
			throw new Error('Ошибка вызова команды start');
		}
	}
}