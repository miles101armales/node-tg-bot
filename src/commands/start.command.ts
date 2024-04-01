import { Markup, Telegraf } from 'telegraf';
import { IBotContext } from '../context/context.interface';
import { Command } from './command.class';

export class StartCommand extends Command {
	constructor(bot: Telegraf<IBotContext>) {
		super(bot);
	}
	handle(): void {
		try {
			this.bot.start((ctx) => {
				try {
					if(ctx.session.email) {
						ctx.reply(
							`❤️ Добро пожаловать! Я бот-конвертер CSV-файлов в формат Google-таблиц.\n\nСписок моих комманд доступен по кнопке "Меню"\n\n ⬇️ Выберите действие:`,
							{
								reply_markup: {
									inline_keyboard: [
										[ { text: '⚡ Конвертировать', callback_data: 'convert' }, { text: '🧷 Настройки выгрузки', callback_data: 'settings' } ],
										[ { text: '📥 Изменить почту', callback_data: 'email' } ]
									]
								}
							}
						)
					} else {
						ctx.reply(`Кажется, вы у нас впервые! 😅\n\nВам необходимо закрепить почту для предоставления доступа к созданным таблицам. 😊\nНажмите на кнопку⬇️`, 
						{
							reply_markup: {
								inline_keyboard: [
									[ { text: '📥 Закрепить почту', callback_data: 'email' } ]
								]
							}
						})
					}
				} catch (error) {
					this.bot.launch();
				}
			});
		} catch (error) {
			throw new Error('Ошибка вызова команды start');
		}
	}
}